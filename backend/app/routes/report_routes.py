from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.report_service import (
    generate_emotion_report
)

report_bp = Blueprint(
    "report",
    __name__
)


@report_bp.route(
    "/reports",
    methods=["GET"]
)
@jwt_required()
def get_report():
    period = request.args.get("period", "week")

    result = generate_emotion_report(period)

    return jsonify(result), 200