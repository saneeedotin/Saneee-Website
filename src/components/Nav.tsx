"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import WorldSwitch from "./WorldSwitch";
import type { World } from "./portal/world";

const LINKS: Record<World, { href: string; label: string }[]> = {
  sane: [
    { href: "/#services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/#people", label: "People" },
    { href: "/#contact", label: "Talk to us" },
  ],
  insane: [
    { href: "/insane#services", label: "We make" },
    { href: "/insane/work", label: "Work" },
    { href: "/insane#people", label: "People" },
    { href: "/insane#contact", label: "Say hi" },
  ],
};

export default function Nav({ world }: { world: World }) {
  const menu = useRef<HTMLDialogElement>(null);
  const header = useRef<HTMLElement>(null);
  const home = world === "sane" ? "/" : "/insane";

  // Out of the way going down, a solid bar coming back up, so it never sits on top of text.
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      header.current?.classList.toggle("nav-solid", y > 8);
      header.current?.classList.toggle("nav-away", y > last && y > 120);
      last = y;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header ref={header} className="nav">
        <Link className="nav-logo" href={home}>
          {/* The Sane nav blends against what's behind it, so it starts from white. */}
          <img src={world === "sane" ? "/img/logo-white.svg" : "/img/logo-black.svg"} alt="saneee.in, home" width={182} height={40} />
        </Link>
        <nav className="nav-links" aria-label="Main">
          {LINKS[world].map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
        <div className="nav-actions">
          <WorldSwitch />
          <button className="nav-menu" type="button" onClick={() => menu.current?.showModal()}>Menu</button>
        </div>
      </header>

      <dialog ref={menu} className="menu" aria-label="Menu">
        <button className="menu-close" type="button" onClick={() => menu.current?.close()}>Close</button>
        <nav aria-label="Menu">
          {LINKS[world].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => menu.current?.close()}>{l.label}</Link>
          ))}
        </nav>
      </dialog>
    </>
  );
}
