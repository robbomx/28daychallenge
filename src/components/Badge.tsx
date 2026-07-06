import type { ReactNode } from "react";

type Tone = "olive" | "orange" | "sand" | "success" | "warning" | "error" | "neutral";

const toneClasses: Record<Tone, string> = {
  olive: "bg-op-olive-dark text-op-olive-light border-op-olive-light/40",
  orange: "bg-op-orange/10 text-op-orange-light border-op-orange/40",
  sand: "bg-op-sand/10 text-op-sand border-op-sand/40",
  success: "bg-op-success/10 text-op-success border-op-success/40",
  warning: "bg-op-warning/10 text-op-warning border-op-warning/40",
  error: "bg-op-error/10 text-op-error border-op-error/40",
  neutral: "bg-op-panel text-op-off-white-dim border-op-line",
};

export default function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`mono-label inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
