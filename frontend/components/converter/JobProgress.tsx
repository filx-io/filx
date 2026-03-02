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
    <div className="rounded-2xl border border-border bg-card p-8 space-y-8">
      {/* Animated spinner */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full filx-gradient opacity-20 animate-ping absolute inset-0" />
          <div className="relative w-16 h-16 rounded-full filx-gradient flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
        </div>
        <p className="font-semibold text-lg">Converting your file…</p>
        {job?.job_id && (
          <p className="text-xs text-muted-foreground font-mono">{job.job_id}</p>
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
                    flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all
                    ${done   ? "border-green-500 bg-green-500/10 text-green-500" : ""}
                    ${active ? "border-primary bg-primary/10 text-primary"        : ""}
                    ${!done && !active ? "border-border text-muted-foreground"    : ""}
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mb-5 mx-2 transition-colors ${done ? "bg-green-500" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        This usually takes under 30 seconds. Hang tight!
      </p>
    </div>
  );
}
