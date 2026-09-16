import Section from "@/components/Section";
import { skills, certifications } from "@/lib/site-data";

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="rounded-sm border border-line bg-panel">
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
          <span className="font-mono text-xs text-paper-dim">skills.yaml</span>
        </div>
        <div className="divide-y divide-line">
          {skills.map((group) => (
            <div
              key={group.category}
              className="grid gap-1 px-4 py-3 sm:grid-cols-4 sm:gap-4 sm:py-3.5"
            >
              <p className="font-mono text-xs text-wire sm:col-span-1">{slugify(group.category)}:</p>
              <p className="text-sm text-paper-dim sm:col-span-3">{group.items.join(" · ")}</p>
            </div>
          ))}
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-4 sm:gap-4 sm:py-3.5">
            <p className="font-mono text-xs text-wire sm:col-span-1">certifications:</p>
            <p className="text-sm text-paper-dim sm:col-span-3">{certifications.join(" · ")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
