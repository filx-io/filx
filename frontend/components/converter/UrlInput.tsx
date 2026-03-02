"use client";

import { Link2, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function UrlInput({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">File URL</label>
      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/document.pdf"
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
            placeholder:text-muted-foreground/50 transition"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Supports public URLs, S3 presigned URLs, and IPFS gateways
      </p>
    </div>
  );
}
