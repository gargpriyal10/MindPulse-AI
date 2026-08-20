from flask_jwt_extended import get_jwt_identity

from app.models.emotion_history import EmotionHistory
from app.database import db
from app.models.user import User


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

def delete_user_account():
    """
    Permanently delete the logged-in user's account and all associated
    emotion history.
    """

    user_id = get_jwt_identity()

    # Delete all emotion history first
    EmotionHistory.query.filter_by(user_id=user_id).delete(
        synchronize_session=False
    )

    # Delete user account
    user = User.query.get(user_id)

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    db.session.delete(user)
    db.session.commit()

    return {
        "success": True,
        "message": "User account deleted successfully."
    }, 200

def get_privacy_settings():
    """
    Return available privacy actions for the logged-in user.
    """

    return {
        "success": True,
        "data": {
            "can_delete_history": True,
            "can_delete_account": True,
            "history_endpoint": "/api/privacy/history",
            "account_endpoint": "/api/privacy/account"
        }
    }, 200