from flask import Flask
from flask_cors import CORS
from routes.auth import auth
from routes.ask import ask
app = Flask(__name__)


CORS(app, supports_credentials=True)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(ask, url_prefix="/api/ask")


if __name__ == "__main__":
    app.run(debug=True)
