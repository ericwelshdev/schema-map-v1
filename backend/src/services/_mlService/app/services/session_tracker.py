
# ml_service/app/services/session_tracker.py
class MappingSessionTracker:
    def __init__(self, metrics_aggregator):
        self.active_sessions = {}
        self.metrics_aggregator = metrics_aggregator
        
    async def start_session(self, session_data):
        session_id = session_data['sessionId']
        self.active_sessions[session_id] = {
            'start_time': datetime.now(),
            'source_schema': session_data['sourceSchema'],
            'target_schema': session_data['targetSchema'],
            'actions': [],
            'metrics': {
                'accuracy': 0,
                'confidence': 0,
                'feedback_rate': 0
            }
        }
        
    async def track_action(self, action_data):
        session = self.active_sessions[action_data['sessionId']]
        session['actions'].append(action_data)
        
        # Calculate real-time metrics
        metrics = self._calculate_session_metrics(session)
        session['metrics'] = metrics
        
        # Update global metrics
        await self.metrics_aggregator.add_metrics(metrics)
        
        return metrics
        
    def _calculate_session_metrics(self, session):
        actions = session['actions']
        total_actions = len(actions)
        if total_actions == 0:
            return session['metrics']
            
        accepted = sum(1 for a in actions if a['action'] == 'accept')
        
        return {
            'accuracy': accepted / total_actions,
            'confidence': self._calculate_confidence(actions),
            'feedback_rate': total_actions / len(session['source_schema'])
        }
