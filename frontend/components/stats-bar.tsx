"use client";

import { useEffect, useState } from "react";

interface StatsPayload {
  jobs_total: number;
  revenue_usdc: string;
  unique_wallets: number;
}

const STATS_URL = "https://api.filx.io/api/v1/stats";

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M+";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K+";
  return n.toLocaleString() + "+";
}

export function StatsBar() {
  const [data, setData] = useState<StatsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const res = await fetch(STATS_URL);
        if (!res.ok) return;
        const json: StatsPayload = await res.json();
        if (!cancelled) setData(json);
      } catch {
        // silently fail — fallback to seed values below
      }
    };

    fetchStats();
    const id = setInterval(fetchStats, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const stats = [
    {
      value: data ? fmt(data.unique_wallets) : "1,200+",
      label: "Agents Served",
    },
    {
      value: data ? fmt(data.jobs_total) : "48,900+",
      label: "Files Processed",
    },
    {
      value: data ? `$${parseFloat(data.revenue_usdc).toFixed(0)}+` : "$2,340+",
      label: "USDC Settled On-Chain",
    },
  ];

  return (
    <div className="border-t border-b border-white/5 bg-[#0d0f17]">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:divide-x divide-white/10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="sm:px-8 text-center space-y-0.5"
          >
            <div className="font-mono font-black text-xl text-slate-200">{s.value}</div>
            <div className="font-mono text-xs text-slate-600 uppercase tracking-wider">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
