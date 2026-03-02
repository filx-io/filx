import { FileText, ScanLine, Image, Table2, Wrench, Zap, Bot, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "PDF → Structured Markdown",
    desc: "Headings, tables, lists — perfect for RAG pipelines and LLM context.",
    color: "text-blue-500", bg: "bg-blue-500/10",
  },
  {
    icon: ScanLine,
    title: "OCR Engine",
    desc: "Scanned PDFs and images — English + Indonesian (Bahasa). Powered by Tesseract + EasyOCR.",
    color: "text-green-500", bg: "bg-green-500/10",
  },
  {
    icon: Image,
    title: "Smart Image Optimizer",
    desc: "Convert PNG/JPG/WebP/AVIF, resize, compress, and remove backgrounds.",
    color: "text-pink-500", bg: "bg-pink-500/10",
  },
  {
    icon: Table2,
    title: "Table Extraction",
    desc: "Extract tables from PDFs and images to CSV or JSON — ready for data pipelines.",
    color: "text-orange-500", bg: "bg-orange-500/10",
  },
  {
    icon: Wrench,
    title: "PDF Tools",
    desc: "Compress, merge, split, rotate, and unlock password-protected PDFs.",
    color: "text-purple-500", bg: "bg-purple-500/10",
  },
  {
    icon: Bot,
    title: "Agent-Native API",
    desc: "MCP tool manifest, LangChain wrapper, AutoGPT plugin, JSON-first responses.",
    color: "text-yellow-500", bg: "bg-yellow-500/10",
  },
  {
    icon: Zap,
    title: "x402 Micropayments",
    desc: "HTTP 402 native. One round-trip: send file → get 402 → pay → get result.",
    color: "text-primary", bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Secure & Ephemeral",
    desc: "Files auto-deleted after 1 hour. No data retained. No account required.",
    color: "text-gray-500", bg: "bg-gray-500/10",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 border-t border-border/40">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black">Everything you need to process files</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Production-grade conversions with a single API call and a micropayment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all space-y-3"
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-semibold leading-snug">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
