"use client";

import { useEffect, useRef } from "react";
import type { Body as PieceBody, Constraint as Joint } from "matter-js";

type Tag = "h1" | "h2" | "p";
type Props = {
  text: string;
  as?: Tag;
  /** Letters for a short word (the hero), words for a headline, so it still reads. */
  split?: "letters" | "words";
  /** How it arrives: words fall in from above, or the letters already in place hop and land. */
  entrance?: "drop" | "hop";
  className?: string;
  style?: React.CSSProperties;
};

const TIDY_AFTER_ENTRANCE_MS = 1600;
const TIDY_AFTER_INPUT_MS = 3000;
const TIDY_SECONDS = 0.9;
const TAP_MS = 300;
const TAP_SLOP = 10; // px

/**
 * Type you can knock about (Insane only). Each letter or word is a Matter.js body; the DOM pieces only move by
 * transform, so the text stays real, selectable to screen readers, and laid out exactly as CSS sets it.
 * At rest every piece is static in its typeset place. A touch wakes it, and anything it hits wakes in turn.
 * After a few idle seconds everything glides home, so the page always ends up readable.
 */
export default function PhysicalType({ text, as: Tag = "h1", split = "words", entrance = "drop", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const parts = split === "letters" ? [...text] : text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let dispose = () => {};
    let alive = true;

    import("matter-js").then(({ default: Matter }) => {
      if (!alive) return;
      const { Engine, Bodies, Body, Composite, Constraint, Events } = Matter;
      const stage = el.closest<HTMLElement>(".hero, .belief, section") ?? el.parentElement!;
      const pieces = [...el.querySelectorAll<HTMLElement>(".phys")];
      let engine = Engine.create({ enableSleeping: true });
      let bodies: PieceBody[] = [];
      let homes: { x: number; y: number }[] = [];
      let raf = 0;
      let inView = false;
      let lastInput = 0;
      let tidyAt = Infinity;
      let tidying = false;
      let grab: { body: PieceBody; joint: Joint } | null = null;
      const pieceOf = new Map<PieceBody, number>();

      const origin = () => stage.getBoundingClientRect();

      // Measure every piece where CSS put it, and build the world around the heading.
      const build = () => {
        Composite.clear(engine.world, false);
        pieces.forEach((p) => (p.style.transform = ""));
        const o = origin();
        const head = el.getBoundingClientRect();
        homes = pieces.map((p) => {
          const r = p.getBoundingClientRect();
          return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2 };
        });
        bodies = pieces.map((p, i) => {
          const r = p.getBoundingClientRect();
          const b = Bodies.rectangle(homes[i].x, homes[i].y, r.width, r.height, {
            restitution: 0.35,
            friction: 0.4,
            frictionAir: 0.012,
            chamfer: { radius: Math.min(r.width, r.height) * 0.12 },
          });
          // Pinned after it's made, not born static: Matter only remembers a body's mass if it was once movable.
          Body.setStatic(b, true);
          pieceOf.set(b, i);
          return b;
        });
        // Floor at the heading's foot; walls at the stage's sides; the top stays open so things can fly.
        const floorY = head.bottom - o.top + 1;
        const t = 400;
        const wall = { isStatic: true, friction: 0.6, restitution: 0.2 };
        Composite.add(engine.world, [
          ...bodies,
          Bodies.rectangle(o.width / 2, floorY + t / 2, o.width + t * 2, t, wall),
          Bodies.rectangle(-t / 2, floorY - 2000, t, 4000, wall),
          Bodies.rectangle(o.width + t / 2, floorY - 2000, t, 4000, wall),
        ]);
      };

      const wake = (b: PieceBody) => {
        if (!b.isStatic || !pieceOf.has(b)) return;
        Body.setStatic(b, false);
        tidying = false;
      };

      const draw = () => {
        bodies.forEach((b, i) => {
          const h = homes[i];
          pieces[i].style.transform = `translate(${b.position.x - h.x}px, ${b.position.y - h.y}px) rotate(${b.angle}rad)`;
        });
      };

      const tidy = () => {
        tidying = true;
        bodies.forEach((b, i) => {
          if (b.isStatic && Math.abs(b.position.x - homes[i].x) < 0.5 && Math.abs(b.position.y - homes[i].y) < 0.5) return;
          Body.setStatic(b, true);
          const from = { x: b.position.x, y: b.position.y, a: b.angle };
          const start = performance.now();
          const step = (now: number) => {
            if (!tidying || !b.isStatic) return; // Knocked again on the way home.
            const t = Math.min(1, (now - start) / 1000 / TIDY_SECONDS);
            const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            // Turn the short way round.
            const a = from.a % (Math.PI * 2);
            const to = Math.abs(a) > Math.PI ? Math.sign(a) * Math.PI * 2 : 0;
            Body.setPosition(b, { x: from.x + (homes[i].x - from.x) * e, y: from.y + (homes[i].y - from.y) * e });
            Body.setAngle(b, a + (to - a) * e);
            if (t < 1) return requestAnimationFrame(step);
            Body.setPosition(b, homes[i]); // Exactly home, so the loop can tell it's done.
            Body.setAngle(b, 0);
          };
          requestAnimationFrame(step);
        });
      };

      const loop = () => {
        const now = performance.now();
        Engine.update(engine, 1000 / 60);
        draw();
        if (!tidying && now > tidyAt && !grab) {
          tidyAt = Infinity;
          tidy();
        }
        const moving = bodies.some((b, i) => !b.isStatic || b.position.x !== homes[i].x || b.position.y !== homes[i].y || b.angle !== 0);
        raf = inView && (moving || grab) ? requestAnimationFrame(loop) : 0;
      };
      const run = () => { if (!raf && inView) raf = requestAnimationFrame(loop); };
      const touched = (ms = TIDY_AFTER_INPUT_MS) => {
        lastInput = performance.now();
        tidyAt = lastInput + ms;
        run();
      };

      // Anything a moving piece hits joins in.
      Events.on(engine, "collisionStart", (e) => {
        e.pairs.forEach(({ bodyA, bodyB }) => {
          if (!bodyA.isStatic || !bodyB.isStatic) { wake(bodyA); wake(bodyB); }
        });
      });

      const entrances = () => {
        if (entrance === "hop") {
          bodies.forEach((b, i) => setTimeout(() => {
            wake(b);
            Body.setVelocity(b, { x: (Math.random() - 0.5) * 4, y: -9 - Math.random() * 4 });
            Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.25);
            run();
          }, i * 70));
        } else {
          const o = origin();
          bodies.forEach((b, i) => {
            wake(b);
            Body.setPosition(b, { x: homes[i].x + (Math.random() - 0.5) * 60, y: -o.height * 0.2 - Math.random() * 500 - i * 40 });
            Body.setAngle(b, (Math.random() - 0.5) * 1.2);
          });
          draw();
        }
        touched(TIDY_AFTER_ENTRANCE_MS);
      };

      // Mouse: brushing a piece shoves it the way the cursor was going; pressing grabs it.
      let last = { x: 0, y: 0, t: 0 };
      const local = (e: PointerEvent) => { const o = origin(); return { x: e.clientX - o.left, y: e.clientY - o.top }; };
      const onOver = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || grab) return;
        const i = pieces.indexOf(e.currentTarget as HTMLElement);
        const dt = Math.max(16, performance.now() - last.t);
        const p = local(e);
        wake(bodies[i]);
        Body.setVelocity(bodies[i], { x: ((p.x - last.x) / dt) * 10, y: ((p.y - last.y) / dt) * 10 - 3 });
        Body.setAngularVelocity(bodies[i], (Math.random() - 0.5) * 0.2);
        touched();
      };
      const onTrack = (e: PointerEvent) => { if (e.pointerType === "mouse") last = { ...local(e), t: performance.now() }; };

      let down: { x: number; y: number; t: number; i: number } | null = null;
      const onDown = (e: PointerEvent) => {
        const i = pieces.indexOf(e.currentTarget as HTMLElement);
        if (e.pointerType !== "mouse") { down = { x: e.clientX, y: e.clientY, t: performance.now(), i }; return; }
        if (e.button !== 0) return;
        e.preventDefault(); // No text selection while throwing.
        const b = bodies[i];
        wake(b);
        const p = local(e);
        const joint = Constraint.create({ pointA: p, bodyB: b, pointB: { x: p.x - b.position.x, y: p.y - b.position.y }, stiffness: 0.2, damping: 0.1, length: 0 });
        Composite.add(engine.world, joint);
        grab = { body: b, joint };
        touched();
      };
      const onMove = (e: PointerEvent) => {
        if (!grab) return;
        grab.joint.pointA = local(e);
        touched();
      };
      const onUp = (e: PointerEvent) => {
        if (grab) {
          Composite.remove(engine.world, grab.joint);
          grab = null;
          touched();
        }
        // Touch: a quick tap flicks the piece; anything longer is a scroll or the portal's long press.
        if (down && e.type === "pointerup" && performance.now() - down.t < TAP_MS && Math.hypot(e.clientX - down.x, e.clientY - down.y) < TAP_SLOP) {
          const b = bodies[down.i];
          wake(b);
          Body.setVelocity(b, { x: (Math.random() - 0.5) * 8, y: -14 - Math.random() * 5 });
          Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.4);
          touched();
        }
        down = null;
      };

      pieces.forEach((p) => {
        p.addEventListener("pointerenter", onOver);
        p.addEventListener("pointerdown", onDown);
      });
      stage.addEventListener("pointermove", onTrack, { passive: true });
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("pointerup", onUp);
      addEventListener("pointercancel", onUp);

      // Width changes reflow the text, so start again from the new layout.
      let width = innerWidth;
      const onResize = () => {
        if (innerWidth === width) return;
        width = innerWidth;
        engine = Engine.create({ enableSleeping: true });
        Events.on(engine, "collisionStart", (e) => e.pairs.forEach(({ bodyA, bodyB }) => { if (!bodyA.isStatic || !bodyB.isStatic) { wake(bodyA); wake(bodyB); } }));
        build();
      };
      addEventListener("resize", onResize);

      // Arrive once the stage is on screen and the loader has finished covering the page.
      let arrived = false;
      const loaderDone = () => !document.documentElement.dataset.load;
      const tryArrive = () => {
        if (arrived || !inView || !loaderDone()) return;
        arrived = true;
        build();
        setTimeout(entrances, entrance === "hop" ? 500 : 0);
      };
      const io = new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        tryArrive();
        run();
      }, { threshold: 0.25 });
      io.observe(stage);
      const mo = new MutationObserver(tryArrive);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-load"] });

      dispose = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        mo.disconnect();
        pieces.forEach((p) => {
          p.removeEventListener("pointerenter", onOver);
          p.removeEventListener("pointerdown", onDown);
          p.style.transform = "";
        });
        stage.removeEventListener("pointermove", onTrack);
        removeEventListener("pointermove", onMove);
        removeEventListener("pointerup", onUp);
        removeEventListener("pointercancel", onUp);
        removeEventListener("resize", onResize);
        Engine.clear(engine);
      };
    });

    return () => {
      alive = false;
      dispose();
    };
  }, [entrance]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style}>
      {parts.map((p, i) => (
        <span key={i}>
          {/* Spaces stay as plain text between words, so the line wraps exactly as before. */}
          {i > 0 && split === "words" ? " " : null}
          <span className="phys">{p}</span>
        </span>
      ))}
    </Tag>
  );
}
