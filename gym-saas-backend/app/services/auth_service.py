from fastapi import HTTPException

from app.core.supabase_client import supabase
from app.models.user_profile import UserProfile
from app.repositories.user_profile_repository import (
    UserProfileRepository
)


class AuthService:

    @staticmethod
    def register(db, user_data: dict):
        try:
            response = supabase.auth.sign_up(
                {
                    "email": user_data["email"],
                    "password": user_data["password"]
                }
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Registration failed: {str(e)}"
            )

        if not response.user:
            raise HTTPException(
                status_code=400,
                detail="Registration failed — could not create auth user"
            )

        auth_user = response.user

        user_profile = UserProfile(
            auth_user_id=auth_user.id,
            email=user_data["email"],
            role=user_data.get("role", "owner"),
            first_name=user_data.get("first_name"),
            last_name=user_data.get("last_name")
        )

        UserProfileRepository.create(db, user_profile)

        return {
            "message": "Registration successful",
            "user": {
                "id": str(user_profile.id),
                "auth_user_id": str(user_profile.auth_user_id),
                "email": user_profile.email,
                "role": user_profile.role,
                "gym_id": (
                    str(user_profile.gym_id)
                    if user_profile.gym_id
                    else None
                ),
                "first_name": user_profile.first_name,
                "last_name": user_profile.last_name,
            }
        }

    @staticmethod
    def login(email: str, password: str):
        try:
            response = supabase.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": password
                }
            )
        except Exception as e:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not response.session or not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # Return structured response matching LoginResponse schema
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "auth_user_id": response.user.id,
                "email": response.user.email,
                "role": response.user.user_metadata.get("role", "owner") if response.user.user_metadata else "owner",
                "gym_id": None,
                "first_name": None,
                "last_name": None,
            }
        }

    @staticmethod
    def login_with_profile(db, email: str, password: str):
        """Login and include full user profile data from the database."""
        try:
            response = supabase.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": password
                }
            )
        except Exception as e:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not response.session or not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # Get user profile from database
        user_profile = UserProfileRepository.get_by_auth_user_id(
            db, response.user.id
        )

        user_data = {
            "id": response.user.id,
            "auth_user_id": response.user.id,
            "email": response.user.email,
            "role": "owner",
            "gym_id": None,
            "first_name": None,
            "last_name": None,
        }

        if user_profile:
            user_data.update({
                "id": str(user_profile.id),
                "auth_user_id": str(user_profile.auth_user_id),
                "email": user_profile.email or response.user.email,
                "role": user_profile.role,
                "gym_id": (
                    str(user_profile.gym_id)
                    if user_profile.gym_id
                    else None
                ),
                "first_name": user_profile.first_name,
                "last_name": user_profile.last_name,
            })

        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": user_data
        }

    @staticmethod
    def get_current_user(db, token: str):
        try:
            response = supabase.auth.get_user(token)
        except Exception:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )

        if not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        auth_user = response.user

        user_profile = (
            UserProfileRepository
            .get_by_auth_user_id(db, auth_user.id)
        )

        if not user_profile:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )

        return {
            "id": str(user_profile.id),
            "auth_user_id": str(user_profile.auth_user_id),
            "email": user_profile.email,
            "role": user_profile.role,
            "gym_id": (
                str(user_profile.gym_id)
                if user_profile.gym_id
                else None
            ),
            "first_name": user_profile.first_name,
            "last_name": user_profile.last_name,
        }