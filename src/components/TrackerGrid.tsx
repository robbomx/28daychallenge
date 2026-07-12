import { useNavigate } from "react-router-dom";
import type { DayStatus } from "../types";
import { workoutPlan } from "../data/workoutPlan";
import type { Phase } from "../types";

interface Props {
  currentDay: number;
  getStatus: (dayNumber: number) => DayStatus;
  onSelect?: (dayNumber: number) => void;
}

const phaseAccent: Record<Phase, string> = {
  Foundation: "bg-op-olive-light",
  Intensity: "bg-op-orange",
  Hardening: "bg-op-error",
  "Chiseled Phase": "bg-op-sand",
};

const statusStyles: Record<DayStatus, string> = {
  locked: "bg-op-charcoal border-op-line text-op-off-white-dim/30 cursor-not-allowed",
  available: "bg-op-panel border-op-orange text-op-off-white hover:bg-op-olive-dark hover:-translate-y-0.5 cursor-pointer",
  completed: "bg-op-success/15 border-op-success text-op-success hover:-translate-y-0.5 cursor-pointer",
  missed: "bg-op-error/10 border-op-error text-op-error hover:-translate-y-0.5 cursor-pointer",
  recovery: "bg-op-olive-dark border-op-olive-light text-op-olive-light hover:-translate-y-0.5 cursor-pointer",
};

function StatusIcon({ status }: { status: DayStatus }) {
  switch (status) {
    case "completed":
      return (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M2 8.5L6 12.5L14 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
        </svg>
      );
    case "locked":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="7" width="10" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "recovery":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2C8 2 4 5 4 9a4 4 0 0 0 8 0c0-1.2-.6-2.1-1.2-3 .1 1-.3 1.8-1 2.2C10.4 5.6 8 4.5 8 2Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "missed":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
      );
    default:
      return null;
  }
}

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

  const weeks = [1, 2, 3, 4];

  return (
    <div>
      {weeks.map((week) => {
        const days = workoutPlan.filter((d) => d.week === week);
        const phase = days[0]?.phase;
        const completedInWeek = days.filter((d) => getStatus(d.dayNumber) === "completed").length;

        return (
          <div key={week} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 ${phase ? phaseAccent[phase] : "bg-op-orange"}`} />
                <h3 className="font-display text-lg text-op-off-white">
                  Week {week} — {phase}
                </h3>
              </div>
              <span className="mono-label text-[11px] text-op-off-white-dim">
                {completedInWeek}/{days.length} complete
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
              {days.map((day) => {
                const status = getStatus(day.dayNumber);
                const isToday = day.dayNumber === currentDay;
                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => handleClick(day.dayNumber, status)}
                    disabled={status === "locked"}
                    className={`relative aspect-square border flex flex-col overflow-hidden transition-all duration-150 ${statusStyles[status]} ${
                      isToday ? "ring-2 ring-op-orange ring-offset-2 ring-offset-op-black" : ""
                    }`}
                    title={`Day ${day.dayNumber} — ${day.title}`}
                  >
                    <span className={`h-1 w-full ${phaseAccent[day.phase]} opacity-70`} />
                    <div className="flex-1 flex flex-col items-center justify-center gap-1 px-1">
                      <span className="font-display text-lg sm:text-xl leading-none">{day.dayNumber}</span>
                      <StatusIcon status={status} />
                    </div>
                    {isToday && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-op-orange" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-4 mt-2 text-xs mono-label text-op-off-white-dim">
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
