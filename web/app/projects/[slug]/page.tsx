import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TokenizationDemo from "@/components/TokenizationDemo";
import { getProject, projects } from "@/lib/projects";
import { getProjectMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  const markdown = getProjectMarkdown(slug);

  if (!project || !markdown) notFound();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <Link href="/#projects" className="text-sm text-signal hover:underline">
            ← Back to projects
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
              {project.title}
            </h1>
            {project.internal && (
              <span className="rounded-sm border border-line px-2 py-0.5 font-mono text-[10px] text-paper-dim">
                internal / not public
              </span>
            )}
          </div>

          <p className="mt-4 font-mono text-xs text-wire">{project.tags.join(" · ")}</p>

          {project.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-signal hover:underline"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}

          <div className="prose-portfolio prose prose-invert mt-10 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>

          {slug === "phi-tokenization-pipeline" && <TokenizationDemo />}
        </article>
      </main>
      <Footer />
    </>
  );
}
