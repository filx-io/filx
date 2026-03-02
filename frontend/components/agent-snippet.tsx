"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SNIPPETS = {
  python: `from x402 import Client

client = Client(wallet_private_key="0x...")

# One-liner: x402 handles 402 → sign → retry automatically
result = client.post(
    "https://api.filx.io/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/document.pdf"}
)
print(result.json())  # {"content": "# Document..."}`,

  javascript: `import { wrapFetch } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount("0x...");
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// x402 wraps fetch: handles 402 → sign → retry automatically
const fetchWithPayment = wrapFetch(fetch, walletClient);

const res = await fetchWithPayment(
  "https://api.filx.io/api/v1/pdf/to-markdown",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/doc.pdf" }),
  }
);
const result = await res.json();
console.log(result);  // { content: "# Document..." }`,

  bankr: `import httpx

API = "https://api.filx.io"
BANKR = "https://api.bankr.bot"

# Step 1: Get payment requirement
res = httpx.post(f"{API}/api/v1/pdf/to-markdown",
    json={"url": "https://example.com/doc.pdf"})

if res.status_code == 402:
    payment_req = res.headers["PAYMENT-REQUIRED"]

    # Step 2: Sign via Bankr (no private key needed)
    job = httpx.post(f"{BANKR}/agent/prompt",
        headers={"X-API-Key": "YOUR_KEY"},
        json={"prompt": f"sign x402 payment: {payment_req}"}
    ).json()

    signed_payload = job["result"]["signature"]

    # Step 3: Resend with signed payment
    result = httpx.post(f"{API}/api/v1/pdf/to-markdown",
        json={"url": "https://example.com/doc.pdf"},
        headers={"PAYMENT-SIGNATURE": signed_payload}
    ).json()
    print(result)  # {"content": "# Document..."}`,

  curl: `# Step 1: Get payment requirement
curl -i -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → 402 Payment Required
# → PAYMENT-REQUIRED: eyJ...base64...

# Step 2: Sign payment and resend with PAYMENT-SIGNATURE header
curl -X POST https://api.filx.io/api/v1/pdf/to-markdown \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: eyJ...signed_base64..." \\
  -d '{"url": "https://example.com/doc.pdf"}'
# → 200 OK
# → PAYMENT-RESPONSE: eyJ...settlement...
# → {"content": "# Document..."}`,
};

type Lang = keyof typeof SNIPPETS;

const TAB_LABELS: Record<Lang, string> = {
  python: "Python",
  javascript: "JavaScript",
  bankr: "Bankr",
  curl: "cURL",
};

// Ordered tab list
const TAB_ORDER: Lang[] = ["python", "javascript", "bankr", "curl"];

export function AgentSnippet() {
  const [lang, setLang] = useState<Lang>("python");
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
          <h2 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-widest text-slate-200">
            Built for AI Agents
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            x402 SDKs handle the full payment flow automatically. One call, one result.
          </p>
        </div>

        <div className="rounded-md border border-white/[0.06] overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4">
            <div className="flex">
              {TAB_ORDER.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-4 py-3 font-mono text-xs font-medium border-b-2 transition-colors uppercase tracking-wider",
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
              className="flex items-center gap-1.5 font-mono text-xs text-slate-600 hover:text-slate-300 transition-colors py-2 px-3 rounded-md hover:bg-white/[0.04]"
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
        </div>

        {/* Compatible frameworks */}
        <div className="flex flex-wrap justify-center gap-2">
          {["MCP", "LangGraph", "AutoGPT", "CrewAI", "OpenAI Functions", "Raw HTTP"].map((f) => (
            <span
              key={f}
              className="font-mono text-xs text-slate-500 px-3 py-1 rounded-md border border-white/[0.06]"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
