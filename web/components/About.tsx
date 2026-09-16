import Section from "@/components/Section";
import { profile, education } from "@/lib/site-data";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-10 sm:grid-cols-3">
        <p className="text-paper-dim sm:col-span-2">{profile.summary}</p>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.school} className="border-l-2 border-line pl-4">
              <p className="font-mono text-xs text-signal">{edu.period}</p>
              <p className="text-sm font-medium text-paper">{edu.school}</p>
              <p className="text-sm text-paper-dim">{edu.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
