from collections import Counter
from datetime import datetime, timedelta

from flask_jwt_extended import get_jwt_identity

from app.models.emotion_history import EmotionHistory


def generate_emotion_report(period="week"):
    """
    Generate an emotion report for the currently authenticated user.
    Data is read from EmotionHistory.
    """

    # Get logged-in user's ID from JWT
    user_id = get_jwt_identity()

    now = datetime.utcnow()

    if period == "week":
        start_date = now - timedelta(days=7)

    elif period == "month":
        start_date = now - timedelta(days=30)

    elif period == "3months":
        start_date = now - timedelta(days=90)

    else:
        start_date = now - timedelta(days=7)
    
    # Fetch user's emotion history
    history = (
        EmotionHistory.query
        .filter(
            EmotionHistory.user_id == user_id,
            EmotionHistory.created_at >= start_date
        )
        .order_by(EmotionHistory.created_at.asc())
        .all()
    )

    # No records case
    if not history:
        return {
            "success": True,
            "total_records": 0,
            "generated_at": datetime.utcnow().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "report": {
                "average_confidence": 0,
                "dominant_emotion": None,
                "emotion_counts": {},
                "emotion_percentages": {},
                "first_session": None,
                "latest_emotion": None,
                "latest_session": None,
            },
        }

    # ---------------------------------------------------------
    # EMOTIONS
    # ---------------------------------------------------------

    emotions = [
        str(record.emotion).lower()
        for record in history
        if record.emotion
    ]

    total = len(emotions)

    # ---------------------------------------------------------
    # CONFIDENCE
    # ---------------------------------------------------------

    confidences = []

    for record in history:
        if record.confidence is not None:
            try:
                confidences.append(float(record.confidence))
            except (TypeError, ValueError):
                continue

    avg_confidence = (
        sum(confidences) / len(confidences)
        if confidences
        else 0
    )

    # ---------------------------------------------------------
    # EMOTION COUNTS
    # ---------------------------------------------------------

    emotion_counts = Counter(emotions)

    dominant_emotion = (
        emotion_counts.most_common(1)[0][0]
        if emotion_counts
        else None
    )

    # ---------------------------------------------------------
    # EMOTION PERCENTAGES
    # ---------------------------------------------------------

    emotion_percentages = {
        emotion: round((count / total) * 100, 1)
        for emotion, count in emotion_counts.items()
    }

    # ---------------------------------------------------------
    # FIRST / LATEST SESSION
    # ---------------------------------------------------------

    first_record = history[0]
    latest_record = history[-1]

    first_session = (
        first_record.created_at.strftime("%Y-%m-%d %H:%M:%S")
        if first_record.created_at
        else None
    )

    latest_session = (
        latest_record.created_at.strftime("%Y-%m-%d %H:%M:%S")
        if latest_record.created_at
        else None
    )

    # ---------------------------------------------------------
    # FINAL REPORT
    # ---------------------------------------------------------

    return {
        "success": True,
        "total_records": total,
        "generated_at": datetime.utcnow().strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
        "report": {
            "average_confidence": round(avg_confidence, 4),
            "dominant_emotion": dominant_emotion,
            "emotion_counts": dict(emotion_counts),
            "emotion_percentages": emotion_percentages,
            "first_session": first_session,
            "latest_emotion": (
                str(latest_record.emotion).lower()
                if latest_record.emotion
                else None
            ),
            "latest_session": latest_session,
        },
    }