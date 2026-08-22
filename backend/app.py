from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from inference import predict_image

app = FastAPI(title="Poppy Identification API")
MAX_IMAGE_SIZE = 10 * 1024 * 1024


class PredictionResponse(BaseModel):
    label: str
    confidence: float = Field(ge=0, le=1)


# Allow the frontend branch to call this API during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image cannot be empty.")
    if len(file_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="Image size must not exceed 10 MB.")

    result = predict_image(file_bytes)
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
