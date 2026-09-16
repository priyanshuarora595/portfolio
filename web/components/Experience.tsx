import Section from "@/components/Section";
import { experience } from "@/lib/site-data";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="relative space-y-12 border-l border-line pl-8">
        {experience.map((job, i) => (
          <div key={job.company} className="relative grid gap-2 sm:grid-cols-4 sm:gap-6">
            <span
              className={`absolute -left-8 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${
                i === 0 ? "bg-signal" : "border border-paper-dim bg-ink"
              }`}
              aria-hidden
            />
            <div className="sm:col-span-1">
              <p className="font-mono text-xs text-signal">{job.period}</p>
              <p className="mt-1 text-sm text-paper-dim">{job.location}</p>
            </div>
            <div className="sm:col-span-3">
              <h3 className="text-base font-semibold text-paper">
                {job.role} <span className="text-paper-dim">· {job.company}</span>
              </h3>
              <ul className="mt-3 space-y-2">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-sm text-paper-dim">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
