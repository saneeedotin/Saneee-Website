import type { Project } from "@/types";

/** The short facts a would-be client looks for. With `named`, the client's name leads, as the page's h1. */
export default function ProjectFacts({ project, named = false }: { project: Project; named?: boolean }) {
  const rows: [string, React.ReactNode][] = [
    ["Business", project.business],
    ["Where", project.where],
    ["Services", project.services?.join(", ")],
    ["Delivered", project.delivered],
    ["Timeline", project.timeline],
  ];
  return (
    <dl className="facts">
      {named && <div><dt className="label">Client</dt><dd><h1 className="case-client">{project.name}</h1></dd></div>}
      {rows.filter(([, value]) => value).map(([label, value]) => (
        <div key={label}><dt className="label">{label}</dt><dd>{value}</dd></div>
      ))}
      {project.live && (
        <div>
          <dt className="label">Website</dt>
          <dd><a href={project.live.url} target="_blank" rel="noopener">{project.live.label} <span aria-hidden="true">↗</span></a></dd>
        </div>
      )}
    </dl>
  );
}
