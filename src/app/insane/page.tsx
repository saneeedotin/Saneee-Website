import ContactForm from "@/components/ContactForm";
import Evidence from "@/components/Evidence";
import TeamBadges from "@/components/TeamBadges";
import { services } from "@/data/services";

// From the brand's own manifesto lines in logo/design.md.
const BELIEFS = [
  ["We don’t do templates.", "We never will."],
  ["Your business isn’t generic.", "Your website shouldn’t be either."],
  ["Your website is your first impression.", "There’s no second chance for it."],
];

export default function InsaneHome() {
  return (
    <>
      <section id="hero" data-chapter="hero" className="hero">
        <p className="lede">Sanely built. Insanely good.</p>
        <h1 className="word" style={{ "--ratio": 4.492 } as React.CSSProperties}>INSANE</h1>
      </section>

      <section data-chapter="services" className="beliefs" aria-label="What we believe">
        {BELIEFS.map(([loud, quiet]) => (
          <div key={loud} className="belief">
            <p className="display">{loud}</p>
            <p className="voice">{quiet}</p>
          </div>
        ))}
      </section>

      <section id="services" data-chapter="services" className="section">
        <p className="label">We make</p>
        <h2 className="display">Seven things, done properly.</h2>
        <ul className="posters">
          {services.map((s) => (
            <li key={s.name}>
              <h3 className="h3">{s.name}</h3>
              <p className="voice">{s.voice}</p>
            </li>
          ))}
        </ul>
      </section>

      <Evidence />

      <section id="people" data-chapter="people" className="section">
        <p className="label">The people</p>
        <h2 className="display">Who to blame.</h2>
        <TeamBadges />
      </section>

      <section id="contact" data-chapter="contact" className="section">
        <p className="label">Say hi</p>
        <h2 className="display">We read everything. Even the long ones.</h2>
        <div className="contact">
          <ContactForm />
          <ul className="reach-list">
            <li><span className="label">Email</span><a href="mailto:saneeedotin@gmail.com">saneeedotin@gmail.com</a></li>
            <li><span className="label">Instagram</span><a href="https://www.instagram.com/saneeedotin/" target="_blank" rel="noopener">saneeedotin <span aria-hidden="true">↗</span></a></li>
            <li><span className="label">Where</span>Mumbai, India</li>
          </ul>
        </div>
      </section>
    </>
  );
}
