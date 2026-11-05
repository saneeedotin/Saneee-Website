import Link from "next/link";
import { nextProject } from "@/data/projects";
import type { Project } from "@/types";

// shortcut: facts and screenshot only. The problem, build and results aren't written yet, even in the prototype.
export default function InsaneCase({ project }: { project: Project }) {
  const next = nextProject(project.slug);
  return (
    <article id="work" data-chapter="work">
      <header className="case-sign" style={{ background: project.sign.background, color: project.sign.color }}>
        <p className="label"><Link href="/insane/work">The evidence</Link> / {project.business}</p>
        <h1>{project.name}</h1>
        <p className="voice">{project.line}</p>
      </header>
      <div className="section case-body">
        <img className="shot" src={project.image} alt={`${project.name} website`} />
        <dl className="facts">
          <div><dt className="label">Business</dt><dd>{project.business}</dd></div>
          {project.where && <div><dt className="label">Where</dt><dd>{project.where}</dd></div>}
          {project.live && (
            <div>
              <dt className="label">Website</dt>
              <dd><a href={project.live.url} target="_blank" rel="noopener">{project.live.label} <span aria-hidden="true">↗</span></a></dd>
            </div>
          )}
        </dl>
      </div>
      <Link className="case-next" href={`/insane/work/${next.slug}`}>
        <span className="label">Next</span>
        <span className="h1 flush">{next.name} <span aria-hidden="true">→</span></span>
      </Link>
    </article>
  );
}
