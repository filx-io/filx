"use client";

import { useQuery } from "@tanstack/react-query";
import { getPricing } from "@/lib/api";
import { Zap } from "lucide-react";

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
};

export function PricingTable() {
  const { data: pricing, isLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: getPricing,
  });

  return (
    <section className="py-20 px-4 border-t border-border/40 bg-muted/20">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">
            Pay only for what you convert. No subscriptions. USDC on Base.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 bg-muted/30 border-b border-border">
            <span>Operation</span>
            <span className="text-center">Price (USDC)</span>
            <span className="text-right">Unit</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading prices…</div>
          ) : (
            <div className="divide-y divide-border">
              {Object.entries(pricing?.prices ?? {}).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 items-center px-6 py-3.5 hover:bg-muted/30 transition-colors text-sm">
                  <span className="font-medium">{LABELS[key] ?? key}</span>
                  <span className="text-center font-mono font-bold text-primary">${val.amount}</span>
                  <span className="text-right text-muted-foreground">{val.unit}</span>
                </div>
              ))}
            </div>
          )}

          {/* Discounts */}
          <div className="border-t border-border bg-primary/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Zap className="w-4 h-4" /> Discounts
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {Object.entries(pricing?.discounts ?? {}).map(([k, v]) => (
                <div key={k} className="flex justify-between bg-background/50 rounded-lg px-3 py-2">
                  <span className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="font-bold text-green-500">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          All prices in USDC (6 decimals) on Base mainnet (chain ID 8453).
          Minimum charge $0.001 per job.
        </p>
      </div>
    </section>
  );
}
