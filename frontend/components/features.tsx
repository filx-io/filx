import { FileText, ScanLine, Image, Table2, Wrench, Zap, Bot, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "PDF → Structured Markdown",
    desc: "Headings, tables, lists — perfect for RAG pipelines and LLM context.",
  },
  {
    icon: ScanLine,
    title: "OCR Engine",
    desc: "Scanned PDFs and images — English + Indonesian (Bahasa). Powered by Tesseract + EasyOCR.",
  },
  {
    icon: Image,
    title: "Smart Image Optimizer",
    desc: "Convert PNG/JPG/WebP/AVIF, resize, compress, and remove backgrounds.",
  },
  {
    icon: Table2,
    title: "Table Extraction",
    desc: "Extract tables from PDFs and images to CSV or JSON — ready for data pipelines.",
  },
  {
    icon: Wrench,
    title: "PDF Tools",
    desc: "Compress, merge, split, rotate, and unlock password-protected PDFs.",
  },
  {
    icon: Bot,
    title: "Agent-Native API",
    desc: "MCP tool manifest, LangChain wrapper, AutoGPT plugin, JSON-first responses.",
  },
  {
    icon: Zap,
    title: "x402 Micropayments",
    desc: "HTTP 402 native. One round-trip: send file → get 402 → pay → get result.",
  },
  {
    icon: Shield,
    title: "Secure & Ephemeral",
    desc: "Files auto-deleted after 1 hour. No data retained. No account required.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-6 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-widest text-slate-200">
            Everything You Need
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            Production-grade conversions with a single API call and a micropayment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-5 rounded-md border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all space-y-3 group"
            >
              <div className="w-9 h-9 rounded-md border border-white/[0.08] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <h3 className="font-mono font-semibold text-sm text-slate-200 leading-snug">{title}</h3>
              <p className="font-mono text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
