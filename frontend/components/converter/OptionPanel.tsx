"use client";

import { type ConvertRequest } from "@/lib/api";

interface Props {
  format: ConvertRequest["to"];
  options: ConvertRequest["options"];
  onChange: (opts: ConvertRequest["options"]) => void;
}

export function OptionPanel({ format, options, onChange }: Props) {
  const showOcr = ["markdown", "text", "json"].includes(format);
  const showLang = showOcr && options?.ocr;
  const showQuality = ["jpg", "webp"].includes(format);
  const showSize = ["png", "jpg", "webp", "avif"].includes(format);

  if (!showOcr && !showQuality && !showSize) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Options</label>
        <p className="text-sm text-muted-foreground">No extra options for this format.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Options</label>

      {showOcr && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!options?.ocr}
            onChange={(e) => onChange({ ...options, ocr: e.target.checked })}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm">Enable OCR <span className="text-muted-foreground">(for scanned PDFs/images)</span></span>
        </label>
      )}

      {showLang && (
        <div className="space-y-1 ml-7">
          <label className="text-xs text-muted-foreground">OCR Language</label>
          <select
            value={options?.language ?? "auto"}
            onChange={(e) => onChange({ ...options, language: e.target.value as "en" | "id" | "auto" })}
            className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="auto">Auto-detect</option>
            <option value="en">English</option>
            <option value="id">Indonesian (Bahasa)</option>
          </select>
        </div>
      )}

      {showQuality && (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Quality: {options?.quality ?? 85}%</label>
          <input
            type="range"
            min={10} max={100} step={5}
            value={options?.quality ?? 85}
            onChange={(e) => onChange({ ...options, quality: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      )}

      {showSize && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Max Width (px)</label>
            <input
              type="number"
              placeholder="Original"
              value={options?.width ?? ""}
              onChange={(e) => onChange({ ...options, width: Number(e.target.value) || undefined })}
              className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Max Height (px)</label>
            <input
              type="number"
              placeholder="Original"
              value={options?.height ?? ""}
              onChange={(e) => onChange({ ...options, height: Number(e.target.value) || undefined })}
              className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      )}
    </div>
  );
}
