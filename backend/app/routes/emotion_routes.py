from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.emotion_history_service import (
    save_emotion_history,
    get_user_emotion_history
)
from flask import Blueprint, request, jsonify

from app.services.emotion_service import save_uploaded_image

from app.services.emotion_service import (
    save_uploaded_image,
    detect_face,
    predict_emotion
)

import os

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
    image_path=image_path
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