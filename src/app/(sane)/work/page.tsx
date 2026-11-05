import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Work" };

export default function SaneWork() {
  return (
    <section id="work" data-chapter="work" className="section page-top">
      <p className="label">Work</p>
      <h1 className="h-editorial">Businesses that came out sane.</h1>
      <ul className="work-grid">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`}>
              <img src={p.image} alt="" loading="lazy" />
              <h2 className="h3">{p.name}</h2>
              <p>{[p.business, p.where].filter(Boolean).join(", ")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
