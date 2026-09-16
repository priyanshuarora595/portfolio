import json

import numpy as np
from fastembed import TextEmbedding

from app.config import DATA_DIR, EMBEDDING_MODEL

_model: TextEmbedding | None = None
_chunks: list[dict] = []
_embeddings: np.ndarray | None = None


def _normalize(vectors: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    norms[norms == 0] = 1
    return vectors / norms


def load_index() -> None:
    """Load the baked-in embeddings index. Call once at startup."""
    global _model, _chunks, _embeddings
    with open(DATA_DIR / "chunks.json") as f:
        _chunks = json.load(f)
    _embeddings = _normalize(np.load(DATA_DIR / "embeddings.npy"))
    _model = TextEmbedding(model_name=EMBEDDING_MODEL)


def retrieve(query: str, k: int = 4) -> list[dict]:
    if _model is None or _embeddings is None:
        raise RuntimeError("RAG index not loaded — call load_index() at startup")

    query_vec = _normalize(np.array(list(_model.embed([query])), dtype=np.float32))
    scores = _embeddings @ query_vec[0]
    top_k = np.argsort(-scores)[:k]
    return [{**_chunks[i], "score": float(scores[i])} for i in top_k]
