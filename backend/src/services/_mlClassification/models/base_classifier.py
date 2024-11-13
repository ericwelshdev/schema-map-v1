from abc import ABC, abstractmethod
import pandas as pd
from typing import List, Dict, Any

class BaseClassifier(ABC):
    def __init__(self, model_config: Dict[str, Any]):
        self.model_config = model_config
        self.model = None
        
    @abstractmethod
    def preprocess(self, text_data: List[str]) -> pd.DataFrame:
        """Transform raw text data into features"""
        pass
        
    @abstractmethod
    def predict(self, features: pd.DataFrame) -> List[Dict[str, Any]]:
        """Generate classification predictions"""
        pass
        
    @abstractmethod
    def train(self, training_data: pd.DataFrame) -> None:
        """Train the classification model"""
        pass
        
    def validate_predictions(self, predictions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Validate and format prediction results"""
        return predictions

class ColumnClassifier(BaseClassifier):
    def __init__(self, model_config: Dict[str, Any]):
        super().__init__(model_config)
        self.classification_schema = model_config.get('classification_schema', {})
