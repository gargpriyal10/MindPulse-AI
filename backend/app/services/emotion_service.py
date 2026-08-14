import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def save_uploaded_image(file):

    if file.filename == "":
        return False, "No file selected.", None

    if not allowed_file(file.filename):
        return False, "Only JPG, JPEG and PNG images are allowed.", None

    upload_folder = "uploads"

    os.makedirs(upload_folder, exist_ok=True)

    filename = secure_filename(file.filename)

    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)

    return True, "Image uploaded successfully.", filename