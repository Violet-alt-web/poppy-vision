from ultralytics import YOLO
from pathlib import Path


# =========================
# 配置
# =========================

DATASET_PATH = "data/dataset"

MODEL = "yolo11n-cls.pt"

EPOCHS = 50
IMAGE_SIZE = 224
BATCH = 16


def main():

    dataset = Path(DATASET_PATH)

    if not dataset.exists():
        raise FileNotFoundError(
            f"Dataset not found: {dataset}"
        )

    print("Starting training...")
    print(f"Dataset: {dataset}")


    model = YOLO(MODEL)


    results = model.train(
        data=str(dataset),
        epochs=EPOCHS,
        imgsz=IMAGE_SIZE,
        batch=BATCH,
        project="runs/classify",
        name="poppy_classifier_train"
    )


    print("Training finished!")
    print(results)


if __name__ == "__main__":
    main()