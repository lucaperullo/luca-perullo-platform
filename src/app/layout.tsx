import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Fly } from "@/components/fly";
import { CookieConsent } from "@/components/cookie-consent";
import { SharedBust } from "@/components/shared-bust";
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
        {/* Avoid flash-of-light-mode for users who prefer dark. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <SmoothScroll />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Fly />
        <CookieConsent />
        <SharedBust />
      </body>
    </html>
  );
}
