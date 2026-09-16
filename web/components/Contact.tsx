import Section from "@/components/Section";
import { profile } from "@/lib/site-data";

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="max-w-xl text-paper-dim">
        Have a role, project, or question in mind? My inbox is open — I try to reply within a
        day or two.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-sm bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink transition hover:brightness-110"
        >
          {profile.email}
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-line px-5 py-2.5 text-sm text-paper transition hover:border-signal hover:text-signal"
        >
          LinkedIn
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-line px-5 py-2.5 text-sm text-paper transition hover:border-signal hover:text-signal"
        >
          GitHub
        </a>
      </div>
    </Section>
  );
}
