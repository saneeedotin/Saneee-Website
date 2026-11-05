# SANEEE.IN — Master Agency File (Zero to End)

> Single source of truth for building the saneee.in website in Google Antigravity.
> Built from: Design System & Brand Bible + Brand Kit v2 (October 2026).
> Where the two sources conflict, the conflict is resolved in Section 0 and the resolved value is used everywhere below.

---

## 0. HOW TO USE THIS FILE (INSTRUCTIONS FOR ANTIGRAVITY)

**Task:** Rebuild the layout, structure, sections and interaction patterns of the reference website, but with saneee.in's identity.

**Rules**
1. Keep the reference site's **layout, section order and interaction patterns**.
2. Replace **every** piece of the reference agency's content with the content in this file: name, logo, taglines, copy, services, projects, team, contact, footer, metadata.
3. Replace **all** colors, fonts, radii, borders and motion values with the tokens in Sections 5-7.
4. Do **not** reuse the reference agency's logos, images, client names, case studies or copy.
5. Never hardcode content in components. Put all content in typed data files under `/data` using the schemas in Section 11.
6. Follow the Do / Don't rules in Section 14.
7. Where this file says "not provided", hide that element or leave it out. Do not invent facts, clients, metrics or links.

**Resolved conflicts between source documents**

| Topic | Decision used in this file |
|---|---|
| Founding year | **2026** (confirmed by the founder; use 2026 everywhere). |
| Cursor Green usage | **One accent element per view/design.** Stricter rule from Brand Kit v2 wins. |
| Services | Nine services as confirmed by the founder (Section 1). They replace the four services listed in the source documents. |
| Asset folder case | Use lowercase `/works/` everywhere (rename folder `Works/` to `works/`) so paths work on case-sensitive hosts. |
| Contact email | **saneeedotin@gmail.com** is the only email. Do not show any other address. |
| Mesh cover style | Allowed for **social covers only**. Never on the website. |
| Glass card values | Light surfaces: blur 16px, white 90%. Dark surfaces: blur 12-16px, white 5% or ink 75%. |
| Border on dark | `rgba(255,255,255,0.08)` default, up to `0.14` on hover/emphasis. |

---

## 1. BRAND IDENTITY

| Field | Value |
|---|---|
| Brand / domain | saneee.in |
| Wordmark | SANEEE.IN |
| Type of business | Premium digital presence studio and engineering collective |
| Established | 2026 |
| HQ | Mumbai, India (operating worldwide) |
| Email (only one) | saneeedotin@gmail.com |
| Instagram | @saneeedotin — https://www.instagram.com/saneeedotin/ |
| Founder | Param Mehta |
| Team | Param Mehta, Hardik Solanki, Smit Chauhan, Teesha Wala |
| Phone / address / LinkedIn company page | Not provided. Do not display. |

### Services (what we do)
1. **Website Development & Design**
2. **App Development & Design**
3. **UI/UX Design**
4. **Brand Identity & Logo Design**
5. **Social Media Marketing**
6. **Product Design**
7. **Graphic Design**
8. **AI & Automations**
9. **Customised web & app projects for every need**

### Industries served
Restaurants, artisanal cafés, family clinics, boutique salons, independent ventures. Also used in the portfolio: creative photography, EdTech, food & beverage, branding & systems.

---

## 2. BRAND STORY, MISSION, POSITIONING

### Story
Businesses (exceptional restaurants, artisanal cafés, family clinics, boutique salons, ambitious independent ventures) often deliver world-class, high-touch experiences in person. Their digital presence rarely reflects that excellence. They end up with generic outdated WordPress templates, clunky DIY page builders, or agency bloat with 40-slide pitch decks that deliver nothing of substance.

saneee.in was built to close that gap. Great businesses deserve an unmistakable, world-class digital front door.

### Mission
**Give every ambitious business a world-class digital front door.**
Customers judge a business on their phone screen in under three seconds, before they step through the door or book a call. We build digital presences that look and feel like a global vanguard brand, never a local afterthought.

