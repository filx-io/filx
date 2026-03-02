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
    <div className="rounded-md border border-green-900/30 bg-green-950/10 overflow-hidden space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-5 border-b border-green-900/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <p className="font-mono font-semibold text-slate-200 text-sm">Conversion Complete</p>
            <p className="font-mono text-xs text-slate-500">
              {job.cost && `Paid ${job.cost.usd} USDC · `}
              {job.result?.format?.toUpperCase()} output
            </p>
          </div>
        </div>

        {/* Expiry */}
        {job.expires_at && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            Expires {new Date(job.expires_at).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Content preview */}
      {content && (
        <div className="max-h-64 overflow-y-auto p-5">
          <pre className="font-mono text-xs text-slate-400 whitespace-pre-wrap break-words leading-relaxed">
            {content.slice(0, 2000)}{content.length > 2000 ? "\n\n… (truncated, download for full)" : ""}
          </pre>
        </div>
      )}

      {/* Metadata */}
      {job.result?.metadata && Object.keys(job.result.metadata).length > 0 && (
        <div className="border-t border-white/[0.04] px-5 py-3 flex flex-wrap gap-4">
          {Object.entries(job.result.metadata).map(([k, v]) => (
            <div key={k} className="font-mono text-xs">
              <span className="text-slate-600">{k}:</span>{" "}
              <span className="text-slate-300">{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-white/[0.04] p-4 flex flex-wrap gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#3b82f6] text-white font-mono text-xs font-medium hover:bg-[#2563eb] transition-colors"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        {content && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-white/[0.08] text-slate-300 hover:border-white/[0.16] font-mono text-xs font-medium transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        )}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-white/[0.06] text-slate-500 hover:text-slate-300 font-mono text-xs transition-colors ml-auto"
        >
          <RefreshCw className="w-4 h-4" /> Convert Another
        </button>
      </div>
    </div>
  );
}
