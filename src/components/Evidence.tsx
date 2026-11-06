import Link from "next/link";
import { projects } from "@/data/projects";
import ClientMark from "./ClientMark";

export default function Evidence({ heading: Heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Name = Heading === "h1" ? "h2" : "h3";
  return (
    <section id="work" data-chapter="work" className="section evidence">
      <p className="label">The work</p>
      <Heading className="display">The evidence.</Heading>
      <ul className="marks">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/insane/work/${p.slug}`} target="_blank">
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <ClientMark project={p} />
              <span className="marks-foot">
                <Name className="h4">{p.name}</Name>
                <span className="voice">{p.line}</span>
                <span className="marks-arrow" aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
