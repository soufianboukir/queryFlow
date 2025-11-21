import requests
from flask import request, jsonify
from config.db import get_db
from config.google_oauth import *
from utils.jwt import create_token

db = get_db()
users = db["users"]

def google_login():
    auth_url = GOOGLE_OAUTH_URL.format(
        client_id=GOOGLE_CLIENT_ID,
        redirect_uri=GOOGLE_REDIRECT_URI
    )
    return jsonify({"auth_url": auth_url})

def google_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing code"}), 400

    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    token_res = requests.post(token_url, data=token_data).json()

    access_token = token_res.get("access_token")
    if not access_token:
        return jsonify({"error": "Invalid token exchange"}), 400

    # Get user info
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    email = user_info["email"]

    # Create or find user
    user = users.find_one({"email": email})
    if not user:
        user_id = users.insert_one({
            "email": email,
            "name": user_info.get("name"),
            "picture": user_info.get("picture")
        }).inserted_id
    else:
        user_id = user["_id"]

    # Create JWT
    token = create_token(user_id)

    return jsonify({
        "token": token,
        "user": {
            "id": str(user_id),
            "email": email,
            "name": user_info.get("name"),
            "picture": user_info.get("picture")
        }
    })
