from flask_jwt_extended import get_jwt_identity

from app.models.emotion_history import EmotionHistory
from app.database import db


def delete_emotion_history():
    """
    Delete all emotion history records of the logged-in user.
    """

    user_id = get_jwt_identity()

    deleted_count = (
        EmotionHistory.query.filter_by(user_id=user_id).delete(
            synchronize_session=False
        )
    )

    db.session.commit()

    return {
        "success": True,
        "message": "Emotion history deleted successfully.",
        "deleted_records": deleted_count
    }, 200