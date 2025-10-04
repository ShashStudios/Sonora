import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Sonora - Voice-First Accessible E-Commerce",
    template: "%s | Sonora",
  },
  description: "Voice-first accessible e-commerce platform for everyone. Shop and sell using voice commands, designed for blind, low-vision, and mobility-limited users.",
  keywords: ["accessibility", "voice commerce", "e-commerce", "a11y", "blind", "low vision", "hands-free shopping"],
  authors: [{ name: "Shash Panigrahi" }, { name: "Eliot Shytaj" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Sonora - Voice-First Accessible E-Commerce",
    description: "Shop and sell using voice. E-commerce for everyone.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
