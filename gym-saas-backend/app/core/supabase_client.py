from supabase import create_client

from app.core.config import settings

# Use the secret key (service role) for server-side operations when available,
# otherwise fall back to the publishable key for development.
_key = settings.SUPABASE_SECRET_KEY or settings.SUPABASE_PUBLISHABLE_KEY

supabase = create_client(
    settings.SUPABASE_URL,
    _key
)