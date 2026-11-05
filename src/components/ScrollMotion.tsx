"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MOTION = "(prefers-reduced-motion: no-preference)";
// Keep in step with the matching media query in globals.css, which makes the sticky stages.
const STAGE = "(min-width: 761px) and (min-height: 600px)";
const EASE = "expo.out";

function animatePage({ stage }: { stage: boolean }) {
  // Headings rise in word by word. Belief lines are excluded: they fill with the scroll below.
  gsap.utils.toArray<HTMLElement>(".h-editorial, .h1, main .display:not(.belief .display)").forEach((el) => {
    const { words } = SplitText.create(el, { type: "words", aria: "none" });
    gsap.from(words, { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.04, ease: EASE, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });

  gsap.utils.toArray<HTMLElement>(".belief").forEach((belief) => {
    const { words } = SplitText.create(belief.querySelector(".display"), { type: "words", aria: "none" });
    gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: belief, start: "top 75%", end: "center 45%", scrub: true } });
    gsap.from(belief.querySelector(".voice"), { opacity: 0, y: 24, ease: "none", scrollTrigger: { trigger: belief, start: "center 55%", end: "center 40%", scrub: true } });
  });

  const lists = gsap.utils.toArray<HTMLElement>(".rows li, .projects a, .posters > li, .marks li, .facts div");
  if (lists.length) {
    gsap.set(lists, { y: 40, opacity: 0 });
    ScrollTrigger.batch(lists, { start: "top 92%", once: true, onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: EASE }) });
  }

  gsap.utils.toArray<HTMLElement>(".shot").forEach((img) => {
    gsap.fromTo(img, { clipPath: "inset(14% 14% 14% 14%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: img, start: "top 95%", end: "top 55%", scrub: true } });
  });

  // The hero's big word stays put: the portal's poster has to line up with it.
  // On Sane the hero is sticky, so timing comes from the section around it, whose position doesn't change.
  const hero = document.querySelector(".morph") ?? document.querySelector(".hero");
  if (hero) gsap.to(".hero .lede", { opacity: 0, y: -48, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "+=45%", scrub: true } });

  const wipe = (tl: gsap.core.Timeline, row: Element) => {
    const cursor = row.querySelector(".fix-cursor");
    tl.set(cursor, { autoAlpha: 1 })
      .fromTo(row.querySelector("ins"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none" })
      .fromTo(cursor, { left: "0%" }, { left: "100%", ease: "none" }, "<")
      .set(cursor, { autoAlpha: 0 });
  };
  const rows = gsap.utils.toArray<HTMLElement>(".fix-row");
  if (rows.length && stage) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".fix", start: "top top", end: "bottom bottom", scrub: true } });
    rows.forEach((row) => wipe(tl, row));
  } else {
    rows.forEach((row) => wipe(gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", end: "top 45%", scrub: true } }), row));
  }
}

export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (!matchMedia(MOTION).matches) return;
    const lenis = new Lenis();
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const mm = gsap.matchMedia();
    // Word positions depend on the real fonts, so splitting waits for them.
    document.fonts.ready.then(() => {
      if (!alive) return;
      mm.add({ motion: MOTION, stage: STAGE }, (context) => {
        const { motion, stage } = context.conditions as { motion: boolean; stage: boolean };
        if (motion) return animatePage({ stage });
      });
      ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
      mm.revert();
    };
  }, [pathname]);

  return null;
}
