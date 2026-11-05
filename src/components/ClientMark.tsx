import type { Project } from "@/types";

/** The client's logo in the current text colour, so it always sits in the site's two colours. */
export default function ClientMark({ project, className }: { project: Project; className?: string }) {
  if (!project.logo) return <span className={`client-mark client-word ${className ?? ""}`}>{project.name}</span>;
  return (
    <span
      role="img"
      aria-label={`${project.name} logo`}
      className={`client-mark ${className ?? ""}`}
      style={{ maskImage: `url(${project.logo})`, WebkitMaskImage: `url(${project.logo})` } as React.CSSProperties}
    />
  );
}
