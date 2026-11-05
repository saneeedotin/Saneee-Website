"use client";

import { useEffect } from "react";
import { worldOf } from "./portal/world";

// What the tab says while you're looking at another one, in each world's voice.
const AWAY = {
  sane: ["Still here when you are.", "We saved your spot.", "Your sane tab misses you."],
  insane: ["Come back. It's insane out here.", "Hey. HEY. Over here.", "We miss you already 🥺"],
};

/** Swaps the tab title while the page is hidden, and puts the real one back on return. */
export default function TabTitle() {
  useEffect(() => {
    let real = document.title;
    let count = 0;
    const onChange = () => {
      if (document.hidden) {
        real = document.title;
        const lines = AWAY[worldOf(location.pathname)];
        document.title = lines[count++ % lines.length];
      } else {
        document.title = real;
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return null;
}
