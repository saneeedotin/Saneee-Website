import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import HeroMorph from "@/components/HeroMorph";
import ReachList from "@/components/ReachList";
import TeamBadges from "@/components/TeamBadges";
import TheFix from "@/components/TheFix";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

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
          <Link className="button-ghost spaced" href="/services">What each one includes <span aria-hidden="true">→</span></Link>
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

      <section id="people" data-chapter="people" className="section">
        <div className="chapter">
          <p className="label">04 / People</p>
          <h2 className="h-editorial">The four people holding it together.</h2>
        </div>
        <TeamBadges />
        <Link className="button-ghost spaced" href="/about">More about us <span aria-hidden="true">→</span></Link>
      </section>

      <section id="contact" data-chapter="contact" className="section chapter dark">
        <p className="label">05 / Contact</p>
        <div>
          <h2 className="h1 flush">Tell us what you need.</h2>
          <div className="contact">
            <ContactForm />
            <ReachList />
          </div>
        </div>
      </section>
    </>
  );
}
