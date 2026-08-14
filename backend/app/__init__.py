from flask import Flask
from flask_cors import CORS

from config import Config
from app.database import db, migrate, jwt


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    from app.models import User

    @app.route("/api/health", methods=["GET"])
    def health():
        return {
            "success": True,
            "message": "MindPulse AI Backend is running"
        }, 200

    from app.routes import auth_bp

    app.register_blueprint(auth_bp)

    return app