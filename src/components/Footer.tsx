import Link from "next/link";
import FooterWord from "./FooterWord";
import LocalTime from "./LocalTime";
import { EMAIL } from "./ReachList";
import type { World } from "./portal/world";

const COPY: Record<World, { label: string; ask: string; button: string }> = {
  sane: { label: "Start something", ask: "Tell us what you need.", button: "Talk to us" },
  insane: { label: "Say hi", ask: "Something broken? Good.", button: "Tell us everything" },
};

const SOCIAL = [
  { href: "https://www.instagram.com/saneeedotin/", label: "Instagram" },
  { href: "https://in.pinterest.com/saneeedotin/", label: "Pinterest" },
  { href: "https://www.linkedin.com/search/results/all/?keywords=saneee%20dotin", label: "LinkedIn" },
];

export default function Footer({ world }: { world: World }) {
  const base = world === "sane" ? "" : "/insane";
  const copy = COPY[world];
  const pages = [
    { href: `${base}/about`, label: "About" },
    { href: `${base}/services`, label: "Services" },
    { href: `${base}/work`, label: "Work" },
    { href: `${base}/contact`, label: "Contact" },
  ];

  return (
    <footer className="footer dark">
      <div className="footer-top">
        <div className="footer-ask">
          <p className="label">{copy.label}</p>
          <p className="footer-line">{copy.ask}</p>
          <div className="footer-actions">
            <Link className="button" href={`${base}/contact`}>{copy.button} <span aria-hidden="true">→</span></Link>
            <a className="footer-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a className="footer-top-link" href="#main" aria-label="Back to top"><span aria-hidden="true">↑</span></a>
          </div>
        </div>

        <nav className="footer-cols" aria-label="Footer">
          <div>
            <p className="label">Pages</p>
            <ul>{pages.map((p) => <li key={p.href}><Link href={p.href}>{p.label}</Link></li>)}</ul>
          </div>
          <div>
            <p className="label">Elsewhere</p>
            <ul>{SOCIAL.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener">{s.label} <span aria-hidden="true">↗</span></a></li>)}</ul>
          </div>
          <div>
            <p className="label">Studio</p>
            <ul>
              <li>Mumbai, India</li>
              <li><LocalTime /></li>
              <li><Link href={`${base}/privacy`}>Privacy</Link></li>
              <li className="footer-small">© {new Date().getFullYear()} saneee.in</li>
            </ul>
          </div>
        </nav>
      </div>

      <FooterWord world={world} />
    </footer>
  );
}
