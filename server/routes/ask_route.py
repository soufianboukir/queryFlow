from flask import Blueprint
from server.controllers.ask import getAnswer

askQue = Blueprint("ask", __name__)

askQue.get("")(getAnswer)
