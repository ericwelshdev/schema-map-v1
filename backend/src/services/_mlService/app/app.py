# mlService/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.services.preprocessing import PreprocessingService
from app.services.training import TrainingService
from app.models.bert_mapper import BertMapper
from app.websocket.connection_manager import ConnectionManager

app = FastAPI()
manager = ConnectionManager()
preprocessor = PreprocessingService()
trainer = TrainingService()
mapper = BertMapper()

@app.post("/process-training-data")
async def process_training_data(data: dict):
    try:
        processed_data = preprocessor.process(data)
        return {"processed_features": processed_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/train-model")
async def train_model(data: dict):
    try:
        model_results = trainer.train(data)
        return model_results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/suggest-mappings")
async def suggest_mappings(data: dict):
    try:
        suggestions = mapper.predict(data)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.websocket("/ws/metrics")
async def metrics_websocket(websocket: WebSocket):
    await ws_handler.handle_connection(websocket)

@app.on_event("startup")
async def startup_event():
    print("WebSocket server started")        