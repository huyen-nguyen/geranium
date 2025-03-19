import os
import torch
import numpy as np
import pandas as pd
from PIL import Image
from open_clip import create_model_from_pretrained, get_tokenizer

# Load the model and config files from the Hugging Face Hub
model, preprocess = create_model_from_pretrained('hf-hub:microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224')
tokenizer = get_tokenizer('hf-hub:microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224')

# Set device
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
model.to(device)
model.eval()
print(f"Model loaded on device: {device}")


# Define image and text directories
image_folder = "../data/unified/imgs"
text_folder = "../data/unified/alt"

# Collect image-text pairs
image_files = [f for f in os.listdir(image_folder) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
matching_pairs = []

for img_file in image_files:
    img_name = os.path.splitext(img_file)[0]  # Extract file name without extension
    text_file = img_name + ".txt"
    text_path = os.path.join(text_folder, text_file)

    if os.path.exists(text_path):
        matching_pairs.append((os.path.join(image_folder, img_file), text_path))
    else:
        print(f"Warning: No text description found for {img_file}. Skipping...")

print(f"Total valid image-text pairs: {len(matching_pairs)}")


# Store embeddings and filenames
image_text_embeddings = []
file_names = []

# Process images and text in batches
context_length = 256
batch_size = 50  # Adjust as needed

for i in range(0, len(matching_pairs), batch_size):
    batch_pairs = matching_pairs[i:i + batch_size]
    print(f"Processing {i} to {i+batch_size} of {len(matching_pairs)}")

    images = []
    texts = []

    for img_path, text_path in batch_pairs:
        # Load and preprocess image
        image = preprocess(Image.open(img_path).convert("RGB"))
        images.append(image)

        # Load text description
        with open(text_path, "r", encoding="utf-8") as f:
            text_desc = f.read().strip()

        texts.append(text_desc)
        file_names.append(os.path.basename(img_path))  # Store file name


    if not images or not texts:
        continue  # Skip empty batches

    # Convert to tensors and move to device
    images = torch.stack(images).to(device)
    texts = tokenizer(texts, context_length=context_length).to(device)

    with torch.no_grad():
        image_features, text_features, logit_scale = model(images, texts)

        # Normalize embeddings
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        text_features = text_features / text_features.norm(dim=-1, keepdim=True)

        # FUSION OPTION 1: Create joint image-text embedding (averaging)
        # combined_embedding = (image_features + text_features) / 2

        # FUSION OPTION 1: Concatenate image and text embeddings
        combined_embedding = torch.cat((image_features, text_features), dim=-1)

        image_text_embeddings.append(combined_embedding.cpu())

    print(f"  - Batch {i // batch_size + 1} processed.")

# Convert list of embeddings to a single tensor
if image_text_embeddings:
    image_text_embeddings = torch.cat(image_text_embeddings)
    print(f"\nFinal shape of combined embeddings: {image_text_embeddings.shape}")
else:
    image_text_embeddings = None

# Save as TSV file
if image_text_embeddings is not None:
    # Convert to NumPy for saving
    embeddings_np = image_text_embeddings.numpy()

    # Create a DataFrame
    df = pd.DataFrame(embeddings_np)
    df.insert(0, "Filename", file_names)  # Add filenames as the first column

    # Save as TSV file
    tsv_path = "./data/image_text_embeddings_concat.tsv"
    df.to_csv(tsv_path, sep="\t", index=False)
    
    print(f"\nEmbeddings saved to {tsv_path} (TSV format)")
else:
    print("\nNo embeddings were generated.")
