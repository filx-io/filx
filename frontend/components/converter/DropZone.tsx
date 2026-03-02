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
      <div className="relative flex items-center gap-4 p-5 rounded-xl border-2 border-primary/40 bg-primary/5">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
        isDragActive && !isDragReject && "border-primary bg-primary/5 dropzone-active",
        isDragReject && "border-destructive bg-destructive/5",
        !isDragActive && !isDragReject && "border-border hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-2xl transition-colors",
          isDragActive ? "bg-primary/20" : "bg-muted"
        )}
      >
        <Upload className={cn("w-7 h-7", isDragActive ? "text-primary" : "text-muted-foreground")} />
      </div>

      <div className="text-center space-y-1">
        <p className="font-semibold text-base">
          {isDragReject
            ? "File type not supported"
            : isDragActive
            ? "Drop it!"
            : "Drop file or click to browse"}
        </p>
        <p className="text-sm text-muted-foreground">
          PDF, PNG, JPG, WebP, AVIF — up to 50 MB
        </p>
      </div>
    </div>
  );
}
