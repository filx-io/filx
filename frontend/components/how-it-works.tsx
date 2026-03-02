export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload or Link",
      body: "Drop a file or paste a URL. PDF, images, scanned docs — any source works.",
    },
    {
      n: "02",
      title: "Choose Format",
      body: "Markdown, JSON, CSV, PNG, WebP — pick your output format.",
    },
    {
      n: "03",
      title: "Pay with $FILX",
      body: "Instant micropayment via x402 protocol on Base chain. No accounts needed.",
    },
    {
      n: "04",
      title: "Get Results",
      body: "Converted file delivered in seconds. Auto-delete after 1 hour.",
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
