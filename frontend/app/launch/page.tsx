"use client";

import { useState } from "react";
import {
  Copy, Check, ExternalLink, ChevronDown, ChevronUp,
  FileText, Image as ImageIcon, Table2, FileCode,
  Zap, ArrowRight, CheckCircle2, Terminal, Shield,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type Lang = "python" | "javascript" | "cli";

// ─── Starter code (NO private keys anywhere) ──────────────────────────────────

const STARTER: Record<Lang, string> = {
  python: `# pip install httpx
import httpx, os

API = "https://api.filx.io"
KEY = os.environ["FILX_API_KEY"]  # filx login → filx api-key

# Step 1 — call the API (get 402 payment request)
res = httpx.post(f"{API}/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/document.pdf"})

# Step 2 — FliX wallet signs the payment (no private key needed)
if res.status_code == 402:
    payment_req = res.headers["PAYMENT-REQUIRED"]

    signed = httpx.post(f"{API}/api/v1/wallet/sign",
        headers={"Authorization": f"Bearer {KEY}"},
        json={"payment_required": payment_req}
    ).json()["payment_signature"]

    # Step 3 — resend with payment proof
    result = httpx.post(f"{API}/api/v1/pdf/to-markdown",
        json={"url": "https://example.com/document.pdf"},
        headers={"PAYMENT-SIGNATURE": signed}
    ).json()

    print(result["content"])   # → "# Document Title\\n\\n..."
    print(result["cost_usdc"]) # → "0.008"`,

  javascript: `// No npm packages needed — just native fetch
const API = "https://api.filx.io";
const KEY = process.env.FILX_API_KEY; // filx login → filx api-key

// Step 1 — call the API
const res = await fetch(\`\${API}/api/v1/pdf/to-markdown\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com/document.pdf" }),
});

// Step 2 — FliX wallet signs the payment (no private key in code)
if (res.status === 402) {
  const paymentRequired = res.headers.get("PAYMENT-REQUIRED");
  const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
    method: "POST",
    headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ payment_required: paymentRequired }),
  }).then(r => r.json());

  // Step 3 — resend with payment proof
  const data = await fetch(\`\${API}/api/v1/pdf/to-markdown\`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
    body: JSON.stringify({ url: "https://example.com/document.pdf" }),
  }).then(r => r.json());

  console.log(data.content);   // → "# Document Title\\n\\n..."
  console.log(data.cost_usdc); // → "0.008"
}`,

  cli: `# Install FliX CLI once
npm install -g @filx/cli

# Login — creates your agent wallet (Privy embedded wallet)
filx login you@example.com

# Check your wallet address and USDC balance
filx whoami
filx balance

# Natural language conversion — pays automatically
filx prompt "Convert https://example.com/doc.pdf to markdown"

# For scripts: export your API key
export FILX_API_KEY=$(filx api-key)`,
};

// ─── Endpoint snippets (no private keys) ─────────────────────────────────────

const ENDPOINT_CODE: Record<string, Record<Lang, string>> = {
  "/api/v1/pdf/to-markdown": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/doc.pdf", "pages": "1-5"},
    headers={"PAYMENT-SIGNATURE": signed}).json()
print(result["content"])`,
    javascript: `const paymentRequired = res.headers.get("PAYMENT-REQUIRED");
const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: paymentRequired }),
}).then(r => r.json());
const { content, cost_usdc } = await fetch(\`\${API}/api/v1/pdf/to-markdown\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ url: "https://example.com/doc.pdf", pages: "1-5" }),
}).then(r => r.json());`,
    cli: `filx prompt "Convert https://example.com/doc.pdf to markdown"`,
  },
  "/api/v1/pdf/ocr": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/pdf/ocr",
    json={"url": "https://example.com/scan.pdf", "lang": "eng"},
    headers={"PAYMENT-SIGNATURE": signed}).json()
print(result["text"])`,
    javascript: `const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
}).then(r => r.json());
const { text } = await fetch(\`\${API}/api/v1/pdf/ocr\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ url: "https://example.com/scan.pdf", lang: "eng" }),
}).then(r => r.json());`,
    cli: `filx prompt "OCR extract text from https://example.com/scan.pdf"`,
  },
  "/api/v1/image/remove-bg": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/image/remove-bg",
    json={"url": "https://example.com/product.jpg"},
    headers={"PAYMENT-SIGNATURE": signed}).json()
