
from typing import Dict, Any, List
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
class ResourceClassifier:
    def __init__(self):
        self.model = RandomForestClassifier()
        self.label_encoder = LabelEncoder()
        self.feature_columns = []
        
    def train(self, data: pd.DataFrame) -> None:
        self.feature_columns = [col for col in data.columns if col != 'label']
        X = data[self.feature_columns]
        y = self.label_encoder.fit_transform(data['label'])
        self.model.fit(X, y)
        
    def predict(self, data: pd.DataFrame) -> List[str]:
        X = data[self.feature_columns]
        predictions = self.model.predict(X)
        return self.label_encoder.inverse_transform(predictions)
        
    def predict_proba(self, data: pd.DataFrame) -> List[Dict[str, float]]:
        X = data[self.feature_columns]
        probabilities = self.model.predict_proba(X)
        classes = self.label_encoder.classes_
        return [
            {class_name: prob for class_name, prob in zip(classes, probs)}
            for probs in probabilities
        ]
