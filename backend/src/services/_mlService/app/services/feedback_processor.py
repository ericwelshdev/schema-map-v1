# ml_service/app/services/feedback_processor.py
class FeedbackProcessor:
    def __init__(self, model_path='models/current_model.pt'):
        self.model = BertMapper()
        self.model.load_state_dict(torch.load(model_path))
        self.feedback_queue = []
        self.min_feedback_batch = 5
        
    async def process_feedback(self, feedback_data):
        self.feedback_queue.append(self._preprocess_feedback(feedback_data))
        
        if len(self.feedback_queue) >= self.min_feedback_batch:
            await self.update_model()
            
    def _preprocess_feedback(self, feedback):
        return {
            'source_column': feedback['mapping']['sourceColumn'],
            'target_column': feedback['mapping']['targetColumn'],
            'label': 1.0 if feedback['feedback'] == 'accept' else 0.0,
            'confidence': feedback['mapping'].get('confidence', 0.0),
            'metadata': feedback.get('metadata', {})
        }
        
    async def update_model(self):
        processed_feedback = self._prepare_training_batch()
        loss = await self.model.fine_tune(processed_feedback)
        
        # Save updated model
        torch.save(self.model.state_dict(), 'models/current_model.pt')
        
        # Clear processed feedback
        self.feedback_queue = []
        
        return {
            'status': 'success',
            'loss': loss,
            'processed_feedback_count': len(processed_feedback)
        }
