import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Docs | FliX — x402 File Primitive",
  description:
    "Full API reference for FliX — the x402 File Primitive. 20+ endpoints: PDF, OCR, image convert, table extract. No API keys — pay per request with USDC on Base.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
