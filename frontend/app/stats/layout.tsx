import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Stats | FilX",
  description:
    "Real-time platform metrics for FilX — total jobs processed, USDC revenue, unique wallets, and endpoint breakdown.",
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
