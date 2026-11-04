export type World = "sane" | "insane";

export const worldOf = (path: string): World =>
  path === "/insane" || path.startsWith("/insane/") ? "insane" : "sane";

/** The same page in the other world. */
export const otherPath = (path: string): string => {
  if (worldOf(path) === "insane") return path.replace(/^\/insane/, "") || "/";
  return path === "/" ? "/insane" : `/insane${path}`;
};

/** The chapter crossing the middle of the viewport. */
export const currentChapter = (): string => {
  const middle = innerHeight / 2;
  for (const el of document.querySelectorAll<HTMLElement>("[data-chapter]")) {
    const r = el.getBoundingClientRect();
    if (r.top <= middle && r.bottom >= middle) return el.dataset.chapter ?? "hero";
  }
  return "hero";
};
