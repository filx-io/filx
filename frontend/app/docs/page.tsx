"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Copy, Check, ExternalLink, ChevronRight, Menu, X,
  Shield, Clock, Zap, FileText, Lock,
} from "lucide-react";


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

// ─── Nav ─────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "overview",   label: "Overview" },
  { id: "concepts",   label: "Concepts" },
  { id: "x402",       label: "x402 Protocol" },
  { id: "headers",    label: "Request Headers" },
  { id: "quickstart", label: "Quick Start" },
  { id: "sdks",       label: "SDKs & Frameworks" },
  { id: "document",   label: "Document Processing" },
  { id: "image",      label: "Image Processing" },
  { id: "data",       label: "Data Extraction" },
  { id: "pricing",    label: "Pricing" },
  { id: "limits",     label: "Limits & Quotas" },
  { id: "errors",     label: "Error Reference" },
];

// ─── Endpoints ────────────────────────────────────────────────────────────────

const DOCUMENT_ENDPOINTS: Endpoint[] = [
  {
    method: "POST", path: "/api/v1/pdf/to-markdown", label: "PDF → Markdown",
    price: "$0.002", unit: "per page",
    desc: "High-fidelity PDF to Markdown conversion. Preserves headings, tables, lists, code blocks, and inline formatting. Ideal for RAG pipelines and feeding documents into LLM context windows.",
    body: {
      url:    "string — publicly accessible URL of the PDF",
      pages:  "string? — page range, e.g. '1-5' or '1,3,7' (default: all)",
    },
    response: `{
  "content": "# Document Title\\n\\n## Section\\n\\nBody text...",
  "pages_processed": 4,
  "cost_usdc": "0.008"
}`,
  },
  {
    method: "POST", path: "/api/v1/pdf/ocr", label: "PDF OCR",
    price: "$0.004", unit: "per page",
    desc: "Extract text from scanned PDFs using OCR. Works on image-based PDFs where standard text extraction fails. Multi-language: English + Indonesian (Bahasa).",
    body: {
      url:  "string — publicly accessible PDF URL",
      lang: "string? — 'eng' | 'ind' (default: 'eng')",
    },
    response: `{
  "text": "Extracted plain text content...",
  "pages_processed": 3,
  "cost_usdc": "0.012"
}`,
  },
  {
    method: "POST", path: "/api/v1/pdf/compress", label: "PDF Compress",
    price: "$0.002", unit: "per file",
    desc: "Reduce PDF file size by optimizing embedded images, removing duplicate fonts, and stripping unnecessary metadata.",
    body: {
      url:     "string — publicly accessible PDF URL",
      quality: "string? — 'low' | 'medium' | 'high' (default: 'medium')",
    },
    response: `{
  "url": "https://api.filx.io/files/abc123.pdf",
  "original_size": 2048000,
  "compressed_size": 614400,
  "reduction_pct": 70,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/pdf/merge", label: "PDF Merge",
    price: "$0.002", unit: "per job",
    desc: "Combine up to 10 PDFs into a single document. Preserves bookmarks and page order. Files are fetched from public URLs.",
    body: {
      urls: "string[] — array of PDF URLs to merge (max 10)",
    },
    response: `{
  "url": "https://api.filx.io/files/merged-abc123.pdf",
  "pages": 42,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/pdf/split", label: "PDF Split",
    price: "$0.002", unit: "per job",
    desc: "Split a PDF into multiple parts by page range, every N pages, or at specific boundaries.",
    body: {
      url:    "string — PDF URL",
      ranges: "string? — comma-separated ranges, e.g. '1-3,4-7,8-' (default: split every page)",
      every:  "number? — split every N pages (alternative to ranges)",
    },
    response: `{
  "urls": [
    "https://api.filx.io/files/part1.pdf",
    "https://api.filx.io/files/part2.pdf"
  ],
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/pdf/rotate", label: "PDF Rotate",
    price: "$0.001", unit: "per job",
    desc: "Rotate individual pages or all pages of a PDF at 90, 180, or 270 degrees.",
    body: {
      url:   "string — PDF URL",
      angle: "number — 90 | 180 | 270",
      pages: "string? — page range to rotate (default: all)",
    },
    response: `{
  "url": "https://api.filx.io/files/rotated-abc123.pdf",
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/pdf/unlock", label: "PDF Unlock",
    price: "$0.003", unit: "per file",
    desc: "Remove password protection from encrypted PDFs. Returns an unlocked, fully accessible document.",
    body: {
      url:      "string — PDF URL",
      password: "string? — PDF password if known",
    },
    response: `{
  "url": "https://api.filx.io/files/unlocked-abc123.pdf",
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/pdf/to-image", label: "PDF → Image",
    price: "$0.002", unit: "per page",
    desc: "Render PDF pages to high-resolution PNG or JPG images. Configurable DPI (72–300).",
    body: {
      url:    "string — PDF URL",
      dpi:    "number? — 72 | 96 | 150 | 300 (default: 150)",
      format: "string? — 'png' | 'jpg' (default: 'png')",
      pages:  "string? — page range (default: all)",
    },
    response: `{
  "urls": [
    "https://api.filx.io/files/page-1.png",
    "https://api.filx.io/files/page-2.png"
  ],
  "pages_processed": 2,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/html/to-pdf", label: "HTML → PDF",
    price: "$0.002", unit: "per page",
    desc: "Convert web pages or raw HTML strings to styled PDF. Supports custom CSS, fonts, headers/footers, and page size.",
    body: {
      url:         "string? — public page URL (use url OR html)",
      html:        "string? — raw HTML string",
      page_size:   "string? — 'A4' | 'letter' | 'A3' (default: 'A4')",
      margin:      "string? — e.g. '20px 40px' (default: '20px')",
      header_html: "string? — HTML for page header",
      footer_html: "string? — HTML for page footer",
    },
    response: `{
  "url": "https://api.filx.io/files/output.pdf",
  "pages": 3,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/markdown/to-pdf", label: "Markdown → PDF",
    price: "$0.002", unit: "per page",
    desc: "Convert Markdown to a beautifully styled PDF. Supports GFM tables, code highlighting, images, and custom themes.",
    body: {
      markdown: "string — raw Markdown content",
      theme:    "string? — 'default' | 'github' | 'minimal' (default: 'default')",
    },
    response: `{
  "url": "https://api.filx.io/files/output.pdf",
  "pages": 2,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
];

const IMAGE_ENDPOINTS: Endpoint[] = [
  {
    method: "POST", path: "/api/v1/image/resize", label: "Image Resize",
    price: "$0.001", unit: "per image",
    desc: "Resize images to exact pixel dimensions or by percentage scale. Preserves aspect ratio by default. Supports all major raster formats.",
    body: {
      url:    "string — image URL",
      width:  "number? — target width in px",
      height: "number? — target height in px",
      scale:  "number? — scale factor, e.g. 0.5 for 50%",
      fit:    "string? — 'contain' | 'cover' | 'fill' (default: 'contain')",
    },
    response: `{
  "url": "https://api.filx.io/files/resized.png",
  "width": 800,
  "height": 600,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/image/compress", label: "Image Compress",
    price: "$0.001", unit: "per image",
    desc: "Lossy or lossless compression. Achieves up to 80% file size reduction with minimal perceptual quality loss.",
    body: {
      url:      "string — image URL",
      quality:  "number? — 1–100 (default: 80, lower = smaller file)",
      lossless: "boolean? — force lossless compression (default: false)",
    },
    response: `{
  "url": "https://api.filx.io/files/compressed.jpg",
  "original_size": 512000,
  "compressed_size": 102400,
  "reduction_pct": 80,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/image/convert", label: "Image Convert",
    price: "$0.001", unit: "per image",
    desc: "Convert between any image format. Batch conversion supported by sending multiple requests in parallel.",
    body: {
      url:    "string — image URL",
      format: "string — 'png' | 'jpg' | 'webp' | 'avif' | 'bmp' | 'tiff' | 'gif' | 'ico'",
    },
    response: `{
  "url": "https://api.filx.io/files/output.webp",
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/image/crop", label: "Image Crop",
    price: "$0.001", unit: "per image",
    desc: "Crop to custom dimensions, specific aspect ratios, or let AI auto-detect the subject for smart center crop.",
    body: {
      url:    "string — image URL",
      x:      "number? — left offset in px",
      y:      "number? — top offset in px",
      width:  "number — crop width in px",
      height: "number — crop height in px",
      smart:  "boolean? — AI subject-centered crop (ignores x/y)",
    },
    response: `{
  "url": "https://api.filx.io/files/cropped.png",
  "width": 400,
  "height": 400,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/image/remove-bg", label: "Background Remove",
    price: "$0.005", unit: "per image",
    desc: "AI-powered background removal. Works on photos, product shots, and portraits. Returns transparent PNG.",
    body: {
      url: "string — image URL (PNG/JPG/WebP)",
    },
    response: `{
  "url": "https://api.filx.io/files/no-bg.png",
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/image/upscale", label: "Image Upscale",
    price: "$0.008", unit: "per image",
    desc: "AI super-resolution at 2x or 4x. Uses deep learning to reconstruct lost detail — significantly sharper than bicubic upscaling.",
    body: {
      url:   "string — image URL",
      scale: "number — 2 or 4",
    },
    response: `{
  "url": "https://api.filx.io/files/upscaled.png",
  "width": 3840,
  "height": 2160,
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/image/watermark", label: "Watermark",
    price: "$0.001", unit: "per image",
    desc: "Overlay text or image watermarks with configurable position, opacity, and rotation.",
    body: {
      url:           "string — image URL",
      text:          "string? — watermark text (use text or watermark_url)",
      watermark_url: "string? — URL of watermark image",
      position:      "string? — 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
      opacity:       "number? — 0.0–1.0 (default: 0.5)",
      rotation:      "number? — degrees (default: 0)",
    },
    response: `{
  "url": "https://api.filx.io/files/watermarked.png",
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
  {
    method: "POST", path: "/api/v1/image/rotate", label: "Rotate / Flip",
    price: "$0.001", unit: "per image",
    desc: "Rotate images at 90° increments or flip horizontally/vertically. Lossless for PNG/WebP/TIFF.",
    body: {
      url:   "string — image URL",
      angle: "number? — 90 | 180 | 270",
      flip:  "string? — 'horizontal' | 'vertical'",
    },
    response: `{
  "url": "https://api.filx.io/files/rotated.png",
  "expires_at": "2026-03-03T02:00:00Z"
}`,
  },
];

const DATA_ENDPOINTS: Endpoint[] = [
  {
    method: "POST", path: "/api/v1/table/extract", label: "Table Extract",
    price: "$0.003", unit: "per page",
    desc: "Detect and extract tables from PDFs or images into structured CSV or JSON. Preserves column headers, merged cells, and multi-line values.",
    body: {
      url:    "string — PDF or image URL",
      format: "string? — 'csv' | 'json' (default: 'json')",
      pages:  "string? — page range for PDFs (default: all)",
    },
    response: `{
  "tables": [
    {
      "page": 1,
      "headers": ["Name", "Q1", "Q2"],
      "rows": [
        ["Alice", "120,000", "145,000"],
        ["Bob",   "98,000",  "112,000"]
      ]
    }
  ],
  "tables_found": 1,
  "cost_usdc": "0.003"
}`,
  },
  {
    method: "POST", path: "/api/v1/ocr/image", label: "OCR Image",
    price: "$0.003", unit: "per image",
    desc: "Extract text from photos, screenshots, and scanned images. Returns plain text or structured JSON with bounding boxes.",
    body: {
      url:        "string — image URL",
      lang:       "string? — 'eng' | 'ind' (default: 'eng')",
      structured: "boolean? — return bounding boxes and confidence scores (default: false)",
    },
    response: `{
  "text": "Invoice #1042\\nDate: 2026-01-15\\nTotal: $1,200.00",
  "confidence": 0.97,
  "cost_usdc": "0.003"
}`,
  },
];

// ─── Pricing table ────────────────────────────────────────────────────────────

const PRICING_ROWS = [
  { op: "PDF → Markdown",     price: "$0.002", unit: "per page",  category: "Document" },
  { op: "PDF OCR",            price: "$0.004", unit: "per page",  category: "Document" },
  { op: "PDF Compress",       price: "$0.002", unit: "per file",  category: "Document" },
  { op: "PDF Merge",          price: "$0.002", unit: "per job",   category: "Document" },
  { op: "PDF Split",          price: "$0.002", unit: "per job",   category: "Document" },
  { op: "PDF Rotate",         price: "$0.001", unit: "per job",   category: "Document" },
  { op: "PDF Unlock",         price: "$0.003", unit: "per file",  category: "Document" },
  { op: "PDF → Image",        price: "$0.002", unit: "per page",  category: "Document" },
  { op: "HTML → PDF",         price: "$0.002", unit: "per page",  category: "Document" },
  { op: "Markdown → PDF",     price: "$0.002", unit: "per page",  category: "Document" },
  { op: "Image Resize",       price: "$0.001", unit: "per image", category: "Image" },
  { op: "Image Compress",     price: "$0.001", unit: "per image", category: "Image" },
  { op: "Image Convert",      price: "$0.001", unit: "per image", category: "Image" },
  { op: "Image Crop",         price: "$0.001", unit: "per image", category: "Image" },
  { op: "Background Remove",  price: "$0.005", unit: "per image", category: "Image" },
  { op: "Image Upscale",      price: "$0.008", unit: "per image", category: "Image" },
  { op: "Watermark",          price: "$0.001", unit: "per image", category: "Image" },
  { op: "Rotate / Flip",      price: "$0.001", unit: "per image", category: "Image" },
  { op: "Table Extract",      price: "$0.003", unit: "per page",  category: "Data" },
  { op: "OCR Image",          price: "$0.003", unit: "per image", category: "Data" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`flex-shrink-0 text-slate-500 hover:text-slate-200 transition-colors ${small ? "p-1" : "p-1.5"}`}
    >
      {copied
        ? <Check className={small ? "w-3 h-3 text-green-400" : "w-3.5 h-3.5 text-green-400"} />
        : <Copy className={small ? "w-3 h-3" : "w-3.5 h-3.5"} />}
    </button>
  );
}

function SectionHeading({ id, label, count }: { id: string; label: string; count?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 bg-[#3b82f6]" />
      <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">{label}</h2>
      {count !== undefined && (
        <span className="font-mono text-xs text-slate-600 border border-white/10 px-2 py-0.5">
          {count} endpoints
        </span>
      )}
    </div>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lang}</span>
        <CopyButton text={code} />
      </div>
      <div className="bg-[#060709] px-5 py-4 overflow-x-auto">
        <pre className="font-mono text-xs text-slate-400 leading-relaxed">{code}</pre>
      </div>
    </div>
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
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 border text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/10 flex-shrink-0">
            {ep.method}
          </span>
          <code className="font-mono text-sm text-slate-300 truncate">{ep.path}</code>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-mono text-xs text-slate-600 hidden md:block">{ep.label}</span>
          <span className="font-mono font-bold text-[#3b82f6] text-sm">{ep.price}</span>
          <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#0a0c14] px-5 py-5 space-y-5">
          <p className="font-mono text-slate-400 text-sm leading-relaxed">{ep.desc}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Request body */}
            <div className="space-y-2">
              <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Request Body</h4>
              <div className="border border-white/5 bg-[#060709] overflow-hidden">
                {Object.entries(ep.body).map(([key, val], i) => (
                  <div key={key} className={`flex gap-3 px-4 py-2.5 ${i < Object.entries(ep.body).length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                    <code className="font-mono text-xs text-[#3b82f6] w-32 flex-shrink-0">{key}</code>
                    <span className="font-mono text-xs text-slate-500 leading-relaxed">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response */}
            <div className="space-y-2">
              <h4 className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Response · 200 OK</h4>
              <div className="relative bg-[#060709] border border-white/5 p-4">
                <pre className="font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap break-all pr-6">
                  {ep.response}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={ep.response} small />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1 border-t border-white/5 text-xs font-mono text-slate-600">
            <span>Pricing: <span className="text-slate-400 font-bold">{ep.price} USDC</span> {ep.unit}</span>
            <span>·</span>
            <span>Paid via x402 on Base mainnet</span>
            <span>·</span>
            <span>Output auto-deleted after <span className="text-slate-400">1 hour</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const setRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  const NavLinks = () => (
    <>
      <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-3 px-2">
        Contents
      </p>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`text-left font-mono text-xs px-2 py-2 transition-colors hover:text-slate-200 ${
              activeSection === s.id
                ? "text-[#3b82f6] border-l-2 border-[#3b82f6] pl-3"
                : "text-slate-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-white/5">
        <a href="https://api.filx.io/docs" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 hover:text-slate-300 transition-colors">
          Swagger UI <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </>
  );

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
              FilX API Reference
            </h1>
            <p className="font-mono text-slate-500 text-sm">
              20 endpoints. No API keys. USDC micropayments on Base via x402 protocol.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {["Base Mainnet · Chain ID 8453", "USDC (6 decimals)", "x402 Protocol", "No Auth Required", "Files auto-deleted in 1h"].map((b) => (
                <span key={b} className="font-mono text-[10px] text-slate-500 border border-white/10 px-2 py-1 bg-[#0d0f17]">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile nav toggle ── */}
        <div className="lg:hidden border-b border-white/5 px-4 py-3 flex items-center justify-between bg-[#0d0f17]">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            {NAV.find((s) => s.id === activeSection)?.label ?? "Docs"}
          </span>
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-slate-400 hover:text-slate-200">
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden border-b border-white/5 bg-[#0d0f17] px-4 pt-4 pb-6 space-y-0.5">
            <NavLinks />
          </div>
        )}

        {/* ── Layout ── */}
        <div className="max-w-7xl mx-auto flex">

          {/* Sidebar (desktop) */}
          <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 px-4">
            <NavLinks />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 px-4 md:px-8 py-10 space-y-16 max-w-4xl">

            {/* ── OVERVIEW ── */}
            <div ref={setRef("overview")} id="overview" className="space-y-6 scroll-mt-24">
              <SectionHeading id="overview" label="Overview" />
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                FilX is a file conversion API built natively for AI agents. Unlike traditional APIs that require sign-up, API keys, and credit top-ups,
                FilX uses the{" "}
                <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:text-white transition-colors">
                  x402 protocol
                </a>{" "}
                — the server charges a micropayment in USDC per request, settled on-chain on Base. No human infrastructure required.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { val: "20",     label: "Endpoints",    sub: "PDF · Image · OCR · Table" },
                  { val: "$0.001", label: "Min Cost",      sub: "USDC on Base mainnet" },
                  { val: "~1s",    label: "Avg Latency",   sub: "End-to-end incl. payment" },
                ].map((s) => (
                  <div key={s.label} className="border border-white/10 bg-[#0d0f17] p-4 space-y-1">
                    <div className="font-mono font-black text-[#3b82f6] text-3xl">{s.val}</div>
                    <div className="font-mono font-bold text-slate-200 text-sm">{s.label}</div>
                    <div className="font-mono text-slate-600 text-xs">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="border border-white/10 bg-[#0d0f17] p-4 flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-bold">Base URL</div>
                  <code className="font-mono text-sm text-[#3b82f6]">https://api.filx.io</code>
                </div>
                <CopyButton text="https://api.filx.io" />
              </div>
            </div>

            {/* ── CONCEPTS ── */}
            <div ref={setRef("concepts")} id="concepts" className="space-y-6 scroll-mt-24">
              <SectionHeading id="concepts" label="Concepts" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Zap,
                    title: "Pay-Per-Request",
                    body: "There are no subscriptions, credits, or rate-limit tiers. Every request costs exactly what's quoted — charged atomically per conversion. Your agent only pays when it needs to convert something.",
                  },
                  {
                    icon: Shield,
                    title: "End-to-End Encrypted",
                    body: "All files are transferred over HTTPS and encrypted at rest. The API never logs file contents — only metadata (job ID, timestamp, cost). Files are permanently deleted after 1 hour.",
                  },
                  {
                    icon: Clock,
                    title: "1-Hour Auto-Delete",
                    body: "Every output file URL expires and is deleted 1 hour after creation. Download your converted file immediately. No persistent storage means zero data retention risk.",
                  },
                  {
                    icon: FileText,
                    title: "URL-Based Input",
                    body: "FilX fetches files from publicly accessible URLs — no multipart upload required. Your agent can pass any public HTTPS URL. Direct binary upload is not supported.",
                  },
                  {
                    icon: Lock,
                    title: "On-Chain Proof",
                    body: "Every payment is a USDC transfer on Base mainnet. The transaction hash is returned in PAYMENT-RESPONSE. Fully auditable — every job has an immutable on-chain receipt.",
                  },
                  {
                    icon: Zap,
                    title: "Stateless API",
                    body: "There are no sessions, no job queues to poll, and no state to manage. Send a request, get a result. For large files, processing happens synchronously within the HTTP response timeout.",
                  },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.title} className="border border-white/10 bg-[#0d0f17] p-5 space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#3b82f6] flex-shrink-0" />
                        <h3 className="font-mono font-bold text-slate-200 text-sm">{c.title}</h3>
                      </div>
                      <p className="font-mono text-xs text-slate-500 leading-relaxed">{c.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── X402 PROTOCOL ── */}
            <div ref={setRef("x402")} id="x402" className="space-y-6 scroll-mt-24">
              <SectionHeading id="x402" label="x402 Protocol" />
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                x402 is an open standard by Coinbase for machine-to-machine micropayments over HTTP.
                Every FilX endpoint returns <code className="text-yellow-400">HTTP 402</code> on the first request, then accepts payment and processes on the second.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  {
                    n: "01", title: "REQUEST", color: "text-[#3b82f6]",
                    desc: "Agent sends a normal HTTP POST. No auth headers.",
                    code: `POST /api/v1/pdf/to-markdown
Host: api.filx.io
Content-Type: application/json

{"url": "https://example.com/doc.pdf"}`,
                  },
                  {
                    n: "02", title: "402 PAYMENT REQUIRED", color: "text-yellow-400",
                    desc: "Server returns payment details. Agent reads and signs.",
                    code: `HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: eyJzY2hlbWUi...

{
  "amount": "0.002",
  "currency": "USDC",
  "network": "base",
  "recipient": "0x742d...8e1f",
  "scheme": "exact"
}`,
                  },
                  {
                    n: "03", title: "PAY + 200 OK", color: "text-green-400",
                    desc: "Agent resends with signed payment. FilX verifies on-chain.",
                    code: `POST /api/v1/pdf/to-markdown
PAYMENT-SIGNATURE: eyJ0eEhhc2gi...

HTTP/1.1 200 OK
PAYMENT-RESPONSE: eyJzZXR0bGVk...
{"content": "# Document..."}`,
                  },
                ].map((step) => (
                  <div key={step.n} className="border border-white/10 bg-[#0d0f17] p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                        <span className="font-mono font-black text-[10px] text-[#3b82f6]">{step.n}</span>
                      </div>
                      <span className={`font-mono font-black text-xs uppercase tracking-widest ${step.color}`}>{step.title}</span>
                    </div>
                    <p className="font-mono text-xs text-slate-600">{step.desc}</p>
                    <div className="bg-[#060709] border border-white/5 p-3">
                      <pre className="font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">{step.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── REQUEST HEADERS ── */}
            <div ref={setRef("headers")} id="headers" className="space-y-6 scroll-mt-24">
              <SectionHeading id="headers" label="Request Headers" />
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                The x402 protocol uses custom HTTP headers for payment negotiation. Here is the complete header reference.
              </p>
              <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
                <div className="grid grid-cols-3 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <span>Header</span>
                  <span>Direction</span>
                  <span>Description</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { header: "Content-Type", dir: "Request →", desc: "Must be application/json for all endpoints" },
                    { header: "PAYMENT-REQUIRED", dir: "← Response", desc: "Base64-encoded JSON with amount, currency, network, recipient, and scheme. Returned on 402." },
                    { header: "PAYMENT-SIGNATURE", dir: "Request →", desc: "Base64-encoded signed payment payload. Include on the second (payment) request." },
                    { header: "PAYMENT-RESPONSE", dir: "← Response", desc: "Returned on 200 OK. Contains tx hash and settlement confirmation. Keep for your records." },
                  ].map((h) => (
                    <div key={h.header} className="grid grid-cols-3 items-start px-5 py-3 hover:bg-white/[0.02] transition-colors gap-3 text-xs">
                      <code className="font-mono text-[#3b82f6] text-xs break-all">{h.header}</code>
                      <span className={`font-mono text-xs ${h.dir.startsWith("←") ? "text-green-400" : "text-slate-400"}`}>{h.dir}</span>
                      <span className="font-mono text-slate-500 leading-relaxed">{h.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-mono font-bold text-slate-300 text-xs uppercase tracking-widest">PAYMENT-REQUIRED Decoded</h3>
                <CodeBlock lang="JSON" code={`{
  "scheme":    "exact",
  "network":   "base",
  "currency":  "USDC",
  "amount":    "2000",          // in USDC micro-units (6 decimals) → $0.002
  "recipient": "0x742d...8e1f", // FilX treasury address
  "job_id":    "job_abc123"     // include in payment memo
}`} />
              </div>
            </div>

            {/* ── QUICK START ── */}
            <div ref={setRef("quickstart")} id="quickstart" className="space-y-6 scroll-mt-24">
              <SectionHeading id="quickstart" label="Quick Start" />
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                The fastest way to get started: use an x402-compatible SDK. It intercepts the 402 response,
                signs the USDC payment, and retries automatically — all in one call.
              </p>

              <div className="space-y-3">
                <div className="border border-green-400/20 bg-green-400/5 p-4 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-mono font-bold text-green-400 text-xs">No private keys required</p>
                    <p className="font-mono text-xs text-slate-400 leading-relaxed">
                      FilX provides an embedded agent wallet — your agent authenticates with a{" "}
                      <code className="text-[#3b82f6]">FILX_API_KEY</code> and the wallet signs payments server-side.
                      Secured by <strong className="text-slate-300">Privy embedded wallets</strong> — private key never in your code.
                    </p>
                  </div>
                </div>

                <CodeBlock lang="Setup — FilX CLI (run once)" code={`# Install FilX CLI
npm install -g @filx/cli

# Login — creates an embedded wallet for your agent via Privy
filx login you@example.com

# Export your API key (store in .env — never commit to git)
export FILX_API_KEY=$(filx api-key)

# Fund your wallet with USDC on Base
filx balance  # shows your wallet address
# Send USDC to that address from Coinbase or any Base wallet`} />

                <CodeBlock lang="Python (recommended)" code={`# pip install httpx
import httpx, os

API = "https://api.filx.io"
KEY = os.environ["FILX_API_KEY"]  # filx login → filx api-key

# Step 1 — call FilX (get 402 payment request)
res = httpx.post(f"{API}/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/document.pdf"})

# Step 2 — FilX wallet signs the payment (no private key needed)
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
    print(result["cost_usdc"]) # → "0.008"`} />

                <CodeBlock lang="JavaScript / TypeScript" code={`// No npm packages needed — just native fetch
const API = "https://api.filx.io";
const KEY = process.env.FILX_API_KEY; // filx login → filx api-key

// Step 1 — call FilX
const res = await fetch(\`\${API}/api/v1/pdf/to-markdown\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
});

// Step 2 — FilX wallet signs the payment (no private key in code)
if (res.status === 402) {
  const { payment_signature } = await fetch(\`\${API}/api/v1/wallet/sign\`, {
    method: "POST",
    headers: { "Authorization": \`Bearer \${KEY}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ payment_required: res.headers.get("PAYMENT-REQUIRED") }),
  }).then(r => r.json());

  // Step 3 — resend with payment proof
  const data = await fetch(\`\${API}/api/v1/pdf/to-markdown\`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
    body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
  }).then(r => r.json());
  // { content: "# Document Title\\n\\n...", pages_processed: 4, cost_usdc: "0.008" }
}`} />

                <CodeBlock lang="FilX CLI — zero code needed" code={`# Install FilX CLI once
npm install -g @filx/cli && filx login you@example.com

# Natural language file conversion — pays automatically
filx prompt "Convert https://example.com/doc.pdf to markdown"
filx prompt "Convert https://arxiv.org/pdf/2312.00001.pdf to markdown and save the result"`} />

                <CodeBlock lang="cURL — manual flow (advanced)" code={`# Step 1: Get payment requirement
curl -i -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → HTTP 402 Payment Required
# → PAYMENT-REQUIRED: eyJzY2hlbWUiOiJleGFjdCIsIm5...

# Step 2: Sign with FilX CLI and resend
SIGNED=$(filx sign-x402 "eyJzY2hlbWUiOiJleGFjdCIsIm5...")
curl -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: $SIGNED" \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → HTTP 200 OK → {"content": "# Document Title..."}`} />
              </div>
            </div>

            {/* ── SDKs ── */}
            <div ref={setRef("sdks")} id="sdks" className="space-y-6 scroll-mt-24">
              <SectionHeading id="sdks" label="SDKs & Frameworks" />

              <div className="space-y-4">
                {/* SDK cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "FilX CLI",             desc: "Recommended. No private key. Agent wallet via Privy. npm install -g @filx/cli",  badge: "⭐ Recommended",             href: "https://filx.io/docs",             lang: "Any" },
                    { name: "Native fetch / httpx", desc: "No packages needed — call api.filx.io/wallet/sign directly with FILX_API_KEY.", badge: "Zero Dependencies",          href: "#quickstart",                      lang: "JS/Python" },
                    { name: "x402 JS/TS SDK",       desc: "wrapFetch wrapper — pair with FILX_API_KEY or your own wallet.",               badge: "npm install @x402/fetch",    href: "https://github.com/coinbase/x402", lang: "JS/TS" },
                    { name: "MCP Tool Manifest",    desc: "Plug FilX into Claude, GPT, Gemini via MCP natively.",                        badge: "Native MCP",                  href: "https://api.filx.io/mcp",          lang: "MCP" },
                    { name: "LangChain / LangGraph","desc": "Python pipeline agents — use httpx + FILX_API_KEY for signing.",             badge: "Python",                      href: "https://www.langchain.com",        lang: "Python" },
                    { name: "Any HTTP Client",      desc: "curl, httpx, fetch, axios — zero SDK. Use api.filx.io/wallet/sign.",           badge: "Universal",                   href: "#quickstart",                      lang: "Any" },
                  ].map((sdk) => (
                    <a key={sdk.name} href={sdk.href}
                      target={sdk.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 border border-white/10 bg-[#0d0f17] p-4 hover:border-white/20 transition-colors">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-200 text-sm">{sdk.name}</span>
                          <span className="font-mono text-[10px] text-slate-600 border border-white/10 px-1.5 py-0.5">{sdk.lang}</span>
                        </div>
                        <p className="font-mono text-xs text-slate-500">{sdk.desc}</p>
                      </div>
                      <span className="font-mono text-[10px] text-[#3b82f6] border border-[#3b82f6]/30 px-2 py-0.5 whitespace-nowrap flex-shrink-0">{sdk.badge}</span>
                    </a>
                  ))}
                </div>

                {/* LangGraph example */}
                <CodeBlock lang="LangGraph — PDF research pipeline (no private key)" code={`# pip install langgraph httpx
import httpx, os
from langgraph.graph import StateGraph
from typing import TypedDict

API = "https://api.filx.io"
KEY = os.environ["FILX_API_KEY"]  # filx login → filx api-key

def sign_x402(payment_required: str) -> str:
    return httpx.post(f"{API}/api/v1/wallet/sign",
        headers={"Authorization": f"Bearer {KEY}"},
        json={"payment_required": payment_required}
    ).json()["payment_signature"]

class State(TypedDict):
    pdf_url: str
    markdown: str

def fetch_pdf(state: State) -> State:
    res = httpx.post(f"{API}/api/v1/pdf/to-markdown",
        json={"url": state["pdf_url"]})
    if res.status_code == 402:
        signed = sign_x402(res.headers["PAYMENT-REQUIRED"])
        res = httpx.post(f"{API}/api/v1/pdf/to-markdown",
            json={"url": state["pdf_url"]},
            headers={"PAYMENT-SIGNATURE": signed})
    return {"markdown": res.json()["content"]}

graph = StateGraph(State)
graph.add_node("fetch_pdf", fetch_pdf)
graph.set_entry_point("fetch_pdf")
app = graph.compile()

result = app.invoke({"pdf_url": "https://arxiv.org/pdf/2312.00001.pdf"})
print(result["markdown"][:500])`} />

                {/* MCP example */}
                <CodeBlock lang="MCP — Claude integration" code={`// Add to your Claude MCP config (claude_desktop_config.json)
{
  "mcpServers": {
    "filx": {
      "url": "https://api.filx.io/mcp",
      "transport": "http"
    }
  }
}

// Claude can now call FilX tools natively:
// "Convert this PDF to markdown" → calls filx.pdf_to_markdown
// "Remove the background from this image" → calls filx.image_remove_bg
// Payment is handled automatically via x402 + your configured wallet`} />
              </div>
            </div>

            {/* ── ENDPOINTS ── */}
            <div ref={setRef("document")} id="document" className="space-y-3 scroll-mt-24">
              <SectionHeading id="document" label="Document Processing" count={DOCUMENT_ENDPOINTS.length} />
              <div className="space-y-2">
                {DOCUMENT_ENDPOINTS.map((ep) => <EndpointCard key={ep.path} ep={ep} />)}
              </div>
            </div>

            <div ref={setRef("image")} id="image" className="space-y-3 scroll-mt-24">
              <SectionHeading id="image" label="Image Processing" count={IMAGE_ENDPOINTS.length} />
              <div className="space-y-2">
                {IMAGE_ENDPOINTS.map((ep) => <EndpointCard key={ep.path} ep={ep} />)}
              </div>
            </div>

            <div ref={setRef("data")} id="data" className="space-y-3 scroll-mt-24">
              <SectionHeading id="data" label="Data Extraction" count={DATA_ENDPOINTS.length} />
              <div className="space-y-2">
                {DATA_ENDPOINTS.map((ep) => <EndpointCard key={ep.path} ep={ep} />)}
              </div>
            </div>

            {/* ── PRICING ── */}
            <div ref={setRef("pricing")} id="pricing" className="space-y-6 scroll-mt-24">
              <SectionHeading id="pricing" label="Pricing" />
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                All prices are in USDC on Base mainnet (chain ID 8453, 6 decimals).
                Minimum charge per job is <span className="text-slate-200 font-bold">$0.001 USDC</span>.
                You are only charged when the conversion succeeds — no charge on error.
              </p>

              <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
                <div className="grid grid-cols-4 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <span className="col-span-2">Operation</span>
                  <span className="text-center">Price (USDC)</span>
                  <span className="text-right">Unit</span>
                </div>
                {["Document", "Image", "Data"].map((cat) => (
                  <div key={cat}>
                    <div className="px-5 py-2 bg-white/[0.01] border-b border-white/[0.04]">
                      <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">{cat}</span>
                    </div>
                    {PRICING_ROWS.filter((r) => r.category === cat).map((row) => (
                      <div key={row.op} className="grid grid-cols-4 items-center px-5 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <span className="col-span-2 font-mono text-xs text-slate-300">{row.op}</span>
                        <span className="text-center font-mono font-bold text-[#3b82f6] text-sm">{row.price}</span>
                        <span className="text-right font-mono text-xs text-slate-500">{row.unit}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/10 bg-[#0d0f17] p-4 space-y-2">
                  <h3 className="font-mono font-bold text-slate-200 text-sm">Volume Discounts</h3>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">5–9 requests / batch</span><span className="text-green-400 font-bold">−10%</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">10+ requests / batch</span><span className="text-green-400 font-bold">−20%</span></div>
                  </div>
                </div>
                <div className="border border-white/10 bg-[#0d0f17] p-4 space-y-2">
                  <h3 className="font-mono font-bold text-slate-200 text-sm">Billing Notes</h3>
                  <ul className="font-mono text-xs text-slate-500 space-y-1 leading-relaxed">
                    <li>→ Charged per page for multi-page PDFs</li>
                    <li>→ No charge on 4xx/5xx errors</li>
                    <li>→ Minimum $0.001 per job</li>
                    <li>→ USDC only — no credit cards</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── LIMITS ── */}
            <div ref={setRef("limits")} id="limits" className="space-y-6 scroll-mt-24">
              <SectionHeading id="limits" label="Limits & Quotas" />
              <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
                <div className="grid grid-cols-3 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <span>Limit</span>
                  <span className="text-center">Value</span>
                  <span>Notes</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { limit: "Max file size",        value: "50 MB",       note: "Per input file URL" },
                    { limit: "Max PDF pages",         value: "500 pages",   note: "Per single request" },
                    { limit: "Max image dimensions",  value: "16383 × 16383 px", note: "Input and output" },
                    { limit: "Max merge files",       value: "10 PDFs",     note: "Per /pdf/merge job" },
                    { limit: "Request timeout",       value: "120 seconds", note: "HTTP response timeout" },
                    { limit: "Output file expiry",    value: "1 hour",      note: "Auto-deleted after creation" },
                    { limit: "Rate limit",            value: "60 req / min", note: "Per wallet address" },
                    { limit: "Concurrent requests",   value: "10",          note: "Per wallet address" },
                  ].map((row) => (
                    <div key={row.limit} className="grid grid-cols-3 items-center px-5 py-3 hover:bg-white/[0.02] transition-colors text-xs gap-3">
                      <span className="font-mono text-slate-300">{row.limit}</span>
                      <span className="text-center font-mono font-bold text-[#3b82f6]">{row.value}</span>
                      <span className="font-mono text-slate-500">{row.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── ERRORS ── */}
            <div ref={setRef("errors")} id="errors" className="space-y-6 scroll-mt-24">
              <SectionHeading id="errors" label="Error Reference" />
              <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
                All error responses return JSON with a <code className="text-[#3b82f6]">code</code> and <code className="text-[#3b82f6]">message</code> field.
                Payments are never charged on 4xx or 5xx errors.
              </p>
              <CodeBlock lang="Error response shape" code={`{
  "error": {
    "code":    "invalid_url",
    "message": "The URL https://example.com/doc.pdf returned 404",
    "status":  400
  }
}`} />
              <div className="border border-white/10 bg-[#0d0f17] overflow-hidden">
                <div className="grid grid-cols-3 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <span>Status</span>
                  <span>Code</span>
                  <span>When it occurs</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { status: "402", color: "text-yellow-400", code: "payment_required",   desc: "No PAYMENT-SIGNATURE header — include it from the 402 response" },
                    { status: "402", color: "text-yellow-400", code: "payment_invalid",    desc: "Signature verification failed or tx hash not found on-chain" },
                    { status: "402", color: "text-yellow-400", code: "insufficient_funds", desc: "USDC transfer amount below the required minimum" },
                    { status: "400", color: "text-red-400",    code: "invalid_url",        desc: "URL is malformed, returns non-2xx, or is not publicly accessible" },
                    { status: "400", color: "text-red-400",    code: "missing_field",      desc: "Required request body field is absent" },
                    { status: "400", color: "text-red-400",    code: "unsupported_format", desc: "Source or target format not supported for this endpoint" },
                    { status: "400", color: "text-red-400",    code: "invalid_range",      desc: "Page range is malformed or exceeds document length" },
                    { status: "413", color: "text-orange-400", code: "file_too_large",     desc: "Input file exceeds the 50 MB limit" },
                    { status: "422", color: "text-red-400",    code: "processing_failed",  desc: "File could not be processed — corrupted or unsupported variant" },
                    { status: "429", color: "text-orange-400", code: "rate_limited",       desc: "Exceeded 60 requests/min per wallet — back off and retry" },
                    { status: "503", color: "text-red-400",    code: "service_unavailable", desc: "Processing service temporarily down — retry after a few seconds" },
                    { status: "500", color: "text-red-500",    code: "internal_error",     desc: "Unexpected server error — payment not charged, retry is safe" },
                  ].map((err) => (
                    <div key={err.code} className="grid grid-cols-3 items-start px-5 py-3 hover:bg-white/[0.02] transition-colors gap-3 text-xs">
                      <span className={`font-mono font-bold ${err.color}`}>{err.status}</span>
                      <code className="font-mono text-slate-400 break-all">{err.code}</code>
                      <span className="font-mono text-slate-500 leading-relaxed">{err.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="border border-white/10 bg-[#0d0f17] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-mono font-bold text-slate-200 text-sm">Ready to integrate?</div>
                <div className="font-mono text-xs text-slate-500 mt-1">Try Swagger UI for interactive testing, or jump straight to the Quick Start.</div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="https://api.filx.io/docs" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 text-slate-300 font-mono text-xs hover:border-white/25 hover:text-white transition-colors">
                  Swagger UI <ExternalLink className="w-3 h-3" />
                </a>
                <button onClick={() => scrollTo("quickstart")}
                  className="px-4 py-2 bg-[#3b82f6] text-white font-mono font-bold text-xs hover:bg-[#2563eb] transition-colors">
                  Quick Start →
                </button>
              </div>
            </div>

          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
