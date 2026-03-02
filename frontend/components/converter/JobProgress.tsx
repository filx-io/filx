"use client";

import { type JobResponse } from "@/lib/api";
import { Loader2, Clock, Cpu, CheckCircle2 } from "lucide-react";

interface Props { job: JobResponse | null }

const STEPS = [
  { status: "queued",     label: "In queue",    icon: Clock },
  { status: "processing", label: "Converting",  icon: Cpu },
  { status: "complete",   label: "Complete",    icon: CheckCircle2 },
];

export function JobProgress({ job }: Props) {
  const currentStep = job
    ? STEPS.findIndex((s) => s.status === job.status)
    : 0;

  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-8 space-y-8">
      {/* Animated spinner */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 opacity-30 animate-ping absolute inset-0" />
          <div className="relative w-14 h-14 rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#3b82f6] animate-spin" />
          </div>
        </div>
        <p className="font-mono font-semibold text-slate-200 text-sm">Converting your file…</p>
        {job?.job_id && (
          <p className="font-mono text-xs text-slate-600">{job.job_id}</p>
        )}
      </div>

      {/* Step progress */}
      <div className="flex items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = currentStep > i;
          const active = currentStep === i;
          return (
            <div key={step.status} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-md border transition-all
                    ${done   ? "border-green-500/40 bg-green-950/30 text-green-400" : ""}
                    ${active ? "border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]" : ""}
                    ${!done && !active ? "border-white/[0.06] text-slate-600" : ""}
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`font-mono text-xs ${active ? "text-slate-300" : "text-slate-600"}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-px mb-5 mx-2 transition-colors ${done ? "bg-green-500/40" : "bg-white/[0.06]"}`} />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center font-mono text-xs text-slate-600">
        This usually takes under 30 seconds.
      </p>
    </div>
  );
}
