import type { Metadata } from "next";
import Evidence from "@/components/Evidence";
import WorkFolders from "@/components/WorkFolders";

export const metadata: Metadata = {
  title: "Work",
  description: "The evidence: Em's Burgers, Vidhya Tutorials and Studio Memento, built by saneee.in.",
};

export default function InsaneWork() {
  return (
    <>
      <section data-chapter="work" className="section page-top">
        <p className="label">The files</p>
        <h1 className="display">Open a folder. Judge for yourself.</h1>
        <WorkFolders world="insane" />
      </section>
      <Evidence />
    </>
  );
}
