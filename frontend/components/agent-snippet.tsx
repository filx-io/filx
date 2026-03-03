"use client";

import { useState } from "react";
import { Copy, Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const SNIPPETS = {
  bankr: `# pip install httpx
import httpx, os

API = "https://api.filx.io"
KEY = os.environ["FILX_API_KEY"]  # filx login → filx api-key

# Step 1 — call FliX
res = httpx.post(f"{API}/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/document.pdf"})

# Step 2 — FliX wallet signs the payment (no private key in code)
if res.status_code == 402:
    signed = httpx.post(f"{API}/api/v1/wallet/sign",
        headers={"Authorization": f"Bearer {KEY}"},
        json={"payment_required": res.headers["PAYMENT-REQUIRED"]}
    ).json()["payment_signature"]

    # Step 3 — resend with payment proof
    result = httpx.post(f"{API}/api/v1/pdf/to-markdown",
        json={"url": "https://example.com/document.pdf"},
        headers={"PAYMENT-SIGNATURE": signed}
    ).json()
    print(result["content"])  # → "# Document Title\\n\\n..."`,

  javascript: `// No npm packages needed — just native fetch
const API = "https://api.filx.io";
const KEY = process.env.FILX_API_KEY; // filx login → filx api-key

// Step 1 — call FliX
const res = await fetch(\`\${API}/api/v1/pdf/to-markdown\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
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
  const result = await fetch(\`\${API}/api/v1/pdf/to-markdown\`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "PAYMENT-SIGNATURE": payment_signature },
    body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
  }).then(r => r.json());

  console.log(result.content);   // → "# Document Title..."
  console.log(result.cost_usdc); // → "0.008"
}`,

  cli: `# Install FliX CLI once
npm install -g @filx/cli

# Login — creates embedded agent wallet (no private key)
filx login you@example.com

# Check wallet & USDC balance on Base
filx whoami && filx balance

# Natural language file conversion — pays automatically
filx prompt "Convert https://example.com/doc.pdf to markdown"

# For scripts: export API key
export FILX_API_KEY=$(filx api-key)`,

  curl: `# Step 1: Request → get 402 + payment details
curl -i -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → HTTP/2 402
# → PAYMENT-REQUIRED: eyJzY2hlbWUiOiJleGFjdCIs...

# Step 2: Sign with FliX CLI
SIGNED=$(filx sign-x402 "eyJzY2hlbWUiOiJleGFjdCIs...")

# Step 3: Resend with payment proof
curl -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: $SIGNED" \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → HTTP/2 200 → {"content": "# Document..."}`,
};

type Lang = keyof typeof SNIPPETS;

const TAB_LABELS: Record<Lang, string> = {
  bankr:      "Python",
  javascript: "JavaScript",
  cli:        "FliX CLI",
  curl:       "cURL",
};

const TAB_ORDER: Lang[] = ["bankr", "javascript", "cli", "curl"];

export function AgentSnippet() {
  const [lang, setLang] = useState<Lang>("bankr");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SNIPPETS[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-6 border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // integration
          </p>
          <h2 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-widest text-slate-200">
            Built for AI Agents
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            No private keys in your code. Your agent wallet signs payments — one API, everything FliX.
          </p>
        </div>

        {/* Security banner */}
        <div className="border border-green-400/20 bg-green-400/5 px-4 py-3 flex items-center gap-3">
          <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
          <p className="font-mono text-xs text-slate-400 leading-relaxed">
            <strong className="text-green-400">No private key exposure.</strong>{" "}
            Your agent wallet is secured via <strong className="text-slate-300">Privy embedded wallets</strong> — authenticate
            with <code className="text-[#3b82f6]">FILX_API_KEY</code>, a rotatable credential. The underlying
            private key is never accessible to your code.
          </p>
        </div>

        <div className="border border-white/[0.06] overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4">
            <div className="flex overflow-x-auto">
              {TAB_ORDER.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-4 py-3 font-mono text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                    lang === l
                      ? "border-[#3b82f6] text-slate-200"
                      : "border-transparent text-slate-600 hover:text-slate-400"
                  )}
                >
                  {TAB_LABELS[l]}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 font-mono text-xs text-slate-600 hover:text-slate-300 transition-colors py-2 px-3 hover:bg-white/[0.04] flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Code */}
          <div className="bg-[#060709] p-6 overflow-x-auto">
            <pre className="text-[#94a3b8] text-xs font-mono leading-relaxed">
              <code>{SNIPPETS[lang]}</code>
            </pre>
          </div>

          <div className="border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between gap-2 bg-white/[0.01]">
            <span className="font-mono text-[10px] text-slate-600">
              {lang === "bankr" && "pip install httpx  ·  export FILX_API_KEY=$(filx api-key)"}
              {lang === "javascript" && "native fetch only — no npm packages needed  ·  export FILX_API_KEY=$(filx api-key)"}
              {lang === "cli" && "npm install -g @filx/cli  ·  filx login you@example.com"}
              {lang === "curl" && "requires: FliX CLI for signing  ·  filx sign-x402 <header>"}
            </span>
            <a href="https://filx.io/docs" className="font-mono text-[10px] text-[#3b82f6] hover:text-white transition-colors flex-shrink-0">
              filx.io/docs →
            </a>
          </div>
        </div>

        {/* Compatible frameworks */}
        <div className="flex flex-wrap justify-center gap-2">
          {["MCP", "LangGraph", "CrewAI", "AutoGPT", "OpenAI Functions", "Claude Tools", "Raw HTTP"].map((f) => (
            <span key={f} className="font-mono text-xs text-slate-500 px-3 py-1 border border-white/[0.06]">
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
