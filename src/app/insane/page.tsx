import Link from "next/link";
import WorldSwitch from "@/components/WorldSwitch";

// Placeholder voice for the proof. Real Insane copy comes with Milestone 4.
const SERVICES = [
  ["Websites", "Your shopfront, open all night."],
  ["Custom software", "Built around how you already work."],
  ["Business systems", "Bookings, customers and bills, in one place."],
  ["AI & automation", "Stop doing the same job twice."],
  ["UI/UX & product design", "Easy to use on the first try."],
  ["Branding & creative", "Look like the business you actually are."],
  ["Digital marketing", "Get seen by the right people."],
];

export default function InsaneHome() {
  return (
    <main className="insane">
      <section id="hero" data-chapter="hero" className="hero">
        <nav className="nav" aria-label="Main">
          <Link href="/insane"><img src="/img/logo.png" alt="saneee.in, home" /></Link>
          <div className="links">
            <a href="#services">We make</a>
            <a href="#contact">Say hi</a>
            <WorldSwitch />
          </div>
        </nav>
        <p className="lede">Sanely built. Insanely good.</p>
        <p className="hint">Hold on. The sane one is right behind this.</p>
        <h1 className="word" style={{ "--ratio": 4.492 } as React.CSSProperties}>INSANE</h1>
      </section>

      <section id="services" data-chapter="services" className="section">
        <p className="label">We make</p>
        <h2 className="h2">Seven things, done properly.</h2>
        <ul className="posters">
          {SERVICES.map(([name, voice]) => (
            <li key={name}>
              <h3>{name}</h3>
              <p>{voice}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" data-chapter="contact" className="section">
        <p className="label">Say hi</p>
        <h2 className="h2-serif">We read everything. Even the long ones.</h2>
        <a className="reach" href="mailto:saneeedotin@gmail.com">saneeedotin@gmail.com</a>
      </section>
    </main>
  );
}
