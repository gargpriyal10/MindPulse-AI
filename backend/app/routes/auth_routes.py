from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.user import User

from app.schemas.auth_schema import (
    validate_register_data,
    validate_login_data
)

from app.services.auth_service import (
    register_user,
    login_user
)

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    valid, message = validate_register_data(data)

    if not valid:
        return jsonify({
            "success": False,
            "message": message
        }), 400

    success, message = register_user(data)

    if not success:
        return jsonify({
            "success": False,
            "message": message
        }), 409

    return jsonify({
        "success": True,
        "message": message
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    valid, message = validate_login_data(data)

    if not valid:
        return jsonify({
            "success": False,
            "message": message
        }), 400

    success, result, user = login_user(data)

    if not success:
        return jsonify({
            "success": False,
            "message": result
        }), 401

    return jsonify({
        "success": True,
        "message": "Login successful",
        "access_token": result,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    user = User.query.get(int(user_id))

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    return jsonify({
        "success": True,
        "user": user.to_dict()
    }), 200