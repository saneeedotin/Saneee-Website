import Link from "next/link";
import { nextProject } from "@/data/projects";
import type { Project } from "@/types";
import type { World } from "./portal/world";

// shortcut: facts and screenshot only. The problem, build and results aren't written yet, even in the prototype.
export default function CaseStudy({ project, world }: { project: Project; world: World }) {
  const base = world === "sane" ? "/work" : "/insane/work";
  const next = nextProject(project.slug);
  return (
    <article id="work" data-chapter="work" className="section page-top">
      <p className="label"><Link href={base}>Work</Link> / {project.business}</p>
      <h1 className="h1">{project.name}</h1>
      {world === "insane" && <p className="voice lead">{project.spray}</p>}
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
      <Link className="next" href={`${base}/${next.slug}`}>
        <span className="label">Next</span>
        <span className="h2">{next.name} <span aria-hidden="true">→</span></span>
      </Link>
    </article>
  );
}
