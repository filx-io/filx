export function X402Flow() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Section header */}
        <div className="text-center space-y-3">
          <span className="font-mono text-xs text-[#3b82f6] uppercase tracking-widest border border-[#3b82f6]/30 rounded px-3 py-1">
            x402 Protocol
          </span>
          <h2 className="font-mono font-bold text-slate-200 text-2xl uppercase tracking-widest mt-4">
            Internet-Native Payments
          </h2>
          <p className="font-mono text-slate-500 text-sm max-w-xl mx-auto">
            x402 is Coinbase&apos;s open standard for machine-to-machine payments. No accounts. No API keys. Just HTTP.
          </p>
        </div>

        {/* ── Section 1: Old Way vs x402 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: The Old Way */}
          <div className="rounded-xl border border-white/5 bg-[#0d0f17] p-6 space-y-5">
            <h3 className="font-mono font-bold text-slate-600 text-xs uppercase tracking-widest line-through">
              The Old Way
            </h3>
            <ol className="space-y-4">
              {[
                { step: "01", title: "Create account with API provider", detail: "Time consuming setup" },
                { step: "02", title: "Add payment method", detail: "KYC required, delays" },
                { step: "03", title: "Buy credits or subscription", detail: "Prepaid, overpay or run out" },
                { step: "04", title: "Manage API keys", detail: "Security risk, must rotate" },
                { step: "05", title: "Make request", detail: "Finally get your data" },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-slate-700 pt-0.5 w-5 shrink-0">{item.step}</span>
                  <div>
                    <p className="font-mono text-xs text-slate-600 line-through">{item.title}</p>
                    <p className="font-mono text-[10px] text-slate-700 mt-0.5">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right: With x402 */}
          <div className="rounded-xl border border-[#3b82f6]/20 bg-[#0d0f17] p-6 space-y-5">
            <h3 className="font-mono font-bold text-[#3b82f6] text-xs uppercase tracking-widest">
              With x402
            </h3>
            <ol className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Agent sends HTTP request → receives 402 Payment Required",
                  detail: "No account, instant",
                },
                {
                  step: "02",
                  title: "Agent signs USDC payment on Base",
                  detail: "No signups, no approvals",
                },
                {
                  step: "03",
                  title: "API access granted, file converted",
                  detail: "No API keys, no security risks",
                },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-[#3b82f6] pt-0.5 w-5 shrink-0">{item.step}</span>
                  <div>
                    <p className="font-mono text-xs text-slate-300">{item.title}</p>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Section 2: Technical Flow ── */}
        <div className="space-y-5">
          <h3 className="font-mono font-bold text-slate-200 text-sm uppercase tracking-widest text-center">
            Technical Flow
          </h3>
          <div className="rounded-xl border border-white/5 bg-[#060709] p-6 overflow-x-auto">
            <pre className="font-mono text-xs leading-relaxed space-y-0">
{/* Request 1 */}
<span className="text-slate-600 select-none">  1  </span><span className="text-[#3b82f6]">→</span><span className="text-slate-300"> POST /api/v1/pdf/to-markdown</span>{"\n"}
<span className="text-slate-600 select-none">  2  </span><span className="text-slate-600">    Body: {"{"} &quot;url&quot;: &quot;https://example.com/document.pdf&quot; {"}"}</span>{"\n"}
<span className="text-slate-600 select-none">  3  </span>{"\n"}
{/* Response 402 */}
<span className="text-slate-600 select-none">  4  </span><span className="text-green-400">←</span><span className="text-slate-300"> 402 Payment Required</span>{"\n"}
<span className="text-slate-600 select-none">  5  </span><span className="text-slate-600">    Header: </span><span className="text-yellow-400">PAYMENT-REQUIRED</span><span className="text-slate-600">: &lt;base64 PaymentRequired&gt;</span>{"\n"}
<span className="text-slate-600 select-none">  6  </span><span className="text-slate-600">    Body: {"{"} scheme: &quot;exact&quot;, network: &quot;base&quot;, amount: &quot;50000&quot;, token: &quot;USDC&quot; {"}"}</span>{"\n"}
<span className="text-slate-600 select-none">  7  </span>{"\n"}
{/* Request 2 */}
<span className="text-slate-600 select-none">  8  </span><span className="text-[#3b82f6]">→</span><span className="text-slate-300"> POST /api/v1/pdf/to-markdown</span>{"\n"}
<span className="text-slate-600 select-none">  9  </span><span className="text-slate-600">    Header: </span><span className="text-yellow-400">PAYMENT-SIGNATURE</span><span className="text-slate-600">: &lt;base64 signed payment&gt;</span>{"\n"}
<span className="text-slate-600 select-none"> 10  </span><span className="text-slate-600">    Body: {"{"} &quot;url&quot;: &quot;https://example.com/document.pdf&quot; {"}"}</span>{"\n"}
<span className="text-slate-600 select-none"> 11  </span>{"\n"}
{/* Response 200 */}
<span className="text-slate-600 select-none"> 12  </span><span className="text-green-400">←</span><span className="text-green-400"> 200 OK</span>{"\n"}
<span className="text-slate-600 select-none"> 13  </span><span className="text-slate-600">    Header: </span><span className="text-yellow-400">PAYMENT-RESPONSE</span><span className="text-slate-600">: &lt;base64 settlement&gt;</span>{"\n"}
<span className="text-slate-600 select-none"> 14  </span><span className="text-slate-600">    Body: {"{"} &quot;result&quot;: {"{"} &quot;content&quot;: &quot;# Document...&quot; {"}"} {"}"}</span>
            </pre>
          </div>
          <div className="flex items-center justify-center gap-6 font-mono text-[10px] text-slate-600 uppercase tracking-wider">
            <span><span className="text-[#3b82f6] mr-1">→</span> Client Request</span>
            <span><span className="text-green-400 mr-1">←</span> Server Response</span>
            <span><span className="text-yellow-400 mr-1">■</span> x402 Headers</span>
          </div>
        </div>

        {/* ── Section 3: Stats Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
          {[
            { value: "75M+", label: "Transactions" },
            { value: "$24M+", label: "Volume" },
            { value: "94K+", label: "Buyers" },
            { value: "Zero", label: "Protocol Fees" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0d0f17] px-6 py-6 text-center space-y-1">
              <p className="font-mono font-black text-2xl text-[#3b82f6] tracking-wider">{stat.value}</p>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Section 4: Why x402 for File Conversion ── */}
        <div className="space-y-8">
          <h3 className="font-mono font-bold text-slate-200 text-sm uppercase tracking-widest text-center">
            Why x402 for File Conversion
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Zero Friction",
                body: "No accounts, no API keys, no KYC. Agent sends request, pays, gets result.",
              },
              {
                title: "Zero Fees",
                body: "x402 is free for buyer and seller. Only nominal Base network gas fees.",
              },
              {
                title: "Zero Trust Required",
                body: "Payment verified on-chain. No chargebacks, no fraud, no disputes.",
              },
              {
                title: "Zero Wait",
                body: "Payment settles in seconds on Base. File conversion starts immediately.",
              },
              {
                title: "Zero Centralization",
                body: "Open standard by Coinbase. Anyone can build on x402.",
              },
              {
                title: "Universal",
                body: "Works with any wallet, any agent framework, any language (JS, Python, Go).",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-white/5 bg-[#0d0f17] p-5 space-y-2"
              >
                <h4 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider">
                  {card.title}
                </h4>
                <p className="font-mono text-slate-500 text-xs leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
