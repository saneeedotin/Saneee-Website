import Link from "next/link";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { team } from "@/data/team";

export default function SaneHome() {
  return (
    <>
      <section id="hero" data-chapter="hero" className="hero">
        <p className="lede">Designed to be distinguished.</p>
        <p className="hint">Move your cursor. Press and hold to cross.</p>
        <h1 className="word" style={{ "--ratio": 4.977 } as React.CSSProperties}>SANEEE</h1>
      </section>

      <section id="services" data-chapter="services" className="section">
        <p className="label">01 / Services</p>
        <h2 className="h-editorial">What the studio makes.</h2>
        <ul className="rows">
          {services.map((s) => (
            <li key={s.name}>
              <h3 className="h3">{s.name}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="work" data-chapter="work" className="section">
        <p className="label">02 / Work</p>
        <h2 className="h-editorial">Businesses that came out sane.</h2>
        <ul className="rows">
          {projects.map((p) => (
            <li key={p.slug}>
              <h3 className="h3"><Link href={`/work/${p.slug}`}>{p.name}</Link></h3>
              <p>{[p.business, p.where].filter(Boolean).join(", ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="people" data-chapter="people" className="section">
        <p className="label">03 / People</p>
        <h2 className="h-editorial">The four people holding it together.</h2>
        <ul className="people">
          {team.map((p) => (
            <li key={p.name}>
              <img src={p.image} alt={`Portrait of ${p.name}`} loading="lazy" />
              <h3 className="h4">{p.name}</h3>
              <p className="label">{p.role}</p>
              <p>{p.bio}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" data-chapter="contact" className="section dark">
        <p className="label">04 / Contact</p>
        <h2 className="h1">Tell us what you need.</h2>
        <p className="body">Websites, software and systems for businesses that want to work better and grow. Mumbai, India.</p>
        <a className="reach" href="mailto:saneeedotin@gmail.com">saneeedotin@gmail.com</a>
      </section>
    </>
  );
}
