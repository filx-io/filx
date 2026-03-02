const rows = [
  {
    input: "PDF",
    outputs: ["Markdown", "JSON", "Text", "CSV"],
  },
  {
    input: "PNG / JPG / WebP",
    outputs: ["PNG", "JPG", "WebP", "AVIF"],
  },
  {
    input: "Scanned PDF",
    outputs: ["Text (OCR)", "Markdown (OCR)"],
  },
  {
    input: "Tables",
    outputs: ["CSV", "JSON"],
  },
];

export function SupportedFormats() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono font-bold text-slate-200 text-2xl uppercase tracking-widest text-center mb-4">
          Supported Formats
        </h2>
        <p className="font-mono text-slate-500 text-sm text-center mb-12">
          11+ conversion types. More added regularly.
        </p>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-[#0d0f17]">
                <th className="font-mono font-bold text-slate-400 text-xs uppercase tracking-widest text-left px-6 py-4">
                  Input
                </th>
                <th className="font-mono font-bold text-slate-400 text-xs uppercase tracking-widest text-left px-6 py-4">
                  Output Formats
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/5 last:border-0 ${
                    i % 2 === 0 ? "bg-[#08090d]" : "bg-[#0d0f17]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-200 text-sm">
                      {row.input}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {row.outputs.map((fmt) => (
                        <span
                          key={fmt}
                          className="font-mono text-xs text-blue-400 border border-blue-400/20 bg-blue-400/5 px-2 py-0.5 rounded"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
