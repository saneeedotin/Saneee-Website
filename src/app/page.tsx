import Link from "next/link";
import WorldSwitch from "@/components/WorldSwitch";

const SERVICES = [
  ["Websites", "Business websites, landing pages, portfolios and online stores. Fast on every phone, and looked after once live."],
  ["Custom software", "Web and mobile apps, customer portals, internal tools and dashboards, with the right access for each person."],
  ["Business systems", "CRM and ERP-style systems, inventory, booking, billing and simple reports, so paper and spreadsheets stop running your day."],
  ["AI & automation", "Assistants, automatic reminders and workflows, and help with documents and data, so your people get time back."],
  ["UI/UX & product design", "Research, user flows, wireframes, visual design and design systems for websites, dashboards and products."],
  ["Branding & creative", "Brand identity, logos, graphic design and marketing material that all feel like one business."],
  ["Digital marketing", "Social media, Meta ads, creative content and a plan for how customers find you online."],
];

export default function SaneHome() {
  return (
    <main className="sane">
      <section id="hero" data-chapter="hero" className="hero">
        <nav className="nav" aria-label="Main">
          <Link href="/"><img src="/img/logo.png" alt="saneee.in, home" /></Link>
          <div className="links">
            <a href="#services">Services</a>
            <a href="#contact">Talk to us</a>
            <WorldSwitch />
          </div>
        </nav>
        <p className="lede">Designed to be distinguished.</p>
        <p className="hint">Move your cursor. Press and hold to cross.</p>
        <h1 className="word" style={{ "--ratio": 4.977 } as React.CSSProperties}>SANEEE</h1>
      </section>

      <section id="services" data-chapter="services" className="section">
        <p className="label">01 / Services</p>
        <h2 className="h2-serif">What the studio makes.</h2>
        <ul className="rows">
          {SERVICES.map(([name, text]) => (
            <li key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" data-chapter="contact" className="section dark">
        <p className="label">02 / Contact</p>
        <h2 className="h2">Tell us what you need.</h2>
        <p className="body">Websites, software and systems for businesses that want to work better and grow. Mumbai, India.</p>
        <a className="reach" href="mailto:saneeedotin@gmail.com">saneeedotin@gmail.com</a>
      </section>
    </main>
  );
}
