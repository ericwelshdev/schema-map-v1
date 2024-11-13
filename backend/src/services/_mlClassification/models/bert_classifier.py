from transformers import AutoModel, AutoTokenizer
import torch
from .base_classifier import BaseClassifier
import pandas as pd
from typing import List, Dict, Any

class BertClassifier(BaseClassifier):
    def __init__(self, model_config: Dict[str, Any]):
        super().__init__(model_config)
        self.bert = AutoModel.from_pretrained("bert-base-uncased")
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
        
    def preprocess(self, text_data: List[str]) -> pd.DataFrame:
        features = pd.DataFrame({'text': text_data})
        return features
        
    def predict(self, features: pd.DataFrame) -> List[Dict[str, Any]]:
        predictions = []
        for text in features['text']:
            tokens = self.tokenizer(text, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = self.bert(**tokens)
            predictions.append({'prediction': outputs.last_hidden_state.mean().item()})
        return predictions
        
    def train(self, training_data: pd.DataFrame) -> None:
        pass
