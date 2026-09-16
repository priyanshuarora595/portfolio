import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "..", "content", "projects");

export function getProjectMarkdown(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  // Strip the leading H1 — the page renders its own title from project metadata.
  return raw.replace(/^#\s+.+\n+/, "");
}
