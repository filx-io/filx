"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = "https://web-production-65eed.up.railway.app";

const SNIPPETS = {
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

export function AgentSnippet() {
  const [lang, setLang] = useState<Lang>("python");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SNIPPETS[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-4 border-t border-border/40">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black">Built for AI Agents</h2>
          <p className="text-muted-foreground text-lg">
            Drop FilX.io into any agent framework in minutes.
          </p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden shadow-xl">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4">
            <div className="flex">
              {(Object.keys(SNIPPETS) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize",
                    lang === l
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l === "langgraph" ? "LangGraph" : l}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-lg hover:bg-muted"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Code */}
          <div className="bg-[#0d1117] p-6 overflow-x-auto">
            <pre className="text-[#e6edf3] text-sm font-mono leading-relaxed">
              <code>{SNIPPETS[lang]}</code>
            </pre>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          {["MCP", "LangGraph", "AutoGPT", "CrewAI", "OpenAI Functions", "Raw HTTP"].map((f) => (
            <span key={f} className="px-3 py-1 rounded-full border border-border bg-muted/50">
              ✅ {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
