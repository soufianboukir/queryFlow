from flask import Blueprint
from controllers.auth import google_login, google_callback

auth = Blueprint("auth", __name__)

auth.get("/google")(google_login)
auth.get("/google/callback")(google_callback)
