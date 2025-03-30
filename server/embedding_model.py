from sentence_transformers import SentenceTransformer
import torch
import os
import json
import hashlib

print("here")

def get_md5(input_str):
    # Create an MD5 hash object
    md5_hash = hashlib.md5()
    
    # Encode the string and update the hash object
    md5_hash.update(input_str.encode('utf-8'))
    
    # Return the hexadecimal MD5 digest
    return md5_hash.hexdigest()

class VisRAGModel:
    def __init__(self, rag_model_name, load_model=True):
        self.rag_model_name = rag_model_name
        self.rag_model = None
        self.desc_embedding = None
        self.name = None
        self.embedding_path = None
        self.load_model_flag = load_model
        if load_model:
            self.load_rag_model()

    def load_rag_model(self):
        if not self.load_model_flag:
            print("Skipping model loading as requested.")
            return
            
        print(f"Loading model: {self.rag_model_name}")
        self.rag_model = SentenceTransformer(self.rag_model_name)
        self.rag_model.max_seq_length = 4096
        self.rag_model.tokenizer.padding_side = "right"

    def load_desc_embedding(self, desc_dict, name):
        keys = list(desc_dict.keys())
        all_value_str = [desc_dict[key] for key in keys]
        combined_key_value = {key: desc_dict[key] for key in keys}
        md5_value = get_md5(json.dumps(combined_key_value, sort_keys=True))
        print("get the md5 value of keys:", md5_value)
        embedding_path = self.rag_model_name.split(
            '/')[-1] + "embedding_" + name + '_' + md5_value + ".pt"
        try:
            desc_embedding = torch.load(
                embedding_path, weights_only=False)
            assert len(desc_embedding) == len(
                desc_dict), "The number of tools in the desc_dict is not equal to the number of desc_embedding."
        except:
            desc_embedding = None
            print("\033[92mInferring the desc_embedding.\033[0m")
            desc_embedding = self.rag_model.encode(
                all_value_str, prompt="", normalize_embeddings=True
            )
            torch.save(desc_embedding, embedding_path)
            
            print("\033[92mFinished inferring the desc_embedding.\033[0m")
        return desc_embedding

    def load_embeddings_from_disk(self, dict_keys, names):
        """
        Load embeddings directly from disk without recomputing them.
        
        Args:
            dict_keys: A list of dictionaries containing the keys used to generate the embeddings
                     (e.g., [query_dict.keys(), reference_dict.keys()])
            names: A list of names corresponding to each dictionary (e.g., ['query', 'reference'])
            
        Returns:
            A list of loaded embeddings corresponding to each dictionary
        """
        embeddings = []
        model_prefix = self.rag_model_name.split('/')[-1]
        
        for keys, name in zip(dict_keys, names):
            # Calculate MD5 hash for the keys
            md5_value = get_md5(json.dumps(list(keys), sort_keys=True))
            embedding_path = f"{model_prefix}embedding_{name}_{md5_value}.pt"
            
            print(f"Loading {name} embeddings from {embedding_path}")
            try:
                embedding = torch.load(embedding_path, weights_only=False)
                print(f"Successfully loaded {name} embeddings with shape {embedding.shape}")
                embeddings.append(embedding)
            except Exception as e:
                print(f"Failed to load {name} embeddings: {str(e)}")
                embeddings.append(None)
        
        return embeddings

    def rag_infer(self, query, desc_embedding, name_dict, top_k=5):
        """
        Perform inference using the RAG model to find the top-k most similar items.

        Args:
            query (str): The input query string.
            desc_embedding (torch.Tensor): The precomputed description embeddings.
            name_dict (dict): A dictionary mapping indices to item names.
            top_k (int): The number of top results to return.

        Returns:
            list: A list of top-k most similar item names.
        """
        if self.rag_model is None:
            print("Model not loaded. Cannot perform inference.")
            return []
        
        if desc_embedding is None or not name_dict:
            print("Description embeddings or name dictionary are not provided.")
            return []

        # Encode the query
        queries = [query]
        query_embeddings = self.rag_model.encode(
            queries, normalize_embeddings=True
        )

        # Calculate similarity scores
        scores = torch.matmul(
            torch.tensor(query_embeddings), torch.tensor(desc_embedding).T
        )

        # Get top-k indices and corresponding names
        top_k = min(top_k, len(name_dict))
        top_k_indices = torch.topk(scores[0], top_k).indices.tolist()
        top_k_names = [name_dict[i] for i in top_k_indices]

        return top_k_names
    
