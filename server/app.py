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
        spec_embeddings,
        text_0_2_4_embeddings,
        text_0_2_4_llm_fs_single_embeddings,
        spec_onhot_embeddings,
    ) = load_embeddings()

    # Inference
    if search_type == "Text":
        text_embeddings = text_query_top_k(
            model, tokenizer, device, search_content, text_embeddings
        )
        top_k_file_names = (
            text_embeddings.sort_values(by="similarity", ascending=False)
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
        spec_embeddings = spec_query_top_k(search_content, spec_embeddings)
        top_k_file_names = (
            spec_embeddings.sort_values(by="similarity", ascending=False)
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
        text_features = text_features / text_features.norm(dim=-1, keepdim=True)

    embedding = text_features.cpu().numpy().tolist()[0]

    # compute similarities and get top K
    embeddings["similarity"] = embeddings.iloc[:, 1:].apply(
        lambda row: 1 - cosine(row, embedding), axis=1
    )
    return embeddings


def image_query_top_k(model, preprocess, device, search_content, embeddings):
    image = preprocess(
        Image.open(BytesIO(base64.b64decode(search_content.split(",")[1]))).convert(
            "RGB"
        )
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


def spec_query_top_k(search_content, embeddings):
    spec_embedding = vectorize_specification(search_content, "all_cfg_rules.txt")

    # compute similarities and get top K
    embeddings["similarity"] = embeddings.iloc[:, 1:].apply(
        lambda row: 1 - cosine(row, spec_embedding), axis=1
    )
    return embeddings


def get_all_modalities(file_names):
    texts = []
    images = []
    specs = []
    file_names_wo_extensions = [os.path.splitext(x)[0] for x in file_names]

    for file_name in file_names_wo_extensions:
        # text
        text_base_path = os.path.join("../data/unified/alt_0_2_2/", file_name)
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
    spec_embeddings = pd.read_csv("./embeddings/spec_frequency.tsv", sep="\t")

    # Additional versions
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
        spec_embeddings,
        text_0_2_4_embeddings,
        text_0_2_4_llm_fs_single_embeddings,
        spec_onehot_embeddings,
    )


@app.route("/api/get_db", methods=["GET"])
def get_index_database():
    index_db_file_names = os.listdir("../data/indexed/imgs")
    index_db = get_all_modalities(index_db_file_names)
    return jsonify({"data": index_db})


if __name__ == "__main__":
    app.run(debug=True, port=8080)
