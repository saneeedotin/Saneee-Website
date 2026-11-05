import Link from "next/link";
import Shell from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell world="sane">
      <section className="section page-top">
        <p className="label">404</p>
        <h1 className="h1">This page isn&rsquo;t in either world.</h1>
        <Link className="reach" href="/">Back to the sane one</Link>
      </section>
    </Shell>
  );
}
