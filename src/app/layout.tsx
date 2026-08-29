import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* Kinetic Typography voices (self-hosted variable fonts):
   - Space Grotesk: display + body (geometric, holds up at 12rem)
   - JetBrains Mono: technical HUD voice (codes, coordinates, labels) */
const grotesk = localFont({
  src: "../fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-space-grotesk",
  display: "swap",
});

const mono = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GATEZERO — Cultural Access & Ticketing System",
  description:
    "The gate between you and the experience. India's premium underground music, nightlife, art and cultural event ticketing platform.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        {children}
        {/* Print-grain texture — decorative, sits above content at 3.5% opacity */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
