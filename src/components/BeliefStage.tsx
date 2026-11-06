"use client";

import { useEffect, useRef } from "react";
import type { Mesh } from "three";
import { LOGO_ARROW } from "./logoShape";

/**
 * One pinned lime stage (after cvnt.in): the beliefs swap in place while one huge 3D logo arrow rises through it.
 * Text and arrow read the same scroll value, so the arrow leaves the top exactly as the last line finishes.
 * Stop scrolling and the arrow leans toward the cursor; grab it to spin it. three.js loads as the section nears.
 */
export default function BeliefStage({ beliefs }: { beliefs: [string, string][] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = section.querySelector<HTMLElement>(".belief-stage")!;
    const canvas = section.querySelector("canvas")!;
    const slides = [...section.querySelectorAll<HTMLElement>(".belief-slide")];
    let alive = true;
    let dispose = () => {};

    const progress = () => {
      const r = section.getBoundingClientRect();
      return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    };

    // The words: each statement owns a third of the scroll, crossfading at the seams.
    const smooth = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };
    const placeText = (p: number) => slides.forEach((s, i) => {
      const u = p * slides.length - i;
      const o = (i === 0 ? 1 : smooth((u + 0.12) / 0.24)) * (i === slides.length - 1 ? 1 : 1 - smooth((u - 0.88) / 0.24));
      s.style.opacity = String(o);
      s.style.transform = `translateY(${(0.5 - Math.min(1, Math.max(0, u))) * 40}px)`;
      s.style.visibility = o < 0.01 ? "hidden" : "visible"; // Explicit: the stylesheet hides all but the first.
    });

    let raf = 0;
    let draw = () => placeText(progress());
    const ask = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    ask();

    const start = () => import("three").then((THREE) => {
      if (!alive) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
      camera.position.z = 10;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.2));
      const key = new THREE.DirectionalLight(0xffffff, 4);
      key.position.set(3, 5, 7);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xc7ff2e, 2.2); // A lime edge, so the ink arrow reads as solid.
      rim.position.set(-5, -3, 2);
      scene.add(rim);

      // The logo's arrow (the site cursor), flipped from SVG's downward y, centred, 1 unit tall.
      const [x0, y0] = LOGO_ARROW[0];
      const shape = new THREE.Shape(LOGO_ARROW.map(([x, y]) => new THREE.Vector2(x - x0, y0 - y)));
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 28, bevelEnabled: true, bevelSize: 6, bevelThickness: 7, bevelSegments: 6 });
      geo.center();
      geo.scale(1 / 151, 1 / 151, 1 / 151);
      // Lacquered ink: a clear coat catches the light the way cvnt's foil does.
      const arrow: Mesh = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08 }));
      scene.add(arrow);

      let w = 0, h = 0, viewW = 0, viewH = 0;
      const size = () => {
        w = stage.clientWidth;
        h = stage.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        viewW = viewH * camera.aspect;
      };
      size();

      // Play: a lean toward the pointer, and a spin you add by dragging that eases back to the flight angle.
      const lean = { x: 0, y: 0, tx: 0, ty: 0 };
      const spin = { x: 0, y: 0, vx: 0, vy: 0 };
      let drag: { x: number; y: number } | null = null;
      const ray = new THREE.Raycaster();
      const hits = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        return ray.intersectObject(arrow).length > 0;
      };

      let lastP = -1;
      const frame = () => {
        const p = progress();
        placeText(p);
        lean.x += (lean.tx - lean.x) * 0.08;
        lean.y += (lean.ty - lean.y) * 0.08;
        if (!drag) {
          spin.vx *= 0.93;
          spin.vy *= 0.93;
          if (Math.abs(spin.vx) + Math.abs(spin.vy) < 0.002) { spin.x *= 0.94; spin.y *= 0.94; }
        }
        spin.x += spin.vx;
        spin.y += spin.vy;

        // Fully below the stage at the start, fully above at the end, dead centre halfway.
        const tall = Math.min(viewH * 0.5, viewW * 0.6);
        arrow.scale.setScalar(tall);
        arrow.position.set(Math.sin(p * Math.PI * 2) * viewW * 0.06, (p - 0.5) * (viewH + tall * 1.4), 0);
        // A slow sway rather than a full turn, so it never goes edge-on and reads as a slab.
        arrow.rotation.set(0.25 + Math.sin(p * Math.PI) * 0.3 + lean.y * 0.45 + spin.x, Math.sin(p * Math.PI * 2) * 0.7 + lean.x * 0.6 + spin.y, -0.35 + p * 0.7);
        renderer.render(scene, camera);

        const settled = !drag && Math.abs(lean.tx - lean.x) + Math.abs(lean.ty - lean.y) < 0.001
          && Math.abs(spin.x) + Math.abs(spin.y) + Math.abs(spin.vx) + Math.abs(spin.vy) < 0.001 && p === lastP;
        lastP = p;
        return settled;
      };
      // Runs while anything is moving, then stops: a still page draws nothing.
      draw = () => { if (!frame()) ask(); };

      const onMove = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        const inside = e.clientY >= r.top && e.clientY <= r.bottom;
        lean.tx = inside ? ((e.clientX - r.left) / r.width - 0.5) * 2 : 0;
        lean.ty = inside ? ((e.clientY - r.top) / r.height - 0.5) * 2 : 0;
        if (drag) {
          spin.vy = (e.clientX - drag.x) * 0.012;
          spin.vx = (e.clientY - drag.y) * 0.012;
          drag = { x: e.clientX, y: e.clientY };
        } else if (e.pointerType === "mouse") {
          canvas.style.cursor = inside && hits(e) ? "grab" : "";
        }
        ask();
      };
      const onDown = (e: PointerEvent) => {
        if (!hits(e)) return;
        if (e.pointerType === "mouse") e.preventDefault();
        drag = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = "grabbing";
        ask();
      };
      const onUp = () => {
        if (!drag) return;
        drag = null;
        canvas.style.cursor = "";
        ask();
      };
      const onLeave = () => { lean.tx = 0; lean.ty = 0; ask(); };
      const onResize = () => { size(); ask(); };

      canvas.addEventListener("pointerdown", onDown);
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("pointerup", onUp);
      addEventListener("pointercancel", onUp);
      stage.addEventListener("pointerleave", onLeave);
      addEventListener("resize", onResize);
      ask();

      dispose = () => {
        canvas.removeEventListener("pointerdown", onDown);
        removeEventListener("pointermove", onMove);
        removeEventListener("pointerup", onUp);
        removeEventListener("pointercancel", onUp);
        stage.removeEventListener("pointerleave", onLeave);
        removeEventListener("resize", onResize);
        geo.dispose();
        renderer.dispose();
      };
    });

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      start();
    }, { rootMargin: "600px 0px" });
    io.observe(section);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("scroll", ask);
      removeEventListener("resize", ask);
      dispose();
    };
  }, []);

  return (
    <section ref={root} data-chapter="services" className="belief-pin" aria-label="What we believe">
      <div className="belief-stage">
        <canvas data-grab aria-hidden="true" />
        {beliefs.map(([loud, quiet]) => (
          <div key={loud} className="belief-slide">
            <p className="display">{loud}</p>
            <p className="voice">{quiet}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
