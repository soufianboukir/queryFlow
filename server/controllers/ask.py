from flask import request, jsonify
from models.qa_model import qa
from controllers.history import create_history
from controllers.query import add_query
from utils.jwt_utils import verify_token
from bson import ObjectId
from datetime import datetime
from config.db import get_db

db = get_db()


def getAnswer():
    auth_header = request.headers.get("Authorization")
    token = None
    user_id = None

    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            user_id = ObjectId(verify_token(token))
        except Exception:
            user_id = None

    question = request.args.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    if len(question) > 1000:
        return jsonify({"error": "Question too long"}), 400

    history_url = request.args.get("history_url")
    history_doc = None
    url = None

    if history_url:
        query = {"url": history_url}
        if user_id:
            query["$or"] = [{"user_id": user_id}, {"visibility": "public"}]
        else:
            query["visibility"] = "public"

        history_doc = db.history.find_one(query)

    if not history_doc:
        if user_id:
            history_id, url = create_history(
                user_id=user_id, title=question, visibility="private"
            )
            history_doc = db.history.find_one({"_id": ObjectId(history_id)})
        else:
            return jsonify({"error": "History not found or access denied"}), 404
    else:
        history_id = history_doc["_id"]
        url = history_doc["url"]

        db.history.update_one(
            {"_id": history_id}, {"$set": {"last_updated": datetime.utcnow()}}
        )

    model_res = qa.MiniLM(question)
    answer = model_res["response"]

    add_query(history_id=history_id, question=question, answer=answer)

    return jsonify({"history_id": str(history_id), "url": url, "response": answer})
