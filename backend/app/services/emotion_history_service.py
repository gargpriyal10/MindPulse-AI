from flask_jwt_extended import get_jwt_identity

from app.database import db
from app.models.emotion_history import EmotionHistory


def save_emotion_history(
    user_id,
    emotion,
    confidence,
    media_path
):
    """
    Save detected emotion into the database.
    """

    history = EmotionHistory(
        user_id=user_id,
        emotion=emotion,
        confidence=confidence,
        media_path=media_path
    )

    db.session.add(history)
    db.session.commit()

    return history


def get_user_emotion_history(user_id):
    """
    Get emotion history for a specific user.
    """

    history = (
        EmotionHistory.query
        .filter_by(user_id=user_id)
        .order_by(EmotionHistory.created_at.desc())
        .all()
    )

    return history


def get_audio_history():
    """
    Returns audio emotion history
    for the logged-in user.
    """

    user_id = get_jwt_identity()

    history = (
        EmotionHistory.query
        .filter_by(user_id=user_id)
        .filter(EmotionHistory.media_path.like("uploads/audio%"))
        .order_by(EmotionHistory.created_at.desc())
        .all()
    )

    return {
        "success": True,
        "count": len(history),
        "history": [
            {
    "id": item.id,
    "emotion": item.emotion,
    "confidence": round(item.confidence, 4),
    "media_path": item.media_path.replace("\\", "/"),
    "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S")
}
            for item in history
        ]
    }