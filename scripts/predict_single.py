from ultralytics import YOLO
import sys
from pathlib import Path


MODEL_PATH = Path(__file__).parent.parent / "models" / "poppy_classifier_v1.pt"


def predict(img_path):

    model = YOLO(str(MODEL_PATH))

    results = model(img_path)

    result = results[0]

    cls_id = result.probs.top1
    conf = result.probs.top1conf.item()

    label = model.names[cls_id]

    print(f"label: {label}")
    print(f"confidence: {conf:.2f}")


if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Usage: python predict_single.py image.jpg")
        exit()

    predict(sys.argv[1])