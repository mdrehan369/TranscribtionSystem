from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import whisper
import os
import shutil

app = FastAPI(title="Whisper Transcription API")

model = whisper.load_model("base")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        temp_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = model.transcribe(temp_path)

        os.remove(temp_path)

        return JSONResponse(content={
            "filename": file.filename,
            "text": result["text"].strip()
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

