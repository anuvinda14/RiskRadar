from pathlib import Path
import re

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
model = joblib.load(BASE_DIR / "phishing_model.joblib")

app = FastAPI(title="ElderSafe Phishing Detection API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with the deployed frontend domain before production.
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=3, max_length=50000)

class AnalyzeResponse(BaseModel):
    riskLevel: str
    riskScore: int
    prediction: str
    model: str
    disclaimer: str

@app.get("/health")
def health():
    return {"status": "ok", "model": "code-cortex-ceas08-tfidf-logreg-v1"}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    text = re.sub(r"\s+", " ", payload.text).strip()
    if len(text) < 3:
        raise HTTPException(status_code=400, detail="Text is too short.")
    probability = float(model.predict_proba([text])[0, 1])
    score = round(probability * 100)
    risk_level = "high" if score >= 70 else "caution" if score >= 40 else "safe"
    return {
        "riskLevel": risk_level,
        "riskScore": score,
        "prediction": "phishing" if probability >= 0.50 else "legitimate",
        "model": "code-cortex-ceas08-tfidf-logreg-v1",
        "disclaimer": "This is a risk estimate, not a guarantee.",
    }
