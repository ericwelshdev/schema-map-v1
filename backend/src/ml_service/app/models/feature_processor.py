
# ml_service/app/models/feature_processor.py
class FeatureProcessor:
    def __init__(self):
        self.text_encoder = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.bert_model = AutoModel.from_pretrained('bert-base-uncased')
        
    def encode_features(self, processed_data):
        encoded_features = []
        for source in processed_data:
            encoded_source = {
                'source_id': source['source_id'],
                'text_embeddings': self._encode_text_features(source['text_features']),
                'numeric_features': self._normalize_numeric_features(source['numeric_features']),
                'metadata_features': source['metadata_features'],
                'labels': source['mapping_labels']
            }
            encoded_features.append(encoded_source)
        
        return encoded_features

    def _encode_text_features(self, text_features):
        combined_text = [f"{name} {desc}" for name, desc in 
                        zip(text_features['names'], text_features['descriptions'])]
        
        encodings = self.text_encoder(combined_text, 
                                    padding=True, 
                                    truncation=True, 
                                    return_tensors='pt')
        
        with torch.no_grad():
            outputs = self.bert_model(**encodings)
            embeddings = outputs.last_hidden_state.mean(dim=1)
        
        return embeddings
