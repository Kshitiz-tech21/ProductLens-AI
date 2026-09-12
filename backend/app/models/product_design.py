# Adding Personas and Journeys to the schema
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from .base import Base

class Persona(Base):
    __tablename__ = 'personas'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    description = Column(Text)
    goals = Column(Text)
    pain_points = Column(Text)

class UserJourney(Base):
    __tablename__ = 'user_journeys'
    id = Column(Integer, primary_key=True)
    persona_id = Column(Integer, ForeignKey('personas.id'))
    journey_type = Column(String) # 'current' or 'improved'
    steps = Column(Text) # JSON string of steps
    description = Column(Text)
