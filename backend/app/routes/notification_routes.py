from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.database import db
from app.models.notification import Notification

notification_bp = Blueprint(
    "notification",
    __name__,
    url_prefix="/api/notifications"
)


@notification_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()

    notifications = (
        Notification.query
        .filter_by(user_id=int(user_id))
        .order_by(Notification.created_at.desc())
        .all()
    )

    return jsonify({
        "success": True,
        "notifications": [item.to_dict() for item in notifications],
        "count": len(notifications)
    }), 200


@notification_bp.route("/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_read(notification_id):
    user_id = int(get_jwt_identity())

    notification = Notification.query.filter_by(
        id=notification_id,
        user_id=user_id
    ).first()

    if not notification:
        return jsonify({
            "success": False,
            "message": "Notification not found"
        }), 404

    notification.is_read = True
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Notification marked as read",
        "notification": notification.to_dict()
    }), 200