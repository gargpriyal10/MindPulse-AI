import os
import uuid
from werkzeug.utils import secure_filename

from flask_jwt_extended import get_jwt_identity

from app import db
from app.models.emotion_history import EmotionHistory
from app.utils.audio_inference import predict_audio_emotion

UPLOAD_FOLDER = "uploads/audio"
ALLOWED_EXTENSIONS = {"wav"}


def allowed_audio(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def analyze_audio(file):
    """
    Save uploaded audio, predict emotion,
    store history and return response.
    """

    if file is None:
        return {
            "success": False,
            "message": "Audio file is required."
        }, 400

    if file.filename == "":
        return {
            "success": False,
            "message": "No audio selected."
        }, 400

    if not allowed_audio(file.filename):
        return {
            "success": False,
            "message": "Only .wav files are allowed."
        }, 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(file_path)

    prediction = predict_audio_emotion(file_path)

    history = EmotionHistory(
        user_id=get_jwt_identity(),
        emotion=prediction["emotion"],
        confidence=prediction["confidence"],
        image_path=file_path
    )

    db.session.add(history)
    db.session.commit()

    return {
        "success": True,
        "emotion": prediction["emotion"],
        "confidence": prediction["confidence"],
        "scores": prediction["scores"],
        "audio_path": file_path.replace("\\", "/")
    }, 200