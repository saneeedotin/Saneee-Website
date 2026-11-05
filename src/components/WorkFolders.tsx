"use client";

import { useEffect, useRef, useState } from "react";
import GlassFolder, { type ArtRecipe, type FolderFile } from "@/components/ui/glass-folder-cards";
import { projects } from "@/data/projects";
import type { World } from "./portal/world";

const MAX_WIDTH = 400;

/** Each project as a glass folder: its screenshot behind the glass, the case study and live site inside. */
export default function WorkFolders({ world }: { world: World }) {
  const cell = useRef<HTMLLIElement>(null);
  const [width, setWidth] = useState(340);

  // The folder draws at a fixed px width, so it follows its grid cell.
  useEffect(() => {
    const el = cell.current;
    if (!el) return;
    const fit = () => setWidth(Math.min(MAX_WIDTH, Math.floor(el.clientWidth)));
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  const base = world === "sane" ? "" : "/insane";
  return (
    <ul className="folders">
      {projects.map((p, i) => {
        // The cover is a liquid swirl in the client's own sign colours.
        const cover: ArtRecipe = { style: "marble", colors: ["#080808", p.sign.background, p.sign.color, p.sign.background], scale: 0.7, warp: 3.2, gloss: 0.45, veins: 0.3 };
        // The last file sits at the front of the folder, so the case study comes first to hand.
        const files: FolderFile[] = [
          { name: "Cover", meta: p.business, art: cover },
          ...(p.live ? [{ name: "Live site", meta: p.live.label, href: p.live.url }] : []),
          { name: "Case study", meta: "Read", image: p.image, href: `${base}/work/${p.slug}` },
        ];
        return (
          <li key={p.slug} ref={i === 0 ? cell : undefined}>
            <GlassFolder
              className="gf-brand"
              label={p.name}
              meta={[p.business, p.where].filter(Boolean).join(", ")}
              tone={world === "sane" ? "light" : "dark"}
              image={p.image}
              files={files}
              action="none"
              width={width}
              appearDelay={i * 140}
            />
          </li>
        );
      })}
    </ul>
  );
}
