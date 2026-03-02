import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "FilX.io — x402 File Converter for AI Agents", template: "%s | FilX.io" },
  description:
    "Convert any file with instant USDC micropayments on Base. PDF→Markdown, OCR, Image Convert, Table Extract. Built for AI agents (MCP, LangGraph, AutoGPT, CrewAI).",
  keywords: ["file converter", "x402", "AI agents", "MCP", "USDC", "Base chain", "PDF", "OCR", "markdown"],
  authors: [{ name: "FilX.io", url: "https://filx.io" }],
  creator: "FilX.io",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://filx.io",
    title: "FilX.io — x402 File Converter for AI Agents",
    description: "Convert any file with instant USDC micropayments on Base.",
    siteName: "FilX.io",
    images: [{ url: "https://filx.io/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FilX.io — x402 File Converter for AI Agents",
    description: "Convert any file with instant USDC micropayments on Base.",
    creator: "@filx_io",
    images: ["https://filx.io/og.png"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://filx.io"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
