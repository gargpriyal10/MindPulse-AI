from app.utils.emotion_fusion import fuse_emotions
from app.services.emotion_service import (
    save_uploaded_image,
    detect_face,
    predict_emotion
)

from app.services.audio_emotion_service import analyze_audio

def generate_fused_emotion(face_result, audio_result):
    """
    Combines facial and audio emotion predictions.
    """

    fused = fuse_emotions(
        face_emotion=face_result["emotion"],
        face_confidence=face_result["confidence"],
        audio_emotion=audio_result["emotion"],
        audio_confidence=audio_result["confidence"]
    )

    return {
        "success": True,
        "face": face_result,
        "audio": audio_result,
        "fusion": fused
    }

def process_fusion(image_file, audio_file):
    """
    Process image + audio and return fused emotion.
    """

    # ---------- Image ----------
    success, message, filename = save_uploaded_image(image_file)

    if not success:
        return {
            "success": False,
            "message": message
        }, 400

    import os

    image_path = os.path.join("uploads", filename)

    success, face_message, face = detect_face(image_path)

    if not success:
        return {
            "success": False,
            "message": face_message
        }, 400

    face_prediction = predict_emotion(face)

    face_result = {
        "emotion": face_prediction["dominant_emotion"],
        "confidence": face_prediction["confidence"]
    }

    # ---------- Audio ----------
    audio_response, status_code = analyze_audio(audio_file)

    if status_code != 200:
        return audio_response, status_code

    audio_result = {
        "emotion": audio_response["emotion"],
        "confidence": audio_response["confidence"]
    }

    # ---------- Fusion ----------
    result = generate_fused_emotion(
        face_result=face_result,
        audio_result=audio_result
    )

    return result, 200