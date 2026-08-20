from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.emotion_history_service import (
    save_emotion_history,
    get_user_emotion_history
)
from flask import Blueprint, request, jsonify

from app.services.emotion_service import save_uploaded_image

from app.services.emotion_fusion_service import process_fusion
from app.services.report_service import generate_emotion_report
from app.services.emotion_service import (
    save_uploaded_image,
    detect_face,
    predict_emotion
)
from app.services.emotion_fusion_service import generate_fused_emotion
import os
from app.services.analytics_service import get_emotion_analytics

emotion_bp = Blueprint(
    "emotion",
    __name__,
    url_prefix="/api/emotions"
)


@emotion_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Image file is required."
        }), 400

    file = request.files["image"]

    success, message, filename = save_uploaded_image(file)

    if not success:
        return jsonify({
            "success": False,
            "message": message
        }), 400

    import os

    image_path = os.path.join("uploads", filename)

    success, face_message, face = detect_face(image_path)

    if not success:
        return jsonify({
        "success": False,
        "message": face_message
    }), 400

    emotion_result = predict_emotion(face)

    user_id = int(get_jwt_identity())

    save_emotion_history(
    user_id=user_id,
    emotion=emotion_result["dominant_emotion"],
    confidence=emotion_result["confidence"],
    media_path=image_path
)

    return jsonify({
    "success": True,
    "message": face_message,
    "filename": filename,
    "emotion": emotion_result["dominant_emotion"],
    "confidence": round(emotion_result["confidence"], 4),
    "scores": emotion_result["scores"]
}), 200

@emotion_bp.route("/history", methods=["GET"])
@jwt_required()
def emotion_history():

    user_id = int(get_jwt_identity())

    history = get_user_emotion_history(user_id)

    return jsonify({
        "success": True,
        "count": len(history),
        "history": [
            item.to_dict()
            for item in history
        ]
    }), 200

@emotion_bp.route("/fusion/test", methods=["POST"])
@jwt_required()
def fusion_test():
    """
    Test emotion fusion using JSON input.
    """

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "JSON body is required."
        }), 400

    if "face" not in data or "audio" not in data:
        return jsonify({
            "success": False,
            "message": "Both face and audio data are required."
        }), 400

    result = generate_fused_emotion(
        face_result=data["face"],
        audio_result=data["audio"]
    )

    return jsonify(result), 200

@emotion_bp.route("/fusion", methods=["POST"])
@jwt_required()
def fusion():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Image file is required."
        }), 400

    if "audio" not in request.files:
        return jsonify({
            "success": False,
            "message": "Audio file is required."
        }), 400

    image_file = request.files["image"]
    audio_file = request.files["audio"]

    response, status_code = process_fusion(
        image_file=image_file,
        audio_file=audio_file
    )

    return jsonify(response), status_code

@emotion_bp.route("/report", methods=["GET"])
@jwt_required()
def emotion_report():
    """
    Returns the emotion summary report
    for the logged-in user.
    """

    response = generate_emotion_report()

    return jsonify(response), 200

@emotion_bp.route("/analytics", methods=["GET"])
@jwt_required()
def emotion_analytics():
    """
    Returns analytics data
    for dashboard charts.
    """

    response = get_emotion_analytics()

    return jsonify(response), 200