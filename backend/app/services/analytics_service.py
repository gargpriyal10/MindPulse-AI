from collections import Counter

from flask_jwt_extended import get_jwt_identity

from app.models.emotion_history import EmotionHistory


def get_emotion_analytics():
    """
    Returns analytics data for dashboard charts.
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
            "labels": [],
            "values": [],
            "timeline": [],
            "total_sessions": 0,
            "average_confidence": 0,
            "latest_emotion": None
        }

    counts = Counter(item.emotion for item in history)

    average_confidence = round(
        sum(item.confidence for item in history) / len(history),
        4
    )

    latest_record = history[-1]

    timeline = [
        {
            "date": item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "emotion": item.emotion,
            "confidence": round(item.confidence, 4)
        }
        for item in history
    ]

    return {
        "success": True,
        "labels": list(counts.keys()),
        "values": list(counts.values()),
        "timeline": timeline,
        "total_sessions": len(history),
        "average_confidence": average_confidence,
        "latest_emotion": latest_record.emotion
    }