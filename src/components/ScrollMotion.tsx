"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { crossingY, forgetCrossing } from "./portal/world";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MOTION = "(prefers-reduced-motion: no-preference)";
// Keep in step with the matching media query in globals.css, which makes the sticky stages.
const STAGE = "(min-width: 761px) and (min-height: 600px)";
const EASE = "expo.out";

function animatePage({ stage }: { stage: boolean }) {
  // Headings rise in word by word. Belief lines are excluded: BeliefStage swaps them with the scroll.
  gsap.utils.toArray<HTMLElement>(".h-editorial, .h1, main .display:not(.belief-slide .display)").forEach((el) => {
    const { words } = SplitText.create(el, { type: "words", aria: "none" });
    gsap.from(words, { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.04, ease: EASE, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
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

// The smooth scroller, shared with the landing below.
let lenis: Lenis | null = null;

export default function ScrollMotion() {
  const pathname = usePathname();

  // Every page change lands somewhere on purpose: the same place after crossing worlds, a linked section (#id),
  // otherwise the top. Lenis keeps its own position, so it has to be told too, or it drags the old one back.
  useEffect(() => {
    const land = () => {
      const crossed = crossingY(pathname);
      const linked = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      const y = Math.max(0, crossed ?? (linked ? linked.getBoundingClientRect().top + scrollY : 0));
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else scrollTo(0, y);
    };
    land();
    // Again once fonts and scroll-linked layouts have settled the page's heights; then the saved place is spent.
    let alive = true;
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      if (!alive) return;
      land();
      forgetCrossing();
    }));
    return () => { alive = false; };
  }, [pathname]);

  useEffect(() => {
    if (!matchMedia(MOTION).matches) return;
    lenis = new Lenis();
    const smooth = lenis;
    const tick = (time: number) => smooth.raf(time * 1000);
    smooth.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      smooth.destroy();
      lenis = null;
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
