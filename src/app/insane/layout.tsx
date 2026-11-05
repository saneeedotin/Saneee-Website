import type { Metadata } from "next";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: { default: "Insane", template: "%s, insane · saneee.in" },
};

export default function InsaneLayout({ children }: { children: React.ReactNode }) {
  return <Shell world="insane">{children}</Shell>;
}
