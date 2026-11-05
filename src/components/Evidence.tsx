import Link from "next/link";
import { projects } from "@/data/projects";

export default function Evidence({ heading: Heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Name = Heading === "h1" ? "h2" : "h3";
  return (
    <section id="work" data-chapter="work" className="evidence">
      <div className="evidence-stage">
        <p className="label">The work</p>
        <Heading className="display">The evidence.</Heading>
        <ul className="evidence-track">
          {projects.map((p) => (
            <li key={p.slug} className="exhibit">
              <Link className="exhibit-shot" href={`/insane/work/${p.slug}`} tabIndex={-1} aria-hidden="true">
                <img src={p.image} alt="" loading="lazy" />
              </Link>
              <div className="exhibit-sign" style={{ background: p.sign.background, color: p.sign.color }}>
                <Name><Link href={`/insane/work/${p.slug}`}>{p.name} <span aria-hidden="true">→</span></Link></Name>
              </div>
              <p className="voice">{p.line}</p>
              {p.live && <a className="exhibit-live" href={p.live.url} target="_blank" rel="noopener">{p.live.label} <span aria-hidden="true">↗</span></a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
