# Mentor AI — Multi-Agent Learning Roadmap Generator

## Problem
Learning a new topic from scratch has a cold-start problem: figuring out a sensible curriculum order, finding explanations pitched at the right level, and finding good video resources all take time before actual learning starts. Mentor AI is a personal tool that takes any topic as input and generates a structured learning roadmap, tiered concept explanations, and curated YouTube resources for it automatically, for anyone who wants a fast on-ramp into a new subject.

## My Role
Solo project — I designed and built the entire system: the Streamlit UI, the CrewAI multi-agent pipeline, the pluggable multi-provider LLM layer, the encrypted credential storage, and the YouTube resource tool.

## Architecture
The frontend is a Streamlit app (`app/streamlit_app.py` with Dashboard, Learn Topic, and Settings pages) where a user enters a topic, views generated roadmaps/history, and configures which LLM provider and API key to use.

Content generation is handled by a CrewAI `Crew` (`backend/crew.py`) of three agents run as a sequential process: a **Curriculum Planner** produces the roadmap, and a **YouTube Search Agent** (using a custom `YoutubeSearchTool`) finds relevant videos — both dispatched with `async_execution=True` since neither depends on the other. A **Concept Explainer** agent then writes tiered (beginner/intermediate/advanced) explanations, declared with `context=[roadmap_task]` so it only runs once the roadmap is ready, making it the natural join point after the two async tasks complete. The three outputs are assembled into one markdown document, passed through a sanitizer that strips stray LLM artifacts (e.g. leaked "Final Answer:"/"System:" preambles) and repairs any unbalanced or fully-wrapped code fences per section before concatenation, so malformed output from one agent can't corrupt the rendering of the sections around it.

An LLM factory (`backend/llm/factory.py` plus one provider class per backend) lets the same agent pipeline run against Ollama (local Llama3, the default), OpenAI, Anthropic, or OpenRouter, selected per-user from Settings — switching providers is a config change, not a code change. Provider access goes through CrewAI's `LLM` class, which is backed by LiteLLM (also a directly pinned dependency) to give a single call interface across otherwise incompatible provider APIs. The Ollama provider explicitly validates that the requested model is actually pulled on the local Ollama host (via its `/api/tags` endpoint) before use, turning a likely silent/cryptic failure into a clear error.

Persistence is SQLite via SQLAlchemy, with a `ModelConfig` table (per-user provider/model/API key) and a `LearningTopic` table (generated content history). Provider API keys are encrypted at rest with Fernet (AES-128); the Fernet key itself is derived by SHA-256-hashing a user-supplied `ENCRYPTION_KEY` string down to 32 bytes, so any arbitrary secret string works as a valid key and raw API keys are never stored in plaintext. The app also ships with a Dockerfile/docker-compose setup so the Streamlit app can run containerized while still reaching a host-installed Ollama instance for local, private inference.

## Tech Stack
- Python, Streamlit (UI)
- CrewAI (multi-agent orchestration), LiteLLM (unified LLM provider interface used internally by CrewAI)
- LLM providers: Ollama (local Llama3), OpenAI, Anthropic, OpenRouter
- SQLAlchemy + SQLite (persistence)
- `cryptography` (Fernet/AES-128) for encrypted API key storage
- yt-dlp, youtube-search-python, youtube-transcript-api (YouTube resource discovery)
- Pydantic
- Docker / docker-compose

## Impact / Results
This is a personal/portfolio project, not a deployed product, so there are no user-scale metrics. It demonstrates practical multi-agent system design (dependency-aware sequential/async task orchestration in CrewAI), a provider-agnostic LLM architecture that runs identically against a fully local model or any of three cloud providers, and secure-by-default handling of user-supplied API keys.

## Links
- GitHub repo: https://github.com/priyanshuarora595/mentor-ai
