from fastapi import FastAPI, HTTPException

from diet_service import predict_diet
from symptom_service import analyze_symptoms

app = FastAPI(title="MaMaCare AI Services")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/diet/plan")
def diet_plan(payload: dict):
    try:
        return predict_diet(payload or {})
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/symptoms/analyze")
def symptoms_analyze(payload: dict):
    return analyze_symptoms(payload or {})
