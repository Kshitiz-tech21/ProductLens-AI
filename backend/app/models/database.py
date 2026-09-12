from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .product_design import Persona, UserJourney
from .base import Base

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String)
    segment = Column(String) # e.g., 'Enterprise', 'SMB', 'Individual'
    region = Column(String)
    device = Column(String) # 'Mobile', 'Desktop', 'Tablet'
    created_at = Column(DateTime, server_default=func.now())
    
    orders = relationship("Order", back_populates="customer")
    events = relationship("ProductEvent", back_populates="customer")
    tickets = relationship("SupportTicket", back_populates="customer")
    reviews = relationship("Review", back_populates="customer")

class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    amount = Column(Float)
    status = Column(String) # 'completed', 'failed', 'refunded'
    created_at = Column(DateTime, server_default=func.now())
    
    customer = relationship("Customer", back_populates="orders")

class ProductEvent(Base):
    __tablename__ = 'product_events'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    event_name = Column(String) # 'landing', 'product_view', 'add_to_cart', 'checkout', 'payment', 'purchase'
    properties = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
    
    customer = relationship("Customer", back_populates="events")

class SupportTicket(Base):
    __tablename__ = 'support_tickets'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    category = Column(String) # 'Payment Issues', 'UI/UX', etc.
    subject = Column(String)
    description = Column(Text)
    sentiment = Column(String) # 'Positive', 'Neutral', 'Negative'
    status = Column(String) # 'open', 'closed'
    created_at = Column(DateTime, server_default=func.now())
    
    customer = relationship("Customer", back_populates="tickets")

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    rating = Column(Integer)
    comment = Column(Text)
    category = Column(String)
    sentiment = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    
    customer = relationship("Customer", back_populates="reviews")

class Feature(Base):
    __tablename__ = 'features'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    description = Column(Text)
    status = Column(String) # 'idea', 'backlog', 'in-progress', 'deployed'
    created_at = Column(DateTime, server_default=func.now())
    
    scores = relationship("FeatureScore", back_populates="feature")

class FeatureScore(Base):
    __tablename__ = 'feature_scores'
    id = Column(Integer, primary_key=True)
    feature_id = Column(Integer, ForeignKey('features.id'))
    reach = Column(Float)
    impact = Column(Float)
    confidence = Column(Float)
    effort = Column(Float)
    rice_score = Column(Float)
    ice_score = Column(Float)
    expected_revenue = Column(Float)
    estimated_cost = Column(Float)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    feature = relationship("Feature", back_populates="scores")

class Experiment(Base):
    __tablename__ = 'experiments'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(Text)
    status = Column(String) # 'running', 'completed'
    started_at = Column(DateTime)
    ended_at = Column(DateTime)
    
    variants = relationship("ExperimentVariant", back_populates="experiment")

class ExperimentVariant(Base):
    __tablename__ = 'experiment_variants'
    id = Column(Integer, primary_key=True)
    experiment_id = Column(Integer, ForeignKey('experiments.id'))
    name = Column(String) # 'Control', 'Variant A'
    conversions = Column(Integer, default=0)
    visitors = Column(Integer, default=0)
    
    experiment = relationship("Experiment", back_populates="variants")

class Recommendation(Base):
    __tablename__ = 'recommendations'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(Text)
    expected_impact = Column(String)
    revenue_impact = Column(Float)
    confidence = Column(Float)
    status = Column(String, default='pending') # 'pending', 'approved', 'rejected'
    created_at = Column(DateTime, server_default=func.now())
    
    approvals = relationship("Approval", back_populates="recommendation")

class Approval(Base):
    __tablename__ = 'approvals'
    id = Column(Integer, primary_key=True)
    recommendation_id = Column(Integer, ForeignKey('recommendations.id'))
    reviewer = Column(String)
    status = Column(String) # 'approve', 'reject', 'investigate'
    comment = Column(Text)
    timestamp = Column(DateTime, server_default=func.now())
    
    recommendation = relationship("Recommendation", back_populates="approvals")

class PRDDocument(Base):
    __tablename__ = 'prd_documents'
    id = Column(Integer, primary_key=True)
    recommendation_id = Column(Integer, ForeignKey('recommendations.id'))
    content = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class KPISnapshot(Base):
    __tablename__ = 'kpi_snapshots'
    id = Column(Integer, primary_key=True)
    metric_name = Column(String)
    value = Column(Float)
    timestamp = Column(DateTime, server_default=func.now())
