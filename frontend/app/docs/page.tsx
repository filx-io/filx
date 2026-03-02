"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Copy, Check, ExternalLink, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Endpoint = {
  method: "POST" | "GET";
  path: string;
  label: string;
  price: string;
  unit: string;
  desc: string;
  body: Record<string, string>;
  response: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "x402", label: "x402 Protocol" },
  { id: "quickstart", label: "Quick Start" },
  { id: "document", label: "Document Processing" },
  { id: "image", label: "Image Processing" },
  { id: "data", label: "Data Extraction" },
  { id: "sdks", label: "SDKs & Integrations" },
  { id: "errors", label: "Error Reference" },
];

const DOCUMENT_ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/pdf/to-markdown",
    label: "PDF → Markdown",
    price: "$0.002",
    unit: "per page",
    desc: "High-fidelity conversion preserving headings, tables, lists, and code blocks. Ideal for RAG pipelines and LLM context windows.",
    body: { url: "string — publicly accessible PDF URL" },
    response: `{"content": "# Document Title\\n\\n## Section\\n\\nParagraph text..."}`,
  },
  {
    method: "POST",
    path: "/api/v1/pdf/ocr",
    label: "PDF OCR",
    price: "$0.004",
    unit: "per page",
    desc: "Extract text from scanned PDFs using OCR. Multi-language support: English + Indonesian (Bahasa).",
    body: { url: "string — publicly accessible PDF URL", lang: "string? — 'eng' | 'ind' (default: 'eng')" },
    response: `{"text": "Extracted plain text content..."}`,
  },
  {
    method: "POST",
    path: "/api/v1/pdf/compress",
    label: "PDF Compress",
    price: "$0.002",
    unit: "per file",
    desc: "Reduce PDF file size by optimizing images, fonts, and embedded resources.",
    body: { url: "string — publicly accessible PDF URL" },
    response: `{"url": "https://...temporary-download-link.pdf", "original_size": 1024000, "compressed_size": 512000}`,
  },
  {
    method: "POST",
    path: "/api/v1/pdf/merge",
    label: "PDF Merge",
    price: "$0.002",
    unit: "per job",
    desc: "Combine multiple PDFs into a single document. Preserves bookmarks and page order.",
    body: { urls: "string[] — array of PDF URLs to merge (max 10)" },
    response: `{"url": "https://...merged.pdf", "pages": 42}`,
  },
  {
    method: "POST",
    path: "/api/v1/pdf/split",
    label: "PDF Split",
    price: "$0.002",
    unit: "per job",
    desc: "Split a PDF by page ranges, every N pages, or at specific page boundaries.",
    body: { url: "string — PDF URL", ranges: "string? — e.g. '1-3,5,7-9'" },
    response: `{"urls": ["https://.../part1.pdf", "https://.../part2.pdf"]}`,
  },
  {
    method: "POST",
    path: "/api/v1/pdf/to-image",
    label: "PDF → Image",
    price: "$0.002",
    unit: "per page",
    desc: "Render PDF pages to high-resolution PNG or JPG images. Configurable DPI.",
    body: { url: "string — PDF URL", dpi: "number? — default 150", format: "string? — 'png' | 'jpg'" },
    response: `{"urls": ["https://.../page-1.png", "https://.../page-2.png"]}`,
  },
  {
    method: "POST",
    path: "/api/v1/html/to-pdf",
    label: "HTML → PDF",
    price: "$0.002",
    unit: "per page",
    desc: "Convert web pages or HTML strings to styled PDF. Supports CSS, custom fonts, headers/footers.",
    body: { url: "string? — page URL", html: "string? — raw HTML string" },
    response: `{"url": "https://...output.pdf", "pages": 3}`,
  },
  {
    method: "POST",
    path: "/api/v1/markdown/to-pdf",
    label: "Markdown → PDF",
    price: "$0.002",
    unit: "per page",
    desc: "Convert Markdown to a beautifully styled PDF. Code highlighting, tables, and images supported.",
    body: { markdown: "string — raw Markdown content" },
    response: `{"url": "https://...output.pdf", "pages": 2}`,
  },
];

