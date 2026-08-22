# Poppy Identification Backend

FastAPI backend for the V1 poppy image classification project.

## Features

- `GET /health`: health check endpoint.
- `POST /predict`: image upload endpoint.
- CORS enabled for local frontend integration.
- Mock prediction result before the trained model is connected.

## Setup

Run these commands from the project root:

```powershell
cd D:\gitpush\poppy-vision
python -m pip install -r backend\requirements.txt
```

## Start Server

Run from the backend directory:

```powershell
cd D:\gitpush\poppy-vision\backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

## Test API

Health check:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/health
```

Prediction:

```powershell
curl.exe -X POST -F "file=@D:\path\to\test.jpg" http://127.0.0.1:8000/predict
```

Current mock response:

```json
{
  "label": "poppy",
  "confidence": 0.95
}
```

## Model Integration Later

After the trained model is available, replace the mock logic in
`inference.py` with real model loading and prediction code.
