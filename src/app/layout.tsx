import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GATE ZERO — Cultural Access & Ticketing System",
  description: "The gate between you and the experience. India's premium underground music, nightlife, art and cultural event ticketing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#050505] text-[#F1F1EB]">
      <body className="min-h-screen bg-[#050505] text-[#F1F1EB] antialiased selection:bg-[#C8FF16] selection:text-black font-sans">
        {children}
      </body>
    </html>
  );
}
