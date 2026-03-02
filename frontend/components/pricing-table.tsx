"use client";

import { useQuery } from "@tanstack/react-query";
import { getPricing } from "@/lib/api";

const LABELS: Record<string, string> = {
  pdf_to_markdown:     "PDF → Markdown",
  pdf_to_markdown_ocr: "PDF → Markdown (OCR)",
  ocr_image:           "OCR (image)",
  image_convert:       "Image Convert",
  image_bg_remove:     "Background Remove",
  table_extract:       "Table Extract",
  pdf_compress:        "PDF Compress",
  pdf_merge:           "PDF Merge",
  pdf_split:           "PDF Split",
  pdf_rotate:          "PDF Rotate",
  pdf_unlock:          "PDF Unlock",
  // Image tools
  image_resize:        "Image Resize",
  image_compress:      "Image Compress",
  image_crop:          "Image Crop",
  image_upscale:       "AI Upscale",
  image_watermark:     "Watermark",
  image_rotate:        "Rotate / Flip",
  // PDF → Image / conversions
  pdf_to_image:        "PDF → Image",
  html_to_pdf:         "HTML → PDF",
  markdown_to_pdf:     "Markdown → PDF",
};

export function PricingTable() {
  const { data: pricing, isLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: getPricing,
  });

  return (
    <section className="py-20 px-6 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-widest text-slate-200">
            Transparent Pricing
          </h2>
          <p className="font-mono text-slate-500 text-sm">
            Pay only for what you convert. No subscriptions. USDC on Base.
          </p>
        </div>

        <div className="rounded-md border border-white/[0.06] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
            <span>Operation</span>
            <span className="text-center">Price (USDC)</span>
            <span className="text-right">Unit</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-600 font-mono text-sm animate-pulse">
              Loading prices…
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {Object.entries(pricing?.prices ?? {}).map(([key, val]) => (
                <div
                  key={key}
                  className="grid grid-cols-3 items-center px-5 py-3 hover:bg-white/[0.02] transition-colors text-sm"
                >
                  <span className="font-mono text-slate-300">{LABELS[key] ?? key}</span>
                  <span className="text-center font-mono font-bold text-[#3b82f6]">${val.amount}</span>
                  <span className="text-right font-mono text-slate-500">{val.unit}</span>
                </div>
              ))}
            </div>
          )}

          {/* Discounts */}
          <div className="border-t border-white/[0.06] bg-white/[0.01] p-5 space-y-3">
            <div className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Volume Discounts
            </div>
            <div className="grid sm:grid-cols-3 gap-2 text-sm">
              {Object.entries(pricing?.discounts ?? {}).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border border-white/[0.06] rounded-md px-3 py-2"
                >
                  <span className="font-mono text-slate-500 text-xs capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="font-mono font-bold text-green-400 text-xs">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center font-mono text-xs text-slate-600">
          All prices in USDC (6 decimals) on Base mainnet (chain ID 8453). Minimum charge $0.001 per job.
        </p>
      </div>
    </section>
  );
}
