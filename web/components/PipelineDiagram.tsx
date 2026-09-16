const STAGES = [
  { file: "resume.pdf", label: "input" },
  { file: "chunk + embed", label: "index" },
  { file: "retrieve top-k", label: "search" },
  { file: "generate", label: "answer" },
];

function Stage({
  file,
  label,
  delay,
}: {
  file: string;
  label: string;
  delay: number;
}) {
  return (
    <div
      className="pipeline-stage flex shrink-0 flex-col gap-1 rounded-sm border border-line bg-panel px-3 py-2.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="font-mono text-xs text-paper">{file}</span>
      <span className="font-mono text-[10px] text-paper-dim">{label}</span>
    </div>
  );
}

function Connector({ delay }: { delay: number }) {
  return (
    <>
      <div className="relative hidden h-px w-8 shrink-0 bg-line sm:block">
        <div
          className="pipeline-connector-x absolute inset-0 bg-signal"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>
      <div className="relative h-6 w-px shrink-0 self-start bg-line sm:hidden">
        <div
          className="pipeline-connector-y absolute inset-0 bg-signal"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>
    </>
  );
}

export default function PipelineDiagram() {
  return (
    <div
      className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-0"
      role="img"
      aria-label="Diagram: this site's own chatbot pipeline — resume.pdf is chunked and embedded, retrieved by relevance, and used to generate an answer."
    >
      {STAGES.map((stage, i) => (
        <div key={stage.file} className="contents">
          {i > 0 && <Connector delay={i * 220} />}
          <Stage file={stage.file} label={stage.label} delay={i * 220 + 100} />
        </div>
      ))}
    </div>
  );
}
