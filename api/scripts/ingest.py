"""Offline ingestion: chunk the resume + project docs, embed them, and bake the index.

Run this manually whenever content/projects/*.md or the resume PDF changes:

    cd api
    source .venv/bin/activate
    python scripts/ingest.py

It's also run automatically as part of the Render build (see render.yaml), so a
fresh deploy always reflects whatever is currently in content/projects/.
"""

import json
import re
import sys
from pathlib import Path

import numpy as np
from fastembed import TextEmbedding
from pypdf import PdfReader

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import CONTENT_DIR, DATA_DIR, EMBEDDING_MODEL, RESUME_PDF  # noqa: E402

RESUME_SECTION_HEADERS = [
    "Professional Summary",
    "Technical Skills",
    "Professional Experience",
    "Education",
    "Certificates And Achievements",
]


def read_resume_chunks() -> list[dict]:
    reader = PdfReader(str(RESUME_PDF))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    positions = []
    for header in RESUME_SECTION_HEADERS:
        idx = text.find(header)
        if idx != -1:
            positions.append((idx, header))
    positions.sort()

    chunks = []
    for i, (start, header) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(text)
        section_text = text[start:end].strip()
        chunks.append(
            {
                "text": f"Resume section: {header}\n\n{section_text}",
                "source": "resume",
                "title": f"Resume — {header}",
            }
        )
    return chunks


def read_project_chunks() -> list[dict]:
    chunks = []
    for path in sorted(CONTENT_DIR.glob("*.md")):
        raw = path.read_text()
        title_match = re.match(r"#\s+(.+)", raw)
        title = title_match.group(1).strip() if title_match else path.stem

        sections = re.split(r"\n(?=## )", raw)
        for section in sections:
            section = section.strip()
            if not section:
                continue
            heading_match = re.match(r"##\s+(.+)", section)
            heading = heading_match.group(1).strip() if heading_match else "Overview"
            chunks.append(
                {
                    "text": f"Project: {title}\nSection: {heading}\n\n{section}",
                    "source": path.stem,
                    "title": title,
                }
            )
    return chunks


def main() -> None:
    print("Reading resume + project docs...")
    chunks = read_resume_chunks() + read_project_chunks()
    print(f"Built {len(chunks)} chunks. Loading embedding model ({EMBEDDING_MODEL})...")

    model = TextEmbedding(model_name=EMBEDDING_MODEL)
    texts = [c["text"] for c in chunks]
    embeddings = np.array(list(model.embed(texts)), dtype=np.float32)

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    np.save(DATA_DIR / "embeddings.npy", embeddings)
    with open(DATA_DIR / "chunks.json", "w") as f:
        json.dump(chunks, f, indent=2)

    print(f"Saved {embeddings.shape[0]} embeddings (dim={embeddings.shape[1]}) to {DATA_DIR}")


if __name__ == "__main__":
    main()
