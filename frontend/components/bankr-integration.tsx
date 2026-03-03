import { ExternalLink, Shield } from "lucide-react";

const PAYMENT_OPTIONS = [
  {
    icon: "🔐",
    title: "Bankr + Privy Wallet",
    desc: "Recommended. Bankr creates an embedded wallet for your agent via Privy. No private key ever touches your code. Authenticate with BANKR_API_KEY.",
    tag: "Recommended",
    href: "https://bankr.bot",
  },
  {
    icon: "🤖",
    title: "Bankr CLI",
    desc: "Natural language payments. 'bankr prompt: pay X USDC to Y'. Ideal for scripted agents and pipelines.",
    tag: "Zero Code",
    href: "https://bankr.bot",
  },
  {
    icon: "🔗",
    title: "Smart Contract",
    desc: "Route payments through your own contract or multi-sig. Batch payments, escrow, custom logic — any contract that sends USDC on Base.",
    tag: "Advanced",
  },
];

const HOW_IT_WORKS = [
  "Agent calls FliX API → gets HTTP 402 with PAYMENT-REQUIRED header (amount, recipient, job_id)",
  "Agent forwards PAYMENT-REQUIRED to Bankr API with BANKR_API_KEY",
  "Bankr signs the USDC payment using the agent's Privy embedded wallet (no private key in code)",
  "Agent resubmits to FliX with PAYMENT-SIGNATURE header containing signed payload",
  "FliX verifies on-chain payment and processes the file → 200 OK + result",
];

export function BankrIntegration() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="border border-white/10 bg-[#0d0f17] p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              // autonomous payments · no private keys
            </p>
            <h2 className="font-mono font-black text-slate-200 text-2xl md:text-3xl uppercase tracking-wider leading-tight">
              Secure Agent Wallets via Bankr
            </h2>
            <p className="font-mono text-slate-400 text-sm leading-relaxed max-w-2xl">
              FliX payments are <strong className="text-slate-200">fully autonomous</strong> — no wallet popups,
              no private keys in code. Your agent authenticates with a{" "}
              <code className="text-[#3b82f6]">BANKR_API_KEY</code> and Bankr handles signing via{" "}
              <strong className="text-slate-200">Privy embedded wallets</strong>.
            </p>
          </div>

          {/* Security callout */}
          <div className="border border-green-400/20 bg-green-400/5 px-4 py-3 flex items-start gap-3">
            <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="font-mono text-xs text-slate-400 leading-relaxed">
              <strong className="text-green-400">Why no private key?</strong>{" "}
              Private keys in environment variables get leaked to logs, git history, CI/CD systems, and crash reports.
              Bankr + Privy keeps the key server-side and gives your agent a rotatable{" "}
              <code className="text-[#3b82f6]">BANKR_API_KEY</code> instead.
            </p>
          </div>

          {/* Payment Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PAYMENT_OPTIONS.map((opt) => (
              <div key={opt.title}
                className="border border-white/10 bg-[#08090d] p-4 space-y-2 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{opt.icon}</span>
                    <span className="font-mono font-bold text-sm text-slate-200">{opt.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 border border-white/10 px-1.5 py-0.5 uppercase tracking-wider">
                    {opt.tag}
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                {opt.href && (
                  <a href={opt.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-[#3b82f6] hover:text-white transition-colors">
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
                Payment Flow (with Bankr)
              </h3>
              <ol className="space-y-3">
                {HOW_IT_WORKS.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-5 h-5 border border-[#3b82f6] flex items-center justify-center font-mono font-black text-[10px] text-[#3b82f6] mt-0.5">
                      {i + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-400 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Code snippet */}
            <div className="space-y-4">
              <h3 className="font-mono font-bold text-slate-300 text-xs uppercase tracking-widest">
                Python Example
              </h3>
              <div className="border border-white/5 bg-[#060709] p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-400 leading-relaxed">{`import httpx, os

API   = "https://api.filx.io"
BANKR = "https://api.bankr.bot"
KEY   = os.environ["BANKR_API_KEY"]

res = httpx.post(f"{API}/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/doc.pdf"})

if res.status_code == 402:
    signed = httpx.post(f"{BANKR}/v1/x402/sign",
        headers={"Authorization": f"Bearer {KEY}"},
        json={"payment_required":
              res.headers["PAYMENT-REQUIRED"]}
    ).json()["payment_signature"]

    result = httpx.post(f"{API}/api/v1/pdf/to-markdown",
        json={"url": "https://example.com/doc.pdf"},
        headers={"PAYMENT-SIGNATURE": signed}
    ).json()
    print(result["content"])`}</pre>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
            <a href="https://bankr.bot" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#3b82f6] hover:text-white transition-colors">
              bankr.bot <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://skills.bankr.bot" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">
              skills.bankr.bot <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://x402.org" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">
              x402.org <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://filx.io/docs" className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">
              API Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
