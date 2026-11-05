import Link from "next/link";
import type { World } from "./portal/world";

export default function Footer({ world }: { world: World }) {
  const home = world === "sane" ? "/" : "/insane";
  return (
    <footer className="footer">
      <Link href={home}>
        <img src={world === "sane" ? "/img/logo-white.svg" : "/img/logo-black.svg"} alt="saneee.in, home" width={182} height={40} />
      </Link>
      <a href="mailto:saneeedotin@gmail.com">saneeedotin@gmail.com</a>
      <a href="https://www.instagram.com/saneeedotin/" target="_blank" rel="noopener">Instagram</a>
      <a href="https://www.linkedin.com/search/results/all/?keywords=saneee%20dotin" target="_blank" rel="noopener">LinkedIn</a>
      <span>Mumbai, India</span>
    </footer>
  );
}
