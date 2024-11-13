# ml_service/app/utils/data_helpers.py
import numpy as np
from typing import List, Dict
import torch

def prepare_batch(data: List[Dict], device: torch.device):
    """Prepare a batch of data for training"""
    text_features = [d["text_features"] for d in data]
    numeric_features = [d["numeric_features"] for d in data]
    metadata_features = [d["metadata_features"] for d in data]
    
    return {
        "text_features": torch.tensor(text_features).to(device),
        "numeric_features": torch.tensor(numeric_features).to(device),
        "metadata_features": torch.tensor(metadata_features).to(device)
    }

def calculate_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors"""
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
