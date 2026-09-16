import Image from "next/image";
import { profile } from "@/lib/site-data";
import PipelineDiagram from "@/components/PipelineDiagram";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
        <div className="order-2 flex flex-col justify-center sm:order-1">
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-paper sm:text-7xl">
            Priyanshu
            <br />
            Arora
          </h1>
          <p className="mt-4 text-lg text-paper-dim">{profile.title}</p>
          <p className="mt-6 max-w-md text-balance text-paper-dim">{profile.tagline}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-sm bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink transition hover:brightness-110"
            >
              View work
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-sm border border-line px-5 py-2.5 text-sm text-paper transition hover:border-signal hover:text-signal"
            >
              Email me
            </a>
          </div>

          <div className="mt-10 flex gap-5 text-sm text-paper-dim">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-paper">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-paper">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="order-1 sm:order-2">
          <div
            className="relative h-72 w-full overflow-hidden sm:h-full sm:min-h-[26rem]"
            style={{ clipPath: "polygon(7% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          >
            <Image
              src="/profile.jpg"
              alt="Priyanshu Arora"
              fill
              sizes="(min-width: 640px) 45vw, 100vw"
              priority
              className="object-cover object-[center_2%]"
            />
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-6 sm:mt-20">
        <p className="mb-4 text-sm text-paper-dim">
          This site&apos;s own chat below runs this exact pipeline:
        </p>
        <PipelineDiagram />
      </div>
    </section>
  );
}
