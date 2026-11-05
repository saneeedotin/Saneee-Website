import Link from "next/link";
import { nextProject } from "@/data/projects";
import type { Project } from "@/types";
import ClientMark from "./ClientMark";

export default function InsaneCase({ project }: { project: Project }) {
  const next = nextProject(project.slug);
  const { brief, approach, built } = project.story;
  return (
    <article id="work" data-chapter="work">
      <header className="case-sign">
        <p className="label"><Link href="/insane/work">The evidence</Link> / {project.business}</p>
        <ClientMark project={project} className="case-mark" />
        <h1>{project.name}</h1>
        <p className="voice">{project.line}</p>
        {project.live && <a className="button" href={project.live.url} target="_blank" rel="noopener">Go see it live <span aria-hidden="true">↗</span></a>}
      </header>

      <ul className="posters case-posters">
        <li><p className="label">The problem</p><p className="voice">{brief}</p></li>
        <li><p className="label">The thinking</p><p className="voice">{approach}</p></li>
        <li><p className="label">What we built</p><ul className="case-built">{built.map((b) => <li key={b} className="h4">{b}</li>)}</ul></li>
      </ul>

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
