"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { otherPath, type World } from "./portal/world";

// saneee.in, flipped, is in.saneee: say it aloud. Each world shows its own order; hover swaps them over.
const HALVES: Record<World, [string, string]> = { sane: ["saneee", "in"], insane: ["in", "saneee"] };

/** The studio's name across the full width, as a door to the other world. */
export default function FooterWord({ world }: { world: World }) {
  const pathname = usePathname();
  const link = useRef<HTMLAnchorElement>(null);
  const [first, second] = HALVES[world];

  // The word is sized to fill the footer exactly, and the halves need their widths to trade places.
  useEffect(() => {
    const el = link.current!;
    const fit = () => {
      el.style.fontSize = "100px";
      const [a, dot, b] = [...el.children].map((c) => (c as HTMLElement).getBoundingClientRect().width);
      const box = el.parentElement!;
      const pad = parseFloat(getComputedStyle(box).paddingLeft) * 2;
      const size = (100 * (box.clientWidth - pad)) / (a + dot + b);
      const k = size / 100;
      el.style.fontSize = `${size}px`;
      el.style.setProperty("--to-b", `${(b + dot) * k}px`);
      el.style.setProperty("--to-a", `${-(a + dot) * k}px`);
      el.style.setProperty("--to-dot", `${(b - a) * k}px`);
    };
    document.fonts.ready.then(fit);
    const watch = new ResizeObserver(fit);
    watch.observe(el.parentElement!);
    return () => watch.disconnect();
  }, [world]);

  return (
    <div className="footer-word">
      <Link ref={link} className="fw" href={otherPath(pathname)} aria-label={world === "sane" ? "Go insane" : "Go sane"}>
        <span className="fw-a" aria-hidden="true">{first}</span>
        <span className="fw-dot" aria-hidden="true">.</span>
        <span className="fw-b" aria-hidden="true">{second}</span>
      </Link>
    </div>
  );
}
