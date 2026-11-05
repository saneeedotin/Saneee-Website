"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types";

export const SHUTTER_EVENT = "shutter-down";
const DROP_MS = 420;

export default function ShutterCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [project, setProject] = useState<Project | null>(null);
  const [down, setDown] = useState(false);
  const from = useRef(pathname);

  useEffect(() => {
    const onDrop = (e: Event) => {
      const { href, project: next } = (e as CustomEvent<{ href: string; project: Project }>).detail;
      from.current = pathname;
      setProject(next);
      setDown(true);
      setTimeout(() => router.push(href), DROP_MS);
    };
    addEventListener(SHUTTER_EVENT, onDrop);
    return () => removeEventListener(SHUTTER_EVENT, onDrop);
  }, [pathname, router]);

  // The new page is in place behind it, so it can go back up.
  useEffect(() => {
    if (pathname === from.current) return;
    from.current = pathname;
    setDown(false);
  }, [pathname]);

  return (
    <div className={down ? "curtain curtain-down" : "curtain"} aria-hidden="true">
      {project && <b style={{ background: project.sign.background, color: project.sign.color }}>{project.name}</b>}
    </div>
  );
}
