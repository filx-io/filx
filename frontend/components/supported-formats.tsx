const INPUT_FORMATS = [
  "PNG", "JPG", "JPEG", "WebP", "AVIF", "GIF", "BMP", "TIFF", "SVG", "ICO",
  "PDF", "HTML", "Markdown",
];

const OUTPUT_FORMATS = [
  "PNG", "JPG", "WebP", "AVIF", "ICO",
  "PDF", "Markdown", "Text", "CSV", "JSON",
];

const rows = [
  {
    input: "Images (PNG / JPG / WebP / AVIF)",
    outputs: ["PNG", "JPG", "WebP", "AVIF", "ICO"],
  },
  {
    input: "PNG / SVG / BMP / TIFF / GIF",
    outputs: ["PNG", "JPG", "WebP", "AVIF"],
  },
  {
    input: "PDF (digital)",
    outputs: ["Markdown", "Text", "JSON", "PNG", "JPG"],
  },
  {
    input: "PDF (scanned / OCR)",
    outputs: ["Text", "Markdown", "JSON"],
  },
  {
    input: "Images with text (OCR)",
    outputs: ["Text", "JSON"],
  },
  {
    input: "PDFs / Images (tables)",
    outputs: ["CSV", "JSON"],
  },
  {
    input: "HTML / URL",
    outputs: ["PDF"],
  },
  {
    input: "Markdown",
    outputs: ["PDF"],
  },
];

export function SupportedFormats() {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-mono font-bold text-slate-200 text-2xl uppercase tracking-widest">
            Supported Formats
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            20+ conversion types across images, documents, and data.
          </p>
        </div>

        {/* Format pills overview */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-lg border border-white/10 bg-[#0d0f17] p-5 space-y-3">
            <h3 className="font-mono font-bold text-xs text-slate-400 uppercase tracking-widest">
              Input Formats
            </h3>
            <div className="flex flex-wrap gap-2">
              {INPUT_FORMATS.map((fmt) => (
                <span
                  key={fmt}
                  className="font-mono text-xs text-slate-300 border border-white/10 bg-[#08090d] px-2 py-0.5 rounded"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0d0f17] p-5 space-y-3">
            <h3 className="font-mono font-bold text-xs text-slate-400 uppercase tracking-widest">
              Output Formats
            </h3>
            <div className="flex flex-wrap gap-2">
              {OUTPUT_FORMATS.map((fmt) => (
                <span
                  key={fmt}
                  className="font-mono text-xs text-blue-400 border border-blue-400/20 bg-blue-400/5 px-2 py-0.5 rounded"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed conversion table */}
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
