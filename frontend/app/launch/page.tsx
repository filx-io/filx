"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Key,
  Bot,
  ArrowRight,
  FileText,
  Image,
  Table,
  FileCode,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATION_METHODS = [
  {
    icon: Bot,
    title: "Bankr Agent API",
    desc: "Natural language payments. Send a prompt, Bankr handles wallet + signing + gas. Zero keys needed.",
    tag: "Easiest",
    href: "https://bankr.bot",
    code: `bankr.prompt("send 0.005 USDC to 0x... on base")`,
  },
  {
    icon: Key,
    title: "Programmatic Wallet",
    desc: "Agent holds its own private key. Sign USDC transfers via viem, ethers.js, or web3.py.",
    tag: "Self-Custody",
    code: `wallet.sendTransaction({ to: addr, value: amount })`,
  },
  {
    icon: Terminal,
    title: "Smart Contract",
    desc: "Route payments through your own contract. Batch payments, escrow, custom logic.",
    tag: "Advanced",
    code: `contract.pay(jobId, amount, recipient)`,
  },
];

const TOP_ENDPOINTS = [
  {
    icon: FileText,
    method: "POST",
    path: "/api/v1/pdf/to-markdown",
    label: "PDF → Markdown",
    price: "$0.002",
    unit: "per page",
    desc: "High-fidelity conversion preserving headings, tables, lists. Ideal for RAG pipelines.",
  },
  {
    icon: FileText,
    method: "POST",
    path: "/api/v1/pdf/ocr",
    label: "PDF OCR",
    price: "$0.004",
    unit: "per page",
    desc: "Extract text from scanned PDFs. Multi-language: English + Indonesian.",
  },
  {
    icon: Image,
    method: "POST",
    path: "/api/v1/image/convert",
    label: "Image Convert",
    price: "$0.001",
    unit: "per image",
    desc: "Convert between PNG, JPG, WebP, AVIF, BMP, TIFF, GIF, SVG, ICO.",
  },
  {
    icon: Image,
    method: "POST",
    path: "/api/v1/image/remove-bg",
    label: "Background Remove",
    price: "$0.005",
    unit: "per image",
    desc: "AI-powered background removal. Returns transparent PNG.",
  },
  {
    icon: Table,
    method: "POST",
    path: "/api/v1/table/extract",
    label: "Table Extract",
    price: "$0.003",
    unit: "per page",
    desc: "Extract tables from PDFs or images to CSV or JSON.",
  },
  {
    icon: FileCode,
    method: "POST",
    path: "/api/v1/html/to-pdf",
    label: "HTML → PDF",
    price: "$0.002",
    unit: "per page",
    desc: "Convert web pages or HTML strings to styled PDF.",
  },
];

