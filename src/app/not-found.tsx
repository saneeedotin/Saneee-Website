import Link from "next/link";
import Shell from "@/components/Shell";
import { S_PATH, S_VIEWBOX } from "@/components/logoShape";

export default function NotFound() {
  return (
    <Shell world="sane">
      <section className="section lost dark">
        <svg viewBox={S_VIEWBOX} aria-hidden="true"><path d={S_PATH} /></svg>
        <p className="label">404</p>
        <h1 className="h1 flush">This page isn&rsquo;t in either world.</h1>
        <p className="body">The link may be old, or the address has a typo.</p>
        <div className="lost-links">
          <Link className="button" href="/">Back to sane <span aria-hidden="true">→</span></Link>
          <Link className="button-ghost" href="/insane">Or go insane <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </Shell>
  );
}
