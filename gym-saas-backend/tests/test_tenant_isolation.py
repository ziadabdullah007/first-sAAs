import pytest
from datetime import datetime
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.gym import Gym
from app.models.member import Member
from app.models.plan import Plan
from app.models.user_profile import UserProfile
from app.db.database import engine, SessionLocal
from app.main import app

# Override get_db for testing
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_gym_a_cannot_access_gym_b_members():
    db = SessionLocal()
    try:
        # Create two gyms
        gym_a = Gym(name="Gym A", owner_name="Owner A", email="ownera@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        gym_b = Gym(name="Gym B", owner_name="Owner B", email="ownerb@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add_all([gym_a, gym_b])
        db.commit()
        db.refresh(gym_a)
        db.refresh(gym_b)

        # Create member in gym B
        member_b = Member(
            gym_id=gym_b.id,
            first_name="John",
            last_name="Doe",
            phone="1234567890",
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

        # Try to access gym B's member as gym A admin
        # This should fail with 404 (not found) or 403 (forbidden)
        response = client.get(
            f"/members/{member_b.id}",
            headers={"Authorization": "Bearer test-token-a"}
        )
        
        # Should NOT return 200
        assert response.status_code != 200
        assert response.status_code in [403, 404]
    finally:
        db.close()


def test_gym_a_cannot_update_gym_b_members():
    db = SessionLocal()
    try:
        # Create two gyms
        gym_a = Gym(name="Gym A", owner_name="Owner A", email="ownera@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        gym_b = Gym(name="Gym B", owner_name="Owner B", email="ownerb@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add_all([gym_a, gym_b])
        db.commit()
        db.refresh(gym_a)
        db.refresh(gym_b)

        # Create member in gym B
        member_b = Member(
            gym_id=gym_b.id,
            first_name="John",
            last_name="Doe",
            phone="1234567890",
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

        # Try to update gym B's member as gym A admin
        response = client.put(
            f"/members/{member_b.id}",
            json={"first_name": "Hacked"},
            headers={"Authorization": "Bearer test-token-a"}
        )
        
        # Should NOT return 200
        assert response.status_code != 200
        assert response.status_code in [403, 404]
    finally:
        db.close()


def test_gym_a_cannot_delete_gym_b_members():
    db = SessionLocal()
    try:
        # Create two gyms
        gym_a = Gym(name="Gym A", owner_name="Owner A", email="ownera@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        gym_b = Gym(name="Gym B", owner_name="Owner B", email="ownerb@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add_all([gym_a, gym_b])
        db.commit()
        db.refresh(gym_a)
        db.refresh(gym_b)

        # Create member in gym B
        member_b = Member(
            gym_id=gym_b.id,
            first_name="John",
            last_name="Doe",
            phone="1234567890",
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

        # Try to delete gym B's member as gym A admin
        response = client.delete(
            f"/members/{member_b.id}",
            headers={"Authorization": "Bearer test-token-a"}
        )
        
        # Should NOT return 200
        assert response.status_code != 200
        assert response.status_code in [403, 404]
    finally:
        db.close()


def test_gym_a_cannot_access_gym_b_plans():
    db = SessionLocal()
    try:
        # Create two gyms
        gym_a = Gym(name="Gym A", owner_name="Owner A", email="ownera@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        gym_b = Gym(name="Gym B", owner_name="Owner B", email="ownerb@test.com", status="active", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add_all([gym_a, gym_b])
        db.commit()
        db.refresh(gym_a)
        db.refresh(gym_b)

        # Create plan in gym B
        plan_b = Plan(
            gym_id=gym_b.id,
            name="Plan B",
            price=100.0,
            duration_months=1,
            status="active"
        )
        db.add(plan_b)
        db.commit()
        db.refresh(plan_b)

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

        # Try to access gym B's plan as gym A admin
        response = client.get(
            f"/plans/{plan_b.id}",
            headers={"Authorization": "Bearer test-token-a"}
        )
        
        # Should NOT return 200
        assert response.status_code != 200
        assert response.status_code in [403, 404]
    finally:
        db.close()