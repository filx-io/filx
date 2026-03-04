import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ExternalLink, FileText, Zap, Clock, Code2, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | FiLX",
  description: "FiLX agent dashboard — API overview, pricing, and job history.",
};

const ENDPOINTS = [
  { method: "POST", path: "/api/v1/pdf/to-markdown",  desc: "PDF → Markdown",          price: "$0.002/page" },
  { method: "POST", path: "/api/v1/pdf/ocr",          desc: "PDF OCR",                  price: "$0.004/page" },
  { method: "POST", path: "/api/v1/pdf/compress",     desc: "PDF Compress",             price: "$0.002/file" },
  { method: "POST", path: "/api/v1/pdf/merge",        desc: "PDF Merge",                price: "$0.002/job"  },
  { method: "POST", path: "/api/v1/pdf/split",        desc: "PDF Split",                price: "$0.002/job"  },
  { method: "POST", path: "/api/v1/pdf/to-image",     desc: "PDF → Image",              price: "$0.002/page" },
  { method: "POST", path: "/api/v1/html/to-pdf",      desc: "HTML → PDF",               price: "$0.002/page" },
  { method: "POST", path: "/api/v1/markdown/to-pdf",  desc: "Markdown → PDF",           price: "$0.002/page" },
  { method: "POST", path: "/api/v1/image/resize",     desc: "Image Resize",             price: "$0.001/img"  },
  { method: "POST", path: "/api/v1/image/compress",   desc: "Image Compress",           price: "$0.001/img"  },
  { method: "POST", path: "/api/v1/image/convert",    desc: "Image Convert",            price: "$0.001/img"  },
  { method: "POST", path: "/api/v1/image/crop",       desc: "Image Crop",               price: "$0.001/img"  },
  { method: "POST", path: "/api/v1/image/remove-bg",  desc: "Background Remove (AI)",   price: "$0.005/img"  },
  { method: "POST", path: "/api/v1/image/upscale",    desc: "Image Upscale 2×/4×",      price: "$0.008/img"  },
  { method: "POST", path: "/api/v1/image/watermark",  desc: "Watermark",                price: "$0.001/img"  },
  { method: "POST", path: "/api/v1/image/rotate",     desc: "Rotate / Flip",            price: "$0.001/img"  },
  { method: "POST", path: "/api/v1/table/extract",    desc: "Table Extract → CSV/JSON", price: "$0.003/page" },
  { method: "POST", path: "/api/v1/ocr/image",        desc: "OCR Image",                price: "$0.003/img"  },
  { method: "GET",  path: "/api/v1/pricing",          desc: "Get current pricing",      price: "free"        },
  { method: "GET",  path: "/health",                  desc: "Health check",             price: "free"        },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#08090d] font-mono text-slate-300">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">// dashboard</p>
          <h1 className="font-mono font-black text-slate-100 text-2xl uppercase tracking-widest">FiLX API</h1>
          <p className="font-mono text-slate-500 text-sm">Base URL: <code className="text-[#3b82f6]">https://api.filx.io</code></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: "Endpoints",   value: "20",    sub: "All returning x402"   },
            { icon: Zap,      label: "Min Cost",    value: "$0.001",sub: "USDC on Base"          },
            { icon: Clock,    label: "Avg Latency", value: "~1s",   sub: "End-to-end"            },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="border border-white/10 bg-[#0d0f17] p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest">
                <Icon className="w-4 h-4 text-[#3b82f6]" /> {label}
              </div>
              <div className="font-mono font-black text-3xl text-slate-100">{value}</div>
              <div className="font-mono text-xs text-slate-600">{sub}</div>
            </div>
          ))}
        </div>

        {/* Auth note */}
        <div className="border border-green-400/20 bg-green-400/5 p-4 flex items-start gap-3">
          <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="font-mono text-xs text-slate-400 leading-relaxed">
            <strong className="text-green-400">No API key needed.</strong>{" "}
            Authentication is handled via the <strong className="text-slate-200">x402 protocol</strong> — pay per request with USDC on Base.
            Use your <strong className="text-slate-200">FiLX agent wallet</strong> for signing (no private key exposure).
            See <a href="https://filx.io/docs" className="text-[#3b82f6] hover:text-white transition-colors">filx.io/docs</a> for full integration guide.
          </p>
        </div>

        {/* Endpoint table */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Code2 className="w-4 h-4 text-[#3b82f6]" />
            <h2 className="font-mono font-bold text-slate-200 uppercase tracking-widest text-sm">All Endpoints</h2>
            <span className="font-mono text-[10px] text-slate-600 border border-white/10 px-2 py-0.5">{ENDPOINTS.length} total</span>
          </div>
          <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
            <div className="grid grid-cols-12 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
              <span className="col-span-1">Method</span>
              <span className="col-span-5">Path</span>
              <span className="col-span-4">Description</span>
              <span className="col-span-2 text-right">Price (USDC)</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {ENDPOINTS.map(({ method, path, desc, price }) => (
                <div key={path} className="grid grid-cols-12 items-center px-4 py-2.5 hover:bg-white/[0.02] transition-colors gap-2 text-xs">
                  <span className={`col-span-1 font-mono font-bold text-[10px] px-1.5 py-0.5 border inline-flex w-fit ${
                    method === "POST"
                      ? "text-[#3b82f6] border-[#3b82f6]/30 bg-[#3b82f6]/5"
                      : "text-green-400 border-green-400/30 bg-green-400/5"
                  }`}>{method}</span>
                  <code className="col-span-5 font-mono text-slate-400 text-[11px] truncate">{path}</code>
                  <span className="col-span-4 font-mono text-slate-500 text-[11px]">{desc}</span>
                  <span className={`col-span-2 text-right font-mono font-bold text-xs ${price === "free" ? "text-green-400" : "text-[#3b82f6]"}`}>{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: FileText, label: "Full API Docs",    href: "https://filx.io/docs",         cta: "filx.io/docs"        },
            { icon: Code2,    label: "Swagger UI",        href: "https://api.filx.io/docs",     cta: "api.filx.io/docs"    },
            { icon: Zap,      label: "App / Quickstart",  href: "https://app.filx.io",          cta: "app.filx.io"         },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between border border-white/10 bg-[#0d0f17] px-4 py-3 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#3b82f6]" />
                  <span className="font-mono font-bold text-slate-200 text-sm">{r.label}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-[#3b82f6]">
                  {r.cta} <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            );
          })}
        </div>

      </div>

      <Footer />
    </main>
  );
}
