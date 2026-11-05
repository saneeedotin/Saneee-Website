"use client";

import { useEffect, useState } from "react";

const format = () =>
  new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date());

/** The studio's own clock, so visitors know whether we're awake. */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(format());
    const tick = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(tick);
  }, []);

  // Rendered after hydration only: the build-time clock would be wrong by the time anyone reads it.
  return <span className="footer-time">{time ? <><span className="footer-dot" aria-hidden="true" />{time} IST</> : " "}</span>;
}
