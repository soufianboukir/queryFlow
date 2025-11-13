from flask import Flask, request, jsonify, render_template

app = Flask(__name__)


@app.route("/")
def home():
    """Render the homepage."""
    return render_template("index.html")


@app.route("/ask", methods=["GET"])
def answer():
    """Handle question requests and return JSON."""
    question = request.args.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    response = f"Received question: {question}"
    return jsonify({"question": question, "response": response})


if __name__ == "__main__":
    app.run(debug=True)
