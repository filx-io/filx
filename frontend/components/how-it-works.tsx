const steps = [
  {
    n: "01",
    title: "REQUEST",
    tagColor: "text-[#3b82f6]",
    summary: "Agent sends a standard HTTP POST with the file URL and target format. No auth headers needed.",
    code: `POST /api/v1/pdf/to-markdown HTTP/1.1
Host: api.filx.io
Content-Type: application/json

{"url": "https://example.com/report.pdf"}`,
  },
  {
    n: "02",
    title: "402 PAYMENT REQUIRED",
    tagColor: "text-yellow-400",
    summary: "Server returns payment details — amount, currency, recipient — in the PAYMENT-REQUIRED header. Agent reads and signs.",
    code: `HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: eyJzY2hlbWUi...

{
  "amount": "0.001",
  "currency": "USDC",
  "network": "base",
  "scheme": "exact"
}`,
  },
  {
    n: "03",
    title: "PAY + 200 OK",
    tagColor: "text-green-400",
    summary: "Agent resends request with PAYMENT-SIGNATURE header. FilX verifies on-chain and returns the converted file.",
    code: `POST /api/v1/pdf/to-markdown HTTP/1.1
PAYMENT-SIGNATURE: eyJ0eEhhc2gi...

HTTP/1.1 200 OK
{"content": "# Report\\n\\n..."}`,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // x402 protocol
          </p>
          <h2 className="font-mono font-bold text-slate-200 text-2xl uppercase tracking-widest">
            How It Works
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            Three HTTP exchanges. No accounts. No API keys. Pure x402.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 border border-white/10 bg-[#0d0f17] p-6"
            >
              {/* Step number */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-black text-xs text-[#3b82f6]">{step.n}</span>
                </div>
                <h3 className={`font-mono font-black text-sm uppercase tracking-widest ${step.tagColor}`}>
                  {step.title}
                </h3>
              </div>

              <p className="font-mono text-slate-500 text-xs leading-relaxed">{step.summary}</p>

              {/* Code block */}
              <div className="bg-[#0a0c14] border border-white/5 p-4 flex-1">
                <pre className="font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap break-all">
                  {step.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
