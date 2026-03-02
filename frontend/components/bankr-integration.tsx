import { ExternalLink } from "lucide-react";

const PAYMENT_OPTIONS = [
  {
    icon: "⚡",
    title: "Bankr Agent API",
    desc: "Natural language payments. Agent sends a prompt to Bankr: 'pay 0.005 USDC to 0x…' — Bankr handles wallet, signing, and gas. Fully autonomous.",
    tag: "Recommended",
    href: "https://bankr.bot",
  },
  {
    icon: "🤖",
    title: "Programmatic Wallet",
    desc: "Agent holds its own private key and signs USDC transfers directly via ethers.js, viem, or web3.py. Full self-custody, zero dependencies.",
    tag: "Self-Custody",
  },
  {
    icon: "🔗",
    title: "Smart Contract",
    desc: "Route payments through your own smart contract or multi-sig. Batch payments, escrow, custom logic — any contract that sends USDC on Base.",
    tag: "Advanced",
  },
];

const HOW_IT_WORKS = [
  "Agent calls FliX API → gets HTTP 402 with payment details (amount, recipient, job_id)",
  "Agent signs and submits USDC transfer on Base (via Bankr, own wallet, or contract)",
  "Agent resubmits to FliX with X-Payment-Tx header containing tx hash",
  "FliX verifies on-chain payment and processes the file",
  "Converted file returned as JSON — ready for the next pipeline step",
];

export function BankrIntegration() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl border border-white/10 bg-[#0d0f17] p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              // autonomous payments
            </p>
            <h2 className="font-mono font-black text-slate-200 text-2xl md:text-3xl uppercase tracking-wider leading-tight">
              No Humans Required
            </h2>
            <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
              FliX payments are <strong className="text-slate-200">fully programmatic</strong>. 
              No wallet popups, no browser extensions, no approval clicks. 
              Your agent pays autonomously via the{" "}
              <strong className="text-slate-200">x402 protocol</strong> — 
              standard HTTP 402 with on-chain USDC settlement on Base.
            </p>
          </div>

          {/* Payment Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Bankr Example (Python)
              </h3>
              <div className="rounded-lg border border-white/5 bg-[#060709] p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-400 leading-relaxed">
                  <code>{`# Agent pays via Bankr — zero keys
bankr.prompt(
  f"send {amount} USDC to {addr} on base"
)
# → Bankr signs + submits tx
# → Agent gets tx_hash back
# → Submit to FliX with proof`}</code>
                </pre>
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
