# ml_service/app/services/monitoring_websocket.py
class MetricsWebSocket:
    def __init__(self):
        self.connections = set()
        self.alert_thresholds = {
            'accuracy_drop': 0.05,
            'confidence_threshold': 0.7,
            'feedback_incorporation_rate': 0.8
        }
    
    async def broadcast_metrics(self, metrics):
        message = {
            'type': 'metrics_update',
            'metrics': metrics,
            'timestamp': datetime.now().isoformat()
        }
        
        if self._should_alert(metrics):
            await self._send_alert(self._generate_alert(metrics))
            
        await self._broadcast(message)
    
    def _should_alert(self, metrics):
        return any([
            metrics['accuracy'] < self.alert_thresholds['accuracy_drop'],
            metrics['confidence'] < self.alert_thresholds['confidence_threshold'],
            metrics['feedback_incorporation'] < self.alert_thresholds['feedback_incorporation_rate']
        ])