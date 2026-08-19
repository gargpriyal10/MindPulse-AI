from app.utils.emotion_fusion import fuse_emotions


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