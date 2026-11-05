import type { Metadata } from "next";
import WorkFolders from "@/components/WorkFolders";

export const metadata: Metadata = {
  title: "Work",
  description: "Websites and systems saneee.in has built for businesses in Mumbai: Em's Burgers, Vidhya Tutorials and Studio Memento.",
};

export default function SaneWork() {
  return (
    <section id="work" data-chapter="work" className="section page-top">
      <p className="label">Work</p>
      <h1 className="h-editorial">Businesses that came out sane.</h1>
      <p className="body">Each project is a folder. Open one to find the case study and the live site.</p>
      <WorkFolders world="sane" />
    </section>
  );
}
