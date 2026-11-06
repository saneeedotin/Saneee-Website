import Link from "next/link";
import { nextProject } from "@/data/projects";
import type { Project } from "@/types";
import ClientMark from "./ClientMark";
import ProjectFacts from "./ProjectFacts";

export default function CaseStudy({ project }: { project: Project }) {
  const next = nextProject(project.slug);
  const { brief, approach, built } = project.story;
  return (
    <article id="work" data-chapter="work" className="section page-top">
      <p className="label"><Link href="/work">Work</Link> / {project.business}</p>
      {/* The mark already says who it is, so the name sits small among the facts. */}
      <ClientMark project={project} className="case-mark" />
      <ProjectFacts project={project} named />

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
