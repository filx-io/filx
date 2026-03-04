import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started | FiLX — x402 File Primitive",
  description:
    "Connect your AI agent to the x402 File Primitive. Get your agent wallet, fund with USDC on Base, start converting files in minutes. No accounts. No API keys.",
};

export default function LaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
