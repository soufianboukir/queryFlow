from flask import Blueprint
from controllers.ask import getAnswer
auth = Blueprint("ask", __name__)

auth.get("/ask")(getAnswer)
