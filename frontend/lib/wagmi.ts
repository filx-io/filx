import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

const isProd = process.env.NODE_ENV === "production";

export const wagmiConfig = getDefaultConfig({
  appName: "FilX.io",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "filx-placeholder",
  chains: isProd ? [base] : [base, baseSepolia],
  ssr: true,
});

export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` ??
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}` ??
  "0x0000000000000000000000000000000000000000";

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 8453);
