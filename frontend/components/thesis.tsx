export function Thesis() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Label */}
        <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
          // the thesis
        </p>

        {/* Heading */}
        <h2 className="font-mono font-black text-slate-200 text-3xl md:text-4xl uppercase tracking-widest leading-tight">
          The Bottleneck Is Files
        </h2>

        {/* Narrative */}
        <div className="space-y-6 font-mono text-slate-400 text-sm md:text-base leading-relaxed">
          <p>
            AI agents are getting smarter every week. They can browse the web, write code,
            send emails, and manage databases. But ask an agent to convert a PDF to Markdown,
            resize an image, or extract a table — and it hits a wall.
          </p>

          <p>
            The traditional approach: sign up for an API, manage keys, buy credits, handle rate limits.{" "}
            <strong className="text-slate-200">
              That&apos;s human infrastructure. Agents need machine infrastructure.
            </strong>
          </p>

          <p>
            FiLX solves this with one principle:{" "}
            <strong className="text-[#3b82f6]">HTTP 402</strong>. The same status code that&apos;s
            been reserved since 1997 for &ldquo;Payment Required&rdquo; — finally implemented,
            by Coinbase&apos;s x402 protocol.
          </p>

          <div className="border-l-2 border-[#3b82f6] pl-5 py-2">
            <p className="text-slate-200 font-bold">
              The agent sends a request. The server says &ldquo;pay me.&rdquo; The agent pays.
              The server delivers.
            </p>
            <p className="text-slate-500 text-sm mt-1">
              No accounts. No keys. No humans in the loop.
            </p>
          </div>

          <p>
            This is how the internet should have worked from the beginning.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
          {[
            { val: "20+", label: "API Endpoints" },
            { val: "$0.001", label: "Avg Cost / Op" },
            { val: "~1s", label: "Median Latency" },
          ].map((s) => (
            <div key={s.label} className="text-center space-y-1">
              <div className="font-mono font-black text-[#3b82f6] text-2xl">{s.val}</div>
              <div className="font-mono text-slate-600 text-[10px] uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
