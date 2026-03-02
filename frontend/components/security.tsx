const items = [
  {
    icon: "🔒",
    title: "End-to-End Encrypted",
    body: "Files encrypted in transit and at rest. Your data never travels in plaintext.",
  },
  {
    icon: "🗑️",
    title: "Auto-Delete",
    body: "All files permanently deleted after 1 hour. No lingering copies, no storage logs.",
  },
  {
    icon: "🚫",
    title: "No Storage",
    body: "We never store your converted files long-term. Convert and it's gone.",
  },
  {
    icon: "🤖",
    title: "Fully Programmatic",
    body: "No human interaction required. Agents authenticate via on-chain payment — no accounts, no API keys, no humans in the loop.",
  },
  {
    icon: "⛓️",
    title: "On-Chain Payments",
    body: "Transparent, verifiable payments on Base. Every transaction is publicly auditable.",
  },
  {
    icon: "🔍",
    title: "Open Source",
    body: "Protocol and SDKs are open source. Audit the code, fork it, contribute.",
  },
];

export function Security() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono font-bold text-slate-200 text-2xl uppercase tracking-widest text-center mb-3">
          Security &amp; Privacy
        </h2>
        <p className="font-mono text-slate-500 text-sm text-center mb-12">
          Designed for agents. Zero human dependencies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-white/10 bg-[#0d0f17] p-6 flex gap-4"
            >
              <span className="text-2xl flex-shrink-0 leading-none mt-0.5">
                {item.icon}
              </span>
              <div className="space-y-1.5">
                <h3 className="font-mono font-bold text-slate-200 text-sm">
                  {item.title}
                </h3>
                <p className="font-mono text-slate-500 text-xs leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
