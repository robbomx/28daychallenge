import { Link } from "react-router-dom";
import type { WorkoutDay } from "../types";
import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";

const difficultyTone: Record<WorkoutDay["difficulty"], "success" | "warning" | "orange" | "error"> = {
  Low: "success",
  Moderate: "warning",
  High: "orange",
  Peak: "error",
};

export default function WorkoutCard({ day, completed = false }: { day: WorkoutDay; completed?: boolean }) {
  return (
    <Card variant="panel" className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="mono-label text-op-orange text-xs">
            Day {String(day.dayNumber).padStart(2, "0")} / 28 · Week {day.week}
          </span>
          <h3 className="font-display text-xl mt-1 text-op-off-white">{day.title}</h3>
        </div>
        {completed && <Badge tone="success">Complete</Badge>}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="neutral">{day.duration}</Badge>
        <Badge tone={difficultyTone[day.difficulty]}>{day.difficulty}</Badge>
        {day.isRecoveryDay && <Badge tone="olive">Recovery</Badge>}
      </div>

      <p className="text-sm text-op-off-white-dim leading-relaxed">{day.notes}</p>

      <Link to={`/workout/${day.dayNumber}`}>
        <Button variant={completed ? "secondary" : "primary"} fullWidth>
          {completed ? "Review Workout" : "Start Workout"}
        </Button>
      </Link>
    </Card>
  );
}
