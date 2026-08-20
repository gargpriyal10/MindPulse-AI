from collections import Counter

from flask_jwt_extended import get_jwt_identity

from app.models.emotion_history import EmotionHistory
from datetime import datetime

def generate_emotion_report():
    """
    Generate a basic emotion report
    for the logged-in user.
    """

    user_id = get_jwt_identity()

    history = (
        EmotionHistory.query
        .filter_by(user_id=user_id)
        .order_by(EmotionHistory.created_at.asc())
        .all()
    )

    if not history:
        return {
            "success": True,
            "message": "No emotion history found.",
            "total_records": 0,
            "report": {}
        }

    emotions = [item.emotion for item in history]

    counts = Counter(emotions)

    dominant_emotion = counts.most_common(1)[0][0]

    average_confidence = round(
        sum(item.confidence for item in history) / len(history),
        4
    )

    emotion_percentages = {
    emotion: round((count / len(history)) * 100, 2)
    for emotion, count in counts.items()
}

    first_record = history[0]
    last_record = history[-1]

    return {
        "success": True,
        "total_records": len(history),
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "report": {
            "dominant_emotion": dominant_emotion,
            "average_confidence": average_confidence,
            "emotion_counts": dict(counts),
            "emotion_percentages": emotion_percentages,
            "first_session": first_record.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "latest_session": last_record.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "latest_emotion": last_record.emotion
        }
    }