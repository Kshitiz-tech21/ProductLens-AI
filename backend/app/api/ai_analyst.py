from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..core.ai_provider import get_ai_provider

router = APIRouter()

@router.post("/investigate")
def investigate(question: str, db: Session = Depends(get_db)):
    provider = get_ai_provider()
    # In a real app, we would fetch data from DB and pass to provider
    result = provider.analyze_data(None, question)
    return result

@router.post("/prd/generate")
def generate_prd(recommendation_id: int, db: Session = Depends(get_db)):
    provider = get_ai_provider()
    # Mock PRD generation
    prd = provider.generate(f"Generate a PRD for recommendation {recommendation_id}")
    return {"prd": prd}