const IMAGE_ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/image/resize",
    label: "Image Resize",
    price: "$0.001",
    unit: "per image",
    desc: "Resize to exact dimensions or percentage. Smart upscale/downscale with aspect ratio preservation.",
    body: { url: "string — image URL", width: "number? — target width in px", height: "number? — target height in px", scale: "number? — scale factor (e.g. 0.5)" },
    response: `{"url": "https://...resized.png", "width": 800, "height": 600}`,
  },
  {
    method: "POST",
    path: "/api/v1/image/compress",
    label: "Image Compress",
    price: "$0.001",
    unit: "per image",
    desc: "Lossy or lossless compression. Up to 80% file size reduction with minimal quality loss.",
    body: { url: "string — image URL", quality: "number? — 1–100 (default: 80)", lossless: "boolean? — default false" },
    response: `{"url": "https://...compressed.jpg", "original_size": 512000, "compressed_size": 102400}`,
  },
  {
    method: "POST",
    path: "/api/v1/image/convert",
    label: "Image Convert",
    price: "$0.001",
    unit: "per image",
    desc: "Convert between any image formats: PNG, JPG, WebP, AVIF, BMP, TIFF, GIF, SVG, ICO.",
    body: { url: "string — image URL", format: "string — target format: 'png' | 'jpg' | 'webp' | 'avif' | 'bmp' | 'tiff' | 'gif' | 'ico'" },
    response: `{"url": "https://...output.webp"}`,
  },
  {
    method: "POST",
    path: "/api/v1/image/crop",
    label: "Image Crop",
    price: "$0.001",
    unit: "per image",
    desc: "Crop to custom dimensions, aspect ratios, or smart crop with AI-detected subject centering.",
    body: { url: "string — image URL", x: "number? — left offset", y: "number? — top offset", width: "number — crop width", height: "number — crop height" },
    response: `{"url": "https://...cropped.png"}`,
  },
  {
    method: "POST",
    path: "/api/v1/image/remove-bg",
    label: "Background Remove",
    price: "$0.005",
    unit: "per image",
    desc: "AI-powered background removal. Returns transparent PNG. Works on photos, products, portraits.",
    body: { url: "string — image URL (PNG/JPG/WebP)" },
    response: `{"url": "https://...no-bg.png"}`,
  },
  {
    method: "POST",
    path: "/api/v1/image/upscale",
    label: "Image Upscale",
    price: "$0.008",
    unit: "per image",
    desc: "AI super-resolution upscaling at 2x or 4x. Enhances detail and sharpness beyond bicubic.",
    body: { url: "string — image URL", scale: "number — 2 or 4" },
    response: `{"url": "https://...upscaled.png", "width": 3840, "height": 2160}`,
  },
  {
    method: "POST",
    path: "/api/v1/image/watermark",
    label: "Watermark",
    price: "$0.001",
    unit: "per image",
    desc: "Add text or image watermark with custom position, opacity, and rotation.",
    body: { url: "string — image URL", text: "string? — watermark text", watermark_url: "string? — watermark image URL", opacity: "number? — 0–1", position: "string? — 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'" },
    response: `{"url": "https://...watermarked.png"}`,
  },
  {
    method: "POST",
    path: "/api/v1/image/rotate",
    label: "Rotate / Flip",
    price: "$0.001",
    unit: "per image",
    desc: "Rotate 90/180/270° or flip horizontal/vertical. Lossless for supported formats.",
    body: { url: "string — image URL", angle: "number? — 90 | 180 | 270", flip: "string? — 'horizontal' | 'vertical'" },
    response: `{"url": "https://...rotated.png"}`,
  },
];

