import Link from "next/link";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { featuredProjects, moreProjects } from "@/lib/projects";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-6 sm:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <p className="mb-4 mt-14 text-sm text-paper-dim">More projects</p>
      <div className="divide-y divide-line border-t border-line">
        {moreProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="flex flex-col justify-between gap-1 py-4 transition hover:text-signal sm:flex-row sm:items-center sm:gap-4"
          >
            <div>
              <p className="text-sm font-medium text-paper">{project.title}</p>
              <p className="text-sm text-paper-dim">{project.tagline}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-paper-dim">view</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
