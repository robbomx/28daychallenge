interface ProgressRingProps {
  percent: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  tone?: "orange" | "olive" | "sand";
}

const toneColor: Record<string, string> = {
  orange: "var(--color-op-orange)",
  olive: "var(--color-op-olive-light)",
  sand: "var(--color-op-sand)",
};

export default function ProgressRing({
  percent,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  tone = "orange",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  // tick marks around the dial, like a compass / field instrument
  const ticks = Array.from({ length: 28 }, (_, i) => i);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-op-line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={toneColor[tone]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <svg width={size} height={size} className="absolute inset-0">
        {ticks.map((i) => {
          const angle = (i / 28) * 2 * Math.PI - Math.PI / 2;
          const r1 = radius + strokeWidth / 2 + 2;
          const r2 = radius + strokeWidth / 2 + 6;
          const x1 = center + r1 * Math.cos(angle);
          const y1 = center + r1 * Math.sin(angle);
          const x2 = center + r2 * Math.cos(angle);
          const y2 = center + r2 * Math.sin(angle);
          const passed = i <= (clamped / 100) * 28;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={passed ? toneColor[tone] : "var(--color-op-line)"}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        {label && <span className="font-display text-3xl leading-none text-op-off-white">{label}</span>}
        {sublabel && <span className="mono-label text-[10px] text-op-off-white-dim mt-1">{sublabel}</span>}
      </div>
    </div>
  );
}
