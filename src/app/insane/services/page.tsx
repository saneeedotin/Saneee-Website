import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "We make",
  description: "Seven things saneee.in makes, done properly: websites, software, systems, automation, design, branding and marketing.",
};

export default function InsaneServices() {
  return (
    <>
      <section id="services" data-chapter="services" className="section page-top">
        <p className="label">We make</p>
        <h1 className="display">Seven things, done properly.</h1>
        <ul className="posters">
          {services.map((s) => (
            <li key={s.name}>
              <h2 className="h3">{s.name}</h2>
              <div>
                <p className="voice">{s.voice}</p>
                <p className="poster-text">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section data-chapter="contact" className="section">
        <p className="label">Say hi</p>
        <h2 className="display">Can&rsquo;t pick? We&rsquo;ll pick with you.</h2>
        <Link className="button spaced" href="/insane/contact">Tell us what&rsquo;s broken <span aria-hidden="true">→</span></Link>
      </section>
    </>
  );
}