download_url = result["url"]  # transparent PNG`,
    javascript: `const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
}).then(r => r.json());
const { url } = await fetch(\`\${API}/api/v1/image/remove-bg\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ url: "https://example.com/product.jpg" }),
}).then(r => r.json()); // transparent PNG`,
    cli: `filx prompt "Remove background from https://example.com/product.jpg"`,
  },
  "/api/v1/image/convert": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/image/convert",
    json={"url": "https://example.com/photo.jpg", "format": "webp"},
    headers={"PAYMENT-SIGNATURE": signed}).json()
print(result["url"])`,
    javascript: `const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
}).then(r => r.json());
const { url } = await fetch(\`\${API}/api/v1/image/convert\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ url: "https://example.com/photo.jpg", format: "webp" }),
}).then(r => r.json());`,
    cli: `filx prompt "Convert https://example.com/photo.jpg to WebP"`,
  },
  "/api/v1/image/upscale": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/image/upscale",
    json={"url": "https://example.com/photo.jpg", "scale": 2},
    headers={"PAYMENT-SIGNATURE": signed}).json()
print(result["url"])  # 2× upscaled`,
    javascript: `const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
}).then(r => r.json());
const { url, width, height } = await fetch(\`\${API}/api/v1/image/upscale\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ url: "https://example.com/photo.jpg", scale: 2 }),
}).then(r => r.json());`,
    cli: `filx prompt "Upscale 2x https://example.com/photo.jpg"`,
  },
  "/api/v1/table/extract": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/table/extract",
    json={"url": "https://example.com/report.pdf", "format": "json"},
    headers={"PAYMENT-SIGNATURE": signed}).json()
for table in result["tables"]:
    print(table["headers"], table["rows"])`,
    javascript: `const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
}).then(r => r.json());
const { tables, tables_found } = await fetch(\`\${API}/api/v1/table/extract\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ url: "https://example.com/report.pdf", format: "json" }),
}).then(r => r.json());`,
    cli: `filx prompt "Extract tables from https://example.com/report.pdf as JSON"`,
  },
  "/api/v1/html/to-pdf": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/html/to-pdf",
    json={"url": "https://example.com/page"},
    headers={"PAYMENT-SIGNATURE": signed}).json()
pdf_url = result["url"]`,
    javascript: `const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
}).then(r => r.json());
const { url, pages } = await fetch(\`\${API}/api/v1/html/to-pdf\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ url: "https://example.com/page" }),
}).then(r => r.json());`,
    cli: `filx prompt "Convert https://example.com/page to PDF"`,
  },
  "/api/v1/markdown/to-pdf": {
    python: `signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
result = httpx.post(f"{API}/api/v1/markdown/to-pdf",
    json={"markdown": "# Hello\\n\\nThis is my **report**.", "theme": "github"},
    headers={"PAYMENT-SIGNATURE": signed}).json()
pdf_url = result["url"]`,
    javascript: `const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
}).then(r => r.json());
const { url } = await fetch(\`\${API}/api/v1/markdown/to-pdf\`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
  body: JSON.stringify({ markdown: "# Hello\\n\\nThis is my **report**." }),
}).then(r => r.json());`,
    cli: `filx prompt "Convert this markdown to PDF: # Hello World"`,
  },
};

