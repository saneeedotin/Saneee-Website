import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import HeroMorph from "@/components/HeroMorph";
import TheFix from "@/components/TheFix";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { team } from "@/data/team";

export default function SaneHome() {
  return (
    <>
      <HeroMorph />

      <section id="services" data-chapter="services" className="section chapter">
        <p className="label">01 / Services</p>
        <div>
          <h2 className="h-editorial">What the studio makes.</h2>
          <ul className="rows">
            {services.map((s) => (
              <li key={s.name}>
                <h3 className="h4">{s.name}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TheFix />

      <section id="work" data-chapter="work" className="section chapter">
        <p className="label">03 / Work</p>
        <div>
          <h2 className="h-editorial">Businesses that came out sane.</h2>
          <ul className="projects">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`}>
                  <h3 className="h3">{p.name}</h3>
                  <span>{[p.business, p.where].filter(Boolean).join(", ")}</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link className="button-ghost spaced" href="/work">All the work <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section id="people" data-chapter="people" className="section chapter">
        <p className="label">04 / People</p>
        <div>
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
        </div>
      </section>

      <section id="contact" data-chapter="contact" className="section chapter dark">
        <p className="label">05 / Contact</p>
        <div>
          <h2 className="h1 flush">Tell us what you need.</h2>
          <div className="contact">
            <ContactForm />
            <ul className="reach-list">
              <li><span className="label">Email</span><a href="mailto:saneeedotin@gmail.com">saneeedotin@gmail.com</a></li>
              <li><span className="label">Instagram</span><a href="https://www.instagram.com/saneeedotin/" target="_blank" rel="noopener">saneeedotin <span aria-hidden="true">↗</span></a></li>
              <li><span className="label">Where</span>Mumbai, India</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
