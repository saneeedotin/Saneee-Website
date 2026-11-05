"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { paintPoster } from "./posters";
import { FRAGMENT, POINTS, VERTEX } from "./shader";
import { currentChapter, otherPath, worldOf } from "./world";

const INTERACTIVE = "a,button,input,textarea,select,label,summary,[data-portal-off]";
const REST_MS = 1500;
const HOLD_SECONDS = 0.95;
const MOVE_CANCELS_HOLD = 12; // px; further than this is a drag or text selection, not a hold

export default function Portal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const pathRef = useRef(pathname);
  const crossingRef = useRef(false);

  useEffect(() => {
    pathRef.current = pathname;
    if (!crossingRef.current) return;
    // The flooded hole hides the swap, then drains to reveal the new page.
    const t = setTimeout(() => { crossingRef.current = false; }, 140);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) return; // The world switch in the nav still works without WebGL.

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uni = { R: u("R"), T: u("T"), O: u("O"), F: u("F"), S: u("S"), H: u("H"), P: u("P") };

    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const trail = Array.from({ length: POINTS }, () => ({ x: 0.5, y: 0.5 }));
    const pointer = { x: 0, y: 0, seen: false, overInteractive: false, lastMove: 0 };
    let open = 0;
    let hold = 0;
    let pressing = false;
    let touching = false;
    let pressAt = { x: 0, y: 0 };
    let posterKey = "";
    let fontsReady = false;
    let raf = 0;
    let lastFrame = 0;

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uni.R, w, h);
      posterKey = "";
      wake();
    };

    // The poster only changes while the hole is not flooded, so a crossing can't flash the wrong one.
    const syncPoster = () => {
      if (!fontsReady || hold > 0.02 || crossingRef.current) return;
      const target = worldOf(pathRef.current) === "sane" ? "insane" : "sane";
      const chapter = currentChapter();
      const key = `${target}:${chapter}:${canvas.width}x${canvas.height}`;
      if (key === posterKey) return;
      posterKey = key;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, paintPoster(target, chapter, canvas.width, canvas.height));
    };

    const frame = (now: number) => {
      const elapsed = (now - lastFrame) / 1000;
      const dt = Math.min(elapsed, 0.1); // Smoothing can't jump, but the hold below always takes real time.
      lastFrame = now;
      const blend = (k: number) => 1 - Math.pow(1 - k, dt * 60);

      const resting = now - pointer.lastMove > REST_MS;
      const mouseWantsOpen = pointer.seen && !pointer.overInteractive && (!resting || pressing);
      const wantsOpen = crossingRef.current || touching || mouseWantsOpen;
      open += ((wantsOpen ? 1 : 0) - open) * blend(wantsOpen ? 0.14 : 0.2);

      if (crossingRef.current) hold = 1;
      else if (pressing) hold = Math.min(1, hold + elapsed / HOLD_SECONDS);
      else hold = Math.max(0, hold - elapsed / (hold > 0.6 ? 0.5 : 0.25));

      if (pressing && hold >= 1 && !crossingRef.current) {
        crossingRef.current = true;
        pressing = false;
        touching = false;
        router.push(`${otherPath(pathRef.current)}#${currentChapter()}`);
      }

      const tx = pointer.x / canvas.clientWidth;
      const ty = 1 - pointer.y / canvas.clientHeight;
      if (open < 0.02) trail.forEach((p) => { p.x = tx; p.y = ty; }); // Opens at the cursor, not where it last closed.
      trail[0].x += (tx - trail[0].x) * blend(0.16);
      trail[0].y += (ty - trail[0].y) * blend(0.16);
      for (let i = 1; i < POINTS; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * blend(0.34);
        trail[i].y += (trail[i - 1].y - trail[i].y) * blend(0.34);
      }

      syncPoster();
      gl.uniform1f(uni.T, now / 1000);
      gl.uniform1f(uni.S, open);
      gl.uniform1f(uni.H, hold);
      gl.uniform1f(uni.F, hold * hold);
      // Hero posters scroll with the hero, so the two words stay locked together.
      gl.uniform1f(uni.O, currentChapter() === "hero" ? scrollY / canvas.clientHeight : 0);
      gl.uniform2fv(uni.P, new Float32Array(trail.flatMap((p) => [p.x, p.y])));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const idle = open < 0.005 && hold === 0 && !wantsOpen;
      raf = idle ? 0 : requestAnimationFrame(frame);
      if (idle) gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const wake = () => {
      if (raf) return;
      lastFrame = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (e.pointerType === "mouse") {
        pointer.seen = true;
        pointer.lastMove = performance.now();
        pointer.overInteractive = !!(e.target as Element)?.closest?.(INTERACTIVE);
      }
      if (pressing && Math.hypot(e.clientX - pressAt.x, e.clientY - pressAt.y) > MOVE_CANCELS_HOLD) pressing = false;
      wake();
    };

    // Scrolling moves the page under a still cursor, so what it's over has to be checked again.
    const onScroll = () => {
      if (!pointer.seen) return;
      pointer.overInteractive = !!document.elementFromPoint(pointer.x, pointer.y)?.closest(INTERACTIVE);
      wake();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || crossingRef.current) return;
      const target = e.target as Element;
      if (target.closest?.(INTERACTIVE)) return;
      // On touch the hole lives in the hero only, so everywhere else scrolls normally.
      if (e.pointerType !== "mouse") {
        if (!target.closest?.('[data-chapter="hero"]')) return;
        touching = true;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pressing = true;
      pressAt = { x: e.clientX, y: e.clientY };
      wake();
    };

    const onUp = () => {
      pressing = false;
      touching = false;
      wake();
    };

    const onLeave = () => {
      pointer.seen = false;
      wake();
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointerdown", onDown);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    addEventListener("resize", size);
    document.documentElement.addEventListener("mouseleave", onLeave);

    let alive = true;
    document.fonts.load('400 100px "Saneee Brand"').then(() => document.fonts.ready).then(() => {
      if (!alive) return;
      fontsReady = true;
      posterKey = "";
    });
    size();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      removeEventListener("resize", size);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [router]);

  return <canvas ref={canvasRef} className="portal" aria-hidden="true" />;
}
