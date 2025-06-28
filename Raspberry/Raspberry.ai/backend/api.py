from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from .main import chat_openai, chat_gemini, chat_claude
from .deps import quota_guard  # You must have this set up

app = FastAPI()

class ChatReq(BaseModel):
    provider: str   # "openai" | "gemini" | "claude"
    prompt: str

@app.post("/chat")
def chat(req: ChatReq, uid: str = Depends(quota_guard)):
    try:
        if req.provider == "openai":
            return {"answer": chat_openai(req.prompt)}
        elif req.provider == "gemini":
            return {"answer": chat_gemini(req.prompt)}
        elif req.provider == "claude":
            return {"answer": chat_claude(req.prompt)}
        raise ValueError("Unknown provider.")
    except Exception as err:
        raise HTTPException(status_code=400, detail=str(err))