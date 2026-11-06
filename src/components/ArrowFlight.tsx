"use client";

import { useEffect, useRef } from "react";
import { LOGO_ARROW } from "./logoShape";

const PER_PANEL = 3;

/**
 * Glossy 3D logo arrows that fly up through each belief panel as it scrolls past, in front of the words
 * (after cvnt.in's packets). Scroll-driven only: nothing draws while the page is still. three.js loads when the
 * section is near, never at page load. Sits inside `.beliefs`; each arrow takes its panel's text colour.
 */
export default function ArrowFlight() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = el.querySelector("canvas")!;
    const panels = [...el.parentElement!.querySelectorAll<HTMLElement>(".belief")];
    let alive = true;
    let dispose = () => {};

    const start = () => import("three").then((THREE) => {
      if (!alive) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
      camera.position.z = 10;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.4));
      const key = new THREE.DirectionalLight(0xffffff, 3);
      key.position.set(3, 5, 7);
      scene.add(key);
      // A lime rim, so an ink arrow still shows when it crosses into the ink panel.
      const rim = new THREE.DirectionalLight(0xc7ff2e, 2.5);
      rim.position.set(-5, -3, 2);
      scene.add(rim);

      // The arrow in the logo's own coordinates, flipped (SVG y points down), centred and extruded.
      const shape = new THREE.Shape(LOGO_ARROW.map(([x, y]) => new THREE.Vector2(x - LOGO_ARROW[0][0], LOGO_ARROW[0][1] - y)));
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 26, bevelEnabled: true, bevelSize: 5, bevelThickness: 6, bevelSegments: 4 });
      geo.center();
      geo.scale(1 / 151, 1 / 151, 1 / 151); // The arrow is 151 units tall; now 1.

      const rnd = (i: number, k: number) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
      const arrows = panels.flatMap((panel, p) => {
        const material = new THREE.MeshStandardMaterial({ color: getComputedStyle(panel).color, metalness: 0.35, roughness: 0.22 });
        return Array.from({ length: PER_PANEL }, (_, j) => {
          const i = p * PER_PANEL + j;
          const mesh = new THREE.Mesh(geo, material);
          scene.add(mesh);
          return { mesh, panel, j, x: 0.15 + 0.7 * ((j + rnd(i, 1) * 0.8) / PER_PANEL), spin: 0.6 + rnd(i, 2), tilt: rnd(i, 3) * Math.PI * 2, size: 0.7 + rnd(i, 4) * 0.6 };
        });
      });

      let w = 0, h = 0;
      const size = () => {
        w = innerWidth;
        h = innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      const draw = () => {
        const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        const viewW = viewH * camera.aspect;
        const unit = Math.min(viewW, viewH) * 0.3;
        for (const a of arrows) {
          const r = a.panel.getBoundingClientRect();
          // 0 as the panel's top enters the bottom of the screen, 1 as its bottom leaves the top.
          const p = (h - r.top) / (h + r.height);
          // Staggered so the three don't move as one; each crosses the screen faster than the page scrolls.
          const t = p * 1.5 - 0.25 - a.j * 0.12;
          const sy = h * (1.25 - 1.5 * t);
          a.mesh.visible = t > -0.1 && t < 1.1;
          if (!a.mesh.visible) continue;
          const sx = w * (a.x + Math.sin(t * 3 + a.tilt) * 0.04);
          a.mesh.position.set((sx / w - 0.5) * viewW, (0.5 - sy / h) * viewH, Math.sin(t * 2 + a.tilt) * 1.5);
          a.mesh.rotation.set(a.tilt + t * 3 * a.spin, t * 5 * a.spin, a.tilt * 0.5 - t * 1.5);
          a.mesh.scale.setScalar(unit * a.size);
        }
        renderer.render(scene, camera);
      };

      let raf = 0;
      const ask = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
      const onResize = () => { size(); ask(); };
      size();
      draw();
      addEventListener("scroll", ask, { passive: true });
      addEventListener("resize", onResize);
      dispose = () => {
        cancelAnimationFrame(raf);
        removeEventListener("scroll", ask);
        removeEventListener("resize", onResize);
        geo.dispose();
        renderer.dispose();
      };
    });

    // Load the engine only as the section comes near.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      start();
    }, { rootMargin: "600px 0px" });
    io.observe(el);

    return () => {
      alive = false;
      io.disconnect();
      dispose();
    };
  }, []);

  return (
    <div ref={box} className="flight" aria-hidden="true">
      <canvas />
    </div>
  );
}
