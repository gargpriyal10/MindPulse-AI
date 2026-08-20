from datetime import datetime

from app.database import db


class EmotionHistory(db.Model):
    __tablename__ = "emotion_history"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    emotion = db.Column(
        db.String(50),
        nullable=False
    )

    confidence = db.Column(
        db.Float,
        nullable=False
    )

    media_path = db.Column(
    db.String(255),
    nullable=False
)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship(
        "User",
        backref=db.backref(
            "emotion_history",
            lazy=True
        )
    )

    def to_dict(self):
        return {
        "id": self.id,
        "emotion": self.emotion,
        "confidence": round(self.confidence, 4),
        "media_path": self.media_path,
        "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
    }