import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Work" };

export default function SaneWork() {
  return (
    <section id="work" data-chapter="work" className="section page-top">
      <p className="label">Work</p>
      <h1 className="h1">Businesses that came out sane.</h1>
      <ul className="rows">
        {projects.map((p) => (
          <li key={p.slug}>
            <h2 className="h3"><Link href={`/work/${p.slug}`}>{p.name}</Link></h2>
            <p>{[p.business, p.where].filter(Boolean).join(", ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
