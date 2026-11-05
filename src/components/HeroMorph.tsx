"use client";

import { useEffect, useRef } from "react";
import { signedDistance } from "./sdf";

// The logo's S and cursor arrow, in the logo's own coordinates. The arrow is the same shape as the site cursor.
const LOGO_S = [[470, 500], [724, 500], [724, 570], [503, 570], [712, 695], [724, 715], [724, 755], [690, 808], [425, 808], [425, 768], [452, 740], [655, 740], [440, 615], [425, 590], [425, 545]];
const LOGO_ARROW = [[755, 357], [868, 465], [800, 465], [755, 508]];
const ORIGIN = { x: 425, y: 357, size: 451 };
const norm = ([x, y]: number[]) => ({ x: (x - ORIGIN.x) / ORIGIN.size - 0.5, y: 0.5 - (y - ORIGIN.y) / ORIGIN.size });

const CURSOR_HEIGHT_PX = 29;
const LOGO_FIELD = 512;
const LOGO_PADDING = 0.1;
const WORD_FIELD_WIDTH = 1024;

// Scroll progress of each act: the word becomes the logo, the arrow leaves, the S opens into Services.
const MORPH = [0.04, 0.5];
const LIFT = [0.62, 0.78];
const OPEN = [0.78, 1];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const within = (p: number, [a, b]: number[]) => clamp01((p - a) / (b - a));
const ease = (q: number) => q * q * (3 - 2 * q);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const VERTEX = `#version 300 es
in vec2 a; out vec2 v;
void main() { v = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }`;

// Works in "stage" units: centred, one unit is the stage's height, y up.
// Blending two distance fields and taking the zero line is what makes one shape flow into the other.
// The word's S grows into the logo's S, and the rest of the word squeezes into the arrow.
const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D F, R, S, A;
uniform float uAspect, uLogo, uBlend, uOpen, uZoom, uArrowScale, uArrowOn;
uniform vec4 uFirstFrom, uFirstTo, uRestFrom, uRestTo;
uniform vec2 uFocus, uTip, uTipUv;
uniform vec3 uBg;
in vec2 v; out vec4 o;

// Logo fields have a margin around the logo's box, so shapes touching the box's edge still have an outside.
float logoField(sampler2D t, vec2 uv) {
  vec2 padded = (uv + ${LOGO_PADDING.toFixed(3)}) / ${(1 + 2 * LOGO_PADDING).toFixed(3)};
  return texture(t, clamp(padded, 0., 1.)).r + length(max(abs(padded - .5) - .5, vec2(0.))) * ${(1 + 2 * LOGO_PADDING).toFixed(3)};
}

// A piece of the word, moved from its box towards the logo shape's box.
float wordPiece(sampler2D t, vec4 from, vec4 to) {
  vec4 box = mix(from, to, uBlend);
  vec2 uv = mix(from.xy, from.zw, (v - box.xy) / (box.zw - box.xy));
  float grow = min((box.z - box.x) / (from.z - from.x), (box.w - box.y) / (from.w - from.y));
  return texture(t, clamp(uv, 0., 1.)).r * grow + length(max(abs(uv - .5) - .5, vec2(0.)));
}

// The logo shape, carried along in the same moving box, so the two blend in place.
float logoPiece(sampler2D t, vec4 from, vec4 to) {
  vec4 box = mix(from, to, uBlend);
  vec2 p = mix(to.xy, to.zw, (v - box.xy) / (box.zw - box.xy));
  float grow = min((box.z - box.x) / (to.z - to.x), (box.w - box.y) / (to.w - to.y));
  return logoField(t, (p - .5) * vec2(uAspect, 1.) / uLogo + .5) * uLogo * grow;
}

