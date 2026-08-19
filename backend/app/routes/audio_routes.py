from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.audio_emotion_service import analyze_audio

audio_bp = Blueprint("audio", __name__, url_prefix="/api/audio")


@audio_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_audio():

    if "audio" not in request.files:
        return jsonify({
            "success": False,
            "message": "No audio file provided."
        }), 400

    audio_file = request.files["audio"]

    response, status_code = analyze_audio(audio_file)

    return jsonify(response), status_code