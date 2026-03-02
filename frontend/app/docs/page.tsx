"use client";
import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.filx.io"}/docs`;
  }, []);

  return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center font-mono text-slate-400">
      Redirecting to API docs…
    </div>
  );
}
