export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "HTTP Request",
      body: "Agent sends POST to FilX API with file URL and target format. Standard HTTP. No auth required.",
      tag: "POST /api/v1/pdf/to-markdown",
      tagColor: "text-[#3b82f6]",
    },
    {
      n: "02",
      title: "402 Payment Required",
      body: "FilX returns payment details: USDC amount, recipient, network (Base), scheme (exact). All in PAYMENT-REQUIRED header.",
      tag: "← PAYMENT-REQUIRED header",
      tagColor: "text-yellow-400",
    },
    {
      n: "03",
      title: "Sign & Pay",
      body: "Agent signs USDC transfer on Base and resends request with PAYMENT-SIGNATURE header. Via Bankr, own wallet, or any signing method.",
      tag: "→ PAYMENT-SIGNATURE header",
      tagColor: "text-yellow-400",
    },
    {
      n: "04",
      title: "200 OK",
      body: "FilX verifies payment on-chain, converts file, returns result with PAYMENT-RESPONSE header. Done.",
      tag: "← 200 OK + PAYMENT-RESPONSE",
      tagColor: "text-green-400",
    },
  ];

  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <h2 className="font-mono font-bold text-slate-200 text-2xl uppercase tracking-widest">
            How It Works
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            Four HTTP exchanges. No accounts. No API keys. Pure x402.
          </p>
        </div>

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

              {/* HTTP tag */}
              <p className={`font-mono text-[10px] uppercase tracking-wider ${step.tagColor}`}>
                {step.tag}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
