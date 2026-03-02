import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LayoutDashboard, FileText, Zap, Clock, Code2 } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://web-production-65eed.up.railway.app";

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: "Total Conversions", value: "—",    sub: "Connect wallet to track" },
            { icon: Zap,      label: "Total Spent",       value: "—",    sub: "USDC on Base" },
            { icon: Clock,    label: "Avg. Time",         value: "<30s", sub: "per conversion" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="rounded-md border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Icon className="w-4 h-4" /> {label}
              </div>
              <div className="text-3xl font-black">{value}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          ))}
        </div>

        {/* API Reference */}
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Code2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">API Reference</h2>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Base URL: <code className="font-mono bg-muted px-2 py-0.5 rounded text-foreground">{API_URL}</code>
            </p>

            <div className="space-y-2 text-sm">
              {[
                { method: "POST", path: "/api/v1/convert",          desc: "Convert file (x402 flow)" },
                { method: "POST", path: "/api/v1/convert/batch",    desc: "Batch convert 2–10 files" },
                { method: "GET",  path: "/api/v1/jobs/{id}",        desc: "Get job status + result" },
                { method: "GET",  path: "/api/v1/pricing",          desc: "Current pricing" },
              ].map(({ method, path, desc }) => (
                <div key={path} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold shrink-0 ${
                    method === "POST" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
                  }`}>
                    {method}
                  </span>
                  <code className="font-mono text-xs text-muted-foreground">{path}</code>
                  <span className="text-muted-foreground text-xs ml-auto">{desc}</span>
                </div>
              ))}
            </div>

            <a
              href={`${API_URL}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Open Swagger UI →
            </a>
          </div>
        </div>

        {/* Job history placeholder */}
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Recent Jobs</h2>
          </div>
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-sm">
              Job history coming in v0.2.0 — connect wallet and convert a file to get started.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
