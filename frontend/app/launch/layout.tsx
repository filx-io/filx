import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch App | FilX.io",
  description:
    "Connect your wallet and access the FilX file conversion platform. Pay with $FILX on Base.",
};

export default function LaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
