"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { otherPath, rememberCrossing, worldOf } from "./portal/world";

export default function WorldSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const href = otherPath(pathname);
  const target = worldOf(pathname) === "sane" ? "Insane" : "Sane";

  return (
    <Link
      className="switch"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        rememberCrossing();
        router.push(href);
      }}
    >
      Go {target} <span aria-hidden="true">→</span>
    </Link>
  );
}
