"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import WorldSwitch from "./WorldSwitch";
import type { World } from "./portal/world";

const LINKS: Record<World, { href: string; label: string }[]> = {
  sane: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/contact", label: "Contact" },
  ],
  insane: [
    { href: "/insane/about", label: "Who we are" },
    { href: "/insane/services", label: "What we make" },
    { href: "/insane/work", label: "Our work" },
    { href: "/insane/contact", label: "Say hi" },
  ],
};

const OPEN_SECONDS = 0.75;
const CLOSE_SECONDS = 0.45;
const POINTS = 360;

// The hero stage counts as dark until the S's zoom has mostly flooded it with paper.
const overDark = (nav: HTMLElement | null) => {
  if (!nav) return false;
  const edge = nav.offsetHeight;
  const hero = document.querySelector(".morph")?.getBoundingClientRect();
  if (hero && hero.top <= edge && hero.bottom > innerHeight + (hero.height - innerHeight) * 0.1) return true;
  return [...document.querySelectorAll(".dark")].some((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= edge && r.bottom > edge;
  });
};

// Fill, dark rim, faint halo: the same layers as the cursor portal's hole. Values are px beyond the fill.
const LAYERS = [0, 9, 13];

/** A lopsided, slowly shifting blob around the top-right corner, as a CSS clip path. */
const bubble = (radius: number, time: number, wobble: number) => {
  const cx = innerWidth;
  const points = [];
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2;
    // Only a quarter of the blob is on screen, so the bumps have to be tight enough to show in that arc:
    // a few uneven lobes, like the portal's hole, rather than one smooth curve.
    const shape =
      Math.sin(5 * a + time * 0.9) * 0.45 +
      Math.sin(8 * a - time * 1.3 + 1.2) * 0.3 +
      Math.sin(13 * a + time * 0.7 + 2.1) * 0.15 +
      Math.sin(3 * a - time * 0.5) * 0.1;
    const r = radius * (1 + wobble * shape);
    points.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `path('M${points.join("L")}Z')`;
};

export default function Nav({ world }: { world: World }) {
  const menu = useRef<HTMLDialogElement>(null);
  const header = useRef<HTMLElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const anim = useRef({ raf: 0, radius: 0, from: 0, to: 0, start: 0, seconds: 1, closing: false });
  const home = world === "sane" ? "/" : "/insane";

  // Out of the way going down, a solid bar coming back up, so it never sits on top of text.
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      header.current?.classList.toggle("nav-solid", y > 8);
      header.current?.classList.toggle("nav-away", y > last && y > 120);
      header.current?.classList.toggle("nav-on-dark", overDark(header.current));
      // In the hero the tagline takes the logo's place; the logo returns once the tagline has gone.
      header.current?.classList.toggle("nav-hero", !!document.querySelector(".hero") && y < innerHeight * 0.4);
      last = y;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(anim.current.raf);
    };
  }, []);

  const animate = (to: number, seconds: number, done?: () => void) => {
    const a = anim.current;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(a.raf);
    Object.assign(a, { from: a.radius, to, start: performance.now(), seconds: still ? 0 : seconds });
    const frame = (now: number) => {
      const t = a.seconds ? Math.min(1, (now - a.start) / 1000 / a.seconds) : 1;
      const eased = to > a.from ? 1 - Math.pow(1 - t, 4) : t * t;
      a.radius = a.from + (a.to - a.from) * eased;
      // Liquid while it moves, a gentle wobble once it settles.
      const wobble = still ? 0 : 0.1 + 0.08 * (1 - t);
      layers.current.forEach((el, i) => {
        if (el) el.style.clipPath = a.radius > 0 ? bubble(a.radius + LAYERS[i], now / 1000, wobble) : "circle(0 at 100% 0)";
      });
      if (t < 1 || (a.to > 0 && !still)) a.raf = requestAnimationFrame(frame);
      else done?.();
    };
    a.raf = requestAnimationFrame(frame);
  };

  const open = () => {
    const dialog = menu.current!;
    const pill = opener.current!.getBoundingClientRect();
    dialog.showModal();
    // The close pill sits exactly where the menu pill was, so it reads as the same button.
    Object.assign(closer.current!.style, { top: `${pill.top}px`, left: `${pill.left}px`, width: `${pill.width}px` });
    const content = body.current!.getBoundingClientRect();
    // Just big enough to hold the links, allowing for the blob's inward wobble.
    const reach = Math.hypot(innerWidth - content.left + 24, content.bottom + 24) * 1.2;
    anim.current.closing = false;
    dialog.classList.add("menu-in");
    animate(reach, OPEN_SECONDS);
  };

  const close = () => {
    const dialog = menu.current!;
    if (!dialog.open || anim.current.closing) return;
    anim.current.closing = true;
    dialog.classList.remove("menu-in");
    animate(0, CLOSE_SECONDS, () => {
      dialog.close();
      anim.current.closing = false;
    });
  };

  return (
    <>
      <header ref={header} className="nav">
        <Link className="nav-logo" href={home}>
          {/* The Sane nav blends against what's behind it, so it starts from white. */}
          <img src={world === "sane" ? "/img/logo-white.svg" : "/img/logo-black.svg"} alt="saneee.in, home" width={182} height={40} />
        </Link>
        <div className="nav-actions">
          <button ref={opener} className="switch" type="button" aria-haspopup="dialog" onClick={open}>Menu</button>
          <WorldSwitch />
        </div>
      </header>

      <dialog
        ref={menu}
        className="menu"
        aria-label="Menu"
        data-lenis-prevent
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div ref={(el) => { layers.current[2] = el; }} className="menu-halo" aria-hidden="true" />
        <div ref={(el) => { layers.current[1] = el; }} className="menu-rim" aria-hidden="true" />
        <div ref={(el) => { layers.current[0] = el; }} className="menu-bubble">
          <button ref={closer} className="switch menu-close" type="button" onClick={close}>Close</button>
          <div ref={body} className="menu-body">
            <nav aria-label="Menu">
              {LINKS[world].map((l, i) => (
                <Link key={l.href} href={l.href} style={{ "--i": i } as React.CSSProperties} onClick={close}>{l.label}</Link>
              ))}
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
