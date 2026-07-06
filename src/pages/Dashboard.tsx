import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { computeStreak, computeTotalCompleted, getCurrentDay, markWorkoutComplete, updateChecklist } from "../lib/storage";
import { getDayData } from "../data/workoutPlan";
import ProgressRing from "../components/ProgressRing";
import Card from "../components/Card";
import WorkoutCard from "../components/WorkoutCard";
import DailyChecklist from "../components/DailyChecklist";
import Badge from "../components/Badge";
import type { DailyChecklistState } from "../types";

const emptyChecklist: DailyChecklistState = {
  workoutCompleted: false,
  stepsCompleted: false,
  waterCompleted: false,
  proteinTarget: false,
  sleepTarget: false,
};

export default function Dashboard() {
  const { user, setUser } = useAuth();
  if (!user) return null;

  const currentDay = getCurrentDay(user);
  const today = getDayData(currentDay, user.fitnessLevel);
  const streak = computeStreak(user);
  const totalCompleted = computeTotalCompleted(user);
  const percent = Math.round((totalCompleted / 28) * 100);
  const todayRecord = user.progress[currentDay];
  const checklist = todayRecord?.checklist ?? emptyChecklist;
  const completedToday = todayRecord?.status === "completed";

  const handleToggle = (key: keyof DailyChecklistState) => {
    const next = { ...checklist, [key]: !checklist[key] };
    setUser(updateChecklist(user, currentDay, next));
  };

  const handleQuickComplete = () => {
    setUser(markWorkoutComplete(user, currentDay));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="mono-label text-xs text-op-orange">Welcome back</span>
          <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-1">
            {user.firstName}
          </h1>
        </div>
        <Badge tone="neutral">
          Day {currentDay} of 28 · {today?.phase}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <Card variant="panel" className="p-6 flex items-center gap-5">
          <ProgressRing percent={percent} size={96} strokeWidth={8} label={`${percent}%`} tone="orange" />
          <div>
            <p className="mono-label text-xs text-op-off-white-dim">Overall Progress</p>
            <p className="text-sm text-op-off-white mt-1">{totalCompleted} of 28 days complete</p>
          </div>
        </Card>
        <Card variant="panel" className="p-6 flex flex-col justify-center">
          <p className="mono-label text-xs text-op-off-white-dim">Workout Streak</p>
          <p className="font-display text-4xl text-op-off-white mt-2">{streak}</p>
          <p className="text-xs text-op-off-white-dim mt-1">consecutive days</p>
        </Card>
        <Card variant="panel" className="p-6 flex flex-col justify-center">
          <p className="mono-label text-xs text-op-off-white-dim">Total Workouts Completed</p>
          <p className="font-display text-4xl text-op-off-white mt-2">{totalCompleted}</p>
          <p className="text-xs text-op-off-white-dim mt-1">out of 28 scheduled</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {today && <WorkoutCard day={today} completed={completedToday} />}
        </div>
        <Card variant="panel" className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg text-op-off-white">Daily Checklist</h3>
            {completedToday && <Badge tone="success">Done</Badge>}
          </div>
          <p className="text-xs text-op-off-white-dim mb-3">Day {currentDay} accountability check-in</p>
          <DailyChecklist checklist={checklist} onToggle={handleToggle} />
          {!checklist.workoutCompleted && (
            <button
              onClick={handleQuickComplete}
              className="mono-label text-xs text-op-orange hover:underline mt-3"
            >
              Mark workout completed
            </button>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <Link to="/tracker" className="mono-label text-xs text-op-off-white-dim hover:text-op-orange underline underline-offset-4">
          View full 28 day tracker →
        </Link>
        <Link to="/nutrition" className="mono-label text-xs text-op-off-white-dim hover:text-op-orange underline underline-offset-4">
          Nutrition guidelines →
        </Link>
        <Link to="/photos" className="mono-label text-xs text-op-off-white-dim hover:text-op-orange underline underline-offset-4">
          Upload progress photo →
        </Link>
      </div>
    </div>
  );
}
