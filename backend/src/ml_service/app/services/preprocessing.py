# ml_service/app/services/preprocessing.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

class PreprocessingService:
    def __init__(self):
        self.scaler = StandardScaler()

    def process(self, data):
        processed_data = {
            "text_features": self._process_text_features(data),
            "numeric_features": self._process_numeric_features(data),
            "metadata_features": self._process_metadata(data)
        }
        return processed_data

    def _process_text_features(self, data):
        # Process column names, descriptions, and comments
        text_features = []
        for column in data["columns"]:
            features = {
                "name": self._normalize_text(column["name"]),
                "description": self._normalize_text(column.get("description", "")),
                "comments": self._normalize_text(column.get("comments", ""))
            }
            text_features.append(features)
        return text_features

    def _process_numeric_features(self, data):
        # Process profiling metrics
        numeric_features = []
        for column in data["columns"]:
            if "profiling_metrics" in column:
                metrics = column["profiling_metrics"]
                features = {
                    "null_percentage": metrics.get("null_percentage", 0),
                    "unique_percentage": metrics.get("unique_percentage", 0),
                    "numeric_percentage": metrics.get("numeric_percentage", 0)
                }
                numeric_features.append(features)
        return self.scaler.fit_transform(numeric_features)

    def _process_metadata(self, data):
        # Process metadata like PII, PHI flags
        metadata_features = []
        for column in data["columns"]:
            features = {
                "is_pii": column.get("isPII", False),
                "is_phi": column.get("isPHI", False),
                "is_pk": column.get("isPK", False),
                "is_fk": column.get("isFK", False)
            }
            metadata_features.append(features)
        return metadata_features

    def _normalize_text(self, text):
        if not text:
            return ""
        return text.lower().strip()
