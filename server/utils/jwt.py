import jwt
import datetime
import os

SECRET = os.getenv("JWT_SECRET")

def create_token(user_id):
    payload = {
        "id": str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")
