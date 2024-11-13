# ml_service/app/models/bert_mapper.py
from transformers import AutoModel, AutoTokenizer
import torch
import torch.nn as nn  # Import nn for neural network layers
import numpy as np

class BertMapper:
    def __init__(self):
        self.bert = AutoModel.from_pretrained("bert-base-uncased")
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")  # Define tokenizer
        self.feature_processor = FeatureProcessor()
        self.classifier = nn.Sequential(
            nn.Linear(768 * 2, 512),  # 768 is BERT's hidden size
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
        
    def train(self, encoded_features, batch_size=32, epochs=10):
        train_data = self._prepare_training_pairs(encoded_features)
        optimizer = torch.optim.Adam(self.classifier.parameters())  # Specify classifier parameters
        criterion = nn.BCELoss()
        
        for epoch in range(epochs):
            total_loss = 0
            for batch in self._get_batches(train_data, batch_size):
                loss = self._train_step(batch, optimizer, criterion)
                total_loss += loss
                
            print(f"Epoch {epoch + 1}, Loss: {total_loss / len(train_data)}")
            
    def _train_step(self, batch, optimizer, criterion):
        self.classifier.train()
        optimizer.zero_grad()
        
        source_emb = batch['source_embeddings']
        target_emb = batch['target_embeddings']
        labels = batch['labels']
        
        # Combine source and target embeddings
        combined = torch.cat((source_emb, target_emb), dim=1)
        predictions = self.classifier(combined)
        
        loss = criterion(predictions, labels)
        loss.backward()
        optimizer.step()
        
        return loss.item()

    def encode_features(self, text):
        tokens = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            outputs = self.bert(**tokens)  # Use self.bert instead of self.model
        return outputs.last_hidden_state.mean(dim=1)
    
    def predict_mappings(self, source_columns, target_columns):
        self.classifier.eval()  # Set model to evaluation mode
        with torch.no_grad():
            # Encode source and target columns
            source_embeddings = self.feature_processor.encode_columns(source_columns)
            target_embeddings = self.feature_processor.encode_columns(target_columns)
        
            # Calculate similarity scores for all pairs
            predictions = []
            for source_emb in source_embeddings:
                column_predictions = []
                for target_emb in target_embeddings:
                    combined = torch.cat((source_emb, target_emb), dim=0).unsqueeze(0)
                    score = self.classifier(combined)
                    column_predictions.append(score.item())
                predictions.append(column_predictions)
        
            return self._format_predictions(predictions, source_columns, target_columns)

    def _format_predictions(self, predictions, source_columns, target_columns):
        mapping_suggestions = []
        for i, source_preds in enumerate(predictions):
            top_matches = self._get_top_matches(source_preds, n=3)
            mapping_suggestions.append({
                'source_column': source_columns[i]['name'],
                'suggested_mappings': [{
                    'target_column': target_columns[j]['name'],
                    'confidence': score,
                    'metadata_match': self._calculate_metadata_similarity(
                        source_columns[i], target_columns[j]
                    )
                } for j, score in top_matches]
            })
        return mapping_suggestions

    async def fine_tune(self, feedback_batch):
        self.classifier.train()
        optimizer = torch.optim.Adam(self.classifier.parameters(), lr=1e-5)  # Specify classifier parameters
        criterion = nn.BCELoss()
        
        encoded_data = self.feature_processor.encode_feedback_batch(feedback_batch)
        
        total_loss = 0
        for batch in self._create_batches(encoded_data, batch_size=32):
            loss = self._training_step(batch, optimizer, criterion)
            total_loss += loss
            
        return total_loss / len(feedback_batch)
        
    def _training_step(self, batch, optimizer, criterion):
        optimizer.zero_grad()
        
        outputs = self.classifier(
            batch['source_embeddings'],
            batch['target_embeddings'],
            batch['metadata_features']
        )
        
        loss = criterion(outputs, batch['labels'])
        loss.backward()
        optimizer.step()
        
        return loss.item()
