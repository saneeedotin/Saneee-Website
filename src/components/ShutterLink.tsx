"use client";

import Link from "next/link";
import type { Project } from "@/types";
import { SHUTTER_EVENT } from "./ShutterCurtain";

type Props = { href: string; project: Project; className?: string; children: React.ReactNode };

/** A link to a project that brings the shutter down first, in that shop's colours. */
export default function ShutterLink({ href, project, className, children }: Props) {
  return (
    <Link
      className={className}
      href={href}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        e.preventDefault();
        dispatchEvent(new CustomEvent(SHUTTER_EVENT, { detail: { href, project } }));
      }}
    >
      {children}
    </Link>
  );
}
