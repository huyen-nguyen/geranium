from flask import Flask, jsonify
from flask_cors import CORS
import open_clip

# get the model and tokenizer 
model, preprocess_train, preprocess_val = open_clip.create_model_and_transforms('hf-hub:microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224')
tokenizer = open_clip.get_tokenizer('hf-hub:microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224')

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route("/api/users", methods=['GET'])

def users():
    return jsonify(
        {
            "users": [
                'mint',
                'chocolate'
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port=8080)