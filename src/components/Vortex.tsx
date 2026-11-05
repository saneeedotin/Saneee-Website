"use client";

import { useEffect, useRef } from "react";

// The logo's S and cursor arrow, in the logo's own coordinates. The arrow is the same shape as the site cursor.
const LOGO_S = [[470, 500], [724, 500], [724, 570], [503, 570], [712, 695], [724, 715], [724, 755], [690, 808], [425, 808], [425, 768], [452, 740], [655, 740], [440, 615], [425, 590], [425, 545]];
const LOGO_ARROW = [[755, 357], [868, 465], [800, 465], [755, 508]];
const ORIGIN = { x: 425, y: 357, size: 451 };
const toPoints = (poly: number[][]) => poly.map((p) => p.join(",")).join(" ");
const norm = ([x, y]: number[]) => ({ x: (x - ORIGIN.x) / ORIGIN.size - 0.5, y: 0.5 - (y - ORIGIN.y) / ORIGIN.size });

const INK = "#080808";
const PAPER = "#F6F6EF";
const LIME = "#C7FF2E";
const CURSOR_HEIGHT_PX = 29;
const CAMERA_Z = 14;

// Scroll progress of each act. Whirl, then gather, S locks, arrow leaves, S opens into Services.
const GATHER = [0.2, 0.62];
const LIFT = [0.74, 0.86];
const OPEN = [0.86, 1];
const BEATS = ["Calls. Bills. Diaries. Spreadsheets.", "All of it.", "One system."];
const BEAT_ENDS = [0.36, 0.62, 0.86];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const within = (p: number, [a, b]: number[]) => clamp01((p - a) / (b - a));
const ease = (q: number) => q * q * (3 - 2 * q);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const random = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function logoCells(maxCells: number) {
  const R = 300;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = R;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const scale = R / ORIGIN.size;
  const fill = (poly: number[][], colour: string) => {
    ctx.fillStyle = colour;
    ctx.beginPath();
    poly.forEach(([x, y], i) => ctx[i ? "lineTo" : "moveTo"]((x - ORIGIN.x) * scale, (y - ORIGIN.y) * scale));
    ctx.closePath();
    ctx.fill();
  };
  fill(LOGO_S, "#f00");
  fill(LOGO_ARROW, "#0f0");
  const px = ctx.getImageData(0, 0, R, R).data;
  for (let step = 3; ; step += 0.25) {
    const cells: { x: number; y: number; arrow: boolean }[] = [];
    for (let y = step / 2; y < R; y += step) {
      for (let x = step / 2; x < R; x += step) {
        const i = (Math.floor(y) * R + Math.floor(x)) * 4;
        if (px[i + 3] > 200) cells.push({ x: x / R - 0.5, y: 0.5 - y / R, arrow: px[i + 1] > px[i] });
      }
    }
    if (cells.length <= maxCells) return { cells, step: step / R };
  }
}

/** Four business fragments in a 2x2 sheet. Brand colours only, so the mess still looks like ours. */
function paintFragments(serif: string) {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S * 2;
  const ctx = canvas.getContext("2d")!;
  const brand = (size: number) => `400 ${size}px "Saneee Brand", sans-serif`;
  const card = (cx: number, cy: number, colour: string) => {
    ctx.fillStyle = colour;
    ctx.fillRect(cx, cy, S, S);
  };
  const lines = (x: number, y: number, width: number, count: number, gap: number) => {
    ctx.fillRect(x, y, width, 0);
    for (let i = 0; i < count; i++) ctx.fillRect(x, y + i * gap, width * (i % 3 === 2 ? 0.6 : 1), 8);
  };

  // Invoice
  card(0, 0, PAPER);
  ctx.fillStyle = INK;
  ctx.font = brand(64);
  ctx.fillText("INVOICE", 36, 96);
  lines(36, 150, 440, 5, 44);
  ctx.font = brand(72);
  ctx.fillText("PAID??", 36, 462);

  // Diary page
  card(S, 0, PAPER);
  ctx.fillStyle = INK;
  lines(S + 36, 110, 440, 8, 52);
  ctx.font = `italic 400 76px ${serif}`;
  ctx.fillText("call Raju back", S + 36, 90);
  ctx.fillText("who has it?", S + 36, 300);

  // Chat bubble, on a clear background
  ctx.clearRect(0, S, S, S);
  ctx.fillStyle = LIME;
  ctx.beginPath();
  ctx.roundRect(20, S + 90, S - 40, 300, 60);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(70, S + 370);
  ctx.lineTo(70, S + 470);
  ctx.lineTo(180, S + 380);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = brand(68);
  ctx.fillText("who called?", 44, S + 200);
  ctx.fillText("urgent!!", 44, S + 310);

  // Spreadsheet
  card(S, S, PAPER);
  ctx.fillStyle = LIME;
  ctx.fillRect(S + 170, S + 170, 170, 85);
  ctx.fillStyle = INK;
  for (let i = 0; i <= 3; i++) ctx.fillRect(S + i * 170, S, 4, S);
  for (let i = 0; i <= 6; i++) ctx.fillRect(S, S + i * 85, S, 4);
  ctx.font = brand(44);
  ctx.fillText("FINAL_2", S + 14, S + 62);
  ctx.fillText("4,800", S + 186, S + 230);
  ctx.fillText("???", S + 356, S + 400);
  return canvas;
}

