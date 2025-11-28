# ================================================
#   AURA API — FAZO LOGÍSTICA
#   Backend Multi-IA PRO 2025
#   Autor: Gustavo Oliva + Mateo
# ================================================

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional
from dotenv import load_dotenv
import base64
import httpx
import os

# ================================================
#   CARGAR VARIABLES .env
# ================================================
load_dotenv()

OPENAI_KEY   = os.getenv("AURA_OPENAI_KEY")
CLAUDE_KEY   = os.getenv("AURA_CLAUDE_KEY")
GROQ_KEY     = os.getenv("AURA_GROQ_KEY")
DEEPSEEK_KEY = os.getenv("AURA_DEEPSEEK_KEY")
GEMINI_KEY   = os.getenv("AURA_GEMINI_KEY")
COHERE_KEY   = os.getenv("AURA_COHERE_KEY")

AURA_MODEL   = os.getenv("AURA_MODEL", "gpt-4.1-mini")
FRONTEND_ORIGIN = os.getenv("AURA_ORIGEN_FRONTEND", "*")

ENABLE_PC_CONTROL = os.getenv("ENABLE_PC_CONTROL", "false").lower() == "true"


# ================================================
#   APP FASTAPI
# ================================================
app = FastAPI(
    title="AURA API — FAZO LOGÍSTICA",
    version="4.0 ULTRAPRO",
    description="Backend oficial para Aura Visual con Multi-IA, Audio, Imagen y módulos FAZO"
)

# CORS PRO
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_ORIGIN,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logs PRO
def log(msg):
    print(f"[AURA-API] {msg}", flush=True)


# ================================================
#   MODELOS
# ================================================
class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class ChatRequest(BaseModel):
    provider: str = "openai"
    messages: List[ChatMessage]
    audio: bool = False
    image: Optional[str] = None  # base64

class ChatResponse(BaseModel):
    reply: str
    audio_base64: Optional[str] = None


# ================================================
#   FUNCIONES PARA CADA PROVEEDOR DE IA
# ================================================

# ---------- OPENAI ----------
async def ia_openai(req: ChatRequest):
    headers = {"Authorization": f"Bearer {OPENAI_KEY}"}

    payload = {
        "model": "gpt-4.1",
        "messages": [m.dict() for m in req.messages]
    }

    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.openai.com/v1/chat/completions",
            json=payload,
            headers=headers
        )
    text = r.json()["choices"][0]["message"]["content"]

    # AUDIO
    if req.audio:
        tts_payload = {
            "model": "gpt-4o-mini-tts",
            "input": text
        }
        async with httpx.AsyncClient() as client:
            r2 = await client.post(
                "https://api.openai.com/v1/audio/speech",
                json=tts_payload,
                headers=headers
            )
        return text, base64.b64encode(r2.content).decode()

    return text, None


# ---------- CLAUDE ----------
async def ia_claude(req: ChatRequest):
    headers = {
        "x-api-key": CLAUDE_KEY,
        "anthropic-version": "2023-06-01"
    }
    payload = {
        "model": "claude-3-7-sonnet",
        "max_tokens": 4096,
        "messages": [{"role": m.role, "content": m.content} for m in req.messages]
    }

    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.anthropic.com/v1/messages",
            json=payload,
            headers=headers
        )
    text = r.json()["content"][0]["text"]
    return text, None


# ---------- GROQ ----------
async def ia_groq(req: ChatRequest):
    headers = {"Authorization": f"Bearer {GROQ_KEY}"}
    payload = {
        "model": "llama3-8b-8192",
        "messages": [m.dict() for m in req.messages]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers
        )
    text = r.json()["choices"][0]["message"]["content"]
    return text, None


# ---------- DEEPSEEK ----------
async def ia_deepseek(req: ChatRequest):
    headers = {"Authorization": f"Bearer {DEEPSEEK_KEY}"}
    payload = {
        "model": "deepseek-chat",
        "messages": [m.dict() for m in req.messages]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.deepseek.com/v1/chat/completions",
            json=payload,
            headers=headers
        )
    text = r.json()["choices"][0]["message"]["content"]
    return text, None


# ---------- GEMINI ----------
async def ia_gemini(req: ChatRequest):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": req.messages[-1].content}
                ]
            }
        ]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=payload)
    text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
    return text, None


# ---------- COHERE ----------
async def ia_cohere(req: ChatRequest):
    headers = {"Authorization": f"Bearer {COHERE_KEY}"}
    payload = {
        "model": "command-r",
        "messages": [m.dict() for m in req.messages]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.cohere.com/v1/chat",
            json=payload,
            headers=headers
        )
    return r.json()["text"], None


# ================================================
#   ROUTER PRINCIPAL /AURA
# ================================================
@app.post("/aura", response_model=ChatResponse)
async def aura_chat(req: ChatRequest):

    if not req.messages:
        raise HTTPException(400, "No hay mensajes.")

    prov = req.provider.lower()

    log(f"⚡ IA solicitada: {prov}")

    # --------------------
    # Selección del motor
    # --------------------
    if prov == "openai":
        text, audio = await ia_openai(req)
    elif prov == "claude":
        text, audio = await ia_claude(req)
    elif prov == "groq":
        text, audio = await ia_groq(req)
    elif prov == "deepseek":
        text, audio = await ia_deepseek(req)
    elif prov == "gemini":
        text, audio = await ia_gemini(req)
    elif prov == "cohere":
        text, audio = await ia_cohere(req)
    else:
        text = "Proveedor no reconocido."
        audio = None

    log(f"💬 AURA responde: {text}")

    return ChatResponse(reply=text, audio_base64=audio)


# ================================================
#   HEALTH
# ================================================
@app.get("/health")
def health():
    return {"status": "ok", "model": AURA_MODEL}


# ================================================
#   CONTROL PC
# ================================================
@app.post("/control-pc")
def control_pc():
    if not ENABLE_PC_CONTROL:
        return {"status": "disabled"}
    return {"status": "ok"}


# ================================================
#   RUN LOCAL
# ================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)