import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.database import (
    Customer, Order, ProductEvent, SupportTicket, Review, 
    Feature, FeatureScore, Experiment, ExperimentVariant, 
    Recommendation, KPISnapshot
)
from ..models.product_design import Persona, UserJourney

def generate_synthetic_data(db: Session, scale_factor=1):
    # Scale seeds
    num_customers = int(1000 * scale_factor)
    num_orders = int(2000 * scale_factor)
    num_events = int(5000 * scale_factor)
    num_tickets = int(500 * scale_factor)
    num_reviews = int(800 * scale_factor)

    segments = ['Enterprise', 'SMB', 'Individual']
    regions = ['North America', 'Europe', 'Asia-Pacific', 'LATAM']
    devices = ['Mobile', 'Desktop', 'Tablet']
    event_names = ['landing', 'product_view', 'add_to_cart', 'checkout', 'payment', 'purchase']
    ticket_categories = ['Payment Issues', 'UI/UX', 'Pricing', 'Performance', 'Feature Request', 'Other']
    sentiments = ['Positive', 'Neutral', 'Negative']

    print(f"Generating {num_customers} customers...")
    customers = []
    for i in range(num_customers):
        customers.append(Customer(
            email=f"user{i}@example.com",
            name=f"User {i}",
            segment=random.choice(segments),
            region=random.choice(regions),
            device=random.choice(devices)
        ))
    db.add_all(customers)
    db.commit()

    customer_ids = [c.id for c in customers]

    print(f"Generating {num_orders} orders...")
    orders = []
    for i in range(num_orders):
        cust = random.choice(customers)
        status = 'completed'
        if cust.device == 'Mobile' and random.random() < 0.3:
            status = 'failed'
        elif random.random() < 0.1:
            status = 'failed'

        orders.append(Order(
            customer_id=cust.id,
            amount=random.uniform(10.0, 500.0),
            status=status,
            created_at=datetime.now() - timedelta(days=random.randint(0, 60))
        ))
    db.add_all(orders)
    db.commit()

    print(f"Generating {num_events} events...")
    events = []
    for i in range(num_events):
        cust = random.choice(customers)
        event_name = random.choices(event_names, weights=[0.4, 0.3, 0.15, 0.1, 0.04, 0.01])[0]
        events.append(ProductEvent(
            customer_id=cust.id,
            event_name=event_name,
            created_at=datetime.now() - timedelta(days=random.randint(0, 60))
        ))
    db.add_all(events)
    db.commit()

    print(f"Generating {num_tickets} tickets...")
    tickets = []
    for i in range(num_tickets):
        cust = random.choice(customers)
        category = random.choice(ticket_categories)
        sentiment = 'Negative' if category == 'Payment Issues' else random.choice(sentiments)
        tickets.append(SupportTicket(
            customer_id=cust.id,
            category=category,
            subject=f"Issue with {category}",
            description=f"I am having trouble with {category}. Please help.",
            sentiment=sentiment,
            status=random.choice(['open', 'closed']),
            created_at=datetime.now() - timedelta(days=random.randint(0, 60))
        ))
    db.add_all(tickets)
    db.commit()

    print(f"Generating {num_reviews} reviews...")
    reviews = []
    for i in range(num_reviews):
        cust = random.choice(customers)
        rating = random.randint(1, 5)
        sentiment = 'Positive' if rating >= 4 else 'Negative' if rating <= 2 else 'Neutral'
        reviews.append(Review(
            customer_id=cust.id,
            rating=rating,
            comment="Great product!" if rating >= 4 else "Terrible experience!",
            category=random.choice(ticket_categories),
            sentiment=sentiment,
            created_at=datetime.now() - timedelta(days=random.randint(0, 60))
        ))
    db.add_all(reviews)
    db.commit()

    print("Seeding Features...")
    features = [
        Feature(name="Payment Retry", description="Automatically retry failed payments"),
        Feature(name="Saved Cart", description="Allow users to save cart for later"),
        Feature(name="Personalized Recommendations", description="AI driven product suggestions"),
        Feature(name="Dark Mode", description="Support for dark theme"),
        Feature(name="Order Tracking", description="Real-time tracking of orders"),
    ]
    db.add_all(features)
    db.commit()

    for f in features:
        reach = random.uniform(1000, 10000)
        impact = random.uniform(0.5, 3.0)
        confidence = random.uniform(0.5, 1.0)
        effort = random.uniform(1, 5)
        rice = (reach * impact * confidence) / effort
        ice = (impact * confidence * 2.0) / effort
        
        db.add(FeatureScore(
            feature_id=f.id,
            reach=reach,
            impact=impact,
            confidence=confidence,
            effort=effort,
            rice_score=rice,
            ice_score=ice,
            expected_revenue=random.uniform(1000, 50000),
            estimated_cost=random.uniform(500, 10000)
        ))
    db.commit()

    print("Seeding Experiments...")
    exp = Experiment(name="New Checkout UI", description="Testing a streamlined checkout flow", status="completed")
    db.add(exp)
    db.commit()
    
    db.add(ExperimentVariant(experiment_id=exp.id, name="Control", conversions=610, visitors=10000))
    db.add(ExperimentVariant(experiment_id=exp.id, name="Variant A", conversions=740, visitors=10000))
    db.commit()

    print("Seeding Recommendations...")
    rec = Recommendation(
        title="Implement Payment Retry",
        description="Automate the retry logic for failed mobile payments to recover lost conversion",
        expected_impact="Checkout conversion +3.2-5.1%",
        revenue_impact=420000.0,
        confidence=0.84,
        status="pending"
    )
    db.add(rec)
    db.commit()

    print("Seeding KPIs...")
    metrics = ['MAU', 'DAU', 'Revenue', 'Conversion', 'Retention', 'Churn']
    for m in metrics:
        for d in range(30):
            # Introduce an anomaly in conversion
            val = random.uniform(10, 100) if m != 'Revenue' else random.uniform(10000, 50000)
            if m == 'Conversion' and d < 3: # Last 3 days are low
                val = val * 0.7
            db.add(KPISnapshot(
                metric_name=m,
                value=val,
                timestamp=datetime.now() - timedelta(days=d)
            ))
    db.commit()

    print("Seeding Personas & Journeys...")
    p1 = Persona(
        name="Riya",
        age=27,
        description="Frequent online shopper using mobile devices",
        goals="Quick checkout and seamless payment experience",
        pain_points="Payment failures require restarting the entire checkout process"
    )
    db.add(p1)
    db.commit()
    
    db.add(UserJourney(
        persona_id=p1.id,
        journey_type="current",
        steps="Search -> Product -> Cart -> Checkout -> Payment failure -> Drop-off",
        description="User fails at the payment stage due to instability"
    ))
    db.add(UserJourney(
        persona_id=p1.id,
        journey_type="improved",
        steps="Search -> Product -> Cart -> Checkout -> Payment failure -> Retry Option -> Success",
        description="User can retry payment without restarting checkout"
    ))
    db.commit()

    print("Data seeding complete!")
