from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..models.product_design import Persona, UserJourney

router = APIRouter()

@router.get("/personas")
def get_personas(db: Session = Depends(get_db)):
    return db.query(Persona).all()

@router.get("/journeys/{persona_id}")
def get_journeys(persona_id: int, db: Session = Depends(get_db)):
    return db.query(UserJourney).filter(UserJourney.persona_id == persona_id).all()
