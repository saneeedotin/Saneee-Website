import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

const SITE = "https://saneee.in";
const PAGES = ["", "/about", "/services", "/work", "/contact", "/privacy"];

/** Every page in both worlds, plus each case study. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...PAGES, ...projects.map((p) => `/work/${p.slug}`)];
  return paths.flatMap((path) => [
    { url: `${SITE}${path || "/"}`, priority: path ? 0.7 : 1 },
    { url: `${SITE}/insane${path}`, priority: 0.5 },
  ]);
}
