from app.database import db
from app.models.emotion_history import EmotionHistory


def save_emotion_history(
    user_id,
    emotion,
    confidence,
    image_path
):
    """
    Save detected emotion into the database.
    """

    history = EmotionHistory(
        user_id=user_id,
        emotion=emotion,
        confidence=confidence,
        image_path=image_path
    )

    db.session.add(history)
    db.session.commit()

    return history

from app.models.emotion_history import EmotionHistory


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