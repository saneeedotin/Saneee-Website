import type { Metadata } from "next";
import PhysicalType from "@/components/PhysicalType";
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
      <PhysicalType text="We read everything. Even the long ones." className="display" />
      <div className="contact">
        <ContactForm />
        <ReachList />
      </div>
    </section>
  );
}
