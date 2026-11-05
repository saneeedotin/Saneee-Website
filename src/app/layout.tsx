import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Portal from "@/components/portal/Portal";

// shortcut: a third family, against the brief's two. Needed until Saneee has a text weight.
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500"],
  display: "swap",
});

// shortcut: stand-in for Voyage, swap when the licensed files arrive.
const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "Websites, custom software, business systems and AI automation for businesses that want to work better and grow. Mumbai.";

export const viewport: Viewport = { themeColor: "#080808" };

export const metadata: Metadata = {
  metadataBase: new URL("https://saneee.in"),
  title: { default: "saneee.in — Designed to be distinguished.", template: "%s — saneee.in" },
  description,
  icons: {
    icon: [
      { url: "/img/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/img/favicon.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/img/apple-touch-icon.png",
  },
  openGraph: {
    title: "saneee.in — Designed to be distinguished.",
    description,
    siteName: "saneee.in",
    type: "website",
    images: "/img/og.jpg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <link rel="preload" href="/fonts/saneee-brand-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Portal />
      </body>
    </html>
  );
}
