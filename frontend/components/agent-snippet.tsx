"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = "https://api.filx.io";

const SNIPPETS = {
  bankr: `import httpx

FILX_API = "https://api.filx.io"
BANKR_API = "https://api.bankr.bot"
BANKR_KEY = "your_bankr_api_key"

# Step 1: Request conversion → get 402
res = httpx.post(f"{FILX_API}/api/v1/convert", json={
    "url": "https://example.com/document.pdf",
    "to": "markdown"
})

if res.status_code == 402:
    payment = res.json()["payment"]
    job_id = res.json()["job_id"]

    # Step 2: Pay via Bankr (natural language)
    bankr_res = httpx.post(f"{BANKR_API}/agent/prompt",
        headers={"X-API-Key": BANKR_KEY},
        json={"prompt": f"send {payment['amount_usd']} USDC to {payment['recipient']} on base"}
    )
    bankr_job = bankr_res.json()["jobId"]

    # Step 3: Poll Bankr for tx hash
    import time
    while True:
        status = httpx.get(f"{BANKR_API}/agent/job/{bankr_job}",
            headers={"X-API-Key": BANKR_KEY}
        ).json()
        if status["status"] == "completed":
            tx_hash = extract_tx_hash(status["response"])
            break
        time.sleep(2)

    # Step 4: Submit to FilX with payment proof
    result = httpx.post(f"{FILX_API}/api/v1/convert",
        json={"url": "https://example.com/document.pdf", "to": "markdown"},
        headers={"X-Payment-Tx": tx_hash, "X-Payment-Job": job_id}
    ).json()

    print(result)  # Converted markdown`,

  python: `import httpx, os

# Step 1: Request → get 402 with payment details
res = httpx.post("${API_URL}/api/v1/convert", json={
    "url": "https://example.com/document.pdf",
    "to": "markdown"
})

if res.status_code == 402:
    payment = res.json()["payment"]
    print(f"Pay {payment['amount_usd']} USDC to {payment['recipient']}")
    
    # Step 2: Pay on Base chain (via your wallet/SDK)
    tx_hash = pay_usdc(payment)  # your payment logic
    
    # Step 3: Submit with proof
    result = httpx.post("${API_URL}/api/v1/convert",
        json={"url": "https://example.com/document.pdf", "to": "markdown"},
        headers={"X-Payment-Tx": tx_hash, "X-Payment-Job": res.json()["job_id"]}
    ).json()
    
    # Step 4: Poll for result
    job = poll_until_done(result["job_id"])
    print(job["result"]["content"])  # Markdown output`,

  curl: `# Step 1: Initiate (get 402)
curl -X POST ${API_URL}/api/v1/convert \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/doc.pdf","to":"markdown"}'

# Step 2: Pay USDC on Base (use your wallet or SDK)

# Step 3: Submit with payment proof
curl -X POST ${API_URL}/api/v1/convert \\
  -H "Content-Type: application/json" \\
  -H "X-Payment-Tx: 0x{your_tx_hash}" \\
  -H "X-Payment-Job: jb_abc123" \\
  -d '{"url":"https://example.com/doc.pdf","to":"markdown"}'

# Step 4: Check result
curl ${API_URL}/api/v1/jobs/jb_abc123`,

  langgraph: `from langchain.tools import tool
from filx import FilXClient

client = FilXClient(
    api_url="${API_URL}",
    wallet_private_key=os.getenv("AGENT_WALLET_KEY"),
    network="base"
)

@tool
def convert_file(url: str, to: str) -> dict:
    """Convert a file using FilX.io with x402 autopayment.
    Supports: pdf->markdown, image->text (OCR), image->png/jpg/webp
    """
    return client.convert(url=url, to=to)

# Add to your LangGraph node
tools = [convert_file]`,
};

type Lang = keyof typeof SNIPPETS;

const TAB_LABELS: Record<Lang, string> = {
  bankr: "Bankr",
  python: "Python",
  curl: "cURL",
  langgraph: "LangGraph",
};

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
          <h2 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-widest text-slate-200">
            Built for AI Agents
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            Drop FilX.io into any agent framework in minutes.
          </p>
        </div>

        <div className="rounded-md border border-white/[0.06] overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4">
            <div className="flex">
              {(Object.keys(SNIPPETS) as Lang[]).map((l) => (
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
