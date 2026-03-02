import { ExternalLink } from "lucide-react";

const PAYMENT_OPTIONS = [
  {
    icon: "💳",
    title: "Direct Wallet",
    desc: "Any Base-compatible wallet. Sign the tx yourself. Full self-custody.",
    tag: "Self-Custody",
  },
  {
    icon: "⚡",
    title: "Bankr",
    desc: "Natural language payments. Agent sends a prompt, Bankr handles wallet and signing. No private keys.",
    tag: "AI-Friendly",
    href: "https://bankr.bot",
  },
  {
    icon: "🔷",
    title: "Coinbase Wallet",
    desc: "Connect via Coinbase Wallet or Coinbase Smart Wallet. Gas sponsorship available.",
    tag: "Popular",
  },
  {
    icon: "🌐",
    title: "WalletConnect",
    desc: "Any WalletConnect v2 compatible wallet. 300+ wallets supported.",
    tag: "Universal",
  },
];

const HOW_IT_WORKS = [
  "Agent calls FilX API → gets HTTP 402 with payment details",
  "Agent pays with preferred method (direct wallet, Bankr, etc.)",
  "Payment confirmed on Base chain",
  "Agent submits tx hash to FilX as proof of payment",
  "FilX delivers the converted file",
];

export function BankrIntegration() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Card */}
        <div className="rounded-xl border border-white/10 bg-[#0d0f17] p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              // payment options
            </p>
            <h2 className="font-mono font-black text-slate-200 text-2xl md:text-3xl uppercase tracking-wider leading-tight">
              Flexible Payment Methods
            </h2>
            <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
              FilX uses the{" "}
              <strong className="text-slate-200">x402 protocol</strong> for micropayments — a
              standard HTTP 402 flow that works with any Base-compatible wallet or payment
              integration. Choose what fits your stack.
            </p>
          </div>

          {/* Payment Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAYMENT_OPTIONS.map((opt) => (
              <div
                key={opt.title}
                className="rounded-lg border border-white/10 bg-[#08090d] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{opt.icon}</span>
                    <span className="font-mono font-bold text-sm text-slate-200">{opt.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5 uppercase tracking-wider">
                    {opt.tag}
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                {opt.href && (
                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-[#3b82f6] hover:text-white transition-colors"
                  >
                    {opt.href.replace("https://", "")}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* How it works */}
            <div className="space-y-4">
              <h3 className="font-mono font-bold text-slate-300 text-xs uppercase tracking-widest">
                x402 Payment Flow
              </h3>
              <ol className="space-y-3">
                {HOW_IT_WORKS.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[#3b82f6] flex items-center justify-center font-mono font-black text-[10px] text-[#3b82f6] mt-0.5">
                      {i + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-400 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Code snippet */}
            <div className="space-y-4">
              <h3 className="font-mono font-bold text-slate-300 text-xs uppercase tracking-widest">
                Example: Direct x402
              </h3>
              <div className="rounded-lg border border-white/5 bg-[#060709] p-4">
                <p className="font-mono text-xs text-slate-500 leading-relaxed whitespace-pre">
                  <span className="text-slate-600"># Standard x402 payment flow</span>{"\n"}
                  <span className="text-[#3b82f6]">resp</span>
                  <span className="text-slate-300"> = httpx.post(</span>
                  <span className="text-green-400">&quot;/api/v1/pdf/to-markdown&quot;</span>
                  <span className="text-slate-300">,</span>{"\n"}
                  {"  "}
                  <span className="text-slate-300">json={"{"}</span>
                  <span className="text-green-400">&quot;url&quot;</span>
                  <span className="text-slate-400">: file_url{"}"}</span>
                  <span className="text-slate-300">)</span>{"\n"}
                  <span className="text-slate-600"># → 402 with payment details</span>{"\n"}
                  <span className="text-[#3b82f6]">pay</span>
                  <span className="text-slate-300">(resp.json()</span>
                  <span className="text-slate-400">[</span>
                  <span className="text-green-400">&quot;payment&quot;</span>
                  <span className="text-slate-400">]</span>
                  <span className="text-slate-300">)</span>{"\n"}
                  <span className="text-slate-600"># Submit any wallet tx hash</span>
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
            <a
              href="https://x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#3b82f6] hover:text-white transition-colors"
            >
              x402.org
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://bankr.bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              bankr.bot
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL ?? "https://api.filx.io"}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              API Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
