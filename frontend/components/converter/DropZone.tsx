"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif", ".tiff", ".bmp"],
  "text/plain": [".txt"],
};

interface Props {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}

export function DropZone({ file, onFile, onClear }: Props) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 1,
  });

  if (file) {
    return (
      <div className="relative flex items-center gap-4 p-4 rounded-md border border-[#3b82f6]/30 bg-[#3b82f6]/5">
        <div className="flex items-center justify-center w-10 h-10 rounded-md border border-white/[0.08]">
          <FileText className="w-5 h-5 text-[#3b82f6]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono font-medium text-slate-200 text-sm truncate">{file.name}</p>
          <p className="font-mono text-xs text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/[0.06] transition-colors"
          aria-label="Remove file"
        >
          <X className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-10 rounded-md border-2 border-dashed cursor-pointer transition-all duration-200",
        isDragActive && !isDragReject && "border-[#3b82f6]/50 bg-[#3b82f6]/5 dropzone-active",
        isDragReject && "border-red-500/40 bg-red-950/10",
        !isDragActive && !isDragReject && "border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-md border transition-colors",
          isDragActive ? "border-[#3b82f6]/40 bg-[#3b82f6]/10" : "border-white/[0.08] bg-white/[0.02]"
        )}
      >
        <Upload className={cn("w-5 h-5", isDragActive ? "text-[#3b82f6]" : "text-slate-600")} />
      </div>

      <div className="text-center space-y-1">
        <p className="font-mono font-semibold text-sm text-slate-300">
          {isDragReject
            ? "File type not supported"
            : isDragActive
            ? "Drop it!"
            : "Drop file or click to browse"}
        </p>
        <p className="font-mono text-xs text-slate-600">
          PDF, PNG, JPG, WebP, AVIF — up to 50 MB
        </p>
      </div>
    </div>
  );
}
