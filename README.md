# Priyanshu Arora — Portfolio

A dark, terminal-styled portfolio site with a RAG chatbot grounded in the resume and
project write-ups in this repo.

## Structure

```
web/                  Next.js 16 (App Router) + Tailwind CSS — the site itself
api/                  FastAPI backend — RAG retrieval + Groq-powered chat
content/projects/     One markdown write-up per project (source of truth for both
                       the project pages on the site and the chatbot's knowledge base)
PriyanshuAroraAiEngineer.pdf   Resume — also chunked into the chatbot's knowledge base
```

## How the chatbot works

- `api/scripts/ingest.py` reads the resume PDF and every file in `content/projects/`,
  splits them into chunks, embeds each chunk locally with `fastembed` (ONNX, no GPU/torch
  needed, no API cost), and saves the result to `api/data/`.
- `api/app/main.py` exposes `POST /api/chat`: it embeds the incoming question, retrieves
  the top matching chunks, and sends them to Groq (free tier, no credit card) to generate
  an answer grounded in that context.
- There's no live database — the embeddings are baked in at build/deploy time. Whenever
  you edit or add a project doc, re-run the ingestion script (locally, or automatically
  on Render — see below) before the change shows up in chat answers.

## Local development

**Backend**

```bash
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then add your GROQ_API_KEY
python scripts/ingest.py    # builds api/data/embeddings.npy + chunks.json
uvicorn app.main:app --reload --port 8000
```

Get a free Groq API key (no card required) at https://console.groq.com/keys.

**Frontend**

```bash
cd web
npm install
cp .env.local.example .env.local   # points at the local backend by default
npm run dev
```

Visit http://localhost:3000.

## Updating project content

Add or edit a markdown file in `content/projects/` (see existing files for the expected
sections: Problem, My Role, Architecture, Tech Stack, Impact/Results, Links), then:

1. Add its metadata to `web/lib/projects.ts` (slug, title, tagline, tags, links) so it
   shows up on the site.
2. Re-run `python scripts/ingest.py` in `api/` so the chatbot picks up the change.

## Deployment

**Frontend → Vercel**

- Import the repo, set the project root to `web/`.
- Env var: `NEXT_PUBLIC_API_URL` = your deployed backend URL.

**Backend → Render**

- `api/render.yaml` is a ready-to-use Blueprint (root dir `api/`, build step installs
  dependencies and runs `ingest.py` fresh on every deploy, so content edits stay in sync
  automatically).
- Env vars to set in the Render dashboard: `GROQ_API_KEY` (secret), and `ALLOWED_ORIGINS`
  set to your Vercel domain once it exists (comma-separated if you need more than one).

## Notes / known limitations

- The chat rate limiter (`api/app/ratelimit.py`) is in-memory per process — fine for a
  single free-tier instance at portfolio traffic levels, but it resets on redeploy/restart
  and wouldn't be consistent if the service were ever scaled to multiple instances.
- The PII tokenization demo on the PHI Tokenization project page is entirely synthetic and
  client-side (see `web/components/TokenizationDemo.tsx`) — it illustrates the shape of
  the real system described in `content/projects/phi-tokenization-pipeline.md`, not the
  actual Datavant integration.
