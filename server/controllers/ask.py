from flask import request, jsonify
from server.models.qa_model import qa
from server.controllers.history import add_history
from server.utils.jwt_utils import verify_token
from bson import ObjectId


def getAnswer():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    try:
        user_id_str = verify_token(token)
        user_id = ObjectId(user_id_str)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    question = request.args.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    if len(question) > 1000:
        return jsonify({"error": "Question too long"}), 400

    response = qa.MiniLM(question)

    try:
        add_history(user_id, question, response["response"])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(response)
