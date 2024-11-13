import re
from difflib import SequenceMatcher
from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import numpy as np
from sklearn.preprocessing import LabelEncoder
import gensim.downloader as api
from sklearn.metrics.pairwise import cosine_similarity

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
        self.word_vectors = api.load('word2vec-google-news-300')
        
    def train(self, texts: List[str], labels: List[str], schema_data: Dict) -> None:
        self.schema_data = schema_data
        X = self.vectorizer.fit_transform([self._preprocess_text(text) for text in texts])
        y = self.label_encoder.fit_transform(labels)
        self.model.fit(X, y)
        
    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        X = self.vectorizer.transform([self._preprocess_text(text) for text in texts])
        predictions = self.model.predict(X)
        base_probabilities = self.model.predict_proba(X)
        
        results = []
        for text, base_prob, pred in zip(texts, base_probabilities, predictions):
            predicted_label = self.label_encoder.inverse_transform([pred])[0]
            
            # Calculate detailed scoring components
            word_match_score = self._calculate_word_match_score(text, predicted_label)
            semantic_score = self._calculate_semantic_score(text, predicted_label)
            embedding_score = self._calculate_embedding_score(text, predicted_label)
            base_score = float(np.max(base_prob))
            
            weights = {
                'word_match': 0.45,    # increased for exact matches
                'semantic': 0.45,      # increased for schema-based matching
                'embedding': 0.05,     # significantly reduced
                'base': 0.05
            }

            
            final_score = (
                word_match_score * weights['word_match'] +
                semantic_score * weights['semantic'] +
                embedding_score * weights['embedding'] +
                base_score * weights['base']
            )
            
            results.append({
                "prediction": predicted_label,
                "confidence": float(final_score),
                "scoring_weights": weights,
                "scoring_components": {
                    "word_match": float(word_match_score),
                    "semantic_match": float(semantic_score),
                    "embedding_match": float(embedding_score),
                    "base_probability": float(base_score),
                    "input_text": text,
                    "predicted_label": predicted_label
                }
            })
        
        return results

    def _calculate_word_match_score(self, text: str, label: str) -> float:
        return SequenceMatcher(None, text.lower(), label.lower()).ratio()

    def _calculate_semantic_score(self, text: str, predicted_label: str) -> float:
        target_classification = None
        for group in self.schema_data:
            for option in group['options']:
                if option['value'] == predicted_label:
                    target_classification = option
                    break
            if target_classification:
                break
        
        if not target_classification:
            return 0.5

        input_terms = set(text.lower().split('_'))
        classification_terms = set()
        classification_terms.update(target_classification['tags'])
        classification_terms.add(target_classification['label'].lower())
        
        if 'properties' in target_classification:
            for prop_value in target_classification['properties'].values():
                classification_terms.update(prop_value.lower().split())
        
        return len(input_terms.intersection(classification_terms)) / len(input_terms)

    def _calculate_embedding_score(self, text: str, label: str) -> float:
        try:
            text_terms = text.lower().split('_')
            label_terms = label.lower().split('_')
            
            print(f"\nWord2Vec Similarities for: {text}")
            for term in text_terms:
                if term in self.word_vectors:
                    similar_terms = self.word_vectors.most_similar(term, topn=5)
                    print(f"Similar to '{term}': {similar_terms}")
            
            text_vectors = [self.word_vectors[term] for term in text_terms if term in self.word_vectors]
            label_vectors = [self.word_vectors[term] for term in label_terms if term in self.word_vectors]
            
            if text_vectors and label_vectors:
                text_avg = np.mean(text_vectors, axis=0)
                label_avg = np.mean(label_vectors, axis=0)
                similarity = float(cosine_similarity([text_avg], [label_avg])[0][0])
                print(f"Overall embedding similarity: {similarity}")
                return similarity
        except Exception as e:
            print(f"Embedding calculation error: {e}")
            
        return 0.5
    def _preprocess_text(self, text: str) -> str:
        text = text.lower()
        text = text.replace('_', ' ')
        return text