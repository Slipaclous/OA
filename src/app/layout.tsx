import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Anthony & Ophélie — Invitation de Mariage",
  description: "Célébration du mariage d'Anthony & Ophélie. Programme, galerie photo et confirmation de présence.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen font-sans bg-[#F9F9FA] text-[#111112] antialiased selection:bg-[#111112] selection:text-[#FFFFFF]">
        {children}
      </body>
    </html>
  );
}
