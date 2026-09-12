from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..analytics.services import AnalyticsService
from ..models.database import Feature, FeatureScore, Experiment, ExperimentVariant, SupportTicket, Review

router = APIRouter()

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    metrics = ['MAU', 'DAU', 'Revenue', 'Conversion', 'Retention', 'Churn']
    results = []
    for m in metrics:
        res = AnalyticsService.calculate_z_score_anomaly(db, m)
        if res and res["is_anomaly"]:
            results.append(res)
    return results

@router.get("/experiments/{exp_id}/analysis")
def analyze_experiment(exp_id: int, db: Session = Depends(get_db)):
    exp = db.query(Experiment).filter(Experiment.id == exp_id).first()
    if not exp or len(exp.variants) < 2:
        return {"error": "Experiment needs at least two variants"}
    
    # Assuming variants[0] is control, variants[1] is variant
    return AnalyticsService.calculate_ab_test(exp.variants[0], exp.variants[1])

@router.get("/prioritization")
def get_prioritization(db: Session = Depends(get_db)):
    features = db.query(Feature).all()
    ranking = []
    for f in features:
        score = db.query(FeatureScore).filter(FeatureScore.feature_id == f.id).first()
        if score:
            ranking.append({
                "name": f.name,
                "rice": score.rice_score,
                "ice": score.ice_score,
                "expected_revenue": score.expected_revenue,
                "cost": score.estimated_cost
            })
    return sorted(ranking, key=lambda x: x["rice"], reverse=True)

@router.get("/voc/analysis")
def get_voc_analysis(db: Session = Depends(get_db)):
    tickets = db.query(SupportTicket).all()
    reviews = db.query(Review).all()
    
    categories = {}
    for t in tickets:
        categories[t.category] = categories.get(t.category, 0) + 1
        
    return {
        "category_distribution": categories,
        "total_feedback": len(tickets) + len(reviews),
        "top_complaints": [t.subject for t in tickets[:5] if t.sentiment == 'Negative']
    }