def save_embeddings(query_list, reference_list, rag_model_name="/n/holylfs06/LABS/mzitnik_lab/Lab/shgao/bioagent/vis/rag_train/gte-Qwen2-1.5B-spac03270324-txt-bs256-8ep"):
    embedding_model = VisRAGModel(rag_model_name)
    query_embedding = embedding_model.load_desc_embedding(query_list, name='query')
    reference_embedding = embedding_model.load_desc_embedding(reference_list, name='reference')
    return query_embedding, reference_embedding

# Example usage of class method for loading embeddings
def load_saved_embeddings(query_dict, reference_dict, model_name="/n/holylfs06/LABS/mzitnik_lab/Lab/shgao/bioagent/vis/rag_train/gte-Qwen2-1.5B-spac03270324-txt-bs256-8ep"):
    """Helper function to load saved embeddings using the class method without loading the model"""
    # Initialize with load_model=False to skip model loading
    embedding_model = VisRAGModel(model_name, load_model=False)
    embeddings = embedding_model.load_embeddings_from_disk(
        [query_dict.keys(), reference_dict.keys()], 
        ['query', 'reference']
    )
    return embeddings

def transform_files_to_dict(folder, suffix):
    print(f"Processing files in {folder} with suffix {suffix}")
    data_dict = {}
    for file_name in os.listdir(folder):
        if file_name.endswith(suffix):
            file_path = os.path.join(folder, file_name)
            with open(file_path, 'r', encoding='utf-8') as f:
                data_dict[file_name] = f.read().strip()
    
    print(f"Processed {len(data_dict)} files.")
    return data_dict


def evaluate_embeddings(query_embedding, reference_embedding, gt_data, query_dict, reference_dict):
    """
    Evaluate the embeddings by calculating similarity scores between query and reference embeddings.
    """
    if query_embedding is None or reference_embedding is None:
        print("Embeddings are not loaded properly.")
        return

    # Calculate similarity scores
    similarity_scores = torch.matmul(
        torch.tensor(query_embedding), torch.tensor(reference_embedding).T
    )

    # Get the keys from both dictionaries
    query_keys = list(query_dict.keys())
    reference_keys = list(reference_dict.keys())
    
    evaluation_result = []
    
    for i, query_file_name in enumerate(query_keys):
        # Get ground truth by removing "_query" suffix
        ground_truth = query_file_name.split('_query')[0] if '_query' in query_file_name else query_file_name.split('.')[0]
        
        # Get siblings for this ground truth
        ground_truths = [ground_truth]
        if ground_truth in gt_data:
            ground_truths.extend(gt_data[ground_truth])
        
        # Get similarities for this query
        scores = similarity_scores[i]
        
        # Create dataframe-like structure for sorting
        embeddings = []
        for j, reference_key in enumerate(reference_keys):
            # Clean reference key by removing extension
            clean_reference_key = reference_key.split('.')[0]
            similarity = float(scores[j])
            embeddings.append({
                "file_name": clean_reference_key,
                "similarity": similarity
            })
        
        # Sort by similarity descending
        embeddings = sorted(embeddings, key=lambda x: x["similarity"], reverse=True)
        
        # Add rank (k) to each result
        for k, embed in enumerate(embeddings):
            embed["k"] = k + 1
        
        # Check if each result is a ground truth
        for embed in embeddings:
            embed["is_groundtruth"] = any(gt in embed["file_name"] for gt in ground_truths)
        
        # Find smallest k where a ground truth was matched
        matched_k_list = [embed["k"] for embed in embeddings if embed["is_groundtruth"]]
        matched_k = min(matched_k_list) if matched_k_list else float('inf')
        
        # Add to evaluation results
        evaluation_result.append({
            'query_file': query_file_name,
            'query_type': 'alt',
            'target_embedding_type': 'spec',
            'smallest_k_matched': matched_k if matched_k != float('inf') else None,
            'matched_ground_truths': [embed["file_name"] for embed in embeddings if embed["is_groundtruth"]][:5]
        })
    
    # Calculate summary statistics
    total_queries = len(evaluation_result)
    queries_with_match = sum(1 for result in evaluation_result if result['smallest_k_matched'] is not None)

    top_k_matches = {}
    for k in range(1, 6):
        top_k_matches[k] = sum(
            1 for result in evaluation_result
            if result['smallest_k_matched'] is not None and result['smallest_k_matched'] <= k
        )

    # Print results
    print(f"Total Queries: {total_queries}")
    print(f"Queries with at least one match: {queries_with_match}")
    for k in range(1, 6):
        accuracy = top_k_matches[k] / total_queries if total_queries > 0 else 0
        print(f"Top-{k} Accuracy: {accuracy:.4f}")

    # Return summary
    return {
        "total_queries": total_queries,
        "queries_with_match": queries_with_match,
        **{f"top_{k}_accuracy": (top_k_matches[k] / total_queries if total_queries > 0 else 0) for k in range(1, 6)},
        # "detailed_results": evaluation_result
    }


