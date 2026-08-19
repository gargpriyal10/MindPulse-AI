import librosa
import numpy as np


TARGET_SAMPLE_RATE = 16000
MAX_DURATION = 5  # seconds


def preprocess_audio(audio_path):
    """
    Load audio, convert to mono, resample to 16kHz,
    trim/pad to fixed duration.
    """

    audio, sample_rate = librosa.load(
        audio_path,
        sr=TARGET_SAMPLE_RATE,
        mono=True
    )

    max_length = TARGET_SAMPLE_RATE * MAX_DURATION

    if len(audio) > max_length:
        audio = audio[:max_length]
    else:
        padding = max_length - len(audio)
        audio = np.pad(audio, (0, padding))

    return audio.astype(np.float32)