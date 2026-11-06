"use client";

import InfiniteMenu from "@/components/ui/InfiniteMenu";
import { projects } from "@/data/projects";

// Module-level, so the sphere doesn't reload its images on every render.
const ITEMS = projects.map((p) => ({ image: p.image, title: p.name, description: p.line, link: `/insane/work/${p.slug}` }));

/** The Insane work: every project's screenshot on a sphere you spin. The front one opens its case study. */
export default function WorkSphere() {
  return (
    <div className="work-sphere" data-portal-off>
      <InfiniteMenu items={ITEMS} theme="light" accentColor="#080808" dim={0} grayscale={false} />
    </div>
  );
}
