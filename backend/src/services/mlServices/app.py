from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from classification.stringClassifier import StringClassificationProcessor
from classification.modelRegistry import MLModelRegistry
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

# Initialize and register the string classifier
string_classifier = StringClassificationProcessor()
model_registry.register_model("schema_classifier", string_classifier)

class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]

@app.post("/train")
async def train(request: Dict[str, Any]):
    model_name = request.get("model_name", "default_model")
    training_data = request.get("training_data", {})
    schema_data = request.get("schema_data", {})
    
    texts = training_data.get("texts", [])
    labels = training_data.get("labels", [])
    
    model, _ = model_registry.get_model(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
        
    model.train(texts, labels, schema_data)
    return {"status": "success", "message": "Model trained successfully"}


@app.post("/predict")
async def predict(request: Dict[str, Any]) -> PredictionResponse:
    model_name = request.get("model_name", "default_model")
    texts = request.get("texts", [])
    
    model, _ = model_registry.get_model(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
        
    predictions = model.predict(texts)
    return PredictionResponse(predictions=predictions)