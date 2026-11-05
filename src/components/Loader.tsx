"use client";

import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { S_PATH, S_VIEWBOX } from "./logoShape";
import { worldOf } from "./portal/world";

const HEROES = {
  sane: { word: "SANEEE", ratio: 4.977, line: "Designed to be distinguished." },
  insane: { word: "INSANE", ratio: 4.492, line: "Sanely built. Insanely good." },
};
const MIN_MS = 600;
const MAX_MS = 2500;
const EASE = "expo.inOut";
// Only what the timelines set: "all" would also wipe the inline --ratio the word is sized by.
const ANIMATED = "transform,translate,left,top,width,height,opacity,visibility,clip-path,fill-opacity,stroke-dasharray,stroke-dashoffset";

/**
 * Runs before React, from layout.tsx: picks the screen that covers the first paint.
 * The intro plays once a session, on a home page opened at the top; every other load gets the S mark.
 */
export const LOAD_SCRIPT = `(function(){var d=document.documentElement;try{var p=location.pathname.replace(/\\/$/,"")||"/";d.dataset.world=p==="/insane"||p.indexOf("/insane/")===0?"insane":"sane";var home=p==="/"||p==="/insane";d.dataset.load=home&&!location.hash&&!sessionStorage.getItem("saneee-intro")?"intro":"mark"}catch(e){d.dataset.load="mark"}})()`;

const ready = () =>
  Promise.race([
    Promise.all([
      document.fonts.ready,
      document.readyState === "complete" ? null : new Promise((r) => addEventListener("load", r, { once: true })),
      new Promise((r) => setTimeout(r, MIN_MS)),
    ]),
    new Promise((r) => setTimeout(r, MAX_MS)),
  ]);

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const covering = useRef(false);

  const finish = () => {
    delete document.documentElement.dataset.load;
    const el = root.current;
    if (el) gsap.set([el, ...el.querySelectorAll("*")], { clearProps: ANIMATED });
  };

  // First load: intro or S mark, then hand over to the page.
  useEffect(() => {
    const html = document.documentElement;
    const el = root.current!;
    const mode = html.dataset.load;
    if (!mode) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mark = el.querySelector<SVGPathElement>(".loader-mark path")!;
    const length = 1; // pathLength="1" on the path
    const tl = gsap.timeline({ paused: true });

    if (mode === "intro") {
      try { sessionStorage.setItem("saneee-intro", "1"); } catch {}
      const world = html.dataset.world === "insane" ? "insane" : "sane";
      const stage = el.querySelector<HTMLElement>(`.loader-stage[data-world="${world}"]`)!;
      const letters = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".word span"));
      const s = letters.find((l) => l.textContent === "S")!;
      const svg = el.querySelector<SVGElement>(".loader-mark")!;
      if (still) {
        tl.set([svg], { autoAlpha: 0 }).set(stage, { autoAlpha: 1 });
      } else {
        // The mark draws in the middle, then flies onto the ink of the word's S while the other letters rise.
        // The svg's viewBox is the S's own bounds, so its box is its ink; the glyph's ink comes from the font's metrics.
        // The mark flies as a plain box (left, top, width, height): transforms would mix with its CSS centring.
        const word = stage.querySelector<HTMLElement>(".word")!;
        let flight = { left: 0, top: 0, width: 0, height: 0 };
        const measure = () => {
          const ctx = document.createElement("canvas").getContext("2d")!;
          ctx.font = `400 ${getComputedStyle(word).fontSize} "Saneee Brand"`;
          const ink = ctx.measureText("S");
          const baseline = word.querySelector(".loader-base")!.getBoundingClientRect().bottom;
          const from = svg.getBoundingClientRect();
          gsap.set(svg, { translate: "none", left: from.left, top: from.top, width: from.width, height: from.height });
          // The font's S is a touch wider than the logo's; the svg stretches to fit (preserveAspectRatio="none").
          flight = {
            left: s.getBoundingClientRect().left - ink.actualBoundingBoxLeft,
            top: baseline - ink.actualBoundingBoxAscent,
            width: ink.actualBoundingBoxLeft + ink.actualBoundingBoxRight,
            height: ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent,
          };
        };
        const rest = letters.filter((l) => l !== s);
        tl.set(stage, { autoAlpha: 1 })
          .set(s, { opacity: 0 })
          .set(rest, { opacity: 0, yPercent: 40 })
          .set(stage.querySelector(".lede"), { opacity: 0, y: 16 })
          .fromTo(mark, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" })
          .to(mark, { fillOpacity: 1, duration: 0.25 }, "-=0.1")
          .add(measure)
          .to(svg, { left: () => flight.left, top: () => flight.top, width: () => flight.width, height: () => flight.height, duration: 0.8, ease: EASE })
          .to(rest, { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.05, ease: "expo.out" }, "<0.35")
          .to(s, { opacity: 1, duration: 0.2 }, "-=0.15")
          .to(svg, { autoAlpha: 0, duration: 0.2 }, "<")
          .to(stage.querySelector(".lede"), { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, "-=0.3");
      }
      // The stage now matches the real hero underneath, so fading the whole cover is invisible except for the colour it held.
      tl.to(el, { autoAlpha: 0, duration: still ? 0.2 : 0.5, ease: "power1.out" });
    } else if (still) {
      tl.to(el, { autoAlpha: 0, duration: 0.2 });
    } else {
      tl.fromTo(mark, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" })
        .to(mark, { fillOpacity: 1, duration: 0.2 }, "-=0.1")
        .addPause("+=0", () => { ready().then(() => tl.play()); })
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "expo.inOut" });
    }
    tl.eventCallback("onComplete", finish);
    // Fonts first, so the word is measured in the brand face.
    document.fonts.ready.then(() => tl.play());
    return () => { tl.kill(); };
  }, []);

  // Page switches: cover, navigate, uncover once the new page is in.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      // The world switch crosses through the portal's own flood.
      if (!a || a.target || a.hasAttribute("download") || a.classList.contains("switch")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      const html = document.documentElement;
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      html.dataset.world = worldOf(url.pathname);
      html.dataset.load = "cover";
      covering.current = true;
      const go = () => router.push(url.pathname + url.search + url.hash);
      if (still) return go();
      gsap.fromTo(root.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.45, ease: "expo.inOut", onComplete: go });
      gsap.fromTo(root.current!.querySelector(".loader-mark path"), { fillOpacity: 1, scale: 0.6, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.6, ease: "expo.out" });
    };
    // Capture: Next's Link handles the click (and prevents it) before a bubbling listener would see it.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!covering.current) return;
    covering.current = false;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Two frames: the new page has painted under the cover before it lifts.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      gsap.to(root.current, { clipPath: "inset(0 0 100% 0)", duration: still ? 0 : 0.6, ease: "expo.inOut", onComplete: finish });
    }));
  }, [pathname]);

  return (
    <div ref={root} className="loader" aria-hidden="true" data-lenis-prevent>
      <svg className="loader-mark" viewBox={S_VIEWBOX} preserveAspectRatio="none"><path d={S_PATH} pathLength={1} /></svg>
      {(["sane", "insane"] as const).map((w) => (
        <div key={w} className="loader-stage" data-world={w}>
          <p className="lede" style={{ "--ratio": HEROES[w].ratio } as React.CSSProperties}>{HEROES[w].line}</p>
          <p className="word" style={{ "--ratio": HEROES[w].ratio } as React.CSSProperties}>
            {[...HEROES[w].word].map((l, i) => <span key={i}>{l}</span>)}
            <i className="loader-base" />
          </p>
        </div>
      ))}
    </div>
  );
}
