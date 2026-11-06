"use client";

import { useEffect, useRef } from "react";
import type { Body as PieceBody, Constraint as Joint } from "matter-js";

type Props = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

const TIDY_AFTER_MS = 3000;
const TIDY_SECONDS = 0.9;
const TAP_MS = 300;
const TAP_SLOP = 10; // px

/**
 * A word whose letters you can grab and throw (the Insane hero). Until someone does, it is plain type and costs
 * nothing: Matter.js loads on the first hover or press. Letters move by transform only, so the text stays real and
 * laid out exactly as CSS sets it. A thrown letter knocks the others loose; after a few idle seconds all glide home.
 */
export default function PhysicalType({ text, className, style }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pieces = [...el.querySelectorAll<HTMLElement>(".phys")];
    const stage = el.closest<HTMLElement>(".hero") ?? el.parentElement!;
    let alive = true;
    let world: ReturnType<typeof makeWorld> | null = null;
    let loading: Promise<void> | null = null;

    // Fetch the engine as soon as a pointer comes near, so a grab rarely has to wait.
    const load = () =>
      (loading ??= import("matter-js").then(({ default: Matter }) => {
        if (alive) world = makeWorld(Matter, el, stage, pieces);
      }));

    let down: { x: number; y: number; t: number; i: number } | null = null;
    let pressed = false;
    let last = { x: 0, y: 0 };
    const onEnter = () => { load(); };
    const onDown = (e: PointerEvent) => {
      const i = pieces.indexOf(e.currentTarget as HTMLElement);
      if (e.pointerType !== "mouse") {
        down = { x: e.clientX, y: e.clientY, t: performance.now(), i };
        load();
        return;
      }
      if (e.button !== 0) return;
      e.preventDefault(); // No text selection while throwing.
      pressed = true;
      last = { x: e.clientX, y: e.clientY };
      load().then(() => { if (pressed) world?.grab(i, last); }); // Unless the button went up while loading.
    };
    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      world?.drag(last);
    };
    const onUp = (e: PointerEvent) => {
      pressed = false;
      world?.release();
      // Touch: only a quick tap flicks a letter; anything longer is a scroll or the portal's long press.
      const d = down;
      down = null;
      if (d && e.type === "pointerup" && performance.now() - d.t < TAP_MS && Math.hypot(e.clientX - d.x, e.clientY - d.y) < TAP_SLOP) {
        load().then(() => world?.flick(d.i));
      }
    };

    pieces.forEach((p) => {
      p.addEventListener("pointerenter", onEnter);
      p.addEventListener("pointerdown", onDown);
    });
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);

    return () => {
      alive = false;
      world?.dispose();
      pieces.forEach((p) => {
        p.removeEventListener("pointerenter", onEnter);
        p.removeEventListener("pointerdown", onDown);
      });
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <h1 ref={ref} className={className} style={style}>
      {[...text].map((c, i) => <span key={i} className="phys">{c}</span>)}
    </h1>
  );
}

