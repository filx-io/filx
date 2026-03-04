"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Activity,
  DollarSign,
  Users,
  Zap,
  FileText,
  Image,
  Database,
  RefreshCw,
  TrendingUp,
  Globe,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────

interface StatsData {
  jobs_total: number;
  revenue_usdc: string;
  unique_wallets: number;
  uptime_pct: number;
  uptime_seconds: number;
  endpoints_live: number;
  network: string;
  by_category: {
    document: number;
    image: number;
    extraction: number;
  };
  top_operations: { operation: string; count: number }[];
  since: string;
}

const STATS_URL = "https://api.filx.io/api/v1/stats";
const REFRESH_MS = 30_000;

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function formatOp(op: string): string {
  return op.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CountUp({ value, prefix = "", suffix = "" }: { value: number | string; prefix?: string; suffix?: string }) {
  return (
    <span>
      {prefix}
      {typeof value === "number" ? value.toLocaleString() : value}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(STATS_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StatsData = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(), REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <main className="min-h-screen flex flex-col bg-[#08090d] font-mono text-slate-300">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 space-y-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              // live stats
            </p>
            <h1 className="font-mono font-black text-slate-100 text-2xl md:text-3xl uppercase tracking-widest">
              Platform Metrics
            </h1>
            <p className="font-mono text-slate-500 text-sm">
              Real-time data from <span className="text-[#3b82f6]">api.filx.io</span> ·{" "}
              {data ? (
                <span className="text-slate-400">
                  since {data.since}
                </span>
              ) : (
                <span className="text-slate-600">loading...</span>
              )}
            </p>
          </div>

          {/* Live badge + refresh */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2 border border-green-400/30 bg-green-400/5 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="font-mono text-green-400 text-xs font-bold uppercase tracking-widest">
                Live
              </span>
            </div>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 border border-white/10 px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:border-white/20 transition-colors disabled:opacity-50"
              title="Refresh now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span className="font-mono text-xs">Refresh</span>
            </button>
          </div>
        </div>

        {/* Last updated */}
        {lastUpdated && (
          <p className="font-mono text-[11px] text-slate-700 -mt-6">
            Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
          </p>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="border border-red-400/20 bg-red-400/5 px-4 py-3">
            <p className="font-mono text-red-400 text-sm">⚠ {error} — retrying automatically</p>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && !data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-white/10 bg-[#0d0f17] p-5 h-28 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Main stat cards ── */}
        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Jobs */}
              <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-3 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <Activity className="w-4 h-4 text-[#3b82f6]" />
                  Jobs Processed
                </div>
                <div className="font-mono font-black text-3xl text-slate-100">
                  <CountUp value={data.jobs_total} />
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  all time · all endpoints
                </div>
              </div>

              {/* Revenue */}
              <div className="border border-green-400/20 bg-green-400/5 p-5 space-y-3 hover:border-green-400/30 transition-colors">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Revenue
                </div>
                <div className="font-mono font-black text-3xl text-green-400">
                  ${parseFloat(data.revenue_usdc).toFixed(3)}
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  USDC on Base · on-chain
                </div>
              </div>

              {/* Unique Wallets */}
              <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-3 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <Users className="w-4 h-4 text-yellow-400" />
                  Unique Wallets
                </div>
                <div className="font-mono font-black text-3xl text-slate-100">
                  <CountUp value={data.unique_wallets} />
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  agents + developers
                </div>
              </div>

              {/* Uptime */}
              <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-3 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Uptime
                </div>
                <div className="font-mono font-black text-3xl text-slate-100">
                  {data.uptime_pct}%
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  session: {formatUptime(data.uptime_seconds)}
                </div>
              </div>
            </div>

            {/* ── Secondary cards row ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Endpoints live */}
              <div className="border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <Globe className="w-4 h-4 text-[#3b82f6]" />
                  Endpoints Live
                </div>
                <div className="font-mono font-black text-2xl text-[#3b82f6]">
                  {data.endpoints_live}
                </div>
                <p className="font-mono text-[11px] text-slate-600">
                  All returning x402 on <span className="text-[#3b82f6]">Base</span>
                </p>
              </div>

              {/* Network */}
              <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  Network
                </div>
                <div className="font-mono font-black text-2xl text-orange-400 uppercase">
                  {data.network}
                </div>
                <p className="font-mono text-[11px] text-slate-600">
                  USDC · chain ID 8453 · 6 decimals
                </p>
              </div>

              {/* Min cost */}
              <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  Min Cost / Job
                </div>
                <div className="font-mono font-black text-2xl text-slate-100">
                  $0.001
                </div>
                <p className="font-mono text-[11px] text-slate-600">
                  USDC per file op · no subscriptions
                </p>
              </div>
            </div>

            {/* ── Category breakdown ── */}
            <div className="space-y-3">
              <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
                // by category
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Document */}
                <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                      <FileText className="w-4 h-4 text-[#3b82f6]" />
                      Document
                    </div>
                    <span className="font-mono font-black text-xl text-slate-100">
                      {data.by_category.document.toLocaleString()}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-600 leading-relaxed">
                    PDF convert, compress, merge, split · HTML/Markdown → PDF
                  </p>
                  {/* mini bar */}
                  {(data.by_category.document + data.by_category.image + data.by_category.extraction) > 0 && (
                    <div className="h-1 bg-white/5 w-full">
                      <div
                        className="h-1 bg-[#3b82f6]"
                        style={{
                          width: `${Math.round(
                            (data.by_category.document /
                              Math.max(1, data.by_category.document + data.by_category.image + data.by_category.extraction)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                      <Image className="w-4 h-4 text-yellow-400" />
                      Image
                    </div>
                    <span className="font-mono font-black text-xl text-slate-100">
                      {data.by_category.image.toLocaleString()}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-600 leading-relaxed">
                    Resize, compress, convert, crop, upscale, bg-remove, watermark
                  </p>
                  {(data.by_category.document + data.by_category.image + data.by_category.extraction) > 0 && (
                    <div className="h-1 bg-white/5 w-full">
                      <div
                        className="h-1 bg-yellow-400"
                        style={{
                          width: `${Math.round(
                            (data.by_category.image /
                              Math.max(1, data.by_category.document + data.by_category.image + data.by_category.extraction)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Extraction */}
                <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                      <Database className="w-4 h-4 text-green-400" />
                      Extraction
                    </div>
                    <span className="font-mono font-black text-xl text-slate-100">
                      {data.by_category.extraction.toLocaleString()}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-600 leading-relaxed">
                    OCR image · Table extract → CSV / JSON
                  </p>
                  {(data.by_category.document + data.by_category.image + data.by_category.extraction) > 0 && (
                    <div className="h-1 bg-white/5 w-full">
                      <div
                        className="h-1 bg-green-400"
                        style={{
                          width: `${Math.round(
                            (data.by_category.extraction /
                              Math.max(1, data.by_category.document + data.by_category.image + data.by_category.extraction)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Top operations (session) ── */}
            {data.top_operations.length > 0 && (
              <div className="space-y-3">
                <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
                  // top operations this session
                </p>
                <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
                  <div className="grid grid-cols-12 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                    <span className="col-span-1">#</span>
                    <span className="col-span-7">Operation</span>
                    <span className="col-span-4 text-right">Jobs (session)</span>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {data.top_operations.map((op, i) => (
                      <div
                        key={op.operation}
                        className="grid grid-cols-12 items-center px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="col-span-1 font-mono text-slate-600 text-xs">{i + 1}</span>
                        <span className="col-span-7 font-mono text-slate-300 text-xs">
                          {formatOp(op.operation)}
                        </span>
                        <span className="col-span-4 text-right font-mono font-bold text-[#3b82f6] text-xs">
                          {op.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Footer note ── */}
            <div className="border border-white/5 bg-[#0d0f17] px-6 py-4 text-center space-y-1">
              <p className="font-mono text-slate-600 text-xs">
                All revenue is settled on-chain as USDC on Base (chain ID 8453).
                Every payment has an immutable transaction receipt.
              </p>
              <p className="font-mono text-slate-700 text-[11px]">
                Session job counts reset on server restart · wallet counts are cumulative
              </p>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
