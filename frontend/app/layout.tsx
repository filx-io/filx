import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "FiLX — x402 File Primitive", template: "%s | FiLX" },
  description:
    "The x402 File Primitive for AI agents. PDF→Markdown, OCR, Image Convert, Background Remove, Table Extract — 20+ endpoints. No API keys. No accounts. Pay per use with USDC on Base.",
  keywords: [
    "x402 file primitive",
    "x402 protocol",
    "file conversion AI agents",
    "PDF to markdown",
    "OCR API",
    "image conversion API",
    "USDC micropayments",
    "Base chain",
    "MCP tools",
    "LangGraph",
    "AI agent infrastructure",
    "HTTP 402",
    "machine-to-machine payments",
    "filx",
    "filx.io",
  ],
  authors: [{ name: "FiLX", url: "https://filx.io" }],
  creator: "FiLX",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://filx.io",
    title: "FiLX — x402 File Primitive",
    description:
      "The x402 File Primitive for AI agents. 20+ file conversion endpoints. No API keys — pay per use with USDC on Base.",
    siteName: "FiLX",
    images: [{ url: "https://filx.io/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FiLX — x402 File Primitive",
    description:
      "The x402 File Primitive for AI agents. 20+ file conversion endpoints. No API keys — pay per use with USDC on Base.",
    creator: "@filx_io",
    images: ["https://filx.io/opengraph-image"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://filx.io"),
};

export const viewport: Viewport = {
  themeColor: [{ color: "#08090d" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistMono.variable} font-mono antialiased min-h-screen`}>
        <Providers>
          {children}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: "#0d0f14",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#e2e8f0",
                fontFamily: "var(--font-geist-mono)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