### Positioning
- **"Premium studio. Local focus. Zero template thinking."**
- **"Digital presence studio & engineering collective."**
- Not a bloated agency with fifty accounts and an intern team. A tight, senior collective of designers and engineers working directly with founders at startup speed.

### Why choose us (3 pillars)
1. **The World-Class Digital Front Door.** Mobile-first, sub-second loading on 5G, 100/100 Lighthouse performance.
2. **Zero Template Thinking.** Custom typography, bespoke vector geometry, no prefabricated themes.
3. **Direct Builder Access.** Founders speak directly with the designers and engineers building the work.

### "Real humans" statement (About section)
saneee.in is powered by real senior builders, not AI agents. Center badge copy: **"A strong team of real humans."**

---

## 3. TAGLINE SYSTEM

Three lines, three jobs. Never used interchangeably.

| # | Tagline | Where it lives | Tone |
|---|---|---|---|
| 1 | **Designed to be distinguished.** | Website hero/header, business cards, proposals, email signatures, brand documents | Timeless, confident. Passive voice is intentional: distinction is the inevitable outcome of precision. |
| 2 | **Distinction, delivered digitally.** | Instagram bio, ad copy, reel captions, campaign headers, launch posters | Punchy, active, marketing-forward. |
| 3 | **Sanely built. Insanely good.** | About page (once), proposal opening paragraph (once), rare manifesto post (max once a month on Instagram) | Witty, self-aware. Power comes from rarity. |

**Rules**
- Never place tagline 1 and tagline 2 next to each other. Use one per context.
- Tagline 3: roughly once per 10 paragraphs. **Never in headers. Never in the footer. Never on buttons.**
- Meta name device (saneee → insane): use sparingly.
  - ✅ "Sanely built. Insanely good." buried in body copy.
  - ✅ "We stay saneee so your brand doesn't have to." as an occasional caption.
  - ❌ Repeating the pun in every headline, paragraph or button.

---

## 4. BRAND VOICE & COPY RULES

**Pillars**
1. **Confident, not cocky.** Quiet authority. The work proves it.
2. **Direct, not blunt.** No corporate buzzwords. One punchy word beats five syllables.
3. **Warm, not casual.** Founders are creative partners. Professional, reliable, high-conviction.

**Cadence**
- Staccato sentences. Fragments are fine.
- Contrast pairs: "Small business. Big presence." / "Premium studio. Local focus." / "Fast. Beautiful. Built to convert."
- Headlines are design. Typography is ~80% of the visual impact. Stack words vertically and let them command the canvas.

---

## 5. COLOR SYSTEM

| Token | HEX | RGB | Role |
|---|---|---|---|
| **Ink** | `#0A0A0A` | 10,10,10 | Primary dark background. Text on light. |
| **Paper** | `#F6F5F0` | 246,245,240 | Warm off-white. Default page background. Text on dark. **Never pure #FFFFFF as a full page fill.** |
| **Cursor Green** | `#C4F135` | 196,241,53 | THE signature accent. Punctuation only. |
| **Depth** | `#141414` | 20,20,20 | Card backgrounds on dark surfaces, bento containers. |
| **Dark Surface** | `#111111` / `#09090B` | 17,17,17 | Large panels, hero media container, footer. |
| **Mist** | `#E2E1DC` | 226,225,220 | Borders, dividers, grid lines on light surfaces. |
| **Ash** | `#7C7C76` | 124,124,118 | Secondary/caption text, metadata. |
| **Ash Dark** | `#4A4A46` | 74,74,70 | Secondary reading copy on light backgrounds (higher contrast). |

### Color rules
- **Default composition:** Ink background, Paper text, ONE Cursor Green accent.
- **Light variant:** Paper background, Ink text, Cursor accent. Max 1 in 4 pieces (social).
- **Cursor Green is punctuation:** an underline, one word, a pill tag, a status ping, an arrow, a hover border, an active tab. **Never a background fill. One accent element per view.**

