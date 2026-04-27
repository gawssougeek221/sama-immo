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
  title: "LuxeProperty — Propriétés d'Exception à Dakar",
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
  authors: [{ name: "LuxeProperty" }],
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
      <body
        className={`${bodoniModa.variable} ${jost.variable} antialiased bg-stone-950 text-stone-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
