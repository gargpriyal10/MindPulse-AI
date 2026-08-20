from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.privacy_service import (delete_emotion_history, delete_user_account)

privacy_bp = Blueprint("privacy", __name__, url_prefix="/api/privacy")


@privacy_bp.route("/history", methods=["DELETE"])
@jwt_required()
def delete_history():
    response, status_code = delete_emotion_history()
    return jsonify(response), status_code

@privacy_bp.route("/account", methods=["DELETE"])
@jwt_required()
def delete_account():
    response, status_code = delete_user_account()
    return jsonify(response), status_code