### Special effects
```css
/* Primary CTA glow border (behind a dark pill button, 2px offset) */
background: linear-gradient(90deg, #3B82F6, #A855F7, #EC4899);
filter: blur(6px);
opacity: 0.7;

/* Ambient radial glow (dark cards) */
background: radial-gradient(circle, rgba(196,241,53,0.08) 0%, rgba(99,102,241,0.04) 50%, transparent 100%);

/* Accent hairline divider */
height: 1px;
background: linear-gradient(90deg, transparent, rgba(196,241,53,0.35), transparent);

/* Technical blueprint grid (light surfaces) */
background-image: linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px);
background-size: 48px 48px;
```

### CSS variables
```css
:root {
  --ink: #0A0A0A;
  --paper: #F6F5F0;
  --cursor: #C4F135;
  --depth: #141414;
  --surface: #111111;
  --surface-hero: #09090B;
  --mist: #E2E1DC;
  --ash: #7C7C76;
  --ash-dark: #4A4A46;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 6. TYPOGRAPHY

Three fonts. Each has one job and never crosses roles. Load via `next/font/google`: `Syne`, `Inter`, `Space_Mono`.

| Role | Font | Weights | Tracking | Leading | Rules |
|---|---|---|---|---|---|
| **Display** | Syne | 600 subheads, 700 section titles, 800 hero/mega headlines/wordmark | -0.02em to -0.04em | 1.05 to 1.15 | Never for body copy or small labels. |
| **Body** | Inter | 300 muted captions, 400 body, 500 emphasis | 0 to -0.01em | 1.72 to 1.8 | Anti-aliasing always on (`-webkit-font-smoothing: antialiased`). |
| **Labels / Data** | Space Mono | 400, 700 | 0.12em to 0.25em | n/a | **ALWAYS UPPERCASE.** Eyebrows, timestamps, HUDs, pills, metrics, slide numbers. 10-12px on a 1080px canvas. |

### Hierarchy example
```
// 01 • THE CREATIVE PARTNER        ← Space Mono · uppercase · Cursor Green · small
DESIGNED TO BE                      ← Syne 800 · Paper #F6F5F0 · tight tracking
DISTINGUISHED.
High-performance digital craft      ← Inter 400 · Ash #7C7C76 · max 2 lines
for products that dare to lead.
```

### Pairings

| Context | Font | Weight | Color |
|---|---|---|---|
| Hero / giant wordmark | Syne | 800 | `#F6F5F0` or `#0A0A0A` |
| Section title | Syne | 700 | `#0A0A0A` or `#F6F5F0` |
| Subheading | Syne | 600 | `#0A0A0A` or `#F6F5F0` |
| Body paragraph | Inter | 400 | `#7C7C76` (dark bg) / `#4A4A46` (light bg) |
| Emphasized body | Inter | 500 | `#0A0A0A` or `#F6F5F0` |
| Eyebrow / section label | Space Mono | 700 | `#C4F135` |
| Tags, pills, metadata | Space Mono | 400 | `#7C7C76` |
| One highlighted word | Syne | 800 | `#C4F135` (one per view only) |

---

## 7. SHAPE, LAYOUT & SURFACES

- **Page background:** `#F6F5F0`.
- **Dark sections** are large, heavily rounded panels floating **inside** the light page with perimeter margins. **Never full-bleed wall-to-wall rectangles.**
- **Max container:** 1280px, centered.

| Element | Radius |
|---|---|
| Pills / buttons / badges | `9999px` |
| Bento cards | `24px` (1.5rem) |
| Structural panels / sections / footer | `32px` to `48px` |
| Image / media frames | `16px` to `24px` |

| Surface | Border |
|---|---|
| On dark | `1px solid rgba(255,255,255,0.08)` (up to `0.14` emphasis) |
| On light | `1px solid #E2E1DC` or `1px solid rgba(17,17,17,0.12)` |

