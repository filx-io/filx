import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Status | FliX",
  description: "Real-time status of FliX API services — uptime, response times, and incident history.",
};

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
