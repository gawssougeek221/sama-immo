import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAMA IMMO — Propriétés d'Exception à Dakar",
  description:
    "Immobilier de luxe à Dakar, Sénégal. Villas, penthouses et résidences premium dans les quartiers les plus prestigieux.",
  keywords: [
    "immobilier",
    "Dakar",
    "Sénégal",
    "luxe",
    "villa",
    "penthouse",
    "propriété",
  ],
  authors: [{ name: "SAMA IMMO" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preload hero video for faster playback */}
        <link rel="preload" href="/hero-video.mp4" as="video" />
        {/* Preload hero poster image */}
        <link rel="preload" href="/hero-background.jpg" as="image" />
      </head>
      <body
        className={`${bodoniModa.variable} ${jost.variable} antialiased bg-stone-950 text-stone-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