const X402_STEPS = [
  {
    n: "01",
    title: "REQUEST",
    color: "text-[#3b82f6]",
    code: `POST /api/v1/pdf/to-markdown
Content-Type: application/json

{"url": "https://example.com/doc.pdf"}`,
  },
  {
    n: "02",
    title: "402 PAYMENT REQUIRED",
    color: "text-yellow-400",
    code: `HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: eyJzY2hlbWUi...

{"amount":"0.002","currency":"USDC"}`,
  },
  {
    n: "03",
    title: "PAY + 200 OK",
    color: "text-green-400",
    code: `PAYMENT-SIGNATURE: eyJ0eEhhc2gi...

HTTP/1.1 200 OK
{"content": "# Document..."}`,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 text-slate-500 hover:text-slate-200 transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LaunchPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08090d] font-mono text-slate-300">

        {/* ── Hero ── */}
        <section className="border-b border-white/5 py-10 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              ✦ x402 PROTOCOL · BASE CHAIN · USDC
            </p>
            <h1 className="font-mono font-black text-slate-100 text-2xl md:text-3xl uppercase tracking-widest">
              File Conversion for AI Agents
            </h1>
            <p className="font-mono text-slate-500 text-sm">
              No accounts. No API keys. Just HTTP + USDC micropayments on Base.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href="https://api.filx.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3b82f6] text-white font-mono font-semibold text-sm tracking-wide hover:bg-[#2563eb] transition-colors"
              >
                Read the Docs <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://filx.io"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/10 text-slate-300 font-mono font-semibold text-sm tracking-wide hover:border-white/25 hover:text-white transition-colors"
              >
                ← Back to Landing Page
              </a>
            </div>
          </div>
        </section>

        {/* ── Two-Column: Integration + Endpoints ── */}
        <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — Agent Integration */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold mb-2">
                // integrate your agent
              </p>
              <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">
                Connect in Minutes
              </h2>
              <p className="font-mono text-slate-500 text-xs mt-1">
                Three ways to get your agent paying with USDC on Base.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {INTEGRATION_METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.title} className="border border-white/10 bg-[#0d0f17] p-4 space-y-2 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#3b82f6]" />
                        <span className="font-bold text-sm text-slate-200">{m.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 border border-white/10 px-1.5 py-0.5 uppercase tracking-wider">
                        {m.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{m.desc}</p>
                    <div className="flex items-center">
                      <code className="flex-1 text-[11px] text-[#3b82f6] bg-[#060709] px-2 py-1.5 overflow-x-auto border border-white/5">
                        {m.code}
                      </code>
                      <CopyButton text={m.code} />
                    </div>
                    {m.href && (
                      <a href={m.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#3b82f6] hover:text-white transition-colors">
                        {m.href.replace("https://", "")} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border border-white/5 bg-[#0d0f17] px-4 py-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-[#3b82f6] font-bold tracking-widest uppercase">
                Base Mainnet · USDC · x402 Protocol
              </span>
            </div>
          </div>

          {/* Right — Top Endpoints */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold mb-2">
                // api endpoints
              </p>
              <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">
                20+ Endpoints
              </h2>
              <p className="font-mono text-slate-500 text-xs mt-1">
                Every endpoint is a single POST request with x402 micropayment. No SDK needed.
              </p>
            </div>

            <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
              <div className="grid grid-cols-3 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06]">
                <span>Endpoint</span>
                <span className="text-center">Price</span>
                <span className="text-right">Unit</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {TOP_ENDPOINTS.map((ep) => (
                  <div
                    key={ep.path}
                    className="grid grid-cols-3 items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-mono text-xs text-slate-300">{ep.label}</span>
                    <span className="text-center font-mono font-bold text-[#3b82f6] text-sm">{ep.price}</span>
                    <span className="text-right font-mono text-slate-500 text-xs">{ep.unit}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] px-4 py-3 flex justify-between items-center">
                <span className="font-mono text-[10px] text-slate-600">All prices in USDC · Base mainnet</span>
                <a
                  href="https://api.filx.io/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[#3b82f6] hover:text-white transition-colors flex items-center gap-1"
                >
                  Full docs <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── x402 Flow ── */}
        <section className="border-t border-white/5 py-12 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
                // x402 protocol
              </p>
              <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">
                How It Works
              </h2>
              <p className="font-mono text-slate-500 text-sm">
                Three HTTP exchanges. No accounts. No API keys. Pure x402.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {X402_STEPS.map((step) => (
                <div key={step.n} className="border border-white/10 bg-[#0d0f17] p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                      <span className="font-mono font-black text-xs text-[#3b82f6]">{step.n}</span>
                    </div>
                    <h3 className={`font-mono font-black text-sm uppercase tracking-widest ${step.color}`}>
                      {step.title}
                    </h3>
                  </div>
                  <div className="bg-[#060709] border border-white/5 p-3">
                    <pre className="font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {step.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Available Services ── */}
        <section className="border-t border-white/5 py-12 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
                // available services
              </p>
              <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">
                Conversion Services
              </h2>
              <p className="font-mono text-slate-500 text-sm">
                Each service is a standalone x402 endpoint. Pay per request. Scale without limits.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "PDF → Markdown",
                  tag: "Document",
                  tagColor: "text-purple-400 border-purple-400/30",
                  uptime: "99.2%",
                  desc: "High-fidelity PDF to Markdown converter with heading, table, and list preservation.",
                  price: "$0.002 USDC",
                  unit: "per page",
                },
                {
                  name: "OCR Engine",
                  tag: "Processing",
                  tagColor: "text-green-400 border-green-400/30",
                  uptime: "99.1%",
                  desc: "Multi-language OCR for scanned PDFs and images. English + Indonesian.",
                  price: "$0.004 USDC",
                  unit: "per page",
                },
                {
                  name: "Image Optimizer",
                  tag: "Media",
                  tagColor: "text-blue-400 border-blue-400/30",
                  uptime: "99.6%",
                  desc: "Smart image conversion, compression, and background removal. WebP/AVIF/PNG/JPG.",
                  price: "$0.001 USDC",
                  unit: "per image",
                },
                {
                  name: "Table Extractor",
                  tag: "Data",
                  tagColor: "text-orange-400 border-orange-400/30",
                  uptime: "96.8%",
                  desc: "Extract tables from PDFs and images to CSV or JSON. Ready for data pipelines.",
                  price: "$0.003 USDC",
                  unit: "per page",
                },
              ].map((svc) => (
                <div key={svc.name} className="border border-white/10 bg-[#0d0f17] p-5 flex flex-col gap-3 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-mono font-bold text-slate-200 text-sm">{svc.name}</h3>
                      <span className={`font-mono text-[10px] font-bold border px-2 py-0.5 mt-1 inline-block ${svc.tagColor}`}>
                        {svc.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                      {svc.uptime} uptime
                    </div>
                  </div>
                  <p className="font-mono text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="font-mono font-bold text-[#3b82f6]">{svc.price}</span>
                    <span className="font-mono text-slate-600">{svc.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center font-mono text-xs text-slate-600">
              All payments in USDC on Base · x402 protocol · Fully autonomous — no human approval required
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
