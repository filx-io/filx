import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Docs | FliX — x402 File Converter for AI Agents",
  description:
    "Full API reference for FliX. 20+ endpoints for PDF, image, OCR, and table extraction. No API keys — pay per request with USDC on Base via x402 protocol.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
