from flask_jwt_extended import create_access_token
from app.database import db
from app.models.user import User


def register_user(data):

    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:
        return False, "Email already registered"

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        gender=data.get("gender"),
        age=data.get("age")
    )

    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return True, "User registered successfully"

from flask_jwt_extended import create_access_token


def login_user(data):

    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:
        return False, "Invalid email or password", None

    if not user.check_password(data["password"]):
        return False, "Invalid email or password", None

    token = create_access_token(identity=str(user.id))

    return True, token, user