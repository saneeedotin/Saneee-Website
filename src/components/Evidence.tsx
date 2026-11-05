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
          {projects.map((p, i) => (
            <li key={p.slug} className="exhibit">
              {/* The client's own sign, hung over their shopfront. */}
              <div className="exhibit-sign" style={{ background: p.sign.background, color: p.sign.color }}>
                <Name><Link href={`/insane/work/${p.slug}`}>{p.name} <span aria-hidden="true">→</span></Link></Name>
                <span className="label">{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              </div>
              <Link className="exhibit-shot" href={`/insane/work/${p.slug}`} tabIndex={-1} aria-hidden="true">
                <span className="exhibit-bar"><i /><i /><i /><span>{p.live?.label ?? p.business}</span></span>
                <img src={p.image} alt="" loading="lazy" />
              </Link>
              <div className="exhibit-foot">
                <p className="voice">{p.line}</p>
                {p.live && <a className="exhibit-live" href={p.live.url} target="_blank" rel="noopener">Visit <span aria-hidden="true">↗</span></a>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
