# saneee.in

The studio's website, in two worlds. **Sane** (`/`) is the clear editorial site. **Insane** (`/insane`) is the same studio in black on lime. The cursor is the door between them: move it to look through, press and hold to cross. Every page exists in both worlds at the same path, `/x` and `/insane/x`.

Built with Next.js 15 (static export), React 19, TypeScript, GSAP, Lenis and `three`. Hosted on Firebase Hosting.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. To try it on a phone, use the PC's Wi-Fi address (not the WSL `172.x` one) and allow Node through the firewall.

## Check and build

```bash
npm run typecheck
```

Stop `npm run dev` first: both use `.next`, and running them together corrupts the dev server.

```bash
npm run build
```

The site is exported to `out/`. To see it the way it will be served:

```bash
npx serve out
```

## Deploy

Needs the Firebase CLI, signed in to the account that owns `saneee-web-2026`.

```bash
npm run deploy
```

## Contact form

The site has no server, so the form posts to a Google Apps Script web app in the studio's Google account, which emails saneeedotin@gmail.com. The script and how to (re)deploy it are in [tools/contact-form](tools/contact-form/README.md). Its URL is `ENDPOINT` in `src/components/ContactForm.tsx`.

## How it fits together

| Where | What |
|---|---|
| `src/app/(sane)/`, `src/app/insane/` | The pages of each world: home, about, services, work, case studies, contact, privacy |
| `src/components/portal/` | The cursor portal: shader, posters, and the path between worlds |
| `src/components/Loader.tsx` | First-visit intro (the S flies into the hero word), the S loader, and the cover between pages |
| `src/components/HeroMorph.tsx` | The Sane hero: SANEEE folds into the logo, the arrow becomes the cursor, the S opens into Services |
| `src/components/Nav.tsx` | Nav and the liquid menu bubble |
| `src/components/Footer.tsx`, `FooterWord.tsx` | Footer; the name swaps saneee.in ↔ in.saneee |
| `src/components/Evidence.tsx` | Client logos on Insane; `ClientMark.tsx` draws each in one colour |
| `src/components/WorkFolders.tsx` | Work as glass folders (`ui/glass-folder-cards.tsx`) |
| `src/components/TeamBadges.tsx` | The team as swinging lanyard badges (`Lanyard.jsx`) |
| `src/components/ScrollMotion.tsx` | Smooth scrolling (Lenis) and scroll animation (GSAP) |
| `src/data/` | Services, projects (with case study write-ups) and team |
| `public/img/clients/` | One-colour client logos, used as masks |
| `tools/font/` | Builds the Saneee font and logo SVGs from the brand artwork |
| `tools/contact-form/` | The contact form's mail script |
| `docs/brand-brief.md` | The brand and content brief the site was built from |

Each section sets `data-chapter` (`hero`, `about`, `services`, `work`, `people`, `contact`). The portal uses it to choose which poster to show and where to land when crossing. Anything with `data-portal-off` keeps the portal closed, for controls that need a press or drag.

## Still to do

- Replace Instrument Serif with the licensed Voyage files. It's a stand-in, marked in `src/app/layout.tsx`.
- Replace the drafted case study write-ups in `src/data/projects.ts` with the studio's own.
