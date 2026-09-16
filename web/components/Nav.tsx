import Link from "next/link";
import { profile } from "@/lib/site-data";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-paper">
          Priyanshu Arora
        </Link>
        <nav className="hidden gap-7 text-sm text-paper-dim sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-paper">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-line px-3 py-1.5 text-sm text-paper transition hover:border-signal hover:text-signal"
        >
          Résumé
        </a>
      </div>
    </header>
  );
}
