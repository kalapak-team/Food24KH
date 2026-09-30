import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_Khmer, Sora } from "next/font/google";
import { HtmlLang } from "@/components/layout/html-lang";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { appConfig } from "@/lib/config";
import "./globals.css";

const manrope = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const sora = Sora({ variable: "--font-display", subsets: ["latin"] });
const khmer = Noto_Sans_Khmer({ variable: "--font-khmer", subsets: ["khmer"] });

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.siteUrl),
  title: {
    default: "Food24KH — Food & grocery delivery in Cambodia",
    template: "%s | Food24KH",
  },
  description:
    "Order food, groceries, flowers and more from local restaurants and shops across Cambodia with Food24KH.",
  openGraph: {
    type: "website",
    siteName: "Food24KH",
    title: "Food24KH — Food & grocery delivery in Cambodia",
    description: "Local restaurants and shops, delivered or ready for pick-up.",
    images: [{ url: "/brand/logo-transparent.png", alt: "Food24KH" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/logo-transparent.png"] },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico?v=3", sizes: "48x48" },
      { url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=3", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png?v=3", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#00008B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${sora.variable} ${khmer.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <HtmlLang />
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
