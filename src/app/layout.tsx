import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "First Place",
  description: "Gere e gerencie classificações de premiações esportivas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR">
      <body className={`${interSans.variable} antialiased bg-gray-50`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
