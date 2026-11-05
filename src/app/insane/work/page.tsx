import type { Metadata } from "next";
import ShutterStreet from "@/components/ShutterStreet";

export const metadata: Metadata = { title: "Work" };

export default function InsaneWork() {
  return (
    <section id="work" data-chapter="work" className="section page-top">
      <p className="label">The street</p>
      <h1 className="display">Pull a shutter.</h1>
      <h2 className="vh">The shops</h2>
      <ShutterStreet />
    </section>
  );
}
