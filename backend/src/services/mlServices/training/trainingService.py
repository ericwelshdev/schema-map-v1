from typing import Dict, Any
from classification.modelRegistry import MLModelRegistry
import pandas as pd

class TrainingService:
    def __init__(self):
        self.model_registry = MLModelRegistry()
    
    def train_model(self, model_name: str, training_data: Dict[str, Any], model_type: str = "string") -> Dict[str, Any]:
        model_class = self.model_registry.get_model_types().get(model_type)
        if not model_class:
            raise ValueError(f"Unknown model type: {model_type}")
            
        model = model_class()
        
        if model_type == "string":
            texts = training_data.get("texts", [])
            labels = training_data.get("labels", [])
            model.train(texts, labels)
        elif model_type == "resource":
            df = pd.DataFrame(training_data)
            model.train(df)
            
        self.model_registry.register_model(model_name, model)
        return {"status": "success", "model_name": model_name}