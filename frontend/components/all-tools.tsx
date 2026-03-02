"use client";

import { useState } from "react";

type Category = "all" | "image" | "document" | "data";

interface Tool {
  name: string;
  endpoint: string;
  desc: string;
  formats: string[];
  price: string;
  unit: string;
  category: Exclude<Category, "all">;
}

const TOOLS: Tool[] = [
  // ── IMAGE ──────────────────────────────────────────────────────────────────
  {
    name: "Image Resize",
    endpoint: "POST /api/v1/image/resize",
    desc: "Resize to exact dimensions or percentage. Smart upscale/downscale with aspect ratio preservation.",
    formats: ["PNG", "JPG", "WebP", "AVIF", "GIF", "BMP", "TIFF", "SVG"],
    price: "50",
    unit: "per image",
    category: "image",
  },
  {
    name: "Image Compress",
    endpoint: "POST /api/v1/image/compress",
    desc: "Lossy or lossless compression. Up to 80% file size reduction with minimal quality loss.",
    formats: ["PNG", "JPG", "WebP"],
    price: "30",
    unit: "per image",
    category: "image",
  },
  {
    name: "Image Convert",
    endpoint: "POST /api/v1/image/convert",
    desc: "Convert between any image formats. Batch conversion supported.",
    formats: ["PNG", "JPG", "WebP", "AVIF", "BMP", "TIFF", "GIF", "SVG", "ICO"],
    price: "50",
    unit: "per image",
    category: "image",
  },
  {
    name: "Image Crop",
    endpoint: "POST /api/v1/image/crop",
    desc: "Crop to custom dimensions, aspect ratios, or smart crop with AI-detected subject centering.",
    formats: ["PNG", "JPG", "WebP", "AVIF", "BMP", "TIFF"],
    price: "50",
    unit: "per image",
    category: "image",
  },
  {
    name: "Background Remove",
    endpoint: "POST /api/v1/image/remove-bg",
    desc: "AI-powered background removal. Returns transparent PNG. Works on photos, products, portraits.",
    formats: ["PNG", "JPG", "WebP"],
    price: "200",
    unit: "per image",
    category: "image",
  },
  {
    name: "Image Upscale",
    endpoint: "POST /api/v1/image/upscale",
    desc: "AI super-resolution upscaling at 2x or 4x. Enhances detail and sharpness beyond bicubic.",
    formats: ["PNG", "JPG", "WebP"],
    price: "300",
    unit: "per image",
    category: "image",
  },
  {
    name: "Watermark",
    endpoint: "POST /api/v1/image/watermark",
    desc: "Add text or image watermark with custom position, opacity, and rotation.",
    formats: ["PNG", "JPG", "WebP", "AVIF"],
    price: "50",
    unit: "per image",
    category: "image",
  },
  {
    name: "Rotate / Flip",
    endpoint: "POST /api/v1/image/rotate",
    desc: "Rotate 90/180/270° or flip horizontal/vertical. Lossless for formats that support it.",
    formats: ["PNG", "JPG", "WebP", "AVIF", "BMP", "TIFF", "GIF"],
    price: "20",
    unit: "per image",
    category: "image",
  },
  // ── DOCUMENT ───────────────────────────────────────────────────────────────
  {
    name: "PDF → Markdown",
    endpoint: "POST /api/v1/pdf/to-markdown",
    desc: "High-fidelity conversion preserving headings, tables, lists, and code blocks. Ideal for RAG pipelines.",
    formats: ["PDF"],
    price: "100",
    unit: "per page",
    category: "document",
  },
  {
    name: "PDF → Text (OCR)",
    endpoint: "POST /api/v1/pdf/ocr",
    desc: "Extract text from scanned PDFs using OCR. Multi-language: English + Indonesian (Bahasa).",
    formats: ["PDF"],
    price: "150",
    unit: "per page",
    category: "document",
  },
  {
    name: "PDF Compress",
    endpoint: "POST /api/v1/pdf/compress",
    desc: "Reduce PDF file size by optimizing images, fonts, and embedded resources inside the PDF.",
    formats: ["PDF"],
    price: "100",
    unit: "per file",
    category: "document",
  },
  {
    name: "PDF Merge",
    endpoint: "POST /api/v1/pdf/merge",
    desc: "Combine multiple PDFs into a single document. Preserves bookmarks and page order.",
    formats: ["PDF"],
    price: "100",
    unit: "per job",
    category: "document",
  },
  {
    name: "PDF Split",
    endpoint: "POST /api/v1/pdf/split",
    desc: "Split a PDF by page ranges, every N pages, or at specific page boundaries.",
    formats: ["PDF"],
    price: "100",
    unit: "per job",
    category: "document",
  },
  {
    name: "PDF Rotate",
    endpoint: "POST /api/v1/pdf/rotate",
    desc: "Rotate individual pages or all pages of a PDF at 90, 180, or 270 degrees.",
    formats: ["PDF"],
    price: "50",
    unit: "per job",
    category: "document",
  },
  {
    name: "PDF Unlock",
    endpoint: "POST /api/v1/pdf/unlock",
    desc: "Remove password protection from encrypted PDFs. Returns an unlocked, accessible document.",
    formats: ["PDF"],
    price: "100",
    unit: "per file",
    category: "document",
  },
  {
    name: "PDF → Image",
    endpoint: "POST /api/v1/pdf/to-image",
    desc: "Render PDF pages to high-resolution PNG or JPG images. Configurable DPI.",
    formats: ["PDF"],
    price: "100",
    unit: "per page",
    category: "document",
  },
  // ── DATA ───────────────────────────────────────────────────────────────────
  {
    name: "Table Extract",
    endpoint: "POST /api/v1/table/extract",
    desc: "Extract tables from PDFs or images to CSV or JSON. Preserves column headers and structure.",
    formats: ["PDF", "PNG", "JPG"],
    price: "500",
    unit: "per table",
    category: "data",
  },
  {
    name: "OCR Image",
    endpoint: "POST /api/v1/ocr/image",
    desc: "Extract text from images (photos, screenshots, scans). Returns plain text or structured JSON.",
    formats: ["PNG", "JPG", "WebP", "BMP", "TIFF"],
    price: "150",
    unit: "per image",
    category: "data",
  },
  {
    name: "HTML → PDF",
    endpoint: "POST /api/v1/html/to-pdf",
    desc: "Convert web pages or HTML strings to styled PDF. Supports CSS, custom fonts, and headers/footers.",
    formats: ["HTML", "URL"],
    price: "100",
    unit: "per page",
    category: "data",
  },
  {
    name: "Markdown → PDF",
    endpoint: "POST /api/v1/markdown/to-pdf",
    desc: "Convert Markdown to a beautifully styled PDF. Code highlighting, tables, and images supported.",
    formats: ["Markdown"],
    price: "100",
    unit: "per page",
    category: "data",
  },
];

