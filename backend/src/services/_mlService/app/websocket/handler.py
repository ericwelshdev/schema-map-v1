
# ml_service/app/websocket/handler.py
from fastapi import WebSocket, WebSocketDisconnect
from app.services.session_tracker import MappingSessionTracker
from app.services.real_time_metrics import RealTimeMetricsCalculator

class WebSocketHandler:
    def __init__(self):
        self.connection_manager = ConnectionManager()
        self.metrics_calculator = RealTimeMetricsCalculator(self.connection_manager)
        self.session_tracker = MappingSessionTracker(self.metrics_calculator)

    async def handle_connection(self, websocket: WebSocket):
        await self.connection_manager.connect(websocket)
        try:
            while True:
                data = await websocket.receive_json()
                await self._process_message(data)
        except WebSocketDisconnect:
            self.connection_manager.disconnect(websocket)

    async def _process_message(self, message):
        if message['type'] == 'session_start':
            await self.session_tracker.start_session(message)
        elif message['type'] == 'mapping_action':
            metrics = await self.session_tracker.track_action(message)
            await self.metrics_calculator.update_metrics(metrics)