**Glass:** `backdrop-filter: blur(16px)` + `background: rgba(255,255,255,0.90)` on light; `rgba(10,10,10,0.75)` or `rgba(255,255,255,0.05)` on dark.

**Spacing:** generous whitespace. ~60px from all edges on a 1080px social canvas.

**Responsive checkpoints:** 390px (mobile), 768px (tablet), 1440px (desktop), 1920px (ultra-wide).

---

## 8. MOTION & INTERACTION

**Master easing:** `cubic-bezier(0.22, 1, 0.36, 1)`

| Property | Value |
|---|---|
| Micro-interactions (hover, toggle) | 200-350ms (300ms default) |
| Section reveals / entrances | 500-850ms |
| Scroll-scrubbed animations | 0.8-1.5s scrub lag |
| Letter-by-letter stagger | 0.03-0.04s per glyph |
| List / card stagger | 0.10-0.15s per child |
| Parallax | scale 1.0→1.15, yPercent 0→15 |

**Principles**
- Entrances rise **up and in**: `y: 60 → 0`, `opacity: 0 → 1`.
- Text reveals line by line or letter by letter, never all at once.
- Hover states use Cursor Green (border, color shift, or small scale nudge).
- Animate `transform` and `opacity` only. Avoid animating width, height, top, filter.
- Respect `prefers-reduced-motion: reduce` everywhere with static fallbacks.

**Signature patterns**
1. **Masked line text reveals.** Text in overflow-hidden wrappers, translating from `y: 100%` / opacity 0 to `y: 0` / opacity 1 on viewport entry (GSAP ScrollTrigger).
2. **Scroll-driven hero media expansion.** Hero media starts as a low-profile rectangle (220px high) and expands to 580px, scrubbed to scroll.
3. **Card stacking and pinning (Selected Works).** Cards pin; the previous card scales to 0.96 and shifts +15px as the next stacks over it.
4. **Infinite marquee.** Grayscale client/award marks, 40s linear loop, pauses on hover, edge opacity masks.
5. **Magnetic cursor pull.** CTAs, nav links, badges. Spring physics, strength 0.2-0.5.
6. **Custom morphing cursor.** Dot that grows on interactive elements and becomes a black-and-lime "VIEW" pill over project cards.
7. **Concentric orbit ring system.** Three counter-rotating rings (22s, 32s, 44s) with glowing SVG guidelines and team avatars.
8. **Glitch / scramble decryptor.** Hero badge scrambles ASCII glyphs (`!<>-_\/[]{}—=+*^?#`) into clear uppercase studio statements.
9. **Wordmark entrance.** Letters rise individually, 0.04s stagger, scaleY from 0.6.
10. **Pulsing dot.** Cursor Green `animate-ping` outer ring + solid inner dot.
11. **Gantt bars.** Width 0 → target, `power3.out`, staggered on scroll entry.
12. **Chat sequence.** Messages fade in and slide from bottom on a timed loop.

---

## 9. WEBSITE STRUCTURE & COMPONENTS (WITH COPY)

Keep the reference site's section order where it exists. Map each reference section to the component below.

### 9.1 Floating pill header (`FloatingHeader`)
- Fixed pill, inset 16-24px from the viewport top.
- **Left:** brand wordmark `SANEEE.IN` with rotating sub-label (animated flip): `DIGITAL PRESENCE STUDIO` → `DESIGN & ENGINEERING` → `MUMBAI STUDIO`.
- **Center:** dropdown links: **Services**, **Industries**, **Works**.
- **Right:** avatar status chip with pulsing green dot: **"Available for Q2/Q3"**, plus gradient-glow CTA **"Book a Call"**.

