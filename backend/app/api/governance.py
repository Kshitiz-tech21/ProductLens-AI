from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..models.database import Recommendation, Approval, PRDDocument
from ..core.ai_provider import get_ai_provider

router = APIRouter()

@router.get("/recommendations")
def list_recommendations(db: Session = Depends(get_db)):
    return db.query(Recommendation).all()

@router.post("/recommendations/{rec_id}/action")
def action_recommendation(rec_id: int, status: str, reviewer: str, comment: str, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        return {"error": "Not found"}
    
    rec.status = status
    approval = Approval(
        recommendation_id=rec_id,
        reviewer=reviewer,
        status=status,
        comment=comment
    )
    db.add(approval)
    db.commit()
    return {"status": "updated"}

@router.post("/prd/generate")
def generate_prd(rec_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        return {"error": "Not found"}
    
    provider = get_ai_provider()
    # Professional PRD template
    prompt = f"Generate a detailed PRD for the feature: {rec.title}. Description: {rec.description}. Expected Impact: {rec.expected_impact}."
    content = provider.generate(prompt)
    
    prd = PRDDocument(recommendation_id=rec_id, content=content)
    db.add(prd)
    db.commit()
    return {"prd_id": prd.id, "content": content}
