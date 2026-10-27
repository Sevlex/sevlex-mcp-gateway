import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

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
  metadataBase: new URL("https://sevlex.com"),
  title: {
    default: "Sevlex | Layer 7 Zero-Trust MCP Security Gateway",
    template: "%s | Sevlex Enterprise",
  },
  description: "Enterprise Layer 7 Zero-Trust MCP Firewall, Shadow AI discovery, AST parameter guardrails, in-flight DLP redaction, and continuous endpoint governance for Claude, Cursor, and Windsurf.",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "AI Security",
    "Zero-Trust AI Gateway",
    "MCP Firewall",
    "AgentGuard",
    "ToolGuard",
    "Claude Desktop Security",
    "Cursor IDE Security",
    "Windsurf Gateway",
    "In-Flight DLP",
    "Merkle Audit Ledger",
  ],
  authors: [{ name: "Sevlex Security Team", url: "https://sevlex.com" }],
  creator: "Sevlex",
  publisher: "Sevlex",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sevlex.com",
    siteName: "Sevlex Enterprise",
    title: "Sevlex | Layer 7 Zero-Trust MCP Security Gateway",
    description: "Enterprise Layer 7 Zero-Trust MCP Firewall, Shadow AI discovery, AST parameter guardrails, and cryptographic Merkle audit non-repudiation.",
    images: [
      {
        url: "/Sevlex_Twitter_Banner.png",
        width: 1200,
        height: 630,
        alt: "Sevlex Enterprise Zero-Trust MCP Gateway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sevlex | Layer 7 Zero-Trust MCP Security Gateway",
    description: "Enterprise Layer 7 Zero-Trust MCP Firewall, AST parameter guardrails, and autonomous agent circuit breakers.",
    images: ["/Sevlex_Twitter_Banner.png"],
    creator: "@sevlex",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/sevlex-icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/sevlex-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
