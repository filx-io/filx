import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch App | FliX — x402 File Converter for AI Agents",
  description:
    "Connect your agent and start converting files with USDC micropayments on Base. No accounts. No API keys. Just x402.",
};

export default function LaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
