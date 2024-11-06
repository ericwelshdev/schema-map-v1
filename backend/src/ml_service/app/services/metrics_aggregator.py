
# ml_service/app/services/metrics_aggregator.py
class MetricsAggregator:
    def __init__(self):
        self.metrics_window = []
        self.window_size = 100

    def add_metrics(self, metrics):
        self.metrics_window.append(metrics)
        if len(self.metrics_window) > self.window_size:
            self.metrics_window.pop(0)

    def get_aggregated_metrics(self):
        return {
            'accuracy': self._calculate_average('accuracy'),
            'confidence': self._calculate_average('confidence'),
            'feedback_rate': self._calculate_average('feedback_rate'),
            'trends': self._calculate_trends()
        }

    def _calculate_trends(self):
        if len(self.metrics_window) < 2:
            return {}

        recent = self.metrics_window[-10:]
        return {
            'accuracy_trend': self._calculate_trend([m['accuracy'] for m in recent]),
            'confidence_trend': self._calculate_trend([m['confidence'] for m in recent])
        }
