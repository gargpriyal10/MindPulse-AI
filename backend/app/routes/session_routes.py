from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.session_service import (
    start_session,
    end_session,
    get_user_sessions
)


session_bp = Blueprint(
    "session",
    __name__,
    url_prefix="/api/sessions"
)


@session_bp.route("/start", methods=["POST"])
@jwt_required()
def start_session_route():
    response, status_code = start_session()
    return jsonify(response), status_code


@session_bp.route("/<int:session_id>/end", methods=["PUT"])
@jwt_required()
def end_session_route(session_id):
    response, status_code = end_session(session_id)
    return jsonify(response), status_code


@session_bp.route("", methods=["GET"])
@jwt_required()
def get_sessions_route():
    response, status_code = get_user_sessions()
    return jsonify(response), status_code