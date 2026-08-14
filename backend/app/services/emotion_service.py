import os
from werkzeug.utils import secure_filename
import cv2
import mediapipe as mp

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

mp_face_detection = mp.solutions.face_detection


def detect_face(image_path):
    """
    Detect whether the uploaded image contains a face.
    """

    image = cv2.imread(image_path)

    if image is None:
        return False, "Unable to read image."

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    with mp_face_detection.FaceDetection(
        model_selection=0,
        min_detection_confidence=0.5
    ) as face_detection:

        results = face_detection.process(rgb_image)

        if not results.detections:
            return False, "No face detected."

    return True, "Face detected successfully."