### 9.2 Hero (`HeroWordmark`)
- Elevated light studio card with the vector logo (`/logo/saneee.in.svg`) on the left.
- Top HUD bar (Space Mono): `01 // ARCHIVE.SYSTEM` · live availability beacon · `EST. 2026 • GLOBAL STUDIO`.
- Eyebrow: `// 01 • THE CREATIVE PARTNER`
- Headline (Syne 800, stacked): **DESIGNED TO BE DISTINGUISHED.**
- Supporting line: *High-performance digital craft for products that dare to lead.*
- Right column rolling vertical carousel: **"Made for [Founders / Product Teams / Design Leaders / Visionaries / Fast Movers]"**
- Bottom service workbench (grid of 9 service cells; 3 columns on desktop, 1-2 on mobile) with hairline hover indicators and `↗` arrows: **Website Development & Design · App Development & Design · UI/UX Design · Brand Identity & Logo Design · Social Media Marketing · Product Design · Graphic Design · AI & Automations · Customised web & app projects for every need**
- Hero tagline is tagline #1 only. Do not add tagline #2 here.

### 9.3 Hero media panel (`HeroMediaPanel`)
- Panel background `#09090B`, 2D canvas simulation:
  - Metallic chrome specular orb in the center.
  - Dashed Cursor Green rotating orbital ring with satellite dots.
  - Mouse parallax depth.
  - Frosted glitch ribbon cycling studio credos (e.g. "Premium studio.", "Local focus.", "Zero template thinking.").

### 9.4 Selected Works (`HomeWorks`)
- Full-width sticky stacking panels.
- Top translucent pill: `[Accent Dot] [Title] | See case study`.
- Flanking rotated coordinates: `Year / 20XX` (left), `Niche / [Industry]` (right).
- Lower glass HUD bar: service tags, client name, project description.
- Data: Section 10.

### 9.5 About — Human orbit (`HomeAbout`)
- Statement: saneee.in is powered by real senior builders, not AI agents.
- Three concentric glowing rings (22s / 32s / 44s) with team avatar chips. Hover card: name, role, LinkedIn shortcut (only if a link exists).
- Center badge: **"A strong team of real humans."**
- This is the one place the tagline **"Sanely built. Insanely good."** may appear.

### 9.6 Why Us — bento grid (`HomeWhyUs`)
Three cards: the pillars in Section 2.

### 9.7 Marquee
Grayscale client/award marks, 40s loop. **No client logos were provided.** Use the four project names as text marks (Studio Memento, Vidhya Tutorials, Ems Burger, Saneee.in Brandkit) or omit the strip.

### 9.8 Command dock (`FlimCommandDock`)
- Floating frosted bottom dock, opened by `Cmd/Ctrl + K` or `/`.
- Typewriter placeholder cycling discovery phrases (e.g. "Search websites…", "Search apps…", "Search brand identity…", "Search by industry…").
- Modal filters projects by service, industry or text query.

### 9.9 Footer (`Footer`)
- Large rounded dark panel (Dark Surface), dual-theme.
- 4 live LCD clocks (Space Mono, `hh:mm AM/PM` + date + location):
  - **Mumbai (IST, Studio HQ)**
  - **London (GMT)**
  - **New York (EST)**
  - **Dubai (GST)**
