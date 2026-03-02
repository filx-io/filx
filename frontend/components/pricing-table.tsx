"use client";

import { useState, useEffect } from "react";
import { getPricing } from "@/lib/api";

const LABELS: Record<string, string> = {
  pdf_to_markdown:     "PDF → Markdown",
  pdf_to_markdown_ocr: "PDF → Markdown (OCR)",
  ocr_image:           "OCR (image)",
  image_convert:       "Image Convert",
  image_resize:        "Image Resize",
  image_compress:      "Image Compress",
  image_crop:          "Image Crop",
  image_bg_remove:     "Background Remove",
  image_upscale:       "AI Upscale",
  image_watermark:     "Watermark",
  image_rotate:        "Rotate / Flip",
  table_extract:       "Table Extract",
  pdf_compress:        "PDF Compress",
  pdf_merge:           "PDF Merge",
  pdf_split:           "PDF Split",
  pdf_rotate:          "PDF Rotate",
  pdf_unlock:          "PDF Unlock",
  pdf_to_image:        "PDF → Image",
  html_to_pdf:         "HTML → PDF",
  markdown_to_pdf:     "Markdown → PDF",
};

const FALLBACK_PRICES: Record<string, { amount: string; unit: string }> = {
  pdf_to_markdown:     { amount: "0.002", unit: "per page" },
  pdf_to_markdown_ocr: { amount: "0.004", unit: "per page" },
  ocr_image:           { amount: "0.003", unit: "per image" },
  image_convert:       { amount: "0.001", unit: "per image" },
  image_resize:        { amount: "0.001", unit: "per image" },
  image_compress:      { amount: "0.001", unit: "per image" },
  image_crop:          { amount: "0.001", unit: "per image" },
  image_bg_remove:     { amount: "0.005", unit: "per image" },
  image_upscale:       { amount: "0.008", unit: "per image" },
  image_watermark:     { amount: "0.001", unit: "per image" },
  image_rotate:        { amount: "0.001", unit: "per image" },
  table_extract:       { amount: "0.003", unit: "per page" },
  pdf_compress:        { amount: "0.002", unit: "per file" },
  pdf_merge:           { amount: "0.002", unit: "per merge" },
  pdf_split:           { amount: "0.002", unit: "per file" },
  pdf_rotate:          { amount: "0.001", unit: "per file" },
  pdf_unlock:          { amount: "0.003", unit: "per file" },
  pdf_to_image:        { amount: "0.002", unit: "per page" },
  html_to_pdf:         { amount: "0.002", unit: "per page" },
  markdown_to_pdf:     { amount: "0.002", unit: "per page" },
};

const FALLBACK_DISCOUNTS: Record<string, string> = {
  filx_token_holder: "50%",
  batch_5plus: "10%",
  batch_10plus: "20%",
};

export function PricingTable() {
  const [pricing, setPricing] = useState<{ prices: Record<string, { amount: string; unit: string }>; discounts: Record<string, string> } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPricing()
      .then((data) => setPricing(data))
      .catch(() => setPricing({ prices: FALLBACK_PRICES, discounts: FALLBACK_DISCOUNTS }))
      .finally(() => setIsLoading(false));
  }, []);

  const prices = pricing?.prices ?? FALLBACK_PRICES;
  const discounts = pricing?.discounts ?? FALLBACK_DISCOUNTS;

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
              {Object.entries(prices).map(([key, val]) => (
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

          <div className="border-t border-white/[0.06] bg-white/[0.01] p-5 space-y-3">
            <div className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Volume Discounts
            </div>
            <div className="grid sm:grid-cols-3 gap-2 text-sm">
              {Object.entries(discounts).map(([k, v]) => (
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
