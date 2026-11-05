import type { Metadata } from "next";
import Link from "next/link";
import TeamBadges from "@/components/TeamBadges";

export const metadata: Metadata = {
  title: "About",
  description: "Four people in Mumbai who build websites, software and systems, and refuse to use templates.",
};

const PRINCIPLES = [
  ["No templates.", "Not now. Not ever."],
  ["Phone first.", "That’s where your customers are."],
  ["Plain words.", "If we can’t explain it simply, we don’t ship it."],
  ["We stick around.", "Launch day is the start, not the end."],
];

export default function InsaneAbout() {
  return (
    <>
      <section data-chapter="about" className="section page-top fit">
        <p className="label">Who we are</p>
        <h1 className="display">Four people. One studio. Zero templates.</h1>
        <p className="body">A small studio in Mumbai that builds websites, software and systems for businesses that are done putting up with the generic stuff.</p>
      </section>

      <section data-chapter="services" className="section">
        <p className="label">How we work</p>
        <ul className="posters">
          {PRINCIPLES.map(([head, text]) => (
            <li key={head}>
              <h2 className="h3">{head}</h2>
              <p className="voice">{text}</p>
            </li>
          ))}
        </ul>
        <Link className="button spaced" href="/insane/services">What we make <span aria-hidden="true">→</span></Link>
      </section>

      <section id="people" data-chapter="people" className="section">
        <p className="label">The people</p>
        <h2 className="display">Who to blame.</h2>
        <TeamBadges />
      </section>

      <section data-chapter="contact" className="section">
        <p className="label">Say hi</p>
        <h2 className="display">Got a problem? Good.</h2>
        <Link className="button spaced" href="/insane/contact">Tell us about it <span aria-hidden="true">→</span></Link>
      </section>
    </>
  );
}
