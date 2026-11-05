import type { Metadata } from "next";
import Privacy from "@/components/Privacy";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What saneee.in collects through this site, and what happens to it. Short version: very little.",
};

export default function InsanePrivacy() {
  return <Privacy heading={<h1 className="display">Short version: we keep almost nothing.</h1>} />;
}
