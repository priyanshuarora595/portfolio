from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.config import ALLOWED_ORIGINS
from app.groq_client import generate_answer
from app.ratelimit import enforce_rate_limit
from app.rag import load_index, retrieve


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_index()
    yield


app = FastAPI(title="Priyanshu Arora Portfolio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatTurn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: list[ChatTurn] = Field(default_factory=list)


class Source(BaseModel):
    title: str
    source: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse, dependencies=[Depends(enforce_rate_limit)])
def chat(payload: ChatRequest) -> ChatResponse:
    chunks = retrieve(payload.message, k=4)
    answer = generate_answer(
        payload.message,
        chunks,
        [turn.model_dump() for turn in payload.history],
    )

    seen: set[tuple[str, str]] = set()
    sources: list[Source] = []
    for chunk in chunks:
        key = (chunk["title"], chunk["source"])
        if key not in seen:
            seen.add(key)
            sources.append(Source(title=chunk["title"], source=chunk["source"]))

    return ChatResponse(answer=answer, sources=sources)
