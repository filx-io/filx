"use client";

import { useState } from "react";
import {
  Copy, Check, ExternalLink, ChevronDown, ChevronUp,
  FileText, Image as ImageIcon, Table2, FileCode,
  Zap, Key, Bot, ArrowRight, CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = "python" | "javascript" | "curl";

// ─── Starter code ─────────────────────────────────────────────────────────────
const STARTER: Record<Lang, string> = {
  python: `# pip install x402 httpx
from x402 import Client

# 1. Init client with your wallet private key
client = Client(wallet_private_key="0x_YOUR_PRIVATE_KEY")

# 2. Call any endpoint — x402 handles payment automatically
result = client.post(
    "https://api.filx.io/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/document.pdf"}
)

# 3. Use the result
data = result.json()
print(data["content"])   # → "# Document Title\\n\\n..."
print(data["cost_usdc"]) # → "0.008"`,

  javascript: `// npm install @x402/fetch viem
import { wrapFetch } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

// 1. Init wallet client
const account = privateKeyToAccount("0x_YOUR_PRIVATE_KEY");
const walletClient = createWalletClient({
  account, chain: base, transport: http()
});

// 2. Wrap fetch — x402 payment is automatic
const fetchWithPayment = wrapFetch(fetch, walletClient);

// 3. Call any endpoint
const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/pdf/to-markdown",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
  }
);
const data = await res.json();
console.log(data.content);   // → "# Document Title\\n\\n..."`,

  curl: `# Step 1 — Request (server will ask for payment)
curl -i -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/doc.pdf"}'

# → HTTP 402 Payment Required
# → PAYMENT-REQUIRED: eyJzY2hlbWUiOiJleGFjdCIsIm...
# (copy the header value)

# Step 2 — Sign & resend with payment
# Use an x402 signing tool, then:
curl -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: eyJTSUdORUQ..." \\
  -d '{"url": "https://example.com/doc.pdf"}'

# → HTTP 200 OK
# → {"content": "# Document Title...", "cost_usdc": "0.002"}`,
};

// ─── Endpoints ────────────────────────────────────────────────────────────────
const ENDPOINT_CODE: Record<string, Record<Lang, string>> = {
  "/api/v1/pdf/to-markdown": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/doc.pdf", "pages": "1-5"}
)
print(result.json()["content"])`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/pdf/to-markdown",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/doc.pdf", pages: "1-5" }) }
);
const { content } = await res.json();`,
    curl: `curl -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"url": "https://example.com/doc.pdf"}'`,
  },
  "/api/v1/pdf/ocr": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/pdf/ocr",
    json={"url": "https://example.com/scan.pdf", "lang": "eng"}
)
print(result.json()["text"])`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/pdf/ocr",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/scan.pdf", lang: "eng" }) }
);`,
    curl: `curl -X POST https://api.filx.io/api/v1/pdf/ocr \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"url": "https://example.com/scan.pdf", "lang": "eng"}'`,
  },
  "/api/v1/image/remove-bg": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/image/remove-bg",
    json={"url": "https://example.com/product.jpg"}
)
download_url = result.json()["url"]  # transparent PNG`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/image/remove-bg",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/product.jpg" }) }
);
const { url } = await res.json(); // transparent PNG URL`,
    curl: `curl -X POST https://api.filx.io/api/v1/image/remove-bg \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"url": "https://example.com/product.jpg"}'`,
  },
  "/api/v1/image/convert": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/image/convert",
    json={"url": "https://example.com/photo.jpg", "format": "webp"}
)
print(result.json()["url"])`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/image/convert",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/photo.jpg", format: "webp" }) }
);`,
    curl: `curl -X POST https://api.filx.io/api/v1/image/convert \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"url": "https://example.com/photo.jpg", "format": "webp"}'`,
  },
  "/api/v1/image/upscale": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/image/upscale",
    json={"url": "https://example.com/photo.jpg", "scale": 2}
)
print(result.json()["url"])  # 2× upscaled image`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/image/upscale",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/photo.jpg", scale: 2 }) }
);`,
    curl: `curl -X POST https://api.filx.io/api/v1/image/upscale \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"url": "https://example.com/photo.jpg", "scale": 2}'`,
  },
  "/api/v1/table/extract": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/table/extract",
    json={"url": "https://example.com/report.pdf", "format": "json"}
)
tables = result.json()["tables"]
for table in tables:
    print(table["headers"], table["rows"])`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/table/extract",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/report.pdf", format: "json" }) }
);
const { tables } = await res.json();`,
    curl: `curl -X POST https://api.filx.io/api/v1/table/extract \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"url": "https://example.com/report.pdf", "format": "json"}'`,
  },
  "/api/v1/html/to-pdf": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/html/to-pdf",
    json={"url": "https://example.com/page", "page_size": "A4"}
)
pdf_url = result.json()["url"]`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/html/to-pdf",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/page" }) }
);
const { url } = await res.json(); // PDF download URL`,
    curl: `curl -X POST https://api.filx.io/api/v1/html/to-pdf \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"url": "https://example.com/page"}'`,
  },
  "/api/v1/markdown/to-pdf": {
    python: `result = client.post(
    "https://api.filx.io/api/v1/markdown/to-pdf",
    json={"markdown": "# Hello\\n\\nThis is my **report**.", "theme": "github"}
)
pdf_url = result.json()["url"]`,
    javascript: `const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/markdown/to-pdf",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown: "# Hello\\n\\nThis is my **report**." }) }
);`,
    curl: `curl -X POST https://api.filx.io/api/v1/markdown/to-pdf \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <signed>" \\
  -d '{"markdown": "# Hello\\n\\nThis is my **report**."}'`,
  },
};

