import Card from "./Card";
import Badge from "./Badge";
import ProgressRing from "./ProgressRing";
import { getDayData } from "../data/workoutPlan";
import { CheckIcon } from "./LandingIcons";

const difficultyTone: Record<string, "success" | "warning" | "orange" | "error"> = {
  Low: "success",
  Moderate: "warning",
  High: "orange",
  Peak: "error",
};

// Real Day 1 data and the same components used inside the actual app —
// this is a genuine preview of the product, not a stock photo or invented UI.
export default function ProductPreview() {
  const day1 = getDayData(1);

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Card variant="panel" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="mono-label text-xs text-op-off-white-dim">Your Progress</p>
          <Badge tone="neutral">Day 6 of 28</Badge>
        </div>
        <div className="flex items-center gap-5">
          <ProgressRing percent={21} size={84} strokeWidth={8} label="21%" tone="orange" />
          <div>
            <p className="font-display text-3xl text-op-off-white leading-none">5</p>
            <p className="text-xs text-op-off-white-dim mt-1">day streak</p>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-5">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div
              key={d}
              className={`aspect-square rounded-sm border flex items-center justify-center text-[10px] mono-label ${
                d <= 5
                  ? "bg-op-success/15 border-op-success text-op-success"
                  : d === 6
                    ? "border-op-orange text-op-off-white ring-1 ring-op-orange"
                    : "border-op-line text-op-off-white-dim/40"
              }`}
            >
              {d <= 5 ? <CheckIcon size={11} /> : d}
            </div>
          ))}
        </div>
      </Card>

      {day1 && (
        <Card variant="panel" className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="mono-label text-xs text-op-orange">Day 01 / 28 · Week 1</p>
              <h4 className="font-display text-lg text-op-off-white mt-1">{day1.title}</h4>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge tone="neutral">{day1.duration}</Badge>
            <Badge tone={difficultyTone[day1.difficulty]}>{day1.difficulty}</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {day1.exercises.slice(0, 3).map((ex) => (
              <div key={ex.name} className="flex items-center justify-between text-xs border-b border-op-line pb-2">
                <span className="text-op-off-white">{ex.name}</span>
                <span className="mono-label text-op-off-white-dim">{ex.setsOrRounds}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
