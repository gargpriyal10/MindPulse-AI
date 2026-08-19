from transformers import pipeline
from app.utils.audio_preprocessing import preprocess_audio

_audio_classifier = None

# Model labels -> Backend labels
EMOTION_MAPPING = {
    "neu": "neutral",
    "hap": "happiness",
    "ang": "anger",
    "sad": "sadness"
}


def get_audio_classifier():
    global _audio_classifier

    if _audio_classifier is None:
        _audio_classifier = pipeline(
            task="audio-classification",
            model="superb/wav2vec2-base-superb-er"
        )

    return _audio_classifier


def predict_audio_emotion(audio_path):
    """
    Predict emotion from an audio file.
    Returns backend-friendly JSON.
    """

# Preprocess audio
    audio = preprocess_audio(audio_path)

    classifier = get_audio_classifier()

    predictions = classifier(audio)

    scores = {}

    for item in predictions:
        backend_label = EMOTION_MAPPING.get(
            item["label"],
            item["label"]
        )

        scores[backend_label] = round(
            float(item["score"]),
            4
        )

    top = max(scores, key=scores.get)

    return {
        "emotion": top,
        "confidence": scores[top],
        "scores": scores
    }