const ENDPOINTS = [
  { path: "/api/v1/pdf/to-markdown",  label: "PDF → Markdown",     price: "$0.002", unit: "/ page",  icon: FileText,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"content": "# Title\\n\\n## Section...", "pages_processed": 4, "cost_usdc": "0.008"}` },
  { path: "/api/v1/pdf/ocr",          label: "PDF OCR",             price: "$0.004", unit: "/ page",  icon: FileText,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"text": "Extracted text...", "confidence": 0.97, "cost_usdc": "0.004"}` },
  { path: "/api/v1/image/remove-bg",  label: "Background Remove",   price: "$0.005", unit: "/ image", icon: ImageIcon,  tag: "Image",    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",        response: `{"url": "https://api.filx.io/files/no-bg.png", "expires_at": "..."}` },
  { path: "/api/v1/image/convert",    label: "Image Convert",       price: "$0.001", unit: "/ image", icon: ImageIcon,  tag: "Image",    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",        response: `{"url": "https://api.filx.io/files/output.webp", "expires_at": "..."}` },
  { path: "/api/v1/image/upscale",    label: "Image Upscale 2×/4×", price: "$0.008", unit: "/ image", icon: ImageIcon,  tag: "Image",    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",        response: `{"url": "https://api.filx.io/files/upscaled.png", "width": 3840, "height": 2160}` },
  { path: "/api/v1/table/extract",    label: "Table Extract",       price: "$0.003", unit: "/ page",  icon: Table2,     tag: "Data",     tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/5",  response: `{"tables": [{"headers": ["Name","Q1"], "rows": [["Alice","120k"]]}], "tables_found": 1}` },
  { path: "/api/v1/html/to-pdf",      label: "HTML → PDF",          price: "$0.002", unit: "/ page",  icon: FileCode,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"url": "https://api.filx.io/files/output.pdf", "pages": 3, "expires_at": "..."}` },
  { path: "/api/v1/markdown/to-pdf",  label: "Markdown → PDF",      price: "$0.002", unit: "/ page",  icon: FileCode,   tag: "Document", tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/5",  response: `{"url": "https://api.filx.io/files/output.pdf", "pages": 2, "expires_at": "..."}` },
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
    { id: "cli",        label: "FliX CLI" },
  ];
  return (
    <div className="flex gap-0 border-b border-white/[0.06]">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`font-mono text-xs px-4 py-2.5 border-b-2 transition-colors ${
            active === t.id
              ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/5"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}>
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
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left">
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
          {open ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-white/[0.06] bg-[#0a0c14] p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Code</span>
              <CopyBtn text={code} label="Copy" />
            </div>
            <div className="bg-[#060709] border border-white/5 p-4 overflow-x-auto">
              <pre className="font-mono text-xs text-slate-400 leading-relaxed">{code}</pre>
            </div>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Response · 200 OK</span>
            <div className="bg-[#060709] border border-white/5 p-4">
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
              ✦ api.filx.io · x402 · USDC · Base
            </p>
            <h1 className="font-mono font-black text-slate-100 text-3xl md:text-4xl uppercase tracking-widest leading-tight">
              Connect Your Agent in 2 Minutes
            </h1>
            <p className="font-mono text-slate-400 text-sm max-w-lg mx-auto">
              No private keys. No account setup. <br />
              Your agent gets its own wallet — just log in and go.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {[
                { icon: Shield,       text: "No private key exposure" },
                { icon: CheckCircle2, text: "Embedded agent wallet" },
                { icon: CheckCircle2, text: "One API, everything FliX" },
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

          {/* ── Step 1: Get Agent Wallet ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-black text-xs text-[#3b82f6]">1</span>
              </div>
              <h2 className="font-mono font-black text-slate-200 text-lg uppercase tracking-widest">Get your agent wallet</h2>
            </div>
            <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shell</span>
                <CopyBtn text={`npm install -g @filx/cli\nfilx login you@example.com\nexport FILX_API_KEY=$(filx api-key)`} label="Copy" />
              </div>
              <div className="bg-[#060709] px-5 py-4">
                <pre className="font-mono text-xs text-slate-400 leading-relaxed">{`# Install FliX CLI once
npm install -g @filx/cli

# Login — creates an embedded wallet for your agent (via Privy)
filx login you@example.com

# Export your API key — this is all you need, no private key
export FILX_API_KEY=$(filx api-key)

# Check your wallet & USDC balance
filx whoami
filx balance`}</pre>
              </div>
              <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  <span className="font-mono text-[10px] text-slate-500">
                    Wallet secured by <strong className="text-slate-300">Privy embedded wallets</strong> — private key never exposed or stored by you.
                  </span>
                </div>
                <a href="https://filx.io/docs"
                  className="font-mono text-[10px] text-[#3b82f6] hover:text-white transition-colors flex items-center gap-1 flex-shrink-0">
                  filx.io/docs <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Why no private key */}
            <div className="border border-green-400/20 bg-green-400/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="font-mono font-bold text-green-400 text-sm">Why no private key?</span>
              </div>
              <p className="font-mono text-xs text-slate-400 leading-relaxed">
                Private keys in code are a security risk — leaked to logs, git history, or CI/CD systems.
                FliX gives your agent a <strong className="text-slate-200">Privy embedded wallet</strong> with a secure,
                server-side key. Your agent authenticates with <code className="text-[#3b82f6]">FILX_API_KEY</code> —
                a rotatable API credential that never exposes the underlying wallet.
              </p>
            </div>
          </div>

          {/* ── Step 2: Fund your wallet ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-black text-xs text-[#3b82f6]">2</span>
              </div>
              <h2 className="font-mono font-black text-slate-200 text-lg uppercase tracking-widest">Fund your agent wallet with USDC</h2>
            </div>
            <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-4">
              <p className="font-mono text-xs text-slate-500 leading-relaxed">
                Your wallet needs <strong className="text-slate-300">USDC on Base mainnet</strong> (chain ID 8453).
                Even <strong className="text-slate-300">$1 USDC</strong> is enough for hundreds of conversions.
                Average cost: $0.001–$0.008 per operation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "FliX CLI",        desc: "Check your wallet address, send USDC directly.",             cmd: "filx whoami   # shows your wallet address\n# send USDC on Base to this address" },
                  { name: "Coinbase",         desc: "Buy USDC on Coinbase and withdraw to your wallet.",          cmd: "# Coinbase → Withdraw → Base network\n# Paste your wallet address" },
                  { name: "Bridge from ETH",  desc: "Already have ETH on Base? Swap to USDC on-chain.",          cmd: "filx prompt \"swap $5 ETH to USDC on Base\"" },
                ].map((opt) => (
                  <div key={opt.name} className="border border-white/10 bg-[#08090d] p-3 space-y-2">
                    <span className="font-mono font-bold text-slate-200 text-xs">{opt.name}</span>
                    <p className="font-mono text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                    <div className="flex items-center gap-1">
                      <code className="flex-1 font-mono text-[10px] text-[#3b82f6] bg-[#060709] border border-white/5 px-2 py-1.5 overflow-x-auto whitespace-pre">{opt.cmd}</code>
                    </div>
                  </div>
                ))}
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
              <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-mono text-[10px] text-[#3b82f6] uppercase tracking-widest font-bold">
                    FliX Wallet · Base Mainnet · USDC · x402
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {lang === "python" && (
                    <span className="font-mono text-[10px] text-slate-600">requires: pip install httpx</span>
                  )}
                  {lang === "javascript" && (
                    <span className="font-mono text-[10px] text-slate-600">native fetch — no npm packages needed</span>
                  )}
                  {lang === "cli" && (
                    <span className="font-mono text-[10px] text-slate-600">requires: npm install -g @filx/cli</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Endpoint Explorer ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-[#3b82f6]" />
                </div>
                <h2 className="font-mono font-black text-slate-200 text-lg uppercase tracking-widest">Try an Endpoint</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-600">Language:</span>
                {(["python", "javascript", "cli"] as Lang[]).map((l) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`font-mono text-[10px] px-3 py-1.5 border transition-colors capitalize ${
                      lang === l ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/10" : "border-white/10 text-slate-600 hover:text-slate-300"
                    }`}>
                    {l === "cli" ? "FliX CLI" : l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {ENDPOINTS.map((ep) => <EndpointRow key={ep.path} ep={ep} lang={lang} />)}
            </div>
            <a href="https://filx.io/docs"
              className="flex items-center justify-center gap-2 border border-white/10 bg-[#0d0f17] py-3 font-mono text-xs text-slate-500 hover:text-slate-200 hover:border-white/20 transition-colors">
              View all 20 endpoints in docs <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* ── Resources ── */}
          <div className="space-y-4">
            <h2 className="font-mono font-bold text-xs text-slate-600 uppercase tracking-widest border-b border-white/5 pb-3">Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: FileText,  title: "Full API Docs",   desc: "All 20 endpoints, request schemas, response models, pricing.",  href: "https://filx.io/docs",       cta: "filx.io/docs" },
                { icon: Terminal,  title: "Swagger UI",       desc: "Interactive explorer — try any endpoint live in your browser.", href: "https://api.filx.io/docs",    cta: "api.filx.io/docs" },
                { icon: Shield,    title: "API Status",       desc: "Live uptime, response times, and incident history.",           href: "https://status.filx.io",     cta: "status.filx.io" },
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
