import numpy as np
from scipy import stats
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models.database import KPISnapshot, SupportTicket, Review, FeatureScore, ExperimentVariant

class AnalyticsService:
    @staticmethod
    def calculate_z_score_anomaly(db: Session, metric_name: str, window=7):
        snapshots = db.query(KPISnapshot).filter(KPISnapshot.metric_name == metric_name).order_by(KPISnapshot.timestamp.desc()).limit(window * 2).all()
        if len(snapshots) < window:
            return None
        
        values = [s.value for s in snapshots][::-1] # chronological
        current_val = values[-1]
        history = values[:-1]
        
        mean = np.mean(history)
        std = np.std(history)
        
        if std == 0: return None
        
        z_score = (current_val - mean) / std
        severity = "High" if abs(z_score) > 3 else "Medium" if abs(z_score) > 2 else "Low"
        
        return {
            "metric": metric_name,
            "value": current_val,
            "z_score": z_score,
            "severity": severity,
            "confidence": min(1.0, abs(z_score) / 5.0),
            "is_anomaly": abs(z_score) > 2
        }

    @staticmethod
    def calculate_ab_test(control: ExperimentVariant, variant: ExperimentVariant):
        p_control = control.conversions / control.visitors if control.visitors > 0 else 0
        p_variant = variant.conversions / variant.visitors if variant.visitors > 0 else 0
        
        lift = (p_variant - p_control) / p_control if p_control > 0 else 0
        
        # Pooled proportion
        pooled_p = (control.conversions + variant.conversions) / (control.visitors + variant.visitors)
        se = np.sqrt(pooled_p * (1 - pooled_p) * (1/control.visitors + 1/variant.visitors))
        
        z_score = (p_variant - p_control) / se if se > 0 else 0
        p_value = 1 - stats.norm.cdf(abs(z_score))
        p_value *= 2 # Two-tailed
        
        return {
            "control_rate": float(p_control),
            "variant_rate": float(p_variant),
            "lift": float(lift),
            "p_value": float(p_value),
            "significant": bool(p_value < 0.05),
            "recommendation": "Deploy Variant" if p_value < 0.05 and lift > 0 else "Keep Control"
        }

    @staticmethod
    def calculate_rice(reach: float, impact: float, confidence: float, effort: float):
        return (reach * impact * confidence) / effort

    @staticmethod
    def calculate_roi(dev_cost: float, monthly_revenue_impact: float, confidence: float):
        annual_benefit = monthly_revenue_impact * 12
        roi = ((annual_benefit - dev_cost) / dev_cost) * 100 if dev_cost > 0 else 0
        payback = dev_cost / monthly_revenue_impact if monthly_revenue_impact > 0 else float('inf')
        
        return {
            "annual_benefit": annual_benefit,
            "roi": roi,
            "payback_months": payback,
            "confidence": confidence
        }
