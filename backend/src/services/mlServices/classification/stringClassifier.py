from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import numpy as np
from sklearn.preprocessing import LabelEncoder
from difflib import SequenceMatcher
import re

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
        self.schema_data = None
        self.confidence_thresholds = {
            'minimum': 0.3,
            'low': 0.4,
            'medium': 0.6,
            'high': 0.8
        }
        
    def train(self, texts: List[str], labels: List[str], schema_data: Dict) -> None:
        self.schema_data = schema_data
        X = self.vectorizer.fit_transform([self._preprocess_text(text) for text in texts])
        y = self.label_encoder.fit_transform(labels)
        self.model.fit(X, y)

    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        # First collect all potential matches with their scores
        potential_matches = []
        for text in texts:
            X = self.vectorizer.transform([self._preprocess_text(text)])
            base_probabilities = self.model.predict_proba(X)
            match = self._find_best_classification_match(text, set())
            if match:
                tier_scores = self._calculate_tiered_scores(text, match)
                potential_matches.append({
                    'text': text,
                    'match': match,
                    'confidence': tier_scores['final_confidence'],
                    'base_probabilities': base_probabilities,
                    'tier_scores': tier_scores
                })
    
        # Sort by confidence to process highest confidence matches first
        potential_matches.sort(key=lambda x: x['confidence'], reverse=True)
    
        # Track used classifications and store results
        used_classifications = set()
        results_map = {}
    
        # Process matches in order of confidence
        for match_info in potential_matches:
            text = match_info['text']
            match = match_info['match']
        
            if match and match['value'] not in used_classifications:
                used_classifications.add(match['value'])
                results_map[text] = {
                    "prediction": match['value'],
                    "confidence": float(match_info['confidence']),
                    "value": match,
                    "scoring_weights": match_info['tier_scores']['weights'],
                    "scoring_components": {
                        "word_match": float(match_info['tier_scores']['word_match']),
                        "pattern_match": float(match_info['tier_scores']['pattern_match']),
                        "semantic_match": float(match_info['tier_scores']['semantic_match']),
                        "embedding_match": float(match_info['tier_scores']['embedding_match']),
                        "base_probability": float(np.max(match_info['base_probabilities'])),
                        "input_text": text,
                        "predicted_label": match['label']
                    }
                }
            else:
                results_map[text] = self._create_null_result(text, match_info['base_probabilities'])
    
        # Return results in original order
        return [results_map.get(text, self._create_null_result(text, np.array([[0]]))) for text in texts]

    def _create_null_result(self, text: str, base_probabilities: np.ndarray) -> Dict:
        return {
            "prediction": None,
            "confidence": 0.0,
            "value": None,
            "scoring_weights": {
                'word_match': 0.45,
                'pattern': 0.25,
                'semantic': 0.20,
                'embedding': 0.05,
                'base': 0.05
            },
            "scoring_components": {
                "word_match": 0.0,
                "pattern_match": 0.0,
                "semantic_match": 0.0,
                "embedding_match": 0.0,
                "base_probability": float(np.max(base_probabilities)),
                "input_text": text,
                "predicted_label": None
            }
        }

    def _calculate_match_score(self, text: str, classification: Dict) -> float:
        text_lower = text.lower()
        text_terms = set(text_lower.split('_'))
        
        # Check anti-patterns first
        if 'anti_patterns' in classification:
            # Check anti-pattern terms
            anti_terms = set(term.lower() for term in classification['anti_patterns'].get('terms', []))
            if text_terms.intersection(anti_terms):
                return 0.1
                
            # Check anti-pattern patterns
            anti_patterns = classification['anti_patterns'].get('patterns', [])
            for pattern in anti_patterns:
                pattern = pattern.replace('*', '.*').lower()
                if re.match(pattern, text_lower):
                    return 0.1
        
        # Calculate positive matches
        label_terms = set(classification['label'].lower().split())
        tag_terms = set(tag.lower() for tag in classification['tags'])
        
        # Include prefix/suffix terms
        property_terms = set()
        if 'properties' in classification:
            for prop_name, prop_value in classification['properties'].items():
                if prop_name in ['prefix', 'suffix']:
                    terms = prop_value.split('like')[1].strip().split(',')
                    property_terms.update(term.strip().lower() for term in terms)
        
        # Combined matching
        all_terms = label_terms.union(tag_terms).union(property_terms)
        term_match_ratio = len(text_terms.intersection(all_terms)) / len(text_terms)
        sequence_match = SequenceMatcher(None, text_lower, classification['label'].lower()).ratio()
        
        return (term_match_ratio * 0.7) + (sequence_match * 0.3)

    def _find_best_classification_match(self, text: str, used_classifications: set) -> Dict:
        best_match = None
        highest_score = 0
        
        for group in self.schema_data:
            for option in group['options']:
                if option['value'] in used_classifications:
                    continue
                    
                score = self._calculate_match_score(text, option)
                if score > highest_score:
                    highest_score = score
                    best_match = option
        
        return best_match if highest_score > self.confidence_thresholds['minimum'] else None

    def _calculate_tiered_scores(self, text: str, classification: Dict) -> Dict[str, Any]:
        # Calculate all scores
        word_match = self._calculate_word_match_score(text, classification['label'])
        pattern_match = self._calculate_pattern_score(text, classification)
        semantic_match = self._calculate_semantic_score(text, classification)
        
        # Calculate base probability using the model
        X = self.vectorizer.transform([self._preprocess_text(text)])
        base_probability = float(np.max(self.model.predict_proba(X)))
        
        # Determine weights based on match strength
        if word_match > self.confidence_thresholds['high']:
            weights = {'core': 0.6, 'pattern': 0.3, 'semantic': 0.1}
        elif pattern_match > self.confidence_thresholds['medium']:
            weights = {'core': 0.3, 'pattern': 0.5, 'semantic': 0.2}
        else:
            weights = {'core': 0.2, 'pattern': 0.3, 'semantic': 0.5}
        
        final_confidence = (
            word_match * weights['core'] +
            pattern_match * weights['pattern'] +
            semantic_match * weights['semantic']
        )
        
        return {
            'word_match': word_match,
            'pattern_match': pattern_match,
            'semantic_match': semantic_match,
            'embedding_match': word_match,
            'base_probability': base_probability,
            'final_confidence': final_confidence,
            'weights': weights
        }

    def _calculate_word_match_score(self, text: str, label: str) -> float:
        return SequenceMatcher(None, text.lower(), label.lower()).ratio()

    def _calculate_pattern_score(self, text: str, classification: Dict) -> float:
        score = 0
        text_lower = text.lower()
        
        if 'properties' in classification:
            props = classification['properties']
            if 'prefix' in props:
                prefixes = [p.strip() for p in props['prefix'].split('like')[1].split(',')]
                if any(text_lower.startswith(p.lower()) for p in prefixes):
                    score += 1
                    
            if 'suffix' in props:
                suffixes = [s.strip() for s in props['suffix'].split('like')[1].split(',')]
                if any(text_lower.endswith(s.lower()) for s in suffixes):
                    score += 1
        
        return score / 2 if score > 0 else 0.5

    def _calculate_semantic_score(self, text: str, classification: Dict) -> float:
        text_terms = set(text.lower().split('_'))
        classification_terms = set()
        
        classification_terms.update(classification['label'].lower().split())
        classification_terms.update(tag.lower() for tag in classification['tags'])
        
        if 'properties' in classification:
            for prop_value in classification['properties'].values():
                classification_terms.update(prop_value.lower().split())
        
        return len(text_terms.intersection(classification_terms)) / len(text_terms)

    def _preprocess_text(self, text: str) -> str:
        text = text.lower()
        text = text.replace('_', ' ')
        return text