export default function Vortex() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let teardown = () => {};

    const start = async () => {
      const THREE = await import("three");
      const fonts = Promise.all([document.fonts.load('400 64px "Saneee Brand"'), document.fonts.ready]);
      await Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]);
      if (!alive) return;

      const el = canvas.current!;
      const root = section.current!;
      const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, powerPreference: "high-performance" });
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // The shader already writes the exact brand values.
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
      camera.position.z = CAMERA_Z;

      const { cells, step } = logoCells(innerWidth < 760 ? 320 : 700);
      const count = cells.length;
      const serif = getComputedStyle(document.documentElement).getPropertyValue("--font-serif") || "serif";
      const sheet = new THREE.CanvasTexture(paintFragments(serif));
      sheet.colorSpace = THREE.NoColorSpace;
      sheet.anisotropy = 4;

      const geometry = new THREE.PlaneGeometry(1, 1);
      const kinds = new Float32Array(count);
      const morph = new Float32Array(count);
      const ends = new Float32Array(count * 3);
      const paper = new THREE.Color().setRGB(0xf6 / 255, 0xf6 / 255, 0xef / 255);
      const lime = new THREE.Color().setRGB(0xc7 / 255, 1, 0x2e / 255);
      cells.forEach((c, i) => {
        kinds[i] = Math.floor(random(i, 11) * 4);
        (c.arrow ? lime : paper).toArray(ends, i * 3);
      });
      geometry.setAttribute("aKind", new THREE.InstancedBufferAttribute(kinds, 1));
      const morphAttribute = new THREE.InstancedBufferAttribute(morph, 1);
      morphAttribute.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("aMorph", morphAttribute);
      geometry.setAttribute("aEnd", new THREE.InstancedBufferAttribute(ends, 3));

      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: { sheet: { value: sheet } },
        vertexShader: `
          attribute float aKind, aMorph;
          attribute vec3 aEnd;
          varying vec2 vUv;
          varying float vKind, vMorph;
          varying vec3 vEnd;
          void main() {
            vUv = uv; vKind = aKind; vMorph = aMorph; vEnd = aEnd;
            gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform sampler2D sheet;
          varying vec2 vUv;
          varying float vKind, vMorph;
          varying vec3 vEnd;
          void main() {
            vec2 cell = vec2(mod(vKind, 2.0), floor(vKind / 2.0));
            vec4 tex = texture2D(sheet, (cell + vUv) / 2.0);
            float alpha = mix(tex.a, 1.0, vMorph);
            if (alpha < 0.5) discard;
            gl_FragColor = vec4(mix(tex.rgb, vEnd, vMorph), 1.0);
          }`,
      });
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      mesh.frustumCulled = false;
      scene.add(mesh);

      const tiles = cells.map((c, i) => ({
        c,
        angle: random(i, 2) * Math.PI * 2,
        level: random(i, 3),
        spin: 0.3 + random(i, 4) * 0.6,
        delay: random(i, 5),
        rx: random(i, 6) * 6,
        ry: random(i, 7) * 6,
        rz: random(i, 8) * 6,
        width: 0.5 + random(i, 9) * 0.55,
      }));
      // The S opens through the middle of its diagonal, the widest stretch of stroke.
      const heart = norm([575, 655]);
      const focus = cells.reduce((best, c) => (!c.arrow && Math.hypot(c.x - heart.x, c.y - heart.y) < Math.hypot(best.x - heart.x, best.y - heart.y) ? c : best), cells.find((c) => !c.arrow)!);
      const tip = norm(LOGO_ARROW[0]);
      const arrowHeight = (LOGO_ARROW[3][1] - LOGO_ARROW[0][1]) / ORIGIN.size;

      const size = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      size();
      addEventListener("resize", size);

      const pointer = { x: 0, y: 0, seen: false };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.seen = true;
      };
      addEventListener("pointermove", onPointer, { passive: true });

      const beats = [...root.querySelectorAll<HTMLElement>(".beat")];
      const dummy = new THREE.Object3D();
      const inkColour = new THREE.Color().setRGB(8 / 255, 8 / 255, 8 / 255);
      const paperColour = paper;
      let p = 0;
      let raf = 0;
      let last = performance.now();

      const frame = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        const r = root.getBoundingClientRect();
        const target = clamp01(-r.top / Math.max(1, r.height - innerHeight));
        p += (target - p) * (1 - Math.pow(0.9, dt * 60));

        const t = now / 1000;
        const viewH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const viewW = viewH * camera.aspect;
        const logo = Math.min(viewW * 0.82, viewH * 0.6);
        const raise = viewH * 0.07;
        const radius = Math.min(viewW, viewH) * 0.62;
        const tall = viewH * 1.1;

        const gather = within(p, GATHER);
        const lift = ease(within(p, LIFT));
        const open = within(p, OPEN);
        const zoom = 1 + 39 * open * open * open;
        const flying = p >= LIFT[0] && p < LIFT[1] && pointer.seen;

        const pxToWorld = viewH / el.clientHeight;
        const mouseX = (pointer.x / el.clientWidth - 0.5) * viewW;
        const mouseY = -(pointer.y / el.clientHeight - 0.5) * viewH;
        const tipX = pointer.seen ? mouseX : viewW * 0.62;
        const tipY = pointer.seen ? mouseY : viewH * 0.62;
        const shrink = (CURSOR_HEIGHT_PX * pxToWorld) / (arrowHeight * logo);

        for (let i = 0; i < count; i++) {
          const o = tiles[i];
          const q = ease(clamp01(gather * 1.75 - o.delay * 0.65));
          const un = 1 - q;
          morph[i] = q;

          const baseX = o.c.x * logo;
          const baseY = o.c.y * logo + raise;
          let endX = baseX;
          let endY = baseY;
          let cell = step * logo * 0.93;

          if (o.c.arrow) {
            const k = mix(1, shrink, lift);
            endX = mix(baseX, tipX + (o.c.x - tip.x) * logo * shrink, lift);
            endY = mix(baseY, tipY + (o.c.y - tip.y) * logo * shrink, lift);
            cell *= k;
            if (p >= LIFT[1]) cell = 0; // Landed: the real cursor has taken over.
          } else if (open > 0) {
            const focusX = focus.x * logo;
            const focusY = focus.y * logo + raise;
            endX = (baseX - focusX) * zoom + focusX * (1 - open);
            endY = (baseY - focusY) * zoom + focusY * (1 - open);
            cell = step * logo * mix(0.93, 1.04, open) * zoom; // Gaps close, or they'd show as a grid on the way through.
          }

          let x = endX;
          let y = endY;
          let z = 0;
          if (un > 0) {
            const angle = o.angle + t * o.spin;
            const yy = (((o.level + t * 0.05 * o.spin) % 1) - 0.5) * tall;
            const rad = radius * (0.22 + 0.78 * (yy / tall + 0.5));
            let cx = Math.cos(angle) * rad;
            let cy = yy + Math.sin(angle * 2 + t) * 0.3;
            const cz = Math.sin(angle) * rad;
            if (pointer.seen) {
              const dx = cx - mouseX;
              const dy = cy - mouseY;
              const dist = Math.hypot(dx, dy);
              if (dist < 2.6) {
                const push = ((2.6 - dist) / 2.6) * 2.2;
                cx += (dx / (dist + 0.01)) * push;
                cy += (dy / (dist + 0.01)) * push;
              }
            }
            x = cx + (endX - cx) * q;
            y = cy + (endY - cy) * q;
            z = cz * un;
          }

          dummy.position.set(x, y, z);
          dummy.rotation.set((o.rx + t * o.spin) * un, (o.ry + t * o.spin * 0.7) * un, o.rz * un);
          dummy.scale.set(mix(o.width, cell, q), mix(o.width * 0.75, cell, q), 1);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        morphAttribute.needsUpdate = true;

        beats.forEach((b, i) => b.classList.toggle("on", p < BEAT_ENDS[i] && p >= (BEAT_ENDS[i - 1] ?? 0)));
        pin.current?.classList.toggle("vortex-flying", flying);
        renderer.setClearColor(p > 0.985 ? paperColour : inkColour);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };

      const seen = new IntersectionObserver(([e]) => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (!e.isIntersecting) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      });
      seen.observe(root);

      teardown = () => {
        seen.disconnect();
        cancelAnimationFrame(raf);
        removeEventListener("resize", size);
        removeEventListener("pointermove", onPointer);
        sheet.dispose();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    // The hero fills the screen, so this waits for the first scroll: the 3D library isn't part of the first load.
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      start().catch((err) => {
        console.warn("Vortex is off:", err);
        section.current?.classList.add("vortex-static");
      });
    }, { rootMargin: "-1px 0px" }); // At rest the section's edge touches the screen's, which already counts as intersecting.
    near.observe(section.current!);

    return () => {
      alive = false;
      near.disconnect();
      teardown();
    };
  }, []);

  return (
    <section ref={section} className="vortex" data-chapter="services" data-portal-off aria-label="All the paperwork of a business coming together into one system">
      <div ref={pin} className="vortex-pin">
        <canvas ref={canvas} className="vortex-canvas" aria-hidden="true" />
        <svg className="vortex-still" viewBox={`${ORIGIN.x} ${ORIGIN.y} ${ORIGIN.size} ${ORIGIN.size}`} aria-hidden="true">
          <polygon points={toPoints(LOGO_S)} fill={PAPER} />
          <polygon points={toPoints(LOGO_ARROW)} fill={LIME} />
        </svg>
        <div className="beats">
          {BEATS.map((text) => (
            <p key={text} className="beat"><span>{text}</span></p>
          ))}
        </div>
      </div>
    </section>
  );
}
