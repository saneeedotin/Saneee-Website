"use client";

import dynamic from "next/dynamic";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { team } from "@/data/team";
import type { Person } from "@/types";

type LanyardProps = {
  frontImage: string;
  backImage: string;
  strapImage: string;
  strapColor: string;
  cardColor: string;
  cornerRadius: number;
  size: number;
  strapLength: number;
  strapWidth: number;
  metal: "graphite" | "silver" | "gold";
};

// Loads only when a badge mounts, so three stays out of the first page load.
const Lanyard = dynamic(() => import("./Lanyard") as unknown as Promise<{ default: ComponentType<LanyardProps> }>, { ssr: false });

function Badge({ person }: { person: Person }) {
  const box = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    // Reduced motion and browsers without WebGL keep the plain portrait.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.WebGL2RenderingContext) return;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      setLive(true);
    }, { rootMargin: "300px 0px" });
    near.observe(box.current!);
    return () => near.disconnect();
  }, []);

  return (
    <li>
      <div ref={box} className="badge" data-portal-off>
        {live ? (
          <Lanyard
            frontImage={person.image}
            backImage="/img/card-back.svg"
            strapImage="/img/strap.svg"
            strapColor="#080808"
            cardColor="#080808"
            cornerRadius={0.18}
            size={0.62}
            strapLength={0.3}
            strapWidth={0.9}
            metal="graphite"
          />
        ) : (
          <img src={person.image} alt="" loading="lazy" />
        )}
      </div>
      <h3 className="h4">{person.name}</h3>
    </li>
  );
}

export default function TeamBadges() {
  return (
    <ul className="people">
      {team.map((p) => <Badge key={p.name} person={p} />)}
    </ul>
  );
}
