# ml_service/app/services/training.py
import torch
from torch import nn
from sklearn.model_selection import train_test_split

class TrainingService:
    def __init__(self):
        self.mapper = BertMapper()
        self.feature_processor = FeatureProcessor()

    def train_model(self, processed_data):
        # Encode features
        encoded_features = self.feature_processor.encode_features(processed_data)
        
        # Train the model
        training_metrics = self.mapper.train(encoded_features)
        
        # Save the model
        model_path = self._save_model()
        
        return {
            'model_path': model_path,
            'metrics': training_metrics
        }
        
    def _save_model(self):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        path = f'models/mapper_model_{timestamp}.pt'
        torch.save(self.mapper.state_dict(), path)
        return path