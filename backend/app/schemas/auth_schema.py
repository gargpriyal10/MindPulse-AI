from app.utils.validators import (
    is_valid_email,
    is_strong_password
)


def validate_register_data(data):

    required_fields = [
        "full_name",
        "email",
        "password"
    ]

    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return False, f"{field} is required"

    if not is_valid_email(data["email"]):
        return False, "Invalid email address"

    if not is_strong_password(data["password"]):
        return (
            False,
            "Password must contain uppercase, lowercase, number and special character."
        )

    return True, None

def validate_login_data(data):

    required_fields = [
        "email",
        "password"
    ]

    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return False, f"{field} is required"

    return True, None