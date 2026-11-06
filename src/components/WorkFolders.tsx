"use client";

import { useEffect, useRef, useState } from "react";
import GlassFolder, { type ArtRecipe, type FolderFile } from "@/components/ui/glass-folder-cards";
import { projects } from "@/data/projects";
import type { World } from "./portal/world";

const MAX_WIDTH = 400;
// Ink, paper and lime folded through each other: every folder in the site's own colours.
const BRAND_ART: ArtRecipe = { style: "marble", colors: ["#080808", "#1a1a18", "#c7ff2e", "#080808", "#f6f6ef"], scale: 0.7, warp: 3.2, gloss: 0.4, veins: 0.3 };

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
        // The last file sits at the front of the folder, so the case study comes first to hand.
        // Plain sheets and the studio's own palette: client colours and screenshots live on the case page.
        const files: FolderFile[] = [
          // New tabs, so this one stays open behind them.
          ...(p.live ? [{ name: "Live site", meta: p.live.label, href: p.live.url, target: "_blank" }] : []),
          { name: "Case study", meta: "Read", href: `${base}/work/${p.slug}`, target: "_blank" },
        ];
        return (
          <li key={p.slug} ref={i === 0 ? cell : undefined}>
            <GlassFolder
              className="gf-brand"
              label={p.name}
              meta={[p.business, p.where].filter(Boolean).join(", ")}
              tone={world === "sane" ? "light" : "dark"}
              art={BRAND_ART}
              seed={i * 7 + 3}
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
