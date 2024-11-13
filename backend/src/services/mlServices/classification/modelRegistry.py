from typing import Dict, Any, Tuple
from .stringClassifier import StringClassificationProcessor
from .resourceClassifier import ResourceClassifier

class MLModelRegistry:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLModelRegistry, cls).__new__(cls)
            cls._instance.models = {}
            cls._instance.preprocessors = {}
        return cls._instance
    
    def register_model(self, model_name: str, model_instance: Any, preprocessor: Any = None) -> None:
        self.models[model_name] = model_instance
        if preprocessor:
            self.preprocessors[model_name] = preprocessor
        print(f"Model registered: {model_name}")
        print(f"Available models: {list(self.models.keys())}")
    
    def get_model(self, model_name: str) -> Tuple[Any, Any]:
        print(f"Getting model: {model_name}")
        print(f"Available models: {list(self.models.keys())}")
        return self.models.get(model_name), self.preprocessors.get(model_name)

    def get_model_types(self) -> Dict[str, Any]:
        return {
            "string": StringClassificationProcessor,
            "resource": ResourceClassifier
        }