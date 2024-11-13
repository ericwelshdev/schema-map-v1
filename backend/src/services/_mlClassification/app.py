from fastapi import FastAPI
from .models.bert_classifier import BertClassifier
from .services.classification_service import ClassificationService
from .config.model_config import MODEL_CONFIG

app = FastAPI()
classifier = BertClassifier(MODEL_CONFIG)
classification_service = ClassificationService(classifier)

@app.post("/classify")
async def classify_text(request: Dict[str, Any]):
    predictions = classification_service.classify_text(request['texts'])
    return {"predictions": predictions}