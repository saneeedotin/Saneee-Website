import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ReachList from "@/components/ReachList";

export const metadata: Metadata = {
  title: "Say hi",
  description: "Tell saneee.in what's broken. We read everything, even the long ones.",
};

export default function InsaneContact() {
  return (
    <section id="contact" data-chapter="contact" className="section page-top">
      <p className="label">Say hi</p>
      <h1 className="display">We read everything. Even the long ones.</h1>
      <div className="contact">
        <ContactForm />
        <ReachList />
      </div>
    </section>
  );
}
