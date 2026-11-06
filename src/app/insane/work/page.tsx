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
      <section data-chapter="work" className="section page-top">
        <p className="label">The files</p>
        <h1 className="display">Spin it. Judge for yourself.</h1>
        <WorkSphere />
      </section>
      <Evidence />
    </>
  );
}
