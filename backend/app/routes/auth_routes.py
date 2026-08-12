from flask import Blueprint, request, jsonify

from app.schemas.auth_schema import validate_register_data
from app.services.auth_service import register_user

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