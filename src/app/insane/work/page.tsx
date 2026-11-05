import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Work" };

// shortcut: plain cards until the shutter street arrives in Milestone 4.
export default function InsaneWork() {
  return (
    <section id="work" data-chapter="work" className="section page-top">
      <p className="label">The street</p>
      <h1 className="h1">Came in mad. Left sane.</h1>
      <ul className="posters">
        {projects.map((p) => (
          <li key={p.slug}>
            <h2 className="h3"><Link href={`/insane/work/${p.slug}`}>{p.name}</Link></h2>
            <p className="voice">{p.spray}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
