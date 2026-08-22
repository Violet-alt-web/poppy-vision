import sys
from pathlib import Path

from ultralytics import YOLO


MODEL_PATH = Path("models/poppy_classifier_v1.pt")


def predict(image_path):

    # 检查模型
    if not MODEL_PATH.exists():
        print(
            f"Error: model not found: {MODEL_PATH}"
        )
        return


    # 检查图片
    image = Path(image_path)

    if not image.exists():
        print(
            f"Error: image not found: {image}"
        )
        return


    try:

        model = YOLO(str(MODEL_PATH))

        results = model(str(image))


        result = results[0]

        probs = result.probs

        cls_id = probs.top1
        confidence = probs.top1conf.item()


        names = result.names

        label = names[cls_id]


        print("=" * 40)
        print("Prediction Result")
        print("=" * 40)

        print(f"Class: {label}")
        print(f"Confidence: {confidence:.2%}")


    except Exception as e:

        print("Inference failed!")
        print(f"Reason: {e}")


if __name__ == "__main__":


    if len(sys.argv) != 2:

        print(
            "Usage:"
        )

        print(
            "python scripts/predict_single.py <image_path>"
        )

        sys.exit(1)


    predict(sys.argv[1])