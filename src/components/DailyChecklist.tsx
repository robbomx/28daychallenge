import type { DailyChecklistState } from "../types";

interface Props {
  checklist: DailyChecklistState;
  onToggle: (key: keyof DailyChecklistState) => void;
}

const items: { key: keyof DailyChecklistState; label: string }[] = [
  { key: "workoutCompleted", label: "Workout completed" },
  { key: "stepsCompleted", label: "Steps target hit" },
  { key: "waterCompleted", label: "Water target hit" },
  { key: "proteinTarget", label: "Protein target hit" },
  { key: "sleepTarget", label: "Sleep target hit" },
];

export default function DailyChecklist({ checklist, onToggle }: Props) {
  return (
    <ul className="flex flex-col divide-y divide-op-line">
      {items.map(({ key, label }) => {
        const checked = checklist[key];
        return (
          <li key={key}>
            <button
              onClick={() => onToggle(key)}
              className="w-full flex items-center gap-3 py-3 text-left group"
              aria-pressed={checked}
            >
              <span
                className={`flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-colors ${
                  checked
                    ? "bg-op-success/20 border-op-success text-op-success"
                    : "border-op-line text-transparent group-hover:border-op-off-white-dim"
                }`}
              >
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1.5 6.5L4.5 9.5L10.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                )}
              </span>
              <span className={`text-sm ${checked ? "text-op-off-white" : "text-op-off-white-dim"}`}>
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
