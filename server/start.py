from flask import Flask, request, jsonify
from models.qa_model import qa
from server.db.db import db

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({"message": "hiii!"})


@app.route("/ask", methods=["GET"])
def answer():
    question = request.args.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    if len(question) > 100:
        return jsonify({"error": "Question too long"}), 400

    response = qa.MiniLM(question)
    return jsonify(response)



@app.route("/add-history", methods=["POST"])
def add_history():
    data = request.json
    user_id = data.get("userId")
    question = data.get("question")
    answer = data.get("answer")

    if not all([user_id, question, answer]):
        return jsonify({"error": "Missing fields"}), 400

    try:
        db.history.insert_one({
            "userId": user_id,
            "question": question,
            "answer": answer
        })
        return jsonify({"message": "History saved!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)






















