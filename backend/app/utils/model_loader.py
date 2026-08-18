import os
from tensorflow.keras.models import load_model

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "ml_models",
    "cnn_emotion_phase4.keras"
)

emotion_model = None


def get_emotion_model():
    global emotion_model

    if emotion_model is None:
        emotion_model = load_model(
    MODEL_PATH,
    safe_mode=False,
    compile=False
)

    return emotion_model