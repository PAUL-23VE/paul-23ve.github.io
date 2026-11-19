import type { Metadata, Viewport } from "next";
import { Cedarville_Cursive, Inter } from "next/font/google";
import type { PropsWithChildren } from "react";

import { Footer } from "@/components/main/footer";
import { Intro } from "@/components/main/intro";
import { Navbar } from "@/components/main/navbar";
import { StadiumScene } from "@/components/main/stadium-scene";
import { CursorFx } from "@/components/sub/cursor-fx";
import { siteConfig } from "@/config";
import { INTRO_SCRIPT } from "@/lib/intro";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const cursive = Cedarville_Cursive({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursive",
});

export const viewport: Viewport = {
  themeColor: "#0b131d",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    // suppressHydrationWarning: el script de la intro añade una clase a <html> antes de hidratar
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          "bg-[#0b131d] overflow-y-scroll overflow-x-hidden",
          inter.className,
          cursive.variable
        )}
      >
        {/* Decide si se muestra la intro antes del primer pintado (lib/intro.ts).
            Va al inicio del <body> y no en <head>: ahí las extensiones del navegador
            inyectan sus propios scripts y React los confundiría al hidratar. */}
        <script id="intro-gate" dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} suppressHydrationWarning />
        <Intro />
        <CursorFx />
        <StadiumScene />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
