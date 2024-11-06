
# ml_service/app/services/alert_manager.py
class AlertManager:
    def __init__(self):
        self.alert_history = []
        self.alert_rules = {
            'accuracy_drop': {
                'threshold': 0.05,
                'message': 'Significant drop in mapping accuracy detected',
                'severity': 'error'
            },
            'low_confidence': {
                'threshold': 0.7,
                'message': 'Low confidence scores in recent mappings',
                'severity': 'warning'
            },
            'feedback_integration': {
                'threshold': 0.8,
                'message': 'Feedback integration rate below threshold',
                'severity': 'warning'
            }
        }

    async def check_metrics(self, metrics):
        alerts = []
        for rule_name, rule in self.alert_rules.items():
            if metrics[rule_name] < rule['threshold']:
                alert = self._create_alert(rule, metrics[rule_name])
                alerts.append(alert)
                await self._store_alert(alert)
        return alerts

    def _create_alert(self, rule, value):
        return {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'message': rule['message'],
            'severity': rule['severity'],
            'value': value,
            'threshold': rule['threshold']
        }
