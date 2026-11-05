# saneee.in

The studio's website, in two worlds. **Sane** (`/`) is the clear editorial site. **Insane** (`/insane`) is the same studio in black on green. The cursor is the door between them: move it to look through, press and hold to cross.

Built with Next.js (static export), React, TypeScript and `three`, hosted on Firebase Hosting.

## Run it

```bash
npm install
```

```bash
npm run dev
```

## Build it

Stop `npm run dev` first: both use `.next`, and running them together breaks the build.

```bash
npm run build
```

The site is exported to `out/`. To check it the way it will be served:

```bash
npx serve out
```

## How it fits together

| Where | What |
|---|---|
| `src/app/(sane)/` | Sane pages |
| `src/app/insane/` | Insane pages |
| `src/components/portal/` | The cursor portal: shader, posters, and the path between worlds |
| `src/components/Vortex.tsx` | The first scroll of the Sane home page |
| `src/components/TheFix.tsx` | The cursor fixing each problem on the Sane home page |
| `src/components/Evidence.tsx` | The sideways-scrolling client work on Insane |
| `src/components/ScrollMotion.tsx` | Smooth scrolling (Lenis) and all scroll animation (GSAP) |
| `src/components/ContactForm.tsx` | Contact form, sent through formsubmit.co |
| `src/data/` | Services, projects and team. Sane and Insane copy sit side by side |
| `tools/font/` | Builds the Saneee font and logo SVGs from the artwork in `logo/` |
| `sanity-machine/` | The earlier prototype, kept for reference until launch |

Each page section sets `data-chapter` (`hero`, `services`, `work`, `people`, `contact`). The portal uses it to choose which poster to show and where to land when crossing. Anything with `data-portal-off` keeps the portal closed, for controls that need a press or drag.

Type and colour follow `logo/typography.md` in the brand folder.

## Before launch

- Replace Instrument Serif with the licensed Voyage files. It's a stand-in, marked in `src/app/layout.tsx`.
- Add the case study write-ups. Case study pages only show facts and a screenshot for now.
- Send one real message through the contact form, because formsubmit.co needs the address activated once.
- Test on real phones and on the Firebase preview channel.