const DATA_ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/table/extract",
    label: "Table Extract",
    price: "$0.003",
    unit: "per page",
    desc: "Extract tables from PDFs or images to CSV or JSON. Preserves column headers and structure.",
    body: { url: "string — PDF or image URL", format: "string? — 'csv' | 'json' (default: 'json')" },
    response: `{"tables": [{"headers": ["Name","Value"], "rows": [["Alice","100"],["Bob","200"]]}]}`,
  },
  {
    method: "POST",
    path: "/api/v1/ocr/image",
    label: "OCR Image",
    price: "$0.003",
    unit: "per image",
    desc: "Extract text from images: photos, screenshots, scans. Returns plain text or structured JSON.",
    body: { url: "string — image URL", lang: "string? — 'eng' | 'ind' (default: 'eng')" },
    response: `{"text": "Extracted text from the image..."}`,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${
      method === "POST"
        ? "text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/10"
        : "text-green-400 border-green-400/40 bg-green-400/10"
    }`}>
      {method}
    </span>
  );
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <MethodBadge method={ep.method} />
          <code className="font-mono text-sm text-slate-300 truncate">{ep.path}</code>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-mono text-xs text-slate-500 hidden sm:block">{ep.label}</span>
          <span className="font-mono font-bold text-[#3b82f6] text-sm">{ep.price}</span>
          <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-white/[0.06] px-5 py-5 space-y-5 bg-[#0a0c14]">
          <p className="font-mono text-slate-400 text-sm leading-relaxed">{ep.desc}</p>

          {/* Request Body */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Request Body</h4>
            <div className="border border-white/5 bg-[#060709]">
              {Object.entries(ep.body).map(([key, val]) => (
                <div key={key} className="flex gap-3 px-4 py-2.5 border-b border-white/[0.04] last:border-0">
                  <code className="font-mono text-xs text-[#3b82f6] w-28 flex-shrink-0">{key}</code>
                  <span className="font-mono text-xs text-slate-500">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Response */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Response</h4>
            <div className="relative bg-[#060709] border border-white/5 p-4">
              <pre className="font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap break-all pr-8">
                {ep.response}
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={ep.response} />
              </div>
            </div>
          </div>

          <div className="font-mono text-xs text-slate-600">
            Pricing: <span className="text-slate-400 font-bold">{ep.price} USDC</span> {ep.unit} · Paid via x402 on Base mainnet
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ id, label, endpoints }: { id: string; label: string; endpoints: Endpoint[] }) {
  return (
    <div id={id} className="space-y-3 scroll-mt-20">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-[#3b82f6]" />
        <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">{label}</h2>
        <span className="font-mono text-xs text-slate-600 border border-white/10 px-2 py-0.5">
          {endpoints.length} endpoints
        </span>
      </div>
      <div className="space-y-2">
        {endpoints.map((ep) => <EndpointCard key={ep.path} ep={ep} />)}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#08090d] font-mono text-slate-300">

        {/* ── Header ── */}
        <div className="border-b border-white/5 py-8 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              // documentation
            </p>
            <h1 className="font-mono font-black text-slate-100 text-3xl md:text-4xl uppercase tracking-widest">
              FliX API Reference
            </h1>
            <p className="font-mono text-slate-500 text-sm">
              20+ endpoints. No API keys. USDC micropayments on Base via x402 protocol.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {["Base Mainnet", "USDC", "x402 Protocol", "No Auth Required"].map((b) => (
                <span key={b} className="font-mono text-[10px] text-slate-500 border border-white/10 px-2 py-1 bg-[#0d0f17]">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Layout ── */}
        <div className="max-w-7xl mx-auto flex gap-0">

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 px-4">
            <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-4 px-2">
              Contents
            </p>
            <nav className="flex flex-col gap-0.5">
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`font-mono text-xs px-2 py-2 transition-colors hover:text-slate-200 ${
                    activeSection === s.id
                      ? "text-[#3b82f6] border-l-2 border-[#3b82f6] pl-3"
                      : "text-slate-500"
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto pt-6">
              <a
                href="https://api.filx.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 hover:text-slate-300 transition-colors"
              >
                Swagger UI <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 px-6 py-10 space-y-16">

            {/* Overview */}
            <div id="overview" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#3b82f6]" />
                <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">Overview</h2>
              </div>
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                FliX is a file conversion API built natively for AI agents. Unlike traditional APIs that require
                sign-up, API keys, and credit balances, FliX uses the{" "}
                <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:text-white">
                  x402 protocol
                </a>{" "}
                — a standard where the server charges micropayments in USDC for each request, settled on Base chain.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { val: "20+", label: "Endpoints", sub: "PDF, Image, OCR, Table" },
                  { val: "$0.001", label: "Avg Cost / Op", sub: "Paid in USDC on Base" },
                  { val: "~1s", label: "Median Latency", sub: "End-to-end incl. payment" },
                ].map((s) => (
                  <div key={s.label} className="border border-white/10 bg-[#0d0f17] p-4 space-y-1">
                    <div className="font-mono font-black text-[#3b82f6] text-3xl">{s.val}</div>
                    <div className="font-mono font-bold text-slate-200 text-sm">{s.label}</div>
                    <div className="font-mono text-slate-600 text-xs">{s.sub}</div>
                  </div>
                ))}
              </div>
              <div className="border border-white/10 bg-[#0d0f17] p-5 space-y-2">
                <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Base URL</div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-[#3b82f6] flex-1">https://api.filx.io</code>
                  <CopyButton text="https://api.filx.io" />
                </div>
              </div>
            </div>

            {/* x402 Protocol */}
            <div id="x402" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#3b82f6]" />
                <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">x402 Protocol</h2>
              </div>
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                Every FliX endpoint follows the x402 payment flow. There is no API key or authentication header —
                instead, you pay per request in USDC on Base chain.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  {
                    n: "01", title: "REQUEST", color: "text-[#3b82f6]",
                    code: `POST /api/v1/pdf/to-markdown
Content-Type: application/json

{"url": "https://example.com/doc.pdf"}`,
                  },
                  {
                    n: "02", title: "402 REQUIRED", color: "text-yellow-400",
                    code: `HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: eyJzY2hlbWUi...

{
  "amount": "0.002",
  "currency": "USDC",
  "network": "base"
}`,
                  },
                  {
                    n: "03", title: "PAY + 200 OK", color: "text-green-400",
                    code: `POST /api/v1/pdf/to-markdown
PAYMENT-SIGNATURE: eyJ0eEhhc2gi...

HTTP/1.1 200 OK
{"content": "# Doc..."}`,
                  },
                ].map((step) => (
                  <div key={step.n} className="border border-white/10 bg-[#0d0f17] p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-[#3b82f6] flex items-center justify-center">
                        <span className="font-mono font-black text-[10px] text-[#3b82f6]">{step.n}</span>
                      </div>
                      <span className={`font-mono font-black text-xs uppercase tracking-widest ${step.color}`}>{step.title}</span>
                    </div>
                    <div className="bg-[#060709] border border-white/5 p-3">
                      <pre className="font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">{step.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start */}
            <div id="quickstart" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#3b82f6]" />
                <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">Quick Start</h2>
              </div>
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                Use an x402-compatible client library to handle the payment flow automatically.
                The client intercepts the 402 response, signs a payment, and retries — all transparently.
              </p>
              <div className="space-y-3">
                {[
                  {
                    lang: "Python",
                    code: `from x402 import Client

client = Client(wallet_private_key="0x...")

result = client.post(
    "https://api.filx.io/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/document.pdf"}
)
print(result.json())  # {"content": "# Document..."}`,
                  },
                  {
                    lang: "JavaScript",
                    code: `import { wrapFetch } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount("0x...");
const walletClient = createWalletClient({ account, chain: base, transport: http() });
const fetchWithPayment = wrapFetch(fetch, walletClient);

const res = await fetchWithPayment("https://api.filx.io/api/v1/pdf/to-markdown", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
});
const result = await res.json();`,
                  },
                  {
                    lang: "cURL (manual)",
                    code: `# Step 1: Get payment requirement
curl -i -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → 402 Payment Required, PAYMENT-REQUIRED: eyJ...

# Step 2: Sign and resend
curl -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: eyJ...signed..." \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → 200 OK, {"content": "# Document..."}`,
                  },
                ].map((snippet) => (
                  <div key={snippet.lang} className="border border-white/10 bg-[#0d0f17] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                      <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">{snippet.lang}</span>
                      <CopyButton text={snippet.code} />
                    </div>
                    <div className="bg-[#060709] p-5 overflow-x-auto">
                      <pre className="font-mono text-xs text-slate-400 leading-relaxed">{snippet.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Endpoint Sections */}
            <Section id="document" label="Document Processing" endpoints={DOCUMENT_ENDPOINTS} />
            <Section id="image" label="Image Processing" endpoints={IMAGE_ENDPOINTS} />
            <Section id="data" label="Data Extraction" endpoints={DATA_ENDPOINTS} />

            {/* SDKs */}
            <div id="sdks" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#3b82f6]" />
                <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">SDKs & Integrations</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "x402 Python SDK", desc: "Official Python client. Auto-handles 402 → sign → retry flow.", href: "https://github.com/coinbase/x402", badge: "pip install x402" },
                  { name: "x402 JS/TS SDK", desc: "wrapFetch wrapper for JavaScript and TypeScript agents.", href: "https://github.com/coinbase/x402", badge: "npm install @x402/fetch" },
                  { name: "Bankr Agent API", desc: "No private key needed. Natural language payment signing.", href: "https://bankr.bot", badge: "Custodial" },
                  { name: "MCP Tool Manifest", desc: "Plug FliX directly into Claude, GPT, Gemini agents via MCP.", href: "https://api.filx.io/mcp", badge: "Native Support" },
                  { name: "LangGraph / LangChain", desc: "Python SDK with x402 client built-in for pipeline agents.", href: "https://www.langchain.com", badge: "Python SDK" },
                  { name: "Any HTTP Client", desc: "curl, httpx, fetch, axios, requests — if it speaks HTTP, it works.", href: "#quickstart", badge: "No SDK Needed" },
                ].map((sdk) => (
                  <a key={sdk.name} href={sdk.href} target={sdk.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="flex flex-col gap-2 border border-white/10 bg-[#0d0f17] p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono font-bold text-slate-200 text-sm">{sdk.name}</span>
                      <span className="font-mono text-[10px] text-[#3b82f6] border border-[#3b82f6]/30 px-2 py-0.5 whitespace-nowrap">{sdk.badge}</span>
                    </div>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">{sdk.desc}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Errors */}
            <div id="errors" className="space-y-6 scroll-mt-20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#3b82f6]" />
                <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">Error Reference</h2>
              </div>
              <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
                <div className="grid grid-cols-3 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <span>Status</span>
                  <span>Code</span>
                  <span>Description</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { status: "402", code: "payment_required", desc: "No payment signature provided — include PAYMENT-SIGNATURE header" },
                    { status: "400", code: "invalid_url", desc: "The provided URL is not accessible or is malformed" },
                    { status: "400", code: "unsupported_format", desc: "Source or target format not supported for this endpoint" },
                    { status: "402", code: "payment_invalid", desc: "Payment signature verification failed on-chain" },
                    { status: "402", code: "insufficient_funds", desc: "Payment amount is below the required minimum" },
                    { status: "413", code: "file_too_large", desc: "File exceeds the 50MB size limit" },
                    { status: "422", code: "processing_failed", desc: "File could not be processed — check format and try again" },
                    { status: "429", code: "rate_limited", desc: "Too many requests — back off and retry" },
                    { status: "500", code: "internal_error", desc: "Server error — payment will not be charged" },
                  ].map((err) => (
                    <div key={err.code} className="grid grid-cols-3 items-start px-5 py-3 hover:bg-white/[0.02] transition-colors text-xs gap-4">
                      <span className={`font-mono font-bold ${err.status === "402" ? "text-yellow-400" : err.status === "400" || err.status === "413" || err.status === "422" ? "text-red-400" : err.status === "429" ? "text-orange-400" : "text-red-500"}`}>
                        {err.status}
                      </span>
                      <code className="font-mono text-slate-400">{err.code}</code>
                      <span className="font-mono text-slate-500">{err.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
