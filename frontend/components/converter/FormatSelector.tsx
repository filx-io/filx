"use client";

import { type ConvertRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FormatOption {
  value: ConvertRequest["to"];
  label: string;
  description: string;
  badge?: string;
}

const ALL_FORMATS: FormatOption[] = [
  { value: "markdown", label: "Markdown",    description: "Structured text, headings & tables", badge: "RAG ⚡" },
  { value: "json",     label: "JSON",        description: "Machine-readable structured output" },
  { value: "text",     label: "Plain Text",  description: "Clean OCR text output" },
  { value: "csv",      label: "CSV",         description: "Table extraction" },
  { value: "png",      label: "PNG",         description: "Lossless image" },
  { value: "jpg",      label: "JPG",         description: "Compressed photo" },
  { value: "webp",     label: "WebP",        description: "Modern web format", badge: "Best" },
  { value: "pdf",      label: "PDF",         description: "Compressed / processed PDF" },
];

interface Props {
  value: ConvertRequest["to"];
  onChange: (v: ConvertRequest["to"]) => void;
  inputFile?: File;
  inputUrl?: string;
}

export function FormatSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Output Format</label>
      <div className="grid grid-cols-2 gap-2">
        {ALL_FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={cn(
              "relative text-left px-3 py-2.5 rounded-lg border text-sm transition-all",
              value === f.value
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border hover:border-primary/40 hover:bg-muted/50"
            )}
          >
            <div className="flex items-center justify-between gap-1">
              <span>{f.label}</span>
              {f.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold shrink-0">
                  {f.badge}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{f.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
