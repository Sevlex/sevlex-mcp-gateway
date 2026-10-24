import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
