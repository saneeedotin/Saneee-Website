import Link from "next/link";
import { nextProject } from "@/data/projects";
import type { Project } from "@/types";

// shortcut: facts and screenshot only. The problem, build and results aren't written yet, even in the prototype.
export default function CaseStudy({ project }: { project: Project }) {
  const next = nextProject(project.slug);
  return (
    <article id="work" data-chapter="work" className="section page-top">
      <p className="label"><Link href="/work">Work</Link> / {project.business}</p>
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
      <img className="shot" src={project.image} alt={`${project.name} website`} />
      <Link className="next" href={`/work/${next.slug}`}>
        <span className="label">Next</span>
        <span className="h2">{next.name} <span aria-hidden="true">→</span></span>
      </Link>
    </article>
  );
}
