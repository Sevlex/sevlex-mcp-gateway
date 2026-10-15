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
  title: "Sevlex Enterprise | Layer 7 Zero-Trust MCP Security Gateway",
  description: "Enterprise Layer 7 Zero-Trust MCP Firewall, Shadow AI discovery, and continuous endpoint governance for Claude, Cursor, and Windsurf.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#08080a] text-zinc-100 font-sans selection:bg-blue-500/20 selection:text-blue-300">
        {children}
      </body>
    </html>
  );
}
