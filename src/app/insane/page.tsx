import Link from "next/link";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { team } from "@/data/team";

// shortcut: placeholder voice taken from the prototype, real Insane copy comes with Milestone 4.
export default function InsaneHome() {
  return (
    <>
      <section id="hero" data-chapter="hero" className="hero">
        <p className="lede">Sanely built. Insanely good.</p>
        <p className="hint">Hold on. The sane one is right behind this.</p>
        <h1 className="word" style={{ "--ratio": 4.492 } as React.CSSProperties}>INSANE</h1>
      </section>

      <section id="services" data-chapter="services" className="section">
        <p className="label">We make</p>
        <h2 className="h1">Seven things, done properly.</h2>
        <ul className="posters">
          {services.map((s) => (
            <li key={s.name}>
              <h3 className="h3">{s.name}</h3>
              <p className="voice">{s.voice}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="work" data-chapter="work" className="section">
        <p className="label">The street</p>
        <h2 className="h1">Came in mad. Left sane.</h2>
        <ul className="posters">
          {projects.map((p) => (
            <li key={p.slug}>
              <h3 className="h3"><Link href={`/insane/work/${p.slug}`}>{p.name}</Link></h3>
              <p className="voice">{p.spray}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="people" data-chapter="people" className="section">
        <p className="label">The suspects</p>
        <h2 className="h1">Four people. One brain cell, shared carefully.</h2>
        <ul className="posters">
          {team.map((p) => (
            <li key={p.name}>
              <h3 className="h3">{p.name}</h3>
              <p className="voice">{p.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" data-chapter="contact" className="section">
        <p className="label">Say hi</p>
        <h2 className="h-editorial">We read everything. Even the long ones.</h2>
        <a className="reach" href="mailto:saneeedotin@gmail.com">saneeedotin@gmail.com</a>
      </section>
    </>
  );
}
