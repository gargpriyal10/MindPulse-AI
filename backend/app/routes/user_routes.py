from flask import Blueprint, request, jsonify

from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.user import User
from app.services.user_service import (
    update_profile,
    change_password
)

user_bp = Blueprint("user", __name__, url_prefix="/api/users")


@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    return jsonify({
        "success": True,
        "user": user.to_dict()
    }), 200


@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def edit_profile():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    user = update_profile(user, request.get_json())

    return jsonify({
        "success": True,
        "message": "Profile updated successfully",
        "user": user.to_dict()
    }), 200


@user_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def update_user_password():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    data = request.get_json()

    success, message = change_password(
        user,
        data["current_password"],
        data["new_password"]
    )

    if not success:
        return jsonify({
            "success": False,
            "message": message
        }), 400

    return jsonify({
        "success": True,
        "message": message
    }), 200