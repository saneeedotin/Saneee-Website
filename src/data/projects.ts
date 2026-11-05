import type { Project } from "@/types";

// shortcut: the stories are drafts written from each client's live site. Replace with the studio's own account.
export const projects: Project[] = [
  {
    slug: "ems",
    name: "Em's Burgers",
    business: "Burger brand",
    where: "Chembur",
    image: "/img/work-ems.webp",
    logo: "/img/clients/ems.png",
    live: { url: "https://emsburger.in", label: "emsburger.in" },
    sign: { background: "#E8421F", color: "#FFF4E0" },
    line: "Hungry yet?",
    story: {
      brief: "A loud, hand-built burger joint in Chembur that people kept finding through Zomato and word of mouth, with nowhere of its own to send them.",
      approach: "Make the site taste like the food: big type, the burgers front and centre, and every page one tap from ordering. The menu reads like the counter, not a PDF.",
      built: ["Brand-led website", "Full menu with signature burgers and sides", "Order on Zomato from every page", "Loyalty club sign-up", "Location, hours and FAQs for local search"],
    },
  },
  {
    slug: "vidhya",
    name: "Vidhya Tutorials",
    business: "Coaching institute",
    image: "/img/work-vidya.webp",
    sign: { background: "#1F3F86", color: "#FFFFFF" },
    line: "Class is inside.",
    story: {
      brief: "A coaching institute for classes 6 to 12 across school, commerce and science, with a strong local reputation and no clear way online for parents to see the programmes.",
      approach: "Calm and trustworthy for parents, clear for students: lead with the promise, show the reviews they already have, and make the first step a free demo class.",
      built: ["Institute website", "Programme pages by class and stream", "Free demo booking", "Reviews and ratings up front"],
    },
  },
  {
    slug: "memento",
    name: "Studio Memento",
    business: "Permanent jewellery",
    where: "Dombivli",
    image: "/img/work-studiomemento.webp",
    logo: "/img/clients/memento.png",
    live: { url: "https://studiomemento.co.in", label: "studiomemento.co.in" },
    sign: { background: "#FF9DB0", color: "#174A97" },
    line: "Something shiny?",
    story: {
      brief: "A permanent jewellery studio in Dombivli where every piece is welded on in person, so the website had to sell an experience rather than a product.",
      approach: "Tell it as stories: the people who came in, the moments they marked, the hands at the bench. Soft and personal, and always leading to a booking.",
      built: ["Website and studio story", "Collections and custom charms", "Customer stories", "Studio booking"],
    },
  },
];

export const nextProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
