# ml_service/app/services/monitoring.py
class ModelMonitor:
    def __init__(self):
        self.metrics_history = []
        self.current_performance = {}
        
    def track_metrics(self, metrics):
        self.metrics_history.append({
            'timestamp': datetime.now().isoformat(),
            **metrics
        })
        self.current_performance = metrics
        return self._calculate_trends()
        
    def _calculate_trends(self):
        if len(self.metrics_history) < 2:
            return None
            
        return {
            'accuracy_trend': self._compute_trend('accuracy'),
            'confidence_trend': self._compute_trend('confidence'),
            'feedback_incorporation_rate': self._compute_feedback_rate()
        }