import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.gym import Gym
from app.models.member import Member
from app.models.plan import Plan
from app.models.subscription import Subscription
from app.models.payment import Payment
from app.models.attendance import Attendance
from app.models.user_profile import UserProfile
from app.db.database import SessionLocal
from app.main import app

# Override get_db for testing
from app.db.database import get_db

def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_subscription_dates_validation():
    """Test that subscription end date must be after start date"""
    db = SessionLocal()
    try:
        # Create gym
        gym = Gym(name="Test Gym", owner_name="Owner", email="owner@test.com", status="active", 
                  created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add(gym)
        db.commit()
        db.refresh(gym)

        # Create member
        member = Member(
            gym_id=gym.id,
            first_name="John",
            last_name="Doe",
            phone="1234567890",
            status="active",
            joined_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(member)
        db.commit()
        db.refresh(member)

        # Create plan
        plan = Plan(
            gym_id=gym.id,
            name="Test Plan",
            price=100.0,
            duration_months=1,
            status="active"
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)

        # Create user profile
        user = UserProfile(
            auth_user_id="test-user",
            gym_id=gym.id,
            role="gym_admin",
            email="admin@test.com"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Try to create subscription with invalid dates (end before start)
        start_date = datetime.utcnow() + timedelta(days=30)
        end_date = datetime.utcnow() - timedelta(days=1)  # Before start date
        
        response = client.post(
            "/subscriptions",
            json={
                "member_id": str(member.id),
                "plan_id": str(plan.id),
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "amount": 100.0,
                "auto_renew": False
            },
            headers={"Authorization": "Bearer test-token"}
        )
        
        # Should fail with 400 or 422
        assert response.status_code in [400, 422]
    finally:
        db.close()


def test_negative_payment_amount_rejected():
    """Test that negative payment amounts are rejected"""
    db = SessionLocal()
    try:
        # Setup gym, member, plan, subscription
        gym = Gym(name="Test Gym", owner_name="Owner", email="owner@test.com", status="active", 
                  created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add(gym)
        db.commit()
        db.refresh(gym)

        member = Member(
            gym_id=gym.id,
            first_name="John",
            last_name="Doe",
            phone="1234567890",
            status="active",
            joined_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(member)
        db.commit()
        db.refresh(member)

        plan = Plan(
            gym_id=gym.id,
            name="Test Plan",
            price=100.0,
            duration_months=1,
            status="active"
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)

        subscription = Subscription(
            member_id=member.id,
            plan_id=plan.id,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30),
            amount=100.0,
            status="active",
            auto_renew=False
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)

        user = UserProfile(
            auth_user_id="test-user",
            gym_id=gym.id,
            role="gym_admin",
            email="admin@test.com"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Try to create payment with negative amount
        response = client.post(
            "/payments",
            json={
                "subscription_id": str(subscription.id),
                "member_id": str(member.id),
                "amount": -100.0,  # Negative amount
                "payment_method": "cash"
            },
            headers={"Authorization": "Bearer test-token"}
        )
        
        # Should fail with 400 or 422
        assert response.status_code in [400, 422]
    finally:
        db.close()


def test_cross_gym_payment_rejected():
    """Test that payment cannot reference subscription from another gym"""
    db = SessionLocal()
    try:
        # Create two gyms
        gym_a = Gym(name="Gym A", owner_name="Owner A", email="ownera@test.com", status="active", 
                     created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        gym_b = Gym(name="Gym B", owner_name="Owner B", email="ownerb@test.com", status="active", 
                     created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add_all([gym_a, gym_b])
        db.commit()
        db.refresh(gym_a)
        db.refresh(gym_b)

        # Create member in gym A
        member_a = Member(
            gym_id=gym_a.id,
            first_name="John",
            last_name="Doe",
            phone="1234567890",
            status="active",
            joined_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(member_a)
        db.commit()
        db.refresh(member_a)

        # Create plan in gym A
        plan_a = Plan(
            gym_id=gym_a.id,
            name="Plan A",
            price=100.0,
            duration_months=1,
            status="active"
        )
        db.add(plan_a)
        db.commit()
        db.refresh(plan_a)

        # Create subscription in gym B
        member_b = Member(
            gym_id=gym_b.id,
            first_name="Jane",
            last_name="Smith",
            phone="0987654321",
            status="active",
            joined_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(member_b)
        db.commit()
        db.refresh(member_b)

        plan_b = Plan(
            gym_id=gym_b.id,
            name="Plan B",
            price=150.0,
            duration_months=1,
            status="active"
        )
        db.add(plan_b)
        db.commit()
        db.refresh(plan_b)

        subscription_b = Subscription(
            member_id=member_b.id,
            plan_id=plan_b.id,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30),
            amount=150.0,
            status="active",
            auto_renew=False
        )
        db.add(subscription_b)
        db.commit()
        db.refresh(subscription_b)

        # Create user profile for gym A admin
        user_a = UserProfile(
            auth_user_id="test-user-a",
            gym_id=gym_a.id,
            role="gym_admin",
            email="admin@test.com"
        )
        db.add(user_a)
        db.commit()
        db.refresh(user_a)

        # Try to create payment for gym B's subscription as gym A admin
        response = client.post(
            "/payments",
            json={
                "subscription_id": str(subscription_b.id),
                "member_id": str(member_a.id),
                "amount": 150.0,
                "payment_method": "cash"
            },
            headers={"Authorization": "Bearer test-token-a"}
        )
        
        # Should fail with 400, 403, or 404
        assert response.status_code in [400, 403, 404]
    finally:
        db.close()


def test_attendance_for_cross_gym_member_rejected():
    """Test that attendance cannot be created for member from another gym"""
    db = SessionLocal()
    try:
        # Create two gyms
        gym_a = Gym(name="Gym A", owner_name="Owner A", email="ownera@test.com", status="active", 
                     created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        gym_b = Gym(name="Gym B", owner_name="Owner B", email="ownerb@test.com", status="active", 
                     created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add_all([gym_a, gym_b])
        db.commit()
        db.refresh(gym_a)
        db.refresh(gym_b)

        # Create member in gym B
        member_b = Member(
            gym_id=gym_b.id,
            first_name="Jane",
            last_name="Smith",
            phone="0987654321",
            status="active",
            joined_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(member_b)
        db.commit()
        db.refresh(member_b)

        # Create user profile for gym A admin
        user_a = UserProfile(
            auth_user_id="test-user-a",
            gym_id=gym_a.id,
            role="gym_admin",
            email="admin@test.com"
        )
        db.add(user_a)
        db.commit()
        db.refresh(user_a)

        # Try to check-in gym B's member as gym A admin
        response = client.post(
            "/attendance/check-in",
            json={
                "member_id": str(member_b.id)
            },
            headers={"Authorization": "Bearer test-token-a"}
        )
        
        # Should fail with 400, 403, or 404
        assert response.status_code in [400, 403, 404]
    finally:
        db.close()