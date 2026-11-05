import type { Metadata } from "next";
import Link from "next/link";
import TeamBadges from "@/components/TeamBadges";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "About",
  description: "saneee.in is a four-person studio in Mumbai that designs and builds websites, software and business systems.",
};

const PRINCIPLES = [
  ["No templates.", "Everything is designed around how your business actually works."],
  ["Fast on every phone.", "Most of your customers will meet you on a phone, so that is where we start."],
  ["Plain words.", "You will always know what we are building, and why."],
  ["Looked after.", "We stay with the work once it is live, not just until launch."],
];

export default function SaneAbout() {
  return (
    <>
      <section data-chapter="about" className="section page-top fit chapter">
        <p className="label">About</p>
        <div>
          <h1 className="h-editorial">A small studio for businesses that want to work better.</h1>
          <p className="body">saneee.in is four people in Mumbai. We design and build websites, custom software and business systems, so paper, phone calls and scattered spreadsheets stop running your day.</p>
        </div>
      </section>

      <section data-chapter="services" className="section chapter">
        <p className="label">What we do</p>
        <div>
          <h2 className="h-editorial">Seven things, done properly.</h2>
          <ul className="rows">
            {services.map((s) => (
              <li key={s.name}>
                <h3 className="h4">{s.name}</h3>
                <p>{s.voice}</p>
              </li>
            ))}
          </ul>
          <Link className="button-ghost spaced" href="/services">What each one includes <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section data-chapter="about" className="section chapter">
        <p className="label">How we work</p>
        <ul className="rows flush">
          {PRINCIPLES.map(([head, text]) => (
            <li key={head}>
              <h3 className="h4">{head}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="people" data-chapter="people" className="section">
        <div className="chapter">
          <p className="label">Who we are</p>
          <h2 className="h-editorial">The four people holding it together.</h2>
        </div>
        <TeamBadges />
      </section>

      <section data-chapter="contact" className="section chapter dark">
        <p className="label">Next</p>
        <div>
          <h2 className="h1 flush">Tell us what you need.</h2>
          <Link className="button spaced" href="/contact">Talk to us <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}
