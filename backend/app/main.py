from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .core.db import get_db, init_db
from .analytics.seed import generate_synthetic_data
from .api import dashboard, ai_analyst, analytics_extended, governance, product_design

app = FastAPI(title="ProductLens AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(ai_analyst.router, prefix="/api/ai", tags=["AI Analyst"])
app.include_router(analytics_extended.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(governance.router, prefix="/api/governance", tags=["Governance"])
app.include_router(product_design.router, prefix="/api/design", tags=["Product Design"])

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/seed")
def seed_data(db: Session = Depends(get_db)):
    generate_synthetic_data(db)
    return {"status": "seeded"}
