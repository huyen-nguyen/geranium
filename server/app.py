from io import BytesIO
from flask import Flask, jsonify, request
from flask_cors import CORS
import torch
import open_clip
import pandas as pd
from scipy.spatial.distance import cosine
import os
import base64
from PIL import Image
from rules_extraction import vectorize_specification


def init():
    # get the model and tokenizer
    model, _, preprocess = open_clip.create_model_and_transforms(
        "hf-hub:microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224"
    )
    tokenizer = open_clip.get_tokenizer(
        "hf-hub:microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224"
    )

    # Set device
    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    model.to(device)
    model.eval()

    return (model, preprocess, tokenizer, device)


app = Flask(__name__)
cors = CORS(app, origins="*")

# Main API endpoint

@app.route("/api/get_inference", methods=["POST"])
def get_inference():
    (model, preprocess, tokenizer, device) = init()

    rq = request.get_json()

    k = rq.get("k")
    search_type = rq.get("type")
    search_content = rq.get("content")

    # Load all embeddings
    (
        text_embeddings,
        image_embeddings,
        spec_freq_embeddings,
        text_0_2_4_embeddings,
        text_0_2_4_llm_fs_single_embeddings,
        spec_onhot_embeddings,
        spec_embeddings,
    ) = load_embeddings()

    # Inference
    if search_type == "Text":
        text_0_2_4_llm_fs_single_embeddings = text_query_top_k(
            model,
            tokenizer,
            device,
            search_content,
            text_0_2_4_llm_fs_single_embeddings,
        )
        top_k_file_names = (
            text_0_2_4_llm_fs_single_embeddings.sort_values(
                by="similarity", ascending=False
            )
            .head(k)
            .file_name.tolist()
        )

        # get all data modalities
        top_k = get_all_modalities(top_k_file_names)
        return jsonify({"data": top_k})

    elif search_type == "Image":
        image_embeddings = image_query_top_k(
            model, preprocess, device, search_content, image_embeddings
        )
        top_k_file_names = (
            image_embeddings.sort_values(by="similarity", ascending=False)
            .head(k)
            .file_name.tolist()
        )

        # get all data modalities
        top_k = get_all_modalities(top_k_file_names)
        return jsonify({"data": top_k})

    elif search_type == "Spec":
        spec_freq_embeddings = spec_query_top_k(search_content, spec_freq_embeddings)
        top_k_file_names = (
            spec_freq_embeddings.sort_values(by="similarity", ascending=False)
            .head(k)
            .file_name.tolist()
        )

        # get all data modalities
        top_k = get_all_modalities(top_k_file_names)
        return jsonify({"data": top_k})
    else:
        return jsonify({})


def text_query_top_k(model, tokenizer, device, search_content, embeddings):
    text_input = tokenizer([search_content], context_length=256).to(device)

    with torch.no_grad():
        text_features = model.encode_text(text_input)
        text_features = text_features / text_features.norm(dim=-1, keepdim=True) # normalize

    # text embedding
    embedding = text_features.cpu().numpy().tolist()[0]

    # compute similarities and get top K, add a similarity column to the embeddings DataFrame
    embeddings["similarity"] = embeddings.iloc[:, 1:].apply(
        lambda row: 1 - cosine(row, embedding), axis=1
    )
    return embeddings


def image_query_top_k(model, preprocess, device, search_content, embeddings):
    if isinstance(search_content, str):
        search_content = search_content.split(",")[1]
    image = preprocess(
        Image.open(BytesIO(base64.b64decode(search_content))).convert("RGB")
    )  # type: ignore
    image_input = torch.stack([image]).to(device)  # type: ignore

    with torch.no_grad():
        image_features = model.encode_image(image_input)
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)

    image_embedding = image_features.cpu().numpy().tolist()[0]

    # compute similarities and get top K
    embeddings["similarity"] = embeddings.iloc[:, 1:].apply(
        lambda row: 1 - cosine(row, image_embedding), axis=1
    )
    return embeddings


def spec_query_top_k(search_content, embeddings, is_onehot=False):
    spec_embedding = vectorize_specification(
        search_content, "all_cfg_rules.txt", is_onehot
    )

    # compute similarities and get top K
    embeddings["similarity"] = embeddings.iloc[:, 1:].apply(
        lambda row: 1 - cosine(row, spec_embedding), axis=1
    )
    return embeddings


def get_all_modalities(file_names):

    """
    Data retrieval function:
    - Takes a list of file names
    - For each file, loads the corresponding text, image, and specification data
    - Returns a list of dictionaries containing all modalities for each file
    """
    texts = []
    images = []
    specs = []
    file_names_wo_extensions = [os.path.splitext(x)[0] for x in file_names]

    for file_name in file_names_wo_extensions:
        try:
            # text
            text_base_path = os.path.join(
                "../data/unified/alt_0_2_4_llm_fs_single/", file_name
            )
            text = open(text_base_path + ".txt", "r").read()
            texts.append(text)

            # image
            image_base_path = os.path.join("../data/unified/imgs/", file_name)
            image = base64.b64encode(open(image_base_path + ".png", "rb").read()).decode(
                "utf-8"
            )
            images.append(image)

            # spec
            spec_base_path = os.path.join("../data/unified/specs/", file_name)
            spec = open(spec_base_path + ".json", "r").read()
            specs.append(spec)
        except:
            pass

    dumped = [
        {"name": name, "text": text, "image": image, "spec": spec}
        for name, text, image, spec in zip(
            file_names_wo_extensions, texts, images, specs
        )
    ]
    return dumped


