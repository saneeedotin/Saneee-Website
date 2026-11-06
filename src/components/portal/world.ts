export type World = "sane" | "insane";

export const worldOf = (path: string): World =>
  path === "/insane" || path.startsWith("/insane/") ? "insane" : "sane";

/** The same page in the other world. */
export const otherPath = (path: string): string => {
  if (worldOf(path) === "insane") return path.replace(/^\/insane/, "") || "/";
  return path === "/" ? "/insane" : `/insane${path}`;
};

// Crossing worlds keeps your place: where you were is saved just before the switch, and read back on arrival.
const CROSSING = "saneee-crossing";
type Place = { to: string; chapter: string; nth: number; p: number };

/** Remember where the reader is (which chapter, which one of that name, how far through it) before switching worlds. */
export const rememberCrossing = () => {
  const middle = innerHeight / 2;
  const all = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
  const el = all.find((e) => { const r = e.getBoundingClientRect(); return r.top <= middle && r.bottom >= middle; });
  const max = document.documentElement.scrollHeight - innerHeight;
  // Outside every chapter (the footer): how far down the page instead.
  const place: Place = el
    ? { to: otherPath(location.pathname), chapter: el.dataset.chapter!, nth: all.filter((e) => e.dataset.chapter === el.dataset.chapter).indexOf(el), p: (middle - el.getBoundingClientRect().top) / el.offsetHeight }
    : { to: otherPath(location.pathname), chapter: "", nth: 0, p: max > 0 ? scrollY / max : 0 };
  try { sessionStorage.setItem(CROSSING, JSON.stringify(place)); } catch {}
};

/** On arrival at `path`: the scroll position for the same place in this world, or null if this wasn't a crossing. */
export const crossingY = (path: string): number | null => {
  let place: Place | null = null;
  try {
    place = JSON.parse(sessionStorage.getItem(CROSSING) ?? "null");
  } catch {}
  if (!place || place.to !== path) return null;
  if (!place.chapter) return place.p * (document.documentElement.scrollHeight - innerHeight);
  if (place.chapter === "hero") return 0;
  const same = [...document.querySelectorAll<HTMLElement>(`[data-chapter="${place.chapter}"]`)];
  const el = same[Math.min(place.nth, same.length - 1)];
  return el ? el.getBoundingClientRect().top + scrollY + place.p * el.offsetHeight - innerHeight / 2 : 0;
};

/** Done with the saved place, so a later visit to the page starts at the top. */
export const forgetCrossing = () => { try { sessionStorage.removeItem(CROSSING); } catch {} };

/** The chapter crossing the middle of the viewport. */
export const currentChapter = (): string => {
  const middle = innerHeight / 2;
  for (const el of document.querySelectorAll<HTMLElement>("[data-chapter]")) {
    const r = el.getBoundingClientRect();
    if (r.top <= middle && r.bottom >= middle) return el.dataset.chapter ?? "hero";
  }
  return "hero";
};
