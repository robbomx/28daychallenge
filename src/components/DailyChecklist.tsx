import type { DailyChecklistState } from "../types";

interface Props {
  checklist: DailyChecklistState;
}

// Read-only status display. Workout completion is set automatically when the
// person finishes a workout — there's nothing here for them to manually check.
export default function DailyChecklist({ checklist }: Props) {
  const checked = checklist.workoutCompleted;
  return (
    <div
      className={`flex items-center gap-3 py-3 border rounded-sm px-3 ${
        checked ? "bg-op-success/10 border-op-success/40" : "border-op-line"
      }`}
    >
      <span
        className={`flex-shrink-0 w-6 h-6 border flex items-center justify-center ${
          checked ? "bg-op-success/20 border-op-success text-op-success" : "border-op-line text-transparent"
        }`}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 6.5L4.5 9.5L10.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        )}
      </span>
      <span className={`text-sm ${checked ? "text-op-off-white" : "text-op-off-white-dim"}`}>
        {checked ? "Workout completed" : "Workout not completed yet"}
      </span>
    </div>
  );
}
