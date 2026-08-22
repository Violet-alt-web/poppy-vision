def predict_image(file_bytes: bytes) -> dict[str, str | float]:
    """
    Mock inference for V1 backend/frontend integration.

    Replace this function with real model inference after the trained
    classifier is available.
    """
    return {
        "label": "poppy",
        "confidence": 0.95,
    }