/** The physics, built on first use. Every letter starts pinned in its typeset place. */
function makeWorld(Matter: typeof import("matter-js"), el: HTMLElement, stage: HTMLElement, pieces: HTMLElement[]) {
  const { Engine, Bodies, Body, Composite, Constraint, Events } = Matter;
  const engine = Engine.create({ enableSleeping: true });
  let bodies: PieceBody[] = [];
  let homes: { x: number; y: number }[] = [];
  let raf = 0;
  let tidyAt = Infinity;
  let tidying = false;
  let held: { body: PieceBody; joint: Joint } | null = null;

  const local = (p: { x: number; y: number }) => {
    const o = stage.getBoundingClientRect();
    return { x: p.x - o.left, y: p.y - o.top };
  };

  const build = () => {
    Composite.clear(engine.world, false);
    pieces.forEach((p) => (p.style.transform = ""));
    const o = stage.getBoundingClientRect();
    const head = el.getBoundingClientRect();
    homes = pieces.map((p) => {
      const r = p.getBoundingClientRect();
      return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2 };
    });
    bodies = pieces.map((p, i) => {
      const r = p.getBoundingClientRect();
      const b = Bodies.rectangle(homes[i].x, homes[i].y, r.width, r.height, {
        restitution: 0.3,
        friction: 0.4,
        frictionAir: 0.015,
        chamfer: { radius: Math.min(r.width, r.height) * 0.12 },
      });
      // Pinned after it's made, not born static: Matter only remembers a body's mass if it was once movable.
      Body.setStatic(b, true);
      Body.setPosition(b, homes[i]); // The chamfer nudges the centroid; home has to match exactly.
      return b;
    });
    // Floor at the word's foot, walls at the hero's sides, a lid at its top (the hero clips anything beyond).
    const floorY = head.bottom - o.top + 1;
    const t = 400;
    const wall = { isStatic: true, friction: 0.6, restitution: 0.2 };
    Composite.add(engine.world, [
      ...bodies,
      Bodies.rectangle(o.width / 2, floorY + t / 2, o.width + t * 2, t, wall),
      Bodies.rectangle(o.width / 2, -t / 2, o.width + t * 2, t, wall),
      Bodies.rectangle(-t / 2, floorY / 2, t, floorY + t * 2, wall),
      Bodies.rectangle(o.width + t / 2, floorY / 2, t, floorY + t * 2, wall),
    ]);
  };

  const wake = (b: PieceBody) => {
    if (!b.isStatic || !bodies.includes(b)) return;
    Body.setStatic(b, false);
    tidying = false;
  };

  // Anything a moving letter hits joins in.
  Events.on(engine, "collisionStart", (e) => {
    e.pairs.forEach(({ bodyA, bodyB }) => {
      if (!bodyA.isStatic || !bodyB.isStatic) { wake(bodyA); wake(bodyB); }
    });
  });

  const atHome = (b: PieceBody, i: number) => b.isStatic && b.position.x === homes[i].x && b.position.y === homes[i].y && b.angle === 0;

  const draw = () => bodies.forEach((b, i) => {
    pieces[i].style.transform = atHome(b, i) ? "" : `translate(${b.position.x - homes[i].x}px, ${b.position.y - homes[i].y}px) rotate(${b.angle}rad)`;
  });

  const tidy = () => {
    tidying = true;
    bodies.forEach((b, i) => {
      if (atHome(b, i)) return;
      Body.setStatic(b, true);
      const from = { x: b.position.x, y: b.position.y, a: b.angle % (Math.PI * 2) };
      const to = Math.abs(from.a) > Math.PI ? Math.sign(from.a) * Math.PI * 2 : 0; // The short way round.
      const start = performance.now();
      const step = (now: number) => {
        if (!tidying || !b.isStatic) return; // Knocked again on the way home.
        const t = Math.min(1, (now - start) / 1000 / TIDY_SECONDS);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        Body.setPosition(b, { x: from.x + (homes[i].x - from.x) * e, y: from.y + (homes[i].y - from.y) * e });
        Body.setAngle(b, from.a + (to - from.a) * e);
        if (t < 1) return void requestAnimationFrame(step);
        Body.setPosition(b, homes[i]); // Exactly home, so the loop can tell it's done.
        Body.setAngle(b, 0);
      };
      requestAnimationFrame(step);
    });
  };

  const loop = () => {
    Engine.update(engine, 1000 / 60);
    draw();
    if (!tidying && !held && performance.now() > tidyAt) {
      tidyAt = Infinity;
      tidy();
    }
    // Stops once every letter is back, so a still hero costs nothing.
    raf = held || bodies.some((b, i) => !atHome(b, i)) ? requestAnimationFrame(loop) : 0;
  };
  const touched = () => {
    tidyAt = performance.now() + TIDY_AFTER_MS;
    if (!raf) raf = requestAnimationFrame(loop);
  };

  // Width changes reflow the word, so start again from the new layout.
  let width = innerWidth;
  const onResize = () => {
    if (innerWidth === width) return;
    width = innerWidth;
    held = null;
    build();
  };
  addEventListener("resize", onResize);
  build();

  return {
    grab(i: number, at: { x: number; y: number }) {
      const b = bodies[i];
      wake(b);
      const p = local(at);
      const joint = Constraint.create({ pointA: p, bodyB: b, pointB: { x: p.x - b.position.x, y: p.y - b.position.y }, stiffness: 0.2, damping: 0.1, length: 0 });
      Composite.add(engine.world, joint);
      held = { body: b, joint };
      touched();
    },
    drag(at: { x: number; y: number }) {
      if (!held) return;
      held.joint.pointA = local(at);
      touched();
    },
    release() {
      if (!held) return;
      Composite.remove(engine.world, held.joint);
      held = null;
      touched();
    },
    flick(i: number) {
      const b = bodies[i];
      wake(b);
      Body.setVelocity(b, { x: (Math.random() - 0.5) * 8, y: -14 - Math.random() * 5 });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.4);
      touched();
    },
    dispose() {
      cancelAnimationFrame(raf);
      tidying = false;
      removeEventListener("resize", onResize);
      pieces.forEach((p) => (p.style.transform = ""));
      Engine.clear(engine);
    },
  };
}