# Example usage
text_dict_alt = transform_files_to_dict('../data/test_suite/alt', '.txt')
text_dict_alt_llm = transform_files_to_dict('../data/test_suite/alt_0_2_4_llm_fs_single', '.txt')
spec_dict = transform_files_to_dict('../data/test_suite/specs', '.json')

# Generate embeddings for both text dictionaries
print("\n=== Generating embeddings for alt dataset ===")
text_embedding_alt, spec_embedding_alt = save_embeddings(text_dict_alt, spec_dict)

print("\n=== Generating embeddings for alt_0_2_4_llm_fs_single dataset ===")
text_embedding_alt_llm, spec_embedding_alt_llm = save_embeddings(text_dict_alt_llm, spec_dict)

# Load ground truth data - URL can't be opened directly, need to download the file first
import requests
try:
    # This is just an example approach - in practice you would download the file first
    response = requests.get("https://raw.githubusercontent.com/huyen-nguyen/geranium/evaluation/evaluation/siblings.json")
    gt_data = response.json()
except:
    print("Could not load ground truth data from URL. Please download the file manually.")
    gt_data = {}

# Evaluate the first dataset (alt)
if text_embedding_alt is not None and spec_embedding_alt is not None:
    print("\n=== Results for alt dataset ===")
    evaluation_summary_alt = evaluate_embeddings(text_embedding_alt, spec_embedding_alt, gt_data, text_dict_alt, spec_dict)
    print("Text to Spec Evaluation Summary (alt):", evaluation_summary_alt)

    evaluation_summary_alt_reverse = evaluate_embeddings(spec_embedding_alt, text_embedding_alt, gt_data, spec_dict, text_dict_alt)
    print("Spec to Text Evaluation Summary (alt):", evaluation_summary_alt_reverse)
else:
    print("Embeddings for alt dataset could not be loaded.")

# Evaluate the second dataset (alt_0_2_4_llm_fs_single)
if text_embedding_alt_llm is not None and spec_embedding_alt_llm is not None:
    print("\n=== Results for alt_0_2_4_llm_fs_single dataset ===")
    evaluation_summary_alt_llm = evaluate_embeddings(text_embedding_alt_llm, spec_embedding_alt_llm, gt_data, text_dict_alt_llm, spec_dict)
    print("Text to Spec Evaluation Summary (alt_llm):", evaluation_summary_alt_llm)

    evaluation_summary_alt_llm_reverse = evaluate_embeddings(spec_embedding_alt_llm, text_embedding_alt_llm, gt_data, spec_dict, text_dict_alt_llm)
    print("Spec to Text Evaluation Summary (alt_llm):", evaluation_summary_alt_llm_reverse)
else:
    print("Embeddings for alt_0_2_4_llm_fs_single dataset could not be loaded.")

# Compare results
print("\n=== Comparison of Top-k Accuracy between datasets ===")
if 'evaluation_summary_alt' in locals() and 'evaluation_summary_alt_llm' in locals():
    print("Text to Spec direction:")
    for k in range(1, 6):
        alt_accuracy = evaluation_summary_alt.get(f"top_{k}_accuracy", 0)
        alt_llm_accuracy = evaluation_summary_alt_llm.get(f"top_{k}_accuracy", 0)
        diff = alt_llm_accuracy - alt_accuracy
        print(f"Top-{k}: alt={alt_accuracy:.4f}, alt_llm={alt_llm_accuracy:.4f}, diff={diff:.4f}")