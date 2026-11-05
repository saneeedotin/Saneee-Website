import type { Metadata } from "next";
import Evidence from "@/components/Evidence";

export const metadata: Metadata = { title: "Work" };

export default function InsaneWork() {
  return <Evidence heading="h1" />;
}
