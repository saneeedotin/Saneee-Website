import Shell from "@/components/Shell";

export default function SaneLayout({ children }: { children: React.ReactNode }) {
  return <Shell world="sane">{children}</Shell>;
}
