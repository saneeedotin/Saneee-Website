import type { World } from "./world";

const HEROES: Record<World, { word: string; line: string }> = {
  insane: { word: "INSANE", line: "Sanely built. Insanely good." },
  sane: { word: "SANEEE", line: "Designed to be distinguished." },
};

// What the hole shows: the chapter you're in, as it looks from the other world.
// Insane shouts in the brand face. Sane speaks in the editorial serif.
const POSTERS: Record<World, Record<string, string[]>> = {
  insane: {
    services: ["WE MAKE", "THINGS", "PROPERLY"],
    work: ["THE", "EVIDENCE"],
    people: ["WHO", "TO BLAME"],
    contact: ["SAY HI.", "WE READ", "EVERYTHING"],
  },
  sane: {
    services: ["What the studio", "makes."],
    work: ["Businesses that", "came out sane."],
    people: ["The four people", "holding it together."],
    contact: ["Tell us what", "you need."],
  },
};

const COLOURS: Record<World, { bg: string; fg: string }> = {
  insane: { bg: "#C7FF2E", fg: "#080808" },
  sane: { bg: "#080808", fg: "#F6F6EF" },
};

export const gutter = (w: number) => Math.max(16, Math.min(48, w * 0.03));

/** Paints one poster at the given size. Letters are never stretched: the word scales to the width. */
export const paintPoster = (world: World, chapter: string, w: number, h: number): HTMLCanvasElement => {
  const { bg, fg } = COLOURS[world];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;

  const g = gutter(w);
  const serif = getComputedStyle(document.documentElement).getPropertyValue("--font-serif") || "serif";
  const brandFont = (size: number) => `400 ${size}px "Saneee Brand"`;
  const serifFont = (size: number) => `italic 400 ${size}px ${serif}`;
  const lines = POSTERS[world][chapter];

  if (!lines) {
    const { word, line } = HEROES[world];
    ctx.font = brandFont(100);
    const size = (100 * (w - 2 * g)) / ctx.measureText(word).width;
    ctx.font = brandFont(size);
    // Matches `.word` in globals.css, so the word lands exactly where the page's own hero word sits.
    ctx.fillText(word, g, h - g - size * 0.025);
    const lineSize = Math.max(26, Math.min(64, w * 0.04));
    ctx.font = serifFont(lineSize);
    ctx.fillText(line, g, 14 + lineSize * 0.9); // Matches `.lede`, which sits where the logo usually is.
    return canvas;
  }

  // Each line fills the width, so the stack covers the screen wherever the hole opens.
  const font = world === "insane" ? brandFont : serifFont;
  const gap = world === "insane" ? 0.8 : 0.88;
  const fits = lines.map((text) => {
    ctx.font = font(100);
    return (100 * (w - 2 * g)) / ctx.measureText(text).width;
  });
  const total = fits.reduce((sum, size) => sum + size * gap, 0);
  const shrink = Math.min(1, (h - 2 * g) / total); // Too tall for the screen: every line comes down together.
  const spare = Math.max(0, h - 2 * g - total * shrink) / Math.max(1, lines.length - 1); // Too short: the lines spread out.
  let y = h - g;
  for (let i = lines.length - 1; i >= 0; i--) {
    const size = fits[i] * shrink;
    ctx.font = font(size);
    ctx.fillText(lines[i], g, y - size * 0.03);
    y -= size * gap + spare;
  }
  return canvas;
};
