"use client";

import dynamic from "next/dynamic";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { team } from "@/data/team";

type LanyardProps = {
  cards: { frontImage: string; backImage: string; name: string }[];
  cardColor: string;
  nameColor: string;
  cornerRadius: number;
  size: number;
  strapImage: string;
  strapColor: string;
  strapLength: number;
  strapWidth: number;
  metal: "graphite" | "silver" | "gold";
};

// Loads only when the section is close, so three stays out of the first page load.
const Lanyard = dynamic(() => import("./Lanyard") as unknown as Promise<{ default: ComponentType<LanyardProps> }>, { ssr: false });

const CARDS = team.map((p) => ({ frontImage: p.image, backImage: "/img/card-back.svg", name: p.name }));

export default function TeamBadges() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"waiting" | "live" | "still">("waiting");
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    // Reduced motion and browsers without WebGL keep plain portraits.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.WebGL2RenderingContext) {
      setMode("still");
      return;
    }
    const phone = matchMedia("(max-width: 760px)");
    const onChange = () => setNarrow(phone.matches);
    onChange();
    phone.addEventListener("change", onChange);
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      setMode("live");
    }, { rootMargin: "300px 0px" });
    near.observe(box.current!);
    return () => {
      near.disconnect();
      phone.removeEventListener("change", onChange);
    };
  }, []);

  // Four across would be tiny on a phone, so it gets two stages of two.
  const stages = narrow ? [CARDS.slice(0, 2), CARDS.slice(2)] : [CARDS];

  return (
    <div ref={box} className={mode === "still" ? "team team-static" : "team"} data-portal-off>
      {mode === "live" ? (
        <>
          {team.map((p) => <h3 key={p.name} className="vh">{p.name}</h3>)}
          {stages.map((cards) => (
            <div key={cards.map((c) => c.name).join()} className="team-stage">
              <Lanyard
                cards={cards}
                cardColor="#080808"
                nameColor="#F6F6EF"
                cornerRadius={0.18}
                size={narrow ? 0.62 : 0.5}
                strapImage="/img/strap.svg"
                strapColor="#080808"
                strapLength={0.3}
                strapWidth={0.9}
                metal="graphite"
              />
            </div>
          ))}
        </>
      ) : (
        <ul className="team-still">
          {team.map((p) => (
            <li key={p.name}>
              <img src={p.image} alt="" loading="lazy" />
              <h3 className="h4">{p.name}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