- Contact launcher: `saneeedotin@gmail.com`, Instagram `@saneeedotin`.
- Sitemap: Services, Industries, Works, About, Contact.
- Tagline in footer: **none** (tagline #3 is forbidden in the footer; keep tagline #1 only if the reference footer has a tagline slot).

### 9.10 Contact / CTA
- Primary CTA: **Book a Call** (pill, glow border).
- Email: saneeedotin@gmail.com. Instagram: @saneeedotin.

---

## 10. PORTFOLIO (CONTENT DATA)

Only the facts below were provided. Do not invent clients, quotes or extra metrics.

| Slug | Title | Year | Service | Industry | Cover | Key impact |
|---|---|---|---|---|---|---|
| `saneee-brandkit` | Saneee.in Brandkit | 2026 | Branding | Branding & Systems | `/works/SaneeedotinBrandkit.png` | 100% brand consistency across digital touchpoints |
| `studio-memento` | Studio Memento | 2025 | Web Design | Creative Photography | `/works/StudioMemento.png` | Sub-2s load with high-res imagery, +65% inquiries |
| `vidhya-tutorials` | Vidhya Tutorials | 2025 | Product Design | EdTech Platform | `/works/VidhyaTutorials.png` | 40% increase in student course retention |
| `ems-burger` | Ems Burger | 2024 | Development | Food & Beverage | `/works/emsburger.png` | 30% more online orders via mobile-first UI |

**Not provided (hide in UI until supplied):** client names beyond the titles above, roles, timelines, live URLs, challenge / approach / solution text. Case-study detail pages should show only title, year, service, industry, cover and the key impact until this is filled.

---

## 11. DATA SCHEMAS (`/data`)

```typescript
export interface Project {
  slug: string;
  title: string;
  year: number;
  industry: string;
  service:
    | "website"
    | "app"
    | "ui-ux-design"
    | "brand-identity"
    | "social-media-marketing"
    | "product-design"
    | "graphic-design"
    | "ai-automations"
    | "custom-projects";
  summary: string;
  client: string;
  role: string;
  timeline: string;
  liveUrl: string;
  demo: { type: "iframe" | "video" | "gallery"; src?: string };
  challenge: string;
  approach: string;
  solution: string;
  results: string[];
  seed: string;
  coverImage?: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  seed: string;
}

export interface Industry {
  slug: string;
  name: string;
  description: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  seed: string;
  image?: string;
  bio: string;
  linkedIn?: string;
}
```

### Services data
| Slug | Title | Tags |
|---|---|---|
| `website` | Website Development & Design | Web Design, Development, Next.js, Performance |
| `app` | App Development & Design | Mobile Apps, Web Apps, Development, Design |
| `ui-ux-design` | UI/UX Design | Interfaces, User Flows, Design Systems |
| `brand-identity` | Brand Identity & Logo Design | Identity, Logo, Typography, Brand Systems |
| `social-media-marketing` | Social Media Marketing | Instagram, Content, Reels, Campaigns |
| `product-design` | Product Design | Product Strategy, Prototyping, UX |
| `graphic-design` | Graphic Design | Posters, Social Creatives, Print |
| `ai-automations` | AI & Automations | AI Workflows, Automation, Integrations |
| `custom-projects` | Customised web & app projects for every need | Bespoke, Web, Apps |

Service descriptions are not provided in the sources. Use one-line descriptions in the brand voice from Section 4, built only from the service names above, or show title and tags only.

### Industries data
Restaurants · Cafés · Clinics · Salons · Independent Ventures · Creative Photography · EdTech · Food & Beverage · Branding & Systems.

### Team data

| id | Name | Role | Initials | Bio | Photo |
|---|---|---|---|---|---|
| `param` | Param Mehta | Founder & Creative Lead | PM | Shapes the overall digital experience, brand identity and design engineering. | `/team/team-param.png` |
| `hardik` | Hardik Solanki | Lead Full-Stack Engineer | HD | Architects high-performance web systems, Next.js backbones and fluid micro-interactions. | `/team/team-hardik.jpg` |
| `smit` | Smit Chauhan | Lead UI/UX Designer | SM | Translates business logic into intuitive, visually rich interfaces and design systems. | `/team/team-smit.jpg` |
| `teesha` | Teesha Wala | Brand & Visual Designer | TS | Crafts bespoke visual identities, typography systems and creative art direction. | `/team/team-teesha.jpg` |

LinkedIn URLs: not provided. Omit the shortcut.

---

## 12. ASSET DIRECTORY

```
saneeedotin/
├── logo/
│   ├── saneee.in.svg            # Primary vector logo
│   ├── inverted.svg             # Inverted logo (Paper on Ink)
│   ├── saneee.in.png            # High-res raster mark
│   ├── animatedLOGO (2).mp4     # 2-3s seamless loop, Ink background only
│   ├── brandkit.md / v2.md      # Brand guidelines
│   ├── design.md                # Social media design system
│   └── typography.md            # Typography specs
├── works/                       # lowercase (renamed from Works/)
│   ├── SaneeedotinBrandkit.png
│   ├── StudioMemento.png
│   ├── VidhyaTutorials.png
│   └── emsburger.png
├── team/
│   ├── team-param.png
│   ├── team-hardik.jpg
│   ├── team-smit.jpg
│   └── team-teesha.jpg
├── References/                  # Screen recordings of reference agencies
├── motion/                      # Remotion video suite (kinetic manifestos)
└── studio/                      # Next.js production web app
```

### Logo rules
| Situation | Logo color | Background |
|---|---|---|
| Default (digital) | Paper `#F6F5F0` | Ink `#0A0A0A` |
| Reversed (print / light) | Ink `#0A0A0A` | Paper `#F6F5F0` |
| Campaign accent (rare) | Ink `#0A0A0A` | Cursor `#C4F135` |

- Never distort, recolor, shadow, stretch, glow or cover the logo.
- On social posts: bottom-center, max 12-15% of slide height, 60px clear space.
- Animated logo: reel intros, story openers, presentation headers.

---

## 13. TECH STACK & ENGINEERING RULES

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 (`@theme` directive with the tokens in Section 5) |
| Motion | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis |
| 3D | Three.js (wireframe sphere / chrome shader) |
| Fonts | `next/font/google`: Syne, Inter, Space_Mono |

**Principles**
1. Never hardcode content. Import projects, team, services and industries from `@/data`.
2. GPU-friendly animation only (`transform`, `opacity`).
3. Responsive by default; verify at 390 / 768 / 1440 / 1920px.
4. Respect `prefers-reduced-motion`.
5. Target 100/100 Lighthouse. Sub-2s loads. Mobile-first.

**Page metadata**
- Title: `saneee.in — Designed to be distinguished.`
- Description: `Premium digital presence studio in Mumbai. Websites, apps, UI/UX, brand identity, social media marketing, product and graphic design, and AI automations for ambitious businesses.`
- Theme color: `#0A0A0A`
- Favicon: from `logo/saneee.in.svg`.

---

## 14. DO / DON'T

**Do**
- Thin directional arrows `→` `↗` (inline, Space Mono).
- 1px rule lines in Mist or `rgba(255,255,255,0.1)`.
- Fully round pill tags in Space Mono, uppercase, small.
- Tiny `+` star marks as twinkling decoration on dark panels.
- Grayscale photography only. Always desaturate.
- Thin concentric ring orbits (`rgba(255,255,255,0.05)` to `0.1`).
- Bento grids with unequal rounded cards, dark on dark.

**Don't**
- Decorative gradients as page or section backgrounds.
- Colorful illustrations or icon sets.
- Full-color stock photos.
- Drop shadows or glows on the logo.
- Cursor Green as a fill, or more than one green accent element per view.
- Pure white `#FFFFFF` as a page fill.
- Clutter. If an element carries no meaning, it does not exist.
- Reference-agency names, logos, copy or imagery anywhere in the build.

---

## 15. SOCIAL & CAMPAIGN SPECS (Instagram / Reels / Ads)

| Format | Size | Ratio |
|---|---|---|
| Square post | 1080 × 1080 | 1:1 |
| Portrait post / carousel slide | 1080 × 1350 | 4:5 |
| Story / Reel | 1080 × 1920 | 9:16 |

- Reel safe zone: center 1080 × 1420.
- Default: Ink background, Paper text, one Cursor Green accent. Light variant max 1 in 4 pieces.
- Instagram bio line: **Distinction, delivered digitally.**
- Padding ~60px from all edges.

**Abstract cover styles**
| Variant | Description | Feel |
|---|---|---|
| Noisy Dark | `#0A0A0A` base + heavy grain + faint dark gradient | Raw, editorial, premium |
| Striped | 45° diagonal stripes + central radial blob, base `#0D0D0D` | Bold, edgy |
| Geometric | Overlapping semi-transparent polygons (triangles to hexagons), 40-55% opacity | Structured, architectural |
| Mesh (social only) | Pastel radial blobs (`#C9D6FF`, `#FFD1FF`, `#A8EDEA`, `#D4FC79`) over `#F0F0F0`, light grain | Airy, organic |

---

## 16. DESIGN DIRECTIONS (OPTIONAL EXPERIMENTS)

Default build = **Direction A**. Use B-D only if explicitly asked.

| Direction | Feel | Hero | Best for |
|---|---|---|---|
| **A. Cybernetic Vanguard (default)** | Dark dominant, blueprint grid, chrome reflections, lime accents | Giant wordmark, canvas chrome orb, HUD counters, mono tickers | Tech, AI, Web3, engineering teams |
| B. Swiss Editorial Monolith | Paper white, ink typography, 1px Mist borders, big negative space | Mega Syne headline ~70% viewport height, numbered badges `(01)`, desaturated photos | Architecture, fashion, luxury |
| C. Tactile Glass Workbench | Frosted glass, violet + lime ambient spotlights, floating command pills, spring physics | Bento canvas with 3D mouse-tilt cards | SaaS, design systems |
| D. Kinetic Typographic Manifesto | Text is the graphic, giant horizontal sliding words, scroll-scrubbed masking | Wordmark that breaks apart or condenses on scroll | Brand launches, campaigns |

---

## 17. MASTER AI PROMPT (PASTE INTO ANTIGRAVITY)

```markdown
You are a world-class senior design engineer building saneee.in — a premium digital presence studio in Mumbai (est. 2026), operating globally. Services: Website Development & Design, App Development & Design, UI/UX Design, Brand Identity & Logo Design, Social Media Marketing, Product Design, Graphic Design, AI & Automations, and Customised web & app projects for every need.

TASK: Clone the layout, section order and interactions of the reference website, replacing ALL of its content, branding, colors, fonts and assets with saneee.in's, using the attached master file as the only source of truth. Do not copy any of the reference agency's logo, copy, imagery or client names.

BRAND: "Designed to be distinguished." (hero only). Mission: "Give every ambitious business a world-class digital front door." Positioning: "Premium studio. Local focus. Zero template thinking."

DESIGN SYSTEM:
- Colors: Ink #0A0A0A, Paper #F6F5F0 (page bg, never pure white), Cursor Green #C4F135 (ONE accent per view, never a fill), Depth #141414, Surface #111111/#09090B, Ash #7C7C76, Mist #E2E1DC.
- Fonts: Syne 800 for display (tracking -0.03em, never body); Inter 400 for body (line-height 1.75); Space Mono uppercase, tracking 0.15em for labels/HUDs/tags.
- Shapes: pills 9999px; bento cards 24px; dark panels 32-48px floating inside the light page, never full-bleed.
- Motion: cubic-bezier(0.22,1,0.36,1); masked line reveals; scroll-driven hero expansion; pinned stacking project cards; magnetic hover; morphing "VIEW" cursor; transform/opacity only; honor prefers-reduced-motion.
- Stack: Next.js App Router + React 19, TypeScript strict, Tailwind v4, GSAP + ScrollTrigger, Lenis, Three.js. All content from typed /data files.

SECTIONS: Floating pill header → Hero wordmark + canvas media panel → Selected Works (4 projects) → Human orbit About → Why Us bento (3 pillars) → Marquee → Footer with 4 live clocks (Mumbai, London, New York, Dubai) → Command dock (Cmd+K).

CONTACT: saneeedotin@gmail.com · @saneeedotin
RULES: No invented facts, clients or metrics. Hide any field marked "not provided".
```

---

*saneee.in — Master Agency File. Compiled from Design System & Brand Bible and Brand Kit v2 (October 2026).*
