def fuse_emotions(face_emotion, face_confidence,
                  audio_emotion, audio_confidence):
    """
    Fuse facial and audio emotion predictions.

    Current Strategy:
    - If both predict the same emotion:
        Average the confidence.
    - Otherwise:
        Return the emotion with the higher confidence.
    """

    if face_emotion == audio_emotion:
        return {
            "emotion": face_emotion,
            "confidence": round(
                (face_confidence + audio_confidence) / 2,
                4
            )
        }

    if face_confidence >= audio_confidence:
        return {
            "emotion": face_emotion,
            "confidence": round(face_confidence, 4)
        }

    return {
        "emotion": audio_emotion,
        "confidence": round(audio_confidence, 4)
    }