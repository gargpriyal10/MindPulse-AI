from app.database import db
from app.models.user import User


def update_profile(user, data):

    if "full_name" in data:
        user.full_name = data["full_name"].strip()

    if "gender" in data:
        user.gender = data["gender"]

    if "age" in data:
        user.age = data["age"]

    db.session.commit()

    return user


def change_password(user, current_password, new_password):

    if not user.check_password(current_password):
        return False, "Current password is incorrect."

    user.set_password(new_password)

    db.session.commit()

    return True, "Password changed successfully."