const SECTION_LABELS: Record<Exclude<Category, "all">, string> = {
  image: "IMAGE PROCESSING",
  document: "DOCUMENT PROCESSING",
  data: "DATA EXTRACTION",
};

const CATEGORY_TABS: { id: Category; label: string; count: number }[] = [
  { id: "all", label: "All", count: TOOLS.length },
  { id: "image", label: "Image", count: TOOLS.filter((t) => t.category === "image").length },
  { id: "document", label: "Document", count: TOOLS.filter((t) => t.category === "document").length },
  { id: "data", label: "Data", count: TOOLS.filter((t) => t.category === "data").length },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#0d0f17] p-4 hover:border-white/20 transition-colors">
      {/* Name */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono font-bold text-slate-200 text-sm uppercase tracking-wider leading-snug">
          {tool.name}
        </h3>
        <span className="flex-shrink-0 font-mono font-bold text-[#3b82f6] text-sm whitespace-nowrap">
          {tool.price} <span className="text-[10px] text-slate-500">$FILX</span>
        </span>
      </div>

      {/* Endpoint */}
      <code className="inline-block bg-[#0a0c14] px-2 py-0.5 rounded text-xs text-blue-400 font-mono break-all leading-relaxed">
        {tool.endpoint}
      </code>

      {/* Description */}
      <p className="font-mono text-xs text-slate-500 leading-relaxed flex-1">{tool.desc}</p>

      {/* Format badges */}
      <div className="flex flex-wrap gap-1">
        {tool.formats.map((fmt) => (
          <span
            key={fmt}
            className="font-mono text-[10px] text-slate-400 border border-white/10 rounded px-1.5 py-0.5 bg-[#08090d]"
          >
            {fmt}
          </span>
        ))}
      </div>

      {/* Unit */}
      <div className="pt-1 border-t border-white/5">
        <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">
          {tool.unit}
        </span>
      </div>
    </div>
  );
}

export function AllTools() {
  const [activeTab, setActiveTab] = useState<Category>("all");

  const filtered = activeTab === "all" ? TOOLS : TOOLS.filter((t) => t.category === activeTab);

  const sections =
    activeTab === "all"
      ? (["image", "document", "data"] as const)
      : [activeTab as Exclude<Category, "all">];

  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // api endpoints
          </p>
          <h2 className="font-mono font-black text-slate-200 text-2xl md:text-3xl uppercase tracking-widest">
            All Tools
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            20+ file processing endpoints. Each is a single POST request with x402 micropayment. No SDK required.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-1.5 rounded-md border transition-colors ${
                activeTab === tab.id
                  ? "border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/10"
                  : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Sections */}
        {sections.map((section) => {
          const sectionTools = filtered.filter((t) => t.category === section);
          if (sectionTools.length === 0) return null;
          return (
            <div key={section} className="space-y-4">
              <h3 className="font-mono font-bold text-xs text-slate-600 uppercase tracking-widest border-b border-white/5 pb-3">
                {SECTION_LABELS[section]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sectionTools.map((tool) => (
                  <ToolCard key={tool.endpoint} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
