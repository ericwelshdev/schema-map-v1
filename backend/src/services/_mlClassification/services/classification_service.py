from typing import List, Dict, Any
from ..models.base_classifier import BaseClassifier

class ClassificationService:
    def __init__(self, classifier: BaseClassifier):
        self.classifier = classifier
        
    def classify_text(self, text_data: List[str]) -> List[Dict[str, Any]]:
        features = self.classifier.preprocess(text_data)
        predictions = self.classifier.predict(features)
        return self.classifier.validate_predictions(predictions)
