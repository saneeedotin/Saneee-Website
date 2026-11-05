import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Websites, custom software, business systems, AI and automation, UI/UX, branding and digital marketing, from saneee.in in Mumbai.",
};

export default function SaneServices() {
  return (
    <>
      <section id="services" data-chapter="services" className="section page-top chapter">
        <p className="label">Services</p>
        <div>
          <h1 className="h-editorial">What the studio makes.</h1>
          <ol className="service-list">
            {services.map((s, i) => (
              <li key={s.name}>
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="h3">{s.name}</h2>
                <p className="voice">{s.voice}</p>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-chapter="contact" className="section chapter dark">
        <p className="label">Next</p>
        <div>
          <h2 className="h1 flush">Not sure which one you need?</h2>
          <p className="body">Tell us what is slowing you down. We will tell you what would help, in plain words.</p>
          <Link className="button spaced" href="/contact">Talk to us <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}
