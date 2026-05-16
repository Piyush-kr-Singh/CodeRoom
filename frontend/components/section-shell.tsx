import type { PropsWithChildren } from "react";

type SectionShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description: string;
}>;

export function SectionShell({ eyebrow, title, description, children }: SectionShellProps) {
  return (
    <section className="container-shell py-16 sm:py-24">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">{eyebrow}</p>
        ) : null}
        <h2 className="section-title">{title}</h2>
        <p className="body-copy mt-5">{description}</p>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
