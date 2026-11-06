"use client";

import { useEffect, useState } from "react";
import InfiniteMenu from "@/components/ui/InfiniteMenu";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

const SIZE = 512;
const INK = "#080808";
const LIME = "#c7ff2e";

/** A tile for the sphere: the client's mark in lime on ink, the way the Evidence cards set it. */
async function tile(p: Project): Promise<string> {
  try {
    return await draw(p, p.logo);
  } catch {
    return draw(p, undefined); // The logo didn't load: fall back to the name.
  }
}

async function draw(p: Project, logo: string | undefined): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, SIZE, SIZE);
  if (!logo) {
    // No logo: the name as a wordmark, like ClientMark does.
    await document.fonts.ready;
    ctx.fillStyle = LIME;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `italic 400 ${SIZE * 0.16}px ${getComputedStyle(document.body).getPropertyValue("--font-serif") || "serif"}, serif`;
    ctx.fillText(p.name, SIZE / 2, SIZE / 2, SIZE * 0.8);
    return canvas.toDataURL("image/png");
  }
  // onload, not decode(): decode can wait indefinitely in a tab that isn't being shown.
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = logo;
  });
  // The logo is a one-colour mask: tint it lime on its own canvas, then set it on the ink.
  const box = SIZE * 0.66;
  const scale = Math.min(box / img.naturalWidth, box / img.naturalHeight);
  const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
  const mark = document.createElement("canvas");
  mark.width = SIZE;
  mark.height = SIZE;
  const m = mark.getContext("2d")!;
  m.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
  m.globalCompositeOperation = "source-in";
  m.fillStyle = LIME;
  m.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(mark, 0, 0);
  return canvas.toDataURL("image/png");
}

/** The Insane work: every client's mark on a sphere you spin. The front one opens its case study. */
export default function WorkSphere() {
  const [items, setItems] = useState<{ image: string; title: string; description: string; link: string }[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all(projects.map(tile)).then((images) => {
      if (alive) setItems(projects.map((p, i) => ({ image: images[i], title: p.name, description: p.line, link: `/insane/work/${p.slug}` })));
    });
    return () => { alive = false; };
  }, []);

  return (
    <div className="work-sphere" data-portal-off>
      {/* The tiles around the front one fade into the lime, so the name and line never sit on a dark tile. */}
      {items && <InfiniteMenu items={items} theme="light" accentColor={INK} backgroundColor={LIME} dim={0.85} grayscale={false} roundness={0.25} zoom={1.35} />}
    </div>
  );
}
