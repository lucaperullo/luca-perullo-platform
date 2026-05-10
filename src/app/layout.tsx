import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChromeGate } from "@/components/chrome-gate";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Fly } from "@/components/fly";
import { CookieConsent } from "@/components/cookie-consent";
import { InAppBrowserBanner } from "@/components/inapp-browser-banner";
import { SharedBust } from "@/components/shared-bust";
import { SiteCommandPalette } from "@/components/site-command-palette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lucaperullo.it"),
  title: {
    default: "Luca Perullo — Software Architect & AI Engineer",
    template: "%s · Luca Perullo",
  },
  description:
    "Costruisco prodotti digitali su misura: web app, AI, e-commerce. Tools gratuiti, componenti open-source e note tecniche dal lavoro reale.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Luca Perullo",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 1200 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og.jpg"],
  },
};

const themeBootstrap = `(() => {
  try {
    const stored = localStorage.getItem("lp-theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) document.documentElement.classList.add("dark");
  } catch (_) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Avoid flash-of-light-mode for users who prefer dark.
            suppressHydrationWarning: alcune estensioni (Bitdefender,
            antitracker aggressivi) strippano o sostituiscono il
            contenuto inline degli script <head> prima che React
            idratri, causando un hydration mismatch su questo nodo
            specifico. È innocuo: lo script si esegue prima che React
            arrivi e mette la classe sul <html>, l'estensione lo
            sostituisce DOPO senza intaccare il comportamento. */}
        <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
      </head>
      <body
        className="flex min-h-full flex-col bg-bg text-fg"
        suppressHydrationWarning
      >
        {/*
          Document-level SVG filter defs. Referenced by CSS `filter: url(#…)`
          in components that need shared filters (e.g. the pixel-gray fly
          variant). Hidden via inline style so it never affects layout.
          Mounted here so a single ID resolves uniquely across the page,
          regardless of how many fly instances render.
        */}
        <svg
          aria-hidden
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <defs>
            {/*
              Pixel-aliased filter — preserves the fly silhouette.

              Earlier flood/tile sampling produced "true pixel art" but
              dissolved the legs/wings/head into an unreadable blob.
              This filter is more restrained: it just dilates strokes
              by 0.5 user-space units (fattens hairlines into chunky
              lines) and snaps alpha to binary (no anti-aliasing, all
              edges become hard pixel-tile boundaries). Combined with
              the per-element CSS overrides for pixel-gray, the fly
              reads as "stylized chunky pixel-y" while staying
              recognisable as a fly.

              For TRUE 16-bit pixel-art (rectangular sprite redraw),
              that's a separate component, not a filter.
            */}
            <filter id="fly-pixel-quantize" x="-10%" y="-10%" width="120%" height="120%">
              <feMorphology operator="dilate" radius="0.5" in="SourceGraphic" result="thick" />
              <feComponentTransfer in="thick">
                <feFuncA type="discrete" tableValues="0 1" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        <SmoothScroll />
        <ChromeGate>
          <SiteHeader />
        </ChromeGate>
        <main className="flex-1">{children}</main>
        <ChromeGate>
          <SiteFooter />
        </ChromeGate>
        <Fly />
        <CookieConsent />
        <InAppBrowserBanner />
        <SharedBust />
        <SiteCommandPalette />
      </body>
    </html>
  );
}
