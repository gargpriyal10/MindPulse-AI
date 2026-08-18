import os
import cv2
import numpy as np
import onnxruntime as ort


MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "ml_models",
    "emotion_model.onnx"
)

EMOTIONS = [
    "neutral",
    "happiness",
    "surprise",
    "sadness",
    "anger",
    "disgust",
    "fear",
    "contempt"
]


class EmotionInference:

    def __init__(self):
        self.session = ort.InferenceSession(
            MODEL_PATH,
            providers=["CPUExecutionProvider"]
        )

        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name

    def preprocess(self, face_image):
        gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
        gray = cv2.resize(gray, (64, 64))

        image = gray.astype(np.float32)
        image = (image - 127.5) / 128.0

        image = np.expand_dims(image, axis=0)
        image = np.expand_dims(image, axis=0)

        return image

    def predict(self, face_image):

        input_tensor = self.preprocess(face_image)

        outputs = self.session.run(
            [self.output_name],
            {self.input_name: input_tensor}
        )[0][0]

        probabilities = np.exp(outputs) / np.sum(np.exp(outputs))

        index = int(np.argmax(probabilities))

        if index >= len(EMOTIONS):
            return {
        "dominant_emotion": "unknown",
        "confidence": 0.0,
        "scores": {}
    }

        return {
            "dominant_emotion": EMOTIONS[index],
            "confidence": float(probabilities[index]),
            "scores": {
                EMOTIONS[i]: float(probabilities[i])
                for i in range(len(EMOTIONS))
            }
        }


emotion_model = EmotionInference()