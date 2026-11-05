"use client";

import { useRef } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import ShutterLink from "./ShutterLink";

const OPEN_SECONDS = 0.8;
const CLOSE_SECONDS = 0.45;

function Shop({ project }: { project: Project }) {
  const shop = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const open = useRef(0);
  const raf = useRef(0);
  const drag = useRef<{ y: number; from: number; height: number } | null>(null);
  const dragged = useRef(false);

  const apply = (v: number) => {
    open.current = Math.max(0, Math.min(1, v));
    shop.current?.style.setProperty("--o", open.current.toFixed(3));
  };

  const finish = () => {
    const isOpen = open.current > 0.5;
    button.current?.setAttribute("aria-expanded", String(isOpen));
    button.current?.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} the shutter of ${project.name}`);
  };

  const settle = (target: number) => {
    cancelAnimationFrame(raf.current);
    const from = open.current;
    const seconds = target > from ? OPEN_SECONDS : CLOSE_SECONDS;
    if (from === target || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(target);
      finish();
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1000 / seconds);
      apply(from + (target - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf.current = requestAnimationFrame(step);
      else finish();
    };
    raf.current = requestAnimationFrame(step);
  };

  const endDrag = () => {
    if (!drag.current) return;
    const { from } = drag.current;
    drag.current = null;
    // A short pull is enough to open, and a short push enough to close.
    if (dragged.current) settle((from < 0.5 ? open.current > 0.22 : open.current > 0.78) ? 1 : 0);
  };

  const place = [project.business, project.where].filter(Boolean).join(", ");
  return (
    <article ref={shop} className="shop" style={{ "--o": 0 } as React.CSSProperties}>
      <div className="sign" style={{ background: project.sign.background, color: project.sign.color }}>
        <h3>{project.name}</h3>
      </div>
      <div className="bay">
        <img src={project.image} alt={`${project.name} website`} loading="lazy" draggable={false} />
        <button
          ref={button}
          className="shutter"
          type="button"
          aria-expanded="false"
          aria-label={`Open the shutter of ${project.name}`}
          onPointerDown={(e) => {
            // With a finger only the handle drags, so the rest of the shutter still scrolls the page.
            if (e.pointerType !== "mouse" && !(e.target as Element).closest(".pull")) return;
            cancelAnimationFrame(raf.current);
            drag.current = { y: e.clientY, from: open.current, height: e.currentTarget.clientHeight * 0.93 };
            dragged.current = false;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dy = drag.current.y - e.clientY;
            if (Math.abs(dy) > 6) dragged.current = true;
            if (dragged.current) apply(drag.current.from + dy / drag.current.height);
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={() => {
            if (dragged.current) {
              dragged.current = false;
              return;
            }
            settle(open.current > 0.5 ? 0 : 1);
          }}
        >
          <span className="spray" aria-hidden="true">{project.spray}</span>
          <span className="pull" aria-hidden="true">Pull</span>
        </button>
      </div>
      <p className="shop-kind">{place}</p>
      <ShutterLink className="shop-link" href={`/insane/work/${project.slug}`} project={project}>
        See the project <span aria-hidden="true">→</span>
      </ShutterLink>
      {project.live && (
        <a className="shop-link" href={project.live.url} target="_blank" rel="noopener">
          {project.live.label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}

export default function ShutterStreet() {
  return (
    <div className="street" data-portal-off>
      <div className="shops">
        {projects.map((p) => <Shop key={p.slug} project={p} />)}
      </div>
    </div>
  );
}
