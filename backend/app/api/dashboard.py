from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.db import get_db
from ..models.database import Customer, Order, ProductEvent, KPISnapshot, Review, SupportTicket

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    # Get most recent KPI snapshots
    summary = {}
    metrics = ['MAU', 'DAU', 'Revenue', 'Conversion', 'Retention', 'Churn']
    for m in metrics:
        last = db.query(KPISnapshot).filter(KPISnapshot.metric_name == m).order_by(KPISnapshot.timestamp.desc()).first()
        prev = db.query(KPISnapshot).filter(KPISnapshot.metric_name == m).order_by(KPISnapshot.timestamp.desc()).offset(1).first()
        
        val = last.value if last else 0
        prev_val = prev.value if prev else val
        diff = ((val - prev_val) / prev_val * 100) if prev_val != 0 else 0
        
        summary[m] = {"value": val, "diff": diff}
    
    return summary

@router.get("/funnel")
def get_funnel(db: Session = Depends(get_db)):
    stages = ['landing', 'product_view', 'add_to_cart', 'checkout', 'payment', 'purchase']
    funnel_data = []
    
    for stage in stages:
        count = db.query(ProductEvent).filter(ProductEvent.event_name == stage).count()
        funnel_data.append({"stage": stage, "count": count})
        
    return funnel_data

@router.get("/voc/summary")
def get_voc_summary(db: Session = Depends(get_db)):
    categories = ['Payment Issues', 'UI/UX', 'Pricing', 'Performance', 'Feature Request', 'Other']
    summary = []
    for cat in categories:
        count = db.query(SupportTicket).filter(SupportTicket.category == cat).count()
        sentiment_neg = db.query(SupportTicket).filter(SupportTicket.category == cat, SupportTicket.sentiment == 'Negative').count()
        summary.append({
            "category": cat,
            "count": count,
            "negative_ratio": sentiment_neg / count if count > 0 else 0
        })
    return summary
