import type { Project } from "@/types";

export const projects: Project[] = [
  { slug: "ems", name: "Em's Burgers", business: "Burger brand", where: "Chembur", image: "/img/work-ems.webp", live: { url: "https://emsburger.in", label: "emsburger.in" }, sign: { background: "#E8421F", color: "#FFF4E0" }, line: "Hungry yet?" },
  { slug: "vidhya", name: "Vidhya Tutorials", business: "Coaching institute", image: "/img/work-vidya.webp", sign: { background: "#1F3F86", color: "#FFFFFF" }, line: "Class is inside." },
  { slug: "memento", name: "Studio Memento", business: "Permanent jewellery", where: "Dombivli", image: "/img/work-studiomemento.webp", live: { url: "https://studiomemento.co.in", label: "studiomemento.co.in" }, sign: { background: "#FF9DB0", color: "#174A97" }, line: "Something shiny?" },
];

export const nextProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
