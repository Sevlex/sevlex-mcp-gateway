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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/sevlex-icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/sevlex-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F9FA] text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
