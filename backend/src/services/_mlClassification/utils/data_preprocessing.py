import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

class DataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
    
    def process_features(self, data):
        numeric_features = data.select_dtypes(include=['int64', 'float64']).columns
        categorical_features = data.select_dtypes(include=['object']).columns
        
        # Scale numeric features
        if len(numeric_features) > 0:
            data[numeric_features] = self.scaler.fit_transform(data[numeric_features])
        
        # Encode categorical features
        for feature in categorical_features:
            if feature not in self.label_encoders:
                self.label_encoders[feature] = LabelEncoder()
            data[feature] = self.label_encoders[feature].fit_transform(data[feature])
            
        return data
