export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "API Call",
      body: "Your agent sends a POST request with a file URL and target format. One endpoint, no auth required.",
    },
    {
      n: "02",
      title: "HTTP 402",
      body: "Server returns 402 Payment Required with USDC amount, recipient address, and job ID on Base chain.",
    },
    {
      n: "03",
      title: "PAY WITH x402",
      body: "Agent pays via x402 protocol — direct wallet, Bankr, or any Base-compatible wallet. Submit the tx hash as proof of payment.",
    },
    {
      n: "04",
      title: "Receive Output",
      body: "Converted file returned as JSON response. Markdown, CSV, JSON, images — ready for the next pipeline step.",
    },
  ];

  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono font-bold text-slate-200 text-2xl uppercase tracking-widest text-center mb-14">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-white/10 bg-[#0d0f17] p-6 space-y-4"
            >
              {/* Connector line between cards (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-3 w-6 h-px bg-white/10" />
              )}

              {/* Step number circle */}
              <div className="w-9 h-9 rounded-full border-2 border-[#3b82f6] flex items-center justify-center">
                <span className="font-mono font-black text-xs text-[#3b82f6]">
                  {step.n}
                </span>
              </div>

              <h3 className="font-mono font-bold text-slate-200 text-sm uppercase tracking-wider">
                {step.title}
              </h3>
              <p className="font-mono text-slate-500 text-xs leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
