# ml_service/app/services/preprocessing.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

class PreprocessingService:
    def __init__(self):
        self.scaler = StandardScaler()

    def process_training_batch(self, data):
        processed_sources = []
        for source in data:
            processed_source = {
                'source_id': source['sourceMetadata']['id'],
                'text_features': self._process_text_features(source),
                'numeric_features': self._process_numeric_features(source),
                'metadata_features': self._process_metadata_features(source),
                'profiling_features': self._process_profiling_features(source),
                'mapping_labels': self._process_mapping_labels(source)
            }
            processed_sources.append(processed_source)
        
        return {
            'processed_data': processed_sources,
            'feature_stats': self._calculate_feature_statistics(processed_sources)
        }

    def _process_text_features(self, source):
        columns = source['sourceMetadata']['columns']
        return {
            'names': [self._normalize_text(col['name']) for col in columns],
            'descriptions': [self._normalize_text(col.get('description', '')) for col in columns],
            'tags': [col.get('tags', []) for col in columns]
        }

    def _process_numeric_features(self, source):
        profiling = source['profilingMetrics']
        return {
            'null_ratios': [col.get('nullRatio', 0) for col in profiling],
            'unique_ratios': [col.get('uniqueRatio', 0) for col in profiling],
            'value_distributions': [col.get('distribution', {}) for col in profiling]
        }

    def _process_metadata_features(self, source):
        columns = source['sourceMetadata']['columns']
        return {
            'pii_flags': [int(col['isPII']) for col in columns],
            'phi_flags': [int(col['isPHI']) for col in columns],
            'pk_flags': [int(col['isPK']) for col in columns],
            'fk_flags': [int(col['isFK']) for col in columns]
        }

    def _normalize_text(self, text):
        if not text:
            return ""
        return text.lower().strip()
