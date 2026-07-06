import { useNavigate } from "react-router-dom";
import type { DayStatus } from "../types";
import { workoutPlan } from "../data/workoutPlan";

interface Props {
  currentDay: number;
  getStatus: (dayNumber: number) => DayStatus;
  onSelect?: (dayNumber: number) => void;
}

const statusStyles: Record<DayStatus, string> = {
  locked: "bg-op-charcoal border-op-line text-op-off-white-dim/40 cursor-not-allowed",
  available: "bg-op-panel border-op-orange text-op-off-white hover:bg-op-olive-dark cursor-pointer",
  completed: "bg-op-success/15 border-op-success text-op-success cursor-pointer",
  missed: "bg-op-error/10 border-op-error text-op-error cursor-pointer",
  recovery: "bg-op-olive-dark border-op-olive-light text-op-olive-light cursor-pointer",
};

const statusLabel: Record<DayStatus, string> = {
  locked: "Locked",
  available: "Available",
  completed: "Completed",
  missed: "Missed",
  recovery: "Recovery",
};

export default function TrackerGrid({ currentDay, getStatus, onSelect }: Props) {
  const navigate = useNavigate();

  const handleClick = (dayNumber: number, status: DayStatus) => {
    if (status === "locked") return;
    if (onSelect) {
      onSelect(dayNumber);
    } else {
      navigate(`/workout/${dayNumber}`);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
        {workoutPlan.map((day) => {
          const status = getStatus(day.dayNumber);
          const isToday = day.dayNumber === currentDay;
          return (
            <button
              key={day.dayNumber}
              onClick={() => handleClick(day.dayNumber, status)}
              disabled={status === "locked"}
              className={`relative aspect-square border flex flex-col items-center justify-center gap-0.5 transition-colors ${statusStyles[status]} ${isToday ? "ring-2 ring-op-orange ring-offset-2 ring-offset-op-black" : ""}`}
              title={`Day ${day.dayNumber} — ${statusLabel[status]}`}
            >
              <span className="mono-label text-[10px] opacity-70">D{String(day.dayNumber).padStart(2, "0")}</span>
              {status === "completed" && (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M1.5 6.5L4.5 9.5L10.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              )}
              {status === "recovery" && <span className="text-[9px] mono-label">REST</span>}
              {status === "missed" && <span className="text-[9px] mono-label">MISSED</span>}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 mt-6 text-xs mono-label text-op-off-white-dim">
        <LegendItem swatch="bg-op-panel border-op-orange" text="Available" />
        <LegendItem swatch="bg-op-success/15 border-op-success" text="Completed" />
        <LegendItem swatch="bg-op-error/10 border-op-error" text="Missed" />
        <LegendItem swatch="bg-op-olive-dark border-op-olive-light" text="Recovery" />
        <LegendItem swatch="bg-op-charcoal border-op-line" text="Locked" />
      </div>
    </div>
  );
}

function LegendItem({ swatch, text }: { swatch: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`w-3 h-3 border inline-block ${swatch}`} />
      {text}
    </span>
  );
}
