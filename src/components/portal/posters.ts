import type { World } from "./world";

type Poster = { word: string; line?: string };

// What the hole shows: the chapter you're in, as it looks from the other world.
const POSTERS: Record<World, Record<string, Poster>> = {
  insane: {
    hero: { word: "INSANE", line: "Sanely built. Insanely good." },
    services: { word: "WE MAKE" },
    work: { word: "THE STREET" },
    people: { word: "SUSPECTS" },
    contact: { word: "SAY HI" },
  },
  sane: {
    hero: { word: "SANEEE", line: "Designed to be distinguished." },
    services: { word: "SERVICES" },
    work: { word: "WORK" },
    people: { word: "PEOPLE" },
    contact: { word: "CONTACT" },
  },
};

const COLOURS: Record<World, { bg: string; fg: string }> = {
  insane: { bg: "#C7FF2E", fg: "#080808" },
  sane: { bg: "#080808", fg: "#F6F6EF" },
};

export const gutter = (w: number) => Math.max(16, Math.min(48, w * 0.03));

/** Paints one poster at the given size. Letters are never stretched: the word scales to the width. */
export const paintPoster = (world: World, chapter: string, w: number, h: number): HTMLCanvasElement => {
  const poster = POSTERS[world][chapter] ?? POSTERS[world].hero;
  const { bg, fg } = COLOURS[world];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;

  const g = gutter(w);
  ctx.font = '400 100px "Saneee Brand"';
  const size = (100 * (w - 2 * g)) / ctx.measureText(poster.word).width;
  ctx.font = `400 ${size}px "Saneee Brand"`;
  // Matches `.word` in globals.css, so the word lands exactly where the page's own hero word sits.
  const bottom = h - g - size * 0.025;
  ctx.fillText(poster.word, g, bottom);

  // shortcut: repeated words so the hole is never blank green, hand-designed posters come in Milestone 4.
  if (!poster.line) {
    for (let y = bottom - size * 0.82; y > -size; y -= size * 0.82) ctx.fillText(poster.word, g, y);
    return canvas;
  }

  const serif = getComputedStyle(document.documentElement).getPropertyValue("--font-serif") || "serif";
  const lineSize = Math.max(26, Math.min(64, w * 0.04));
  ctx.font = `italic 400 ${lineSize}px ${serif}`;
  ctx.fillText(poster.line, g, h * 0.3);
  return canvas;
};
