from flask import Blueprint, request, jsonify

from app.services.emotion_service import save_uploaded_image

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

    return jsonify({
        "success": True,
        "message": message,
        "filename": filename
    }), 200