from flask import Blueprint, request, jsonify

from app.services.emotion_service import save_uploaded_image

from app.services.emotion_service import (
    save_uploaded_image,
    detect_face
)

emotion_bp = Blueprint(
    "emotion",
    __name__,
    url_prefix="/api/emotions"
)


@emotion_bp.route("/upload", methods=["POST"])
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

    success, face_message = detect_face(image_path)

    if not success:
        return jsonify({
        "success": False,
        "message": face_message
    }), 400

    return jsonify({
    "success": True,
    "message": face_message,
    "filename": filename
}), 200