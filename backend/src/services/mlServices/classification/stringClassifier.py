from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import numpy as np
from sklearn.preprocessing import LabelEncoder

class StringClassificationProcessor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            analyzer='char_wb',
            ngram_range=(2, 4),
            min_df=1,
            max_features=1000
        )
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.label_encoder = LabelEncoder()
        
    def train(self, texts: List[str], labels: List[str]) -> None:
        # Transform text features
        X = self.vectorizer.fit_transform([self._preprocess_text(text) for text in texts])
        # Encode labels
        y = self.label_encoder.fit_transform(labels)
        # Train model
        self.model.fit(X, y)
    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        X = self.vectorizer.transform([self._preprocess_text(text) for text in texts])
        predictions = self.model.predict(X)
        base_probabilities = self.model.predict_proba(X)
        
        results = []
        for text, base_prob, pred in zip(texts, base_probabilities, predictions):
            predicted_label = self.label_encoder.inverse_transform([pred])[0]
            
            # Calculate scores with higher weights
            word_match_score = self._calculate_word_match_score(text, predicted_label)
            pattern_score = self._calculate_pattern_score(text, predicted_label)
            semantic_score = self._calculate_semantic_score(text, predicted_label)
            base_score = np.max(base_prob)
            
            # Adjusted weights to emphasize strong matches
            final_score = (
                word_match_score * 0.5 +
                pattern_score * 0.3 +
                semantic_score * 0.15 +
                base_score * 0.05
            )
            
            # Scale score to higher range for strong matches
            adjusted_score = 0.75 + (final_score * 0.25)
            
            # Include detailed scoring in response
            results.append({
                "prediction": predicted_label,
                "confidence": float(adjusted_score),
                "debug_scores": {
                    "word_match": float(word_match_score),
                    "pattern_match": float(pattern_score),
                    "semantic_match": float(semantic_score),
                    "base_probability": float(base_score),
                    "final_score": float(final_score),
                    "input_text": text
                }
            })
        
        return results

    def _calculate_word_match_score(self, text: str, label: str) -> float:
        return SequenceMatcher(None, text.lower(), label.lower()).ratio()

    def _calculate_pattern_score(self, text: str, label: str) -> float:
        # Pattern matching for common naming conventions
        patterns = {
            'table': r'.*_(TABLE|ENTITY|NAME)',
            'column': r'.*_(COLUMN|FIELD|ATTR)'
        }
        pattern_matches = any(re.match(pattern, text.upper()) for pattern in patterns.values())
        return 0.9 if pattern_matches else 0.5

    def _calculate_semantic_score(self, text: str, label: str) -> float:
        # Semantic similarity based on common terms
        common_terms = {'entity', 'table', 'column', 'attribute', 'name', 'id'}
        text_terms = set(text.lower().split('_'))
        match_ratio = len(text_terms.intersection(common_terms)) / len(text_terms)
        return match_ratio    
    def _preprocess_text(self, text: str) -> str:
        # Text preprocessing logic
        text = text.lower()
        text = text.replace('_', ' ')
        return text