import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FliX — x402 File Converter for AI Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#08090d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Grid bg lines */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: 0.04 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 1, background: "#fff", width: "100%" }} />
          ))}
        </div>

        {/* Blue accent line top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#3b82f6" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "0 80px", textAlign: "center" }}>

          {/* Badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid rgba(59,130,246,0.4)", padding: "6px 20px",
            color: "#3b82f6", fontSize: 13, fontWeight: 700, letterSpacing: 4,
          }}>
            ✦ x402 PROTOCOL · BASE CHAIN · USDC
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: "#f1f5f9", letterSpacing: -2, lineHeight: 1, textTransform: "uppercase" }}>
              FliX
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3b82f6", letterSpacing: 4, textTransform: "uppercase" }}>
              File Converter for AI Agents
            </div>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 17, color: "#64748b", letterSpacing: 1, maxWidth: 700 }}>
            20 endpoints · No API keys · USDC micropayments on Base
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 48, marginTop: 8 }}>
            {[
              { val: "PDF → MD", label: "$0.002 / page" },
              { val: "OCR",      label: "$0.004 / page" },
              { val: "BG Remove",label: "$0.005 / image"},
              { val: "Upscale",  label: "$0.008 / image"},
            ].map((s) => (
              <div key={s.val} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#3b82f6" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 13, color: "#334155", letterSpacing: 2 }}>filx.io</div>
          <div style={{ fontSize: 12, color: "#334155", letterSpacing: 1 }}>Powered by x402 · Bankr · Base</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
