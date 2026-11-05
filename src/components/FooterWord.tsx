"use client";

import gsap from "gsap";
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

  useEffect(() => {
    const el = link.current!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lettersOf = (half: string) => [...el.querySelectorAll<HTMLElement>(`[data-half="${half}"]`)];
    const a = lettersOf("a");
    const b = lettersOf("b");
    const dot = el.querySelector<HTMLElement>(".fw-dot")!;
    // How far each piece travels to spell the other order: [b][.][a] instead of [a][.][b].
    let shift = { a: 0, b: 0, dot: 0 };
    let swapped = false;
    let tl: gsap.core.Timeline | null = null;

    // The word fills the footer exactly; the travel distances come from the letters' real widths.
    const fit = () => {
      gsap.set([...a, ...b, dot], { clearProps: "transform" });
      swapped = false;
      el.style.fontSize = "100px";
      const width = (els: HTMLElement[]) => els.reduce((sum, l) => sum + l.getBoundingClientRect().width, 0);
      const [wa, wd, wb] = [width(a), width([dot]), width(b)];
      const box = el.parentElement!;
      const room = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) * 2;
      const k = room / (wa + wd + wb);
      el.style.fontSize = `${100 * k}px`;
      shift = { a: (wb + wd) * k, b: -(wa + wd) * k, dot: (wb - wa) * k };
    };

    // One half arcs over, the other ducks under: two worlds passing each other. Letters lean into the move.
    const swap = (on: boolean) => {
      if (on === swapped) return;
      swapped = on;
      tl?.kill();
      if (still) {
        gsap.set(a, { x: on ? shift.a : 0 });
        gsap.set(b, { x: on ? shift.b : 0 });
        gsap.set(dot, { x: on ? shift.dot : 0 });
        return;
      }
      const lead = on ? "end" : "start";
      tl = gsap.timeline({ defaults: { duration: 1.1, ease: "expo.inOut" } });
      tl.to(a, { x: on ? shift.a : 0, stagger: { each: 0.035, from: lead } }, 0)
        // Keyframes, not yoyo, so a swap cut short still lands every letter level.
        .to(a, { keyframes: [{ yPercent: -16, skewX: on ? -10 : 10, ease: "sine.out" }, { yPercent: 0, skewX: 0, ease: "sine.in" }], stagger: { each: 0.035, from: lead } }, 0)
        .to(b, { x: on ? shift.b : 0, stagger: { each: 0.035, from: on ? "start" : "end" } }, 0.05)
        .to(b, { keyframes: [{ yPercent: 7, skewX: on ? 10 : -10, scaleY: 0.92, ease: "sine.out" }, { yPercent: 0, skewX: 0, scaleY: 1, ease: "sine.in" }], transformOrigin: "50% 100%", stagger: { each: 0.035, from: on ? "start" : "end" } }, 0.05)
        // The dot shrinks to a point, slides, and pops back in its new place.
        .to(dot, { scale: 0.2, duration: 0.3, ease: "power2.in" }, 0)
        .to(dot, { x: on ? shift.dot : 0, duration: 0.6, ease: "expo.inOut" }, 0.25)
        .to(dot, { scale: 1, duration: 0.6, ease: "back.out(4)" }, 0.75);
    };

    const enter = () => swap(true);
    const leave = () => swap(false);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focus", enter);
    el.addEventListener("blur", leave);

    // Phones have no hover: the word flips once when it comes into view, then flips back.
    let back = 0;
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !matchMedia("(hover: none)").matches) return;
      seen.disconnect();
      swap(true);
      back = window.setTimeout(() => swap(false), 2200);
    }, { threshold: 0.9 });
    seen.observe(el);

    document.fonts.ready.then(fit);
    const watch = new ResizeObserver(fit);
    watch.observe(el.parentElement!);
    return () => {
      tl?.kill();
      clearTimeout(back);
      seen.disconnect();
      watch.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focus", enter);
      el.removeEventListener("blur", leave);
    };
  }, [world]);

  return (
    <div className="footer-word">
      <Link ref={link} className="fw" href={otherPath(pathname)} aria-label={world === "sane" ? "Go insane" : "Go sane"}>
        {[...first].map((l, i) => <span key={`a${i}`} data-half="a" aria-hidden="true">{l}</span>)}
        <span className="fw-dot" aria-hidden="true">.</span>
        {[...second].map((l, i) => <span key={`b${i}`} data-half="b" aria-hidden="true">{l}</span>)}
      </Link>
    </div>
  );
}
