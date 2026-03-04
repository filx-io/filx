"use client";

import { useEffect, useState } from "react";

const LINES = [
  { text: "$ # FilX — x402 File Conversion", color: "text-slate-500", delay: 0 },
  { text: "$ curl -X POST https://api.filx.io/api/v1/image/resize \\", color: "text-slate-300", delay: 400 },
  { text: "    -H \"Content-Type: application/json\" \\", color: "text-slate-300", delay: 700 },
  { text: "    -d '{\"url\": \"https://example.com/photo.jpg\", \"width\": 800}'", color: "text-slate-300", delay: 1000 },
  { text: "", color: "", delay: 1400 },
  { text: "HTTP/1.1 402 Payment Required", color: "text-yellow-400", delay: 1800 },
  { text: "PAYMENT-REQUIRED: eyJzY2hlbWUiOiJleGFjdCIsIm5ldHdvcmsiOiJiYXNl...", color: "text-yellow-300", delay: 2100 },
  { text: "{", color: "text-slate-400", delay: 2400 },
  { text: "  \"amount\": \"0.001\",", color: "text-slate-400", delay: 2500 },
  { text: "  \"currency\": \"USDC\",", color: "text-slate-400", delay: 2600 },
  { text: "  \"recipient\": \"0x742d...8e1f\",", color: "text-slate-400", delay: 2700 },
  { text: "  \"network\": \"base\",", color: "text-slate-400", delay: 2800 },
  { text: "  \"scheme\": \"exact\"", color: "text-slate-400", delay: 2900 },
  { text: "}", color: "text-slate-400", delay: 3000 },
  { text: "", color: "", delay: 3300 },
  { text: "$ # Agent signs USDC payment on Base and resends...", color: "text-slate-500", delay: 3600 },
  { text: "", color: "", delay: 4000 },
  { text: "HTTP/1.1 200 OK", color: "text-green-400", delay: 4400 },
  { text: "PAYMENT-RESPONSE: eyJ0eEhhc2giOiIweGFiY2QiLCJzZXR0bGVk...", color: "text-green-300", delay: 4700 },
  { text: "{", color: "text-slate-400", delay: 5000 },
  { text: "  \"status\": \"completed\",", color: "text-slate-400", delay: 5100 },
  { text: "  \"output_url\": \"https://api.filx.io/files/abc123.jpg\",", color: "text-slate-400", delay: 5200 },
  { text: "  \"processing_time_ms\": 847,", color: "text-slate-400", delay: 5300 },
  { text: "  \"cost\": \"$0.001 USDC\"", color: "text-green-400", delay: 5400 },
  { text: "}", color: "text-slate-400", delay: 5500 },
];

export function TerminalDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Start after a short initial delay
    const startTimer = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
      }, LINES[i].delay);
      timers.push(t);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [started]);

  return (
    <section className="py-16 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
            // live demo
          </p>
          <h2 className="font-mono font-black text-slate-200 text-xl uppercase tracking-widest">
            Watch a Real x402 Interaction
          </h2>
        </div>

        {/* Terminal window */}
        <div className="border border-white/10 bg-[#0a0c14] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#0d0f17]">
            <span className="w-3 h-3 rounded-full bg-red-500/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/60 inline-block" />
            <span className="ml-4 font-mono text-xs text-slate-600">filx-agent — bash</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 min-h-[420px] overflow-x-auto">
            <div className="space-y-[2px]">
              {LINES.slice(0, visibleCount).map((line, i) => (
                <div key={i} className="flex">
                  <pre className={`font-mono text-xs leading-relaxed whitespace-pre ${line.color || "text-slate-500"}`}>
                    {line.text}
                  </pre>
                  {/* Cursor on last visible line */}
                  {i === visibleCount - 1 && visibleCount < LINES.length && (
                    <span className="font-mono text-xs text-slate-300 animate-pulse ml-0.5">█</span>
                  )}
                </div>
              ))}
              {visibleCount >= LINES.length && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-green-400 border border-green-400/30 px-2 py-0.5">
                    ✓ CONVERSION COMPLETE
                  </span>
                  <span className="font-mono text-[10px] text-slate-600">847ms · $0.001 USDC</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="font-mono text-xs text-slate-600 text-center">
          The entire flow — request, payment negotiation, settlement, delivery — in under 1 second.
        </p>
      </div>
    </section>
  );
}
