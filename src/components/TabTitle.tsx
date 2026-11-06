"use client";

import { useEffect } from "react";
import { projects } from "@/data/projects";
import { worldOf } from "./portal/world";

// What the tab says while you're looking at another one, in each world's voice.
const AWAY = {
  sane: ["Still here when you are.", "We saved your spot.", "Your sane tab misses you."],
  insane: ["Come back. It's insane out here.", "Hey. HEY. Over here.", "We miss you already 🥺"],
};

// …and while you're off looking at our work, which opens in its own tab.
const AWAY_AT_WORK = {
  sane: ["So, what do you think?", "Seen enough? We're right here."],
  insane: ["So? Insane, right?", "Told you. Now come back."],
};

/** Swaps the tab title while the page is hidden, and puts the real one back on return. */
export default function TabTitle() {
  useEffect(() => {
    let real = document.title;
    let count = 0;
    let atWork = false;
    // A case study or a client's live site, opened in a new tab.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[target="_blank"]');
      if (!a) return;
      atWork = a.pathname.includes("/work/") || projects.some((p) => p.live && a.href.startsWith(p.live.url.replace(/\/$/, "")));
    };
    const onChange = () => {
      if (document.hidden) {
        real = document.title;
        const lines = (atWork ? AWAY_AT_WORK : AWAY)[worldOf(location.pathname)];
        document.title = lines[count++ % lines.length];
      } else {
        document.title = real;
        atWork = false;
      }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onChange);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onChange);
    };
  }, []);

  return null;
}
