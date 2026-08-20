from datetime import datetime

from flask_jwt_extended import get_jwt_identity

from app.database import db
from app.models.session import Session


def start_session():
    user_id = get_jwt_identity()

    session = Session(
        user_id=user_id,
        status="active"
    )

    db.session.add(session)
    db.session.commit()

    return {
        "success": True,
        "message": "Session started successfully.",
        "session": {
            "id": session.id,
            "user_id": session.user_id,
            "status": session.status,
            "started_at": session.started_at
        }
    }, 201


def end_session(session_id):
    user_id = get_jwt_identity()

    session = Session.query.filter_by(
        id=session_id,
        user_id=user_id
    ).first()

    if not session:
        return {
            "success": False,
            "message": "Session not found."
        }, 404

    if session.status == "completed":
        return {
            "success": False,
            "message": "Session is already completed."
        }, 400

    session.ended_at = datetime.utcnow()
    session.status = "completed"

    db.session.commit()

    return {
        "success": True,
        "message": "Session ended successfully.",
        "session": {
            "id": session.id,
            "user_id": session.user_id,
            "status": session.status,
            "started_at": session.started_at,
            "ended_at": session.ended_at
        }
    }, 200


def get_user_sessions():
    user_id = get_jwt_identity()

    sessions = (
        Session.query
        .filter_by(user_id=user_id)
        .order_by(Session.started_at.desc())
        .all()
    )

    return {
        "success": True,
        "count": len(sessions),
        "sessions": [
            {
                "id": session.id,
                "status": session.status,
                "started_at": session.started_at,
                "ended_at": session.ended_at
            }
            for session in sessions
        ]
    }, 200