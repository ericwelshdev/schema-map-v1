from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from classification.modelRegistry import MLModelRegistry
from training.trainingService import TrainingService
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_registry = MLModelRegistry()
training_service = TrainingService()

class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]

@app.post("/train")
async def train_model(request: Dict[str, Any]):
    try:
        result = training_service.train_model(
            model_name=request.get("model_name", "default_model"),
            training_data=request.get("training_data"),
            model_type=request.get("model_type", "string")
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(request: Dict[str, Any]) -> PredictionResponse:
    model_name = request.get("model_name", "default_model")
    texts = request.get("texts", [])
    
    model, _ = model_registry.get_model(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
        
    predictions = model.predict(texts)
    return PredictionResponse(predictions=predictions)