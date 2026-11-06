import type { Metadata } from "next";
import Evidence from "@/components/Evidence";
import WorkSphere from "@/components/WorkSphere";

export const metadata: Metadata = {
  title: "Work",
  description: "The evidence: Em's Burgers, Vidhya Tutorials and Studio Memento, built by saneee.in.",
};

export default function InsaneWork() {
  return (
    <>
      {/* Nothing but the projects on screen; the heading is still there for screen readers and search. */}
      <section data-chapter="work" className="work-play">
        <h1 className="vh">Our work. Spin it, judge for yourself.</h1>
        <WorkSphere />
      </section>
      <Evidence />
    </>
  );
}