void main() {
  vec2 st = (v - .5) * vec2(uAspect, 1.);
  vec2 base = (st - uFocus * (1. - uOpen)) / uZoom + uFocus;
  float dS = logoField(S, base / uLogo + .5) * uLogo * uZoom;
  float dA = uArrowOn > .5 ? logoField(A, uTipUv + (st - uTip) / (uLogo * uArrowScale)) * uLogo * uArrowScale : 1e3;

  if (uBlend < 1.) {
    // Slightly fattened mid-way: where two shapes don't overlap, blending their fields would thin them to nothing.
    float swell = .02 * min(1., uAspect) * sin(uBlend * 3.14159);
    dS = mix(wordPiece(F, uFirstFrom, uFirstTo), logoPiece(S, uFirstFrom, uFirstTo), uBlend) - swell;
    dA = mix(wordPiece(R, uRestFrom, uRestTo), logoPiece(A, uRestFrom, uRestTo), uBlend) - swell;
  }

  float d = min(dS, dA);
  float aa = max(fwidth(d), 1e-5);
  float lime = smoothstep(-.004, .004, dS - dA) * uBlend;
  vec3 ink = mix(vec3(.965, .965, .937), vec3(.78, 1., .18), lime);
  o = vec4(mix(ink, uBg, smoothstep(-aa, aa, d)), 1.);
}`;

function logoField(poly: number[][]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = LOGO_FIELD;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const boxPixels = LOGO_FIELD / (1 + 2 * LOGO_PADDING);
  const scale = boxPixels / ORIGIN.size;
  const margin = LOGO_PADDING * boxPixels;
  ctx.beginPath();
  poly.forEach(([x, y], i) => ctx[i ? "lineTo" : "moveTo"]((x - ORIGIN.x) * scale + margin, (y - ORIGIN.y) * scale + margin));
  ctx.closePath();
  ctx.fill();
  // Distances in fractions of the logo's box.
  return signedDistance(ctx.getImageData(0, 0, LOGO_FIELD, LOGO_FIELD).data, LOGO_FIELD, LOGO_FIELD).map((d) => d / boxPixels);
}

/** A polygon's box inside the logo's, in stage texture coordinates with y up. */
function logoBox(poly: number[][], logo: number, aspect: number) {
  const xs = poly.map((p) => norm(p).x * logo);
  const ys = poly.map((p) => norm(p).y * logo);
  return [0.5 + Math.min(...xs) / aspect, 0.5 + Math.min(...ys), 0.5 + Math.max(...xs) / aspect, 0.5 + Math.max(...ys)] as const;
}

/** The page's own hero word as distance fields covering the stage: its first letter, and the rest. */
function wordFields(word: HTMLElement, stage: HTMLElement) {
  const box = word.getBoundingClientRect();
  const stageBox = stage.getBoundingClientRect();
  const fontSize = parseFloat(getComputedStyle(word).fontSize);
  const W = stage.clientWidth;
  const H = stage.clientHeight;
  const k = Math.min(1, WORD_FIELD_WIDTH / W);
  const width = Math.round(W * k);
  const height = Math.round(H * k);
  const text = word.textContent ?? "";
  const left = box.left - stageBox.left;
  const baseline = box.bottom - stageBox.top - fontSize * 0.025; // Same baseline as paintPoster.

  const piece = (part: string, x: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.scale(k, k);
    ctx.font = `400 ${fontSize}px "Saneee Brand"`;
    ctx.fillText(part, x, baseline);
    const m = ctx.measureText(part);
    return {
      data: signedDistance(ctx.getImageData(0, 0, width, height).data, width, height).map((d) => d / height),
      // Its ink's box, in stage texture coordinates with y up.
      box: [(x - m.actualBoundingBoxLeft) / W, 1 - (baseline + m.actualBoundingBoxDescent) / H, (x + m.actualBoundingBoxRight) / W, 1 - (baseline - m.actualBoundingBoxAscent) / H] as const,
      advance: m.width,
    };
  };
  const first = piece(text[0], left);
  const rest = piece(text.slice(1), left + first.advance);
  return { first, rest, width, height };
}

export default function HeroMorph() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const word = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let teardown = () => {};

    const pointer = { x: 0, y: 0, seen: false };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.seen = true;
    };
    addEventListener("pointermove", onPointer, { passive: true });

    const start = () => {
      const el = canvas.current!;
      const root = section.current!;
      const pin = stage.current!;
      const wordEl = word.current!;
      const gl = el.getContext("webgl2", { antialias: false, alpha: false });
      if (!gl) throw new Error("WebGL2 unavailable");

      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader failed");
        return s;
      };
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.bindAttribLocation(program, 0, "a");
      gl.linkProgram(program);
      gl.useProgram(program);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const u = (name: string) => gl.getUniformLocation(program, name);

      const upload = (unit: number, name: string, data: Float32Array, width: number, height: number) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, width, height, 0, gl.RED, gl.FLOAT, data);
        gl.uniform1i(u(name), unit);
      };
      upload(1, "S", logoField(LOGO_S), LOGO_FIELD, LOGO_FIELD);
      upload(2, "A", logoField(LOGO_ARROW), LOGO_FIELD, LOGO_FIELD);

      const tip = norm(LOGO_ARROW[0]);
      const heart = norm([575, 655]); // The S opens through the middle of its diagonal, the widest stretch of stroke.
      const arrowHeight = (LOGO_ARROW[3][1] - LOGO_ARROW[0][1]) / ORIGIN.size;
      gl.uniform2f(u("uTipUv"), tip.x + 0.5, tip.y + 0.5);

      const size = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        el.width = Math.round(pin.clientWidth * dpr);
        el.height = Math.round(pin.clientHeight * dpr);
        gl.viewport(0, 0, el.width, el.height);
        const fields = wordFields(wordEl, pin);
        upload(0, "F", fields.first.data, fields.width, fields.height);
        upload(3, "R", fields.rest.data, fields.width, fields.height);
        gl.uniform4f(u("uFirstFrom"), ...fields.first.box);
        gl.uniform4f(u("uRestFrom"), ...fields.rest.box);
      };
      let resizing = 0;
      const onResize = () => {
        clearTimeout(resizing);
        resizing = window.setTimeout(size, 150);
      };
      size();
      addEventListener("resize", onResize);

      let p = 0;
      let raf = 0;
      let last = performance.now();

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        const r = root.getBoundingClientRect();
        const target = clamp01(-r.top / Math.max(1, r.height - innerHeight));
        p += (target - p) * (1 - Math.pow(0.9, dt * 60));

        // Until the morph starts the real word is on show, and the portal can open over it.
        const morphing = p >= MORPH[0];
        wordEl.style.visibility = morphing ? "hidden" : "";
        el.style.visibility = morphing ? "visible" : "hidden";
        pin.toggleAttribute("data-portal-off", morphing);
        if (!morphing) return;

        const aspect = pin.clientWidth / pin.clientHeight;
        const logo = Math.min(aspect * 0.82, 0.6);
        const lift = ease(within(p, LIFT));
        const open = within(p, OPEN);
        const zoom = 1 + 39 * open * open * open;
        pin.classList.toggle("morph-flying", p >= LIFT[0] && p < LIFT[1] && pointer.seen);

        const shrink = CURSOR_HEIGHT_PX / pin.clientHeight / (arrowHeight * logo);
        const tipX = pointer.seen ? (pointer.x / pin.clientWidth - 0.5) * aspect : aspect * 0.62;
        const tipY = pointer.seen ? 0.5 - pointer.y / pin.clientHeight : 0.62;

        gl.uniform1f(u("uAspect"), aspect);
        gl.uniform1f(u("uLogo"), logo);
        gl.uniform4f(u("uFirstTo"), ...logoBox(LOGO_S, logo, aspect));
        gl.uniform4f(u("uRestTo"), ...logoBox(LOGO_ARROW, logo, aspect));
        gl.uniform1f(u("uBlend"), ease(within(p, MORPH)));
        gl.uniform1f(u("uOpen"), open);
        gl.uniform1f(u("uZoom"), zoom);
        gl.uniform2f(u("uFocus"), heart.x * logo, heart.y * logo);
        gl.uniform2f(u("uTip"), mix(tip.x * logo, tipX, lift), mix(tip.y * logo, tipY, lift));
        gl.uniform1f(u("uArrowScale"), mix(1, shrink, lift));
        gl.uniform1f(u("uArrowOn"), p < LIFT[1] ? 1 : 0); // Landed: the real cursor has taken over.
        if (p > 0.985) gl.uniform3f(u("uBg"), 0.965, 0.965, 0.937);
        else gl.uniform3f(u("uBg"), 0.031, 0.031, 0.031);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
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
        clearTimeout(resizing);
        removeEventListener("resize", onResize);
      };
    };

    document.fonts.load('400 64px "Saneee Brand"').then(() => document.fonts.ready).then(() => {
      // A short wait so building the fields doesn't compete with the page's first paint.
      setTimeout(() => {
        if (!alive) return;
        try {
          start();
        } catch (err) {
          console.warn("Hero morph is off:", err);
          section.current?.classList.add("morph-static");
        }
      }, 100);
    });

    return () => {
      alive = false;
      removeEventListener("pointermove", onPointer);
      teardown();
    };
  }, []);

  return (
    <section ref={section} id="hero" className="morph">
      <div ref={stage} data-chapter="hero" className="hero">
        <canvas ref={canvas} className="morph-canvas" aria-hidden="true" />
        <p className="lede" style={{ "--ratio": 4.977 } as React.CSSProperties}>Designed to be distinguished.</p>
        <h1 ref={word} className="word" style={{ "--ratio": 4.977 } as React.CSSProperties}>SANEEE</h1>
      </div>
    </section>
  );
}
