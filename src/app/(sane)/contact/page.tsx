import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ReachList from "@/components/ReachList";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell saneee.in what your business needs. Write to us, or find us on Instagram and LinkedIn. Mumbai, India.",
};

export default function SaneContact() {
  return (
    <section id="contact" data-chapter="contact" className="section page-top chapter dark">
      <p className="label">Contact</p>
      <div>
        <h1 className="h1 flush">Tell us what you need.</h1>
        <p className="body">Write a few lines about your business and what is getting in the way. One of us reads every message and replies personally.</p>
        <div className="contact">
          <ContactForm />
          <ReachList />
        </div>
      </div>
    </section>
  );
}
