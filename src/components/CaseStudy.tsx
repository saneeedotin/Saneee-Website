import Link from "next/link";
import { nextProject } from "@/data/projects";
import type { Project } from "@/types";
import ClientMark from "./ClientMark";

export default function CaseStudy({ project }: { project: Project }) {
  const next = nextProject(project.slug);
  const { brief, approach, built } = project.story;
  return (
    <article id="work" data-chapter="work" className="section page-top">
      <p className="label"><Link href="/work">Work</Link> / {project.business}</p>
      <ClientMark project={project} className="case-mark" />
      <h1 className="h1">{project.name}</h1>
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

      <div className="case-story">
        <section className="chapter"><h2 className="label">The brief</h2><p className="lead flush">{brief}</p></section>
        <section className="chapter"><h2 className="label">The thinking</h2><p className="lead flush">{approach}</p></section>
        <section className="chapter">
          <h2 className="label">What we built</h2>
          <ul className="rows flush">{built.map((b) => <li key={b}><p className="h4">{b}</p></li>)}</ul>
        </section>
      </div>

      <img className="shot" src={project.image} alt={`${project.name} website`} />
      {project.live && <a className="button spaced" href={project.live.url} target="_blank" rel="noopener">Visit {project.live.label} <span aria-hidden="true">↗</span></a>}

      <Link className="next" href={`/work/${next.slug}`}>
        <span className="label">Next</span>
        <span className="h2">{next.name} <span aria-hidden="true">→</span></span>
      </Link>
    </article>
  );
}
