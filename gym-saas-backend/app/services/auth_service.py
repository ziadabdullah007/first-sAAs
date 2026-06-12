from app.core.supabase_client import supabase


class AuthService:

    @staticmethod
    def register(email: str, password: str):

        response = supabase.auth.sign_up(
            {
                "email": email,
                "password": password
            }
        )

        return response