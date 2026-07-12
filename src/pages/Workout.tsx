import { useState, type ReactNode } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDayData } from "../data/workoutPlan";
import { useAuth } from "../context/AuthContext";
import { markWorkoutComplete } from "../lib/storage";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { getFormVideoLink, shouldShowFormVideo } from "../data/exerciseVideos";

const difficultyTone: Record<string, "success" | "warning" | "orange" | "error"> = {
  Low: "success",
  Moderate: "warning",
  High: "orange",
  Peak: "error",
};

export default function Workout() {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [notes, setNotes] = useState("");

  const num = Number(dayNumber);
  const day = getDayData(num, user?.fitnessLevel ?? "Beginner");

  if (!day) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-op-off-white">Day not found</h1>
        <Link to="/tracker" className="text-op-orange text-sm hover:underline mt-4 inline-block">
          Back to tracker
        </Link>
      </div>
    );
  }

  const isCompleted = user?.progress[num]?.status === "completed";

  const handleComplete = () => {
    if (!user) return;
    setUser(markWorkoutComplete(user, num));
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/tracker" className="mono-label text-xs text-op-off-white-dim hover:text-op-orange">
        ← Back to Tracker
      </Link>

      <div className="mt-4 mb-8">
        <span className="mono-label text-xs text-op-orange">
          Day {String(day.dayNumber).padStart(2, "0")} / 28 · Week {day.week} · {day.phase}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2">{day.title}</h1>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge tone="neutral">{day.duration}</Badge>
          <Badge tone={difficultyTone[day.difficulty]}>{day.difficulty}</Badge>
          {day.isRecoveryDay && <Badge tone="olive">Recovery Day</Badge>}
          {isCompleted && <Badge tone="success">Completed</Badge>}
          {user && user.fitnessLevel !== "Beginner" && !day.isRecoveryDay && (
            <Badge tone="sand">Scaled for {user.fitnessLevel}</Badge>
          )}
        </div>
      </div>

      <Section title="Warm Up">
        <ul className="flex flex-col gap-2">
          {day.warmup.map((w, i) => (
            <li key={i} className="text-sm text-op-off-white-dim flex gap-3">
              <span className="text-op-orange">·</span> {w}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Main Workout">
        <div className="flex flex-col gap-3">
          {day.exercises.map((ex, i) => {
            const video = shouldShowFormVideo(ex.name) ? getFormVideoLink(ex.name) : null;
            return (
              <Card key={i} variant="panel" className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-display text-base text-op-off-white">{ex.name}</h4>
                  <span className="mono-label text-[11px] text-op-off-white-dim whitespace-nowrap">
                    {ex.setsOrRounds}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <InfoRow label="Reps / Time" value={ex.repsOrTime} />
                  <InfoRow label="Rest" value={ex.rest} />
                </div>
                <p className="text-xs text-op-off-white-dim mt-3">
                  <span className="text-op-sand">Modification:</span> {ex.modification}
                </p>
                <p className="text-xs text-op-off-white-dim mt-1">
                  <span className="text-op-sand">Intensity note:</span> {ex.intensityNote}
                </p>
                {video && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mono-label text-[11px] text-op-orange hover:underline mt-3"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M6.5 6L10.5 8L6.5 10V6Z" fill="currentColor" />
                    </svg>
                    Watch form video
                  </a>
                )}
              </Card>
            );
          })}
        </div>
      </Section>

      {day.finisher.length > 0 && (
        <Section title="Finisher">
          <ul className="flex flex-col gap-2">
            {day.finisher.map((f, i) => (
              <li key={i} className="text-sm text-op-off-white-dim flex gap-3">
                <span className="text-op-orange">·</span> {f}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Cooldown">
        <ul className="flex flex-col gap-2">
          {day.cooldown.map((c, i) => (
            <li key={i} className="text-sm text-op-off-white-dim flex gap-3">
              <span className="text-op-orange">·</span> {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Field Notes">
        <p className="text-sm text-op-off-white-dim leading-relaxed">{day.notes}</p>
      </Section>

      <Section title="Your Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did today feel? Track anything worth remembering for next time."
          rows={3}
          className="w-full bg-op-panel border border-op-line focus:border-op-orange rounded-sm px-3 py-2.5 text-sm text-op-off-white outline-none placeholder:text-op-off-white-dim/50"
        />
      </Section>

      <Button variant={isCompleted ? "secondary" : "primary"} fullWidth size="lg" onClick={handleComplete} className="mt-4">
        {isCompleted ? "Workout Already Completed" : "Complete Workout"}
      </Button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="mono-label text-xs text-op-off-white-dim mb-3 pb-2 border-b border-op-line">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono-label text-[10px] text-op-off-white-dim">{label}</p>
      <p className="text-op-off-white mt-0.5">{value}</p>
    </div>
  );
}
