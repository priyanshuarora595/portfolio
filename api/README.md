# Portfolio API

FastAPI backend for the portfolio's RAG chatbot. See the root [README](../README.md)
for the full project overview; this file covers just this service.

## Local development

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then add your GROQ_API_KEY
python scripts/ingest.py    # builds data/embeddings.npy + chunks.json
uvicorn app.main:app --reload --port 8000
```

## Layout

- `app/main.py` — FastAPI app, `/api/chat` and `/api/health` routes
- `app/rag.py` — loads the baked-in embeddings index, does retrieval
- `app/groq_client.py` — builds the prompt, calls Groq for the answer
- `app/ratelimit.py` — per-IP in-memory rate limiter
- `scripts/ingest.py` — chunks + embeds the resume and `content/projects/*.md`
- `render.yaml` — Render Blueprint (not used by the live service, which was
  created directly via the Render CLI/API — kept here as a reference/fallback)