const ENDPOINTS = [
  { path: "/api/v1/pdf/to-markdown",  label: "PDF → Markdown",      price: "$0.002", unit: "/ page",  icon: FileText,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"content": "# Title\\n\\n## Section...", "pages_processed": 4, "cost_usdc": "0.008"}` },
  { path: "/api/v1/pdf/ocr",          label: "PDF OCR",              price: "$0.004", unit: "/ page",  icon: FileText,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"text": "Extracted plain text...", "confidence": 0.97, "cost_usdc": "0.004"}` },
  { path: "/api/v1/image/remove-bg",  label: "Background Remove",    price: "$0.005", unit: "/ image", icon: ImageIcon,  tag: "Image",    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",        response: `{"url": "https://api.filx.io/files/no-bg.png", "expires_at": "..."}` },
  { path: "/api/v1/image/convert",    label: "Image Convert",        price: "$0.001", unit: "/ image", icon: ImageIcon,  tag: "Image",    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",        response: `{"url": "https://api.filx.io/files/output.webp", "expires_at": "..."}` },
  { path: "/api/v1/image/upscale",    label: "Image Upscale 2×/4×",  price: "$0.008", unit: "/ image", icon: ImageIcon,  tag: "Image",    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",        response: `{"url": "https://api.filx.io/files/upscaled.png", "width": 3840, "height": 2160}` },
  { path: "/api/v1/table/extract",    label: "Table Extract",        price: "$0.003", unit: "/ page",  icon: Table2,     tag: "Data",     tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/5",  response: `{"tables": [{"headers": ["Name","Q1"], "rows": [["Alice","120k"]]}], "tables_found": 1}` },
  { path: "/api/v1/html/to-pdf",      label: "HTML → PDF",           price: "$0.002", unit: "/ page",  icon: FileCode,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"url": "https://api.filx.io/files/output.pdf", "pages": 3, "expires_at": "..."}` },
  { path: "/api/v1/markdown/to-pdf",  label: "Markdown → PDF",       price: "$0.002", unit: "/ page",  icon: FileCode,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"url": "https://api.filx.io/files/output.pdf", "pages": 2, "expires_at": "..."}` },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-slate-200 border border-white/10 px-2.5 py-1.5 hover:border-white/20 transition-colors flex-shrink-0"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  );
}

function LangTabs({ active, onChange }: { active: Lang; onChange: (l: Lang) => void }) {
  const tabs: { id: Lang; label: string }[] = [
    { id: "python",     label: "Python" },
    { id: "javascript", label: "JavaScript" },
    { id: "curl",       label: "cURL" },
  ];
  return (
    <div className="flex gap-0 border-b border-white/[0.06]">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`font-mono text-xs px-4 py-2.5 border-b-2 transition-colors ${
            active === t.id
              ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function EndpointRow({ ep, lang }: { ep: typeof ENDPOINTS[0]; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const code = ENDPOINT_CODE[ep.path]?.[lang] ?? "";
  const Icon = ep.icon;

  return (
    <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-slate-200 text-sm">{ep.label}</span>
              <span className={`font-mono text-[10px] font-bold border px-1.5 py-0.5 ${ep.tagColor}`}>{ep.tag}</span>
            </div>
            <code className="font-mono text-[11px] text-slate-500 mt-0.5 block">{ep.path}</code>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="font-mono font-bold text-[#3b82f6] text-sm">{ep.price}</div>
            <div className="font-mono text-[10px] text-slate-600">{ep.unit}</div>
          </div>
          {open
            ? <ChevronUp className="w-4 h-4 text-slate-600" />
            : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#0a0c14] p-4 space-y-4">
          {/* Request code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Request</span>
              <CopyBtn text={code} label="Copy" />
            </div>
            <div className="bg-[#060709] border border-white/5 p-4 overflow-x-auto">
              <pre className="font-mono text-xs text-slate-400 leading-relaxed">{code}</pre>
            </div>
          </div>
          {/* Response */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Response · 200 OK</span>
            <div className="bg-[#060709] border border-white/5 p-4 overflow-x-auto">
              <pre className="font-mono text-xs text-green-400 leading-relaxed">{ep.response}</pre>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 pt-1 border-t border-white/5">
            <span>{ep.price} USDC {ep.unit}</span>
            <span>·</span>
            <span>Output expires in 1 hour</span>
            <a href="https://filx.io/docs" className="text-[#3b82f6] hover:text-white transition-colors ml-auto flex items-center gap-1">
              Full docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LaunchPage() {
  const [lang, setLang] = useState<Lang>("python");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08090d] font-mono text-slate-300">

        {/* ── Hero ── */}
        <section className="border-b border-white/5 py-12 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              ✦ app.filx.io · x402 · USDC · Base
            </p>
            <h1 className="font-mono font-black text-slate-100 text-3xl md:text-4xl uppercase tracking-widest leading-tight">
              Start Converting Files in 2 Minutes
            </h1>
            <p className="font-mono text-slate-400 text-sm max-w-lg mx-auto">
              No account. No API key. No subscription. <br />
              Just copy the code below, add your wallet, and go.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {[
                { icon: CheckCircle2, text: "Wallet on Base" },
                { icon: CheckCircle2, text: "USDC balance" },
                { icon: CheckCircle2, text: "x402 client" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 font-mono text-xs text-slate-500 border border-white/10 px-3 py-1.5 bg-[#0d0f17]">
                  <item.icon className="w-3 h-3 text-green-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* ── Step 1: Install ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-black text-xs text-[#3b82f6]">1</span>
              </div>
              <h2 className="font-mono font-black text-slate-200 text-lg uppercase tracking-widest">Install the x402 client</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { lang: "Python",     cmd: "pip install x402 httpx",          icon: "🐍" },
                { lang: "JavaScript", cmd: "npm install @x402/fetch viem",      icon: "⚡" },
                { lang: "Bankr",      cmd: "No install — natural language API", icon: "🤖", href: "https://bankr.bot" },
              ].map((item) => (
                <div key={item.lang} className="border border-white/10 bg-[#0d0f17] p-4 space-y-2 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-200 text-sm">{item.icon} {item.lang}</span>
                    {item.href && (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#3b82f6] hover:text-white transition-colors flex items-center gap-0.5">
                        site <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <code className="flex-1 text-[11px] text-[#3b82f6] bg-[#060709] border border-white/5 px-2 py-1.5 overflow-x-auto">
                      {item.cmd}
                    </code>
                    {!item.href && <CopyBtn text={item.cmd} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Step 2: Get USDC ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-black text-xs text-[#3b82f6]">2</span>
              </div>
              <h2 className="font-mono font-black text-slate-200 text-lg uppercase tracking-widest">Get a wallet + USDC on Base</h2>
            </div>
            <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-4">
              <p className="font-mono text-xs text-slate-500 leading-relaxed">
                You need a wallet with USDC on <strong className="text-slate-300">Base mainnet</strong> (chain ID 8453).
                Even $0.10 USDC is enough for dozens of conversions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "Coinbase Wallet",  desc: "Easiest — create wallet + buy USDC in one app.",   href: "https://wallet.coinbase.com", badge: "Recommended" },
                  { name: "MetaMask",          desc: "Add Base network, bridge or buy USDC.",            href: "https://metamask.io",         badge: "Popular" },
                  { name: "Bankr",             desc: "Custodial — no wallet setup needed at all.",        href: "https://bankr.bot",           badge: "No Key Needed" },
                ].map((w) => (
                  <a key={w.name} href={w.href} target="_blank" rel="noopener noreferrer"
                    className="border border-white/10 bg-[#08090d] p-3 space-y-1 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono font-bold text-slate-200 text-xs">{w.name}</span>
                      <span className="font-mono text-[10px] text-[#3b82f6] border border-[#3b82f6]/30 px-1.5 py-0.5 whitespace-nowrap">{w.badge}</span>
                    </div>
                    <p className="font-mono text-[11px] text-slate-500 leading-relaxed">{w.desc}</p>
                  </a>
                ))}
              </div>
              <div className="flex items-start gap-2 border border-yellow-400/20 bg-yellow-400/5 p-3">
                <span className="text-yellow-400 text-xs mt-0.5">⚠</span>
                <p className="font-mono text-xs text-yellow-400/80 leading-relaxed">
                  Never share your private key. For production agents, use Bankr (custodial) or a dedicated agent wallet — never your personal wallet.
                </p>
              </div>
            </div>
          </div>

          {/* ── Step 3: Run the code ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-black text-xs text-[#3b82f6]">3</span>
              </div>
              <h2 className="font-mono font-black text-slate-200 text-lg uppercase tracking-widest">Copy, paste, run</h2>
            </div>
            <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06]">
                <LangTabs active={lang} onChange={setLang} />
                <div className="px-3">
                  <CopyBtn text={STARTER[lang]} label="Copy all" />
                </div>
              </div>
              <div className="bg-[#060709] px-5 py-5 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-400 leading-relaxed">{STARTER[lang]}</pre>
              </div>
              <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-mono text-[10px] text-[#3b82f6] uppercase tracking-widest font-bold">Base Mainnet · USDC · x402</span>
                </div>
                <a href="https://filx.io/docs#quickstart" className="font-mono text-[10px] text-slate-500 hover:text-slate-200 transition-colors flex items-center gap-1">
                  More examples <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* ── Endpoint explorer ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-[#3b82f6]" />
                </div>
                <h2 className="font-mono font-black text-slate-200 text-lg uppercase tracking-widest">Try an Endpoint</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-600">Code language:</span>
                <div className="flex gap-0">
                  {(["python", "javascript", "curl"] as Lang[]).map((l) => (
                    <button key={l} onClick={() => setLang(l)}
                      className={`font-mono text-[10px] px-3 py-1.5 border transition-colors capitalize ${
                        lang === l
                          ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/10"
                          : "border-white/10 text-slate-600 hover:text-slate-300"
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {ENDPOINTS.map((ep) => (
                <EndpointRow key={ep.path} ep={ep} lang={lang} />
              ))}
            </div>
            <a href="https://filx.io/docs" className="flex items-center justify-center gap-2 border border-white/10 bg-[#0d0f17] py-3 font-mono text-xs text-slate-500 hover:text-slate-200 hover:border-white/20 transition-colors">
              View all 20 endpoints in full docs <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* ── Help & Resources ── */}
          <div className="space-y-4">
            <h2 className="font-mono font-bold text-xs text-slate-600 uppercase tracking-widest border-b border-white/5 pb-3">
              Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: FileText, title: "Full API Docs",     desc: "All 20 endpoints with request schemas, response models, and pricing.", href: "https://filx.io/docs",       cta: "filx.io/docs" },
                { icon: Bot,      title: "Swagger UI",         desc: "Interactive API explorer — try any endpoint directly in your browser.", href: "https://api.filx.io/docs",  cta: "api.filx.io/docs" },
                { icon: Key,      title: "x402 Protocol",      desc: "Learn how HTTP 402 machine payments work on Base chain.",             href: "https://x402.org",           cta: "x402.org" },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer"
                    className="border border-white/10 bg-[#0d0f17] p-4 space-y-2 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#3b82f6]" />
                      <span className="font-mono font-bold text-slate-200 text-sm">{r.title}</span>
                    </div>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-[#3b82f6]">
                      {r.cta} <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Base URL ── */}
          <div className="border border-white/10 bg-[#0d0f17] p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-1">Base URL</div>
              <code className="font-mono text-sm text-[#3b82f6]">https://api.filx.io</code>
            </div>
            <CopyBtn text="https://api.filx.io" label="Copy" />
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
