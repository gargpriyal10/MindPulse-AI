import re


def is_valid_email(email):
    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    return re.match(pattern, email)


def is_strong_password(password):
    """
    Minimum 8 characters
    At least:
    - 1 uppercase
    - 1 lowercase
    - 1 digit
    - 1 special character
    """

    pattern = (
        r"^(?=.*[a-z])"
        r"(?=.*[A-Z])"
        r"(?=.*\d)"
        r"(?=.*[@$!%*?&])"
        r"[A-Za-z\d@$!%*?&]{8,}$"
    )

    return re.match(pattern, password)