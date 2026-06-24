import type { Metadata } from "next";
import { newsreader, plexSans, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "UnifyFlow",
  description: "Plataforma unificada de flujos para equipos de trabajo colaborativo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
