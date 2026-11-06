"use client";

import { useEffect, useState } from "react";

export type StaggerItem = { title: string; line: string; image?: string };

/**
 * A fan of cards: the middle one lifted and inked, the rest scattered either side. Click a card, or the arrows,
 * to bring it to the middle. Adapted from 21st.dev's stagger testimonials, in the site's own colours.
 */
export default function StaggerCards({ items, label }: { items: StaggerItem[]; label: string }) {
  const [size, setSize] = useState(365);
  // Each card keeps a stable key and number while the order rotates.
  const [list, setList] = useState(() => items.map((item, n) => ({ ...item, n, key: n })));

  useEffect(() => {
    const fit = () => setSize(matchMedia("(min-width: 640px)").matches ? 365 : 290);
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  const move = (steps: number) => {
    setList((prev) => {
      const next = [...prev];
      for (let i = 0; i < Math.abs(steps); i++) {
        if (steps > 0) next.push({ ...next.shift()!, key: Math.random() });
        else next.unshift({ ...next.pop()!, key: Math.random() });
      }
      return next;
    });
  };

  const middle = Math.floor(list.length / 2);
  const current = list[middle];
  return (
    <div className="stagger" role="group" aria-roledescription="carousel" aria-label={label}>
      {list.map((item, index) => {
        const position = index - middle;
        const centre = position === 0;
        return (
          <button
            key={item.key}
            type="button"
            className={centre ? "stagger-card is-centre" : "stagger-card"}
            onClick={() => move(position)}
            aria-current={centre || undefined}
            aria-label={centre ? undefined : `Show ${item.title}`}
            tabIndex={centre ? 0 : -1}
            style={{
              width: size,
              height: size,
              zIndex: centre ? 2 : 1,
              transform: `translate(-50%, -50%) translateX(${(size / 1.5) * position}px) translateY(${centre ? -65 : position % 2 ? 15 : -15}px) rotate(${centre ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
            }}
          >
            <span className="stagger-cut" aria-hidden="true" />
            {item.image && <img src={item.image} alt="" loading="lazy" />}
            <span className="stagger-title">{item.title}</span>
            <span className="stagger-line">{item.line}</span>
            <span className="label stagger-n">{String(item.n + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          </button>
        );
      })}
      <div className="stagger-arrows">
        <button type="button" onClick={() => move(-1)} aria-label="Previous">←</button>
        <button type="button" onClick={() => move(1)} aria-label="Next">→</button>
      </div>
      <p className="vh" aria-live="polite">{current.title}: {current.line}</p>
    </div>
  );
}
