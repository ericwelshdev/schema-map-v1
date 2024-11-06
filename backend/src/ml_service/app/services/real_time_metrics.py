
# ml_service/app/services/real_time_metrics.py
class RealTimeMetricsCalculator:
    def __init__(self, connection_manager):
        self.connection_manager = connection_manager
        self.metrics_history = []
        
    async def update_metrics(self, session_metrics):
        self.metrics_history.append(session_metrics)
        
        aggregated_metrics = self._aggregate_metrics()
        trends = self._calculate_trends()
        
        metrics_update = {
            'type': 'metrics',
            'payload': {
                'current': session_metrics,
                'aggregated': aggregated_metrics,
                'trends': trends
            }
        }
        
        await self.connection_manager.broadcast(metrics_update)
        
    def _aggregate_metrics(self):
        recent_metrics = self.metrics_history[-100:]  # Last 100 actions
        return {
            'accuracy': sum(m['accuracy'] for m in recent_metrics) / len(recent_metrics),
            'confidence': sum(m['confidence'] for m in recent_metrics) / len(recent_metrics),
            'feedback_rate': sum(m['feedback_rate'] for m in recent_metrics) / len(recent_metrics)
        }
        
    def _calculate_trends(self):
        if len(self.metrics_history) < 2:
            return {}
            
        recent = self.metrics_history[-10:]
        return {
            'accuracy_trend': (recent[-1]['accuracy'] - recent[0]['accuracy']) / recent[0]['accuracy'],
            'confidence_trend': (recent[-1]['confidence'] - recent[0]['confidence']) / recent[0]['confidence']
        }
