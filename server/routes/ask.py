from flask import Blueprint
from controllers.ask import getAnswer
ask = Blueprint("ask", __name__)

ask.get("/ask")(getAnswer)
