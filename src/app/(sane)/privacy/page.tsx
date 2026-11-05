import type { Metadata } from "next";
import Privacy from "@/components/Privacy";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What saneee.in collects through this site, and what happens to it.",
};

export default function SanePrivacy() {
  return <Privacy heading={<h1 className="h-editorial">What happens to what you tell us.</h1>} />;
}
