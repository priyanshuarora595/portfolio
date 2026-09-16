import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
API_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = API_DIR / "data"
CONTENT_DIR = ROOT_DIR / "content" / "projects"
RESUME_PDF = ROOT_DIR / "web" / "public" / "resume.pdf"

EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-20b")

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

RATE_LIMIT_PER_HOUR = int(os.environ.get("RATE_LIMIT_PER_HOUR", "20"))

CONTACT_EMAIL = "priyanshuarora02@gmail.com"
