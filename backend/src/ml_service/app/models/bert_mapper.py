# ml_service/app/models/bert_mapper.py
from transformers import AutoModel, AutoTokenizer
import torch
import numpy as np

class BertMapper:
    def __init__(self):
        self.model = AutoModel.from_pretrained("bert-base-uncased")
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def encode_features(self, text):
        tokens = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            outputs = self.model(**tokens)
        return outputs.last_hidden_state.mean(dim=1)

    def predict(self, data):
        source_embeddings = self.encode_features(data["source_columns"])
        target_embeddings = self.encode_features(data["target_columns"])
        
        similarities = torch.nn.functional.cosine_similarity(
            source_embeddings.unsqueeze(1),
            target_embeddings.unsqueeze(0)
        )
        
        return similarities.cpu().numpy()
