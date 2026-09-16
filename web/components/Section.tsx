import type { ReactNode } from "react";

export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-10 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
