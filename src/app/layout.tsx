'use client'; // This layout now uses client-side context

import type { Metadata } from "next";
import { LanguageProvider } from "@/contexts/LanguageContext";
// import "./globals.css"; // Already imported by overwriting

// Metadata can still be exported from a client component layout
export const metadata: Metadata = {
  title: "Lemar Bistro - Denizli'nin Buluşma Noktası | Menü & Etkinlikler",
  description: "Denizli Kınıklı'da hizmet veren Lemar Bistro, zengin menüsü, sıcak atmosferi ve özel kokteylleri ile sizleri bekliyor. Kahvaltı, yemek ve eğlence için doğru adres.",
  keywords: "Lemar Bistro, Denizli Kafe, Denizli Restaurant, Kınıklı Bistro, Denizli Kahvaltı, Denizli Nargile, Kokteyl Bar",
};

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* External CSS link removed in favor of globals.css imports, but re-adding fonts here for safety if imports fail or for faster loading */}
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
