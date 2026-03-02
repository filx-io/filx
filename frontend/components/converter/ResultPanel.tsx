"use client";

import { type JobResponse } from "@/lib/api";
import { Download, Copy, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface Props {
  job: JobResponse;
  onReset: () => void;
}

export function ResultPanel({ job, onReset }: Props) {
  const content = job.result?.content;
  const downloadUrl = job.download_url;

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else if (content) {
      const ext = job.result?.format ?? "txt";
      const blob = new Blob([content], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `filx-result.${ext}`;
      a.click();
    }
  };

  return (
    <div className="rounded-2xl border border-green-500/30 bg-green-500/5 overflow-hidden space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-5 border-b border-green-500/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
          <div>
            <p className="font-semibold">Conversion Complete!</p>
            <p className="text-xs text-muted-foreground">
              {job.cost && `Paid ${job.cost.usd} USDC · `}
              {job.result?.format?.toUpperCase()} output
            </p>
          </div>
        </div>

        {/* Expiry */}
        {job.expires_at && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Clock className="w-3.5 h-3.5" />
            Expires {new Date(job.expires_at).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Content preview */}
      {content && (
        <div className="max-h-64 overflow-y-auto p-5">
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
            {content.slice(0, 2000)}{content.length > 2000 ? "\n\n… (truncated, download for full)" : ""}
          </pre>
        </div>
      )}

      {/* Metadata */}
      {job.result?.metadata && Object.keys(job.result.metadata).length > 0 && (
        <div className="border-t border-green-500/20 px-5 py-3 flex flex-wrap gap-4">
          {Object.entries(job.result.metadata).map(([k, v]) => (
            <div key={k} className="text-xs">
              <span className="text-muted-foreground">{k}:</span>{" "}
              <span className="font-medium">{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-green-500/20 p-4 flex flex-wrap gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg filx-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        {content && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        )}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm text-muted-foreground transition-colors ml-auto"
        >
          <RefreshCw className="w-4 h-4" /> Convert Another
        </button>
      </div>
    </div>
  );
}
