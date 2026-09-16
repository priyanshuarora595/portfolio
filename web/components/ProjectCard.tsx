import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-sm border border-line bg-panel p-6 transition hover:border-signal"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-semibold text-paper transition group-hover:text-signal">
          {project.title}
        </h3>
        {project.internal && (
          <span className="shrink-0 whitespace-nowrap font-mono text-[10px] text-paper-dim">
            internal
          </span>
        )}
      </div>
      <p className="flex-1 text-sm text-paper-dim">{project.tagline}</p>
      <p className="mt-4 font-mono text-xs text-wire">{project.tags.join(" · ")}</p>
    </Link>
  );
}