def load_embeddings():
    text_embeddings = pd.read_csv("./embeddings/text_embeddings.tsv", sep="\t")
    image_embeddings = pd.read_csv("./embeddings/image_embeddings.tsv", sep="\t")
    spec_freq_embeddings = pd.read_csv("./embeddings/spec_frequency.tsv", sep="\t")

    # Additional versions
    spec_embeddings = pd.read_csv("./embeddings/spec_embeddings.tsv", sep="\t")
    text_0_2_4_embeddings = pd.read_csv(
        "./embeddings/text_0_2_4_embeddings.tsv", sep="\t"
    )
    text_0_2_4_llm_fs_single_embeddings = pd.read_csv(
        "./embeddings/text_0_2_4_llm_fs_single_embeddings.tsv", sep="\t"
    )
    spec_onehot_embeddings = pd.read_csv("./embeddings/spec_onehot.tsv", sep="\t")

    return (
        text_embeddings,
        image_embeddings,
        spec_freq_embeddings,
        text_0_2_4_embeddings,
        text_0_2_4_llm_fs_single_embeddings,
        spec_onehot_embeddings,
        spec_embeddings,
    )


@app.route("/api/get_db", methods=["GET"])
def get_index_database():
    index_db_file_names_single = os.listdir("../data/indexed/single_chart")
    index_db_file_names_multiple = os.listdir("../data/indexed/multiple_chart/imgs")
    index_db_file_names = index_db_file_names_single + index_db_file_names_multiple
    index_db_file_names = [f for f in index_db_file_names if f.endswith(".png")]

    index_db_file_names = sort_list(
        index_db_file_names,
        [
            "gene_annotation_p_4_sw_1_0_s_1_0.png",
            "EX_SPEC_SARS_COV_2_sw_1_0_s_1_0_oc.png",
            "EX_SPEC_MATRIX_sw_0_7_s_0_7_cc_1.png",
            "EX_SPEC_CLINVAR_LOLLIPOP_sw_1_2_s_1_2_oc.png",

            "EX_SPEC_CYTOBANDS_sw_1_2_s_1_2_oc.png",
            "EX_SPEC_MATRIX_HFFC6_sw_1_2_s_1_2_recolor.png",
            "EX_SPEC_PILEUP_sw_1_0_s_1_0_oc.png",
            "EX_SPEC_SEQUENCE_TRACK_sw_1_2_s_1_2_oc.png",

            "EX_SPEC_ALIGNMENT_CHART_sw_1_0_s_1_0_oc.png",
            "EX_SPEC_MARK_DISPLACEMENT_sw_1_0_s_1_0_oc.png",
            "BOCA-UK-f83fc777-5416-c3e9-e040-11ac0d482c8e.png",
            "EX_SPEC_GREMLIN_sw_1_0_s_1_0_oc.png",

            "VCF_INDELS_sw_1_0_s_1_0_oc.png",
            "stratified-area_p_0_sw_0_7_s_0_7_cc_0.png",
            "gene_annotation_single_1_s_1_0_oc.png",
            "TEXT_sw_1_2_s_1_2_oc.png",

            "multi_view_circular_ideograms_m_3_sw_1_0_s_1_0_oc_oc.png",
            "band_connection_p_0_sw_1_0_s_1_0_oc.png",
            "EX_SPEC_RESPONSIVE_COMPARATIVE_MATRICES_sw_0_7_s_0_7_p_0_sw_1_0_s_1_0_cc_0.png",
            "circular-heat_p_0_sw_1_0_s_1_0_cc_0.png",

            "BRUSH_sw_1_2_s_1_0_oc.png",
            "EX_SPEC_CIRCULAR_OVERVIEW_LINEAR_DETAIL_sw_1_2_s_1_2_oc.png",
            "multi_view_circular_ideograms_m_2_sw_1_0_s_1_0_oc_oc",
            "BED_DEMO_sw_0_7_s_0_7_oc_p_0_sw_1_2_s_1_2_oc.png",
            "EX_SPEC_MOUSE_EVENT_sw_1_2_s_1_2_oc.png",
            "breast_cancer_circular_s_2_0_oc.png",
            "EX_SPEC_MATRIX_sw_0_7_s_0_7_oc_bupu.png",
            "EX_SPEC_CIRCOS_BETWEEN_LINK_sw_1_0_s_1_0_oc.png",
            "multi_layer_circular_m_1_sw_0_7_s_0_7_cc_0.png"
            "EX_SPEC_CIRCULR_RANGE_sw_1_0_s_1_0_cc_2.png",
            "viridis-heatmap_p_0_sw_1_2_s_1_0_oc.png",

        ],
    )

    index_db = get_all_modalities(index_db_file_names)
    return jsonify({"data": index_db})

def sort_list(lst, order):
    order_dict = {val: idx for idx, val in enumerate(order)}
    return sorted(lst, key=lambda x: order_dict.get(x, float('inf')))

if __name__ == "__main__":
    app.run(debug=True, port=8080)
