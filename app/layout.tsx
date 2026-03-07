import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { NeuralParticles } from "@/components/layout/neural-particles";
import { TopStripe } from "@/components/layout/top-stripe";
import "katex/dist/katex.min.css";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PantherPrep",
  description: "SAT & PSAT test prep for PAPS students",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#CC0000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <body className="font-body">
        <TopStripe />
        <NeuralParticles count={70} connectionDist={120} speed={0.25} entropy={0.008} fireChance={0.001} />
        <div className="relative z-[1]">{children}</div>
      </body>
    </html>
  );
}
