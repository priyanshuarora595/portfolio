"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { profile } from "@/lib/site-data";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; source: string }[];
  error?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const SUGGESTIONS = [
  "What has Priyanshu built with AWS Lambda?",
  "Tell me about the PHI tokenization pipeline",
  "What AI/RAG projects has he worked on?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const detail = res.status === 429 ? await res.json().catch(() => null) : null;
        throw new Error(detail?.detail || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Something went wrong reaching the assistant. Feel free to email Priyanshu directly at ${profile.email}.`,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-sm border border-line bg-panel shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm text-paper">Ask about Priyanshu</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-paper-dim hover:text-paper"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-paper-dim">
                  Ask anything about Priyanshu&apos;s experience, skills, or projects — answers
                  are retrieved from his resume and project write-ups, the same pipeline shown
                  above.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-sm border border-line px-3 py-2 text-left text-xs text-paper-dim transition hover:border-signal hover:text-signal"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[90%] rounded-sm px-3 py-2 text-left text-sm ${
                    m.role === "user"
                      ? "bg-signal text-signal-ink"
                      : m.error
                        ? "border border-line text-paper-dim"
                        : "border border-line text-paper"
                  }`}
                >
                  {m.content}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <p className="mt-1 font-mono text-[10px] text-paper-dim">
                    sources: {m.sources.map((s) => s.title).join(", ")}
                  </p>
                )}
              </div>
            ))}

            {loading && <p className="text-xs text-paper-dim">Thinking…</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={500}
              className="flex-1 rounded-sm border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-sm bg-signal px-3 py-2 text-xs font-medium text-signal-ink disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-signal-ink shadow-lg transition hover:brightness-110"
      >
        {open ? (
          <span className="text-lg">✕</span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 5h16v11H8l-4 4V5z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
