import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentDay, markDayMissedRecovered } from "../lib/storage";
import type { DayStatus } from "../types";
import TrackerGrid from "../components/TrackerGrid";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Tracker() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [selectedMissedDay, setSelectedMissedDay] = useState<number | null>(null);

  if (!user) return null;
  const currentDay = getCurrentDay(user);

  const getStatus = (dayNumber: number): DayStatus => {
    const record = user.progress[dayNumber];
    if (record?.status === "completed") return "completed";
    if (dayNumber > currentDay) return "locked";
    if (dayNumber < currentDay && !record) return "missed";
    return "available";
  };

  const handleSelect = (dayNumber: number) => {
    const status = getStatus(dayNumber);
    if (status === "missed") {
      setSelectedMissedDay(dayNumber);
    } else {
      navigate(`/workout/${dayNumber}`);
    }
  };

  const handleRecoveryAction = (action: "recovered" | "restart") => {
    if (selectedMissedDay == null) return;
    setUser(markDayMissedRecovered(user, selectedMissedDay, action));
    setSelectedMissedDay(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <span className="mono-label text-xs text-op-orange">Accountability</span>
      <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2 mb-8">28 Day Tracker</h1>

      <TrackerGrid currentDay={currentDay} getStatus={getStatus} onSelect={handleSelect} />

      {selectedMissedDay != null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50" onClick={() => setSelectedMissedDay(null)}>
          <Card
            variant="panel"
            className="w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl text-op-off-white">Day {selectedMissedDay} was missed</h3>
            <p className="text-sm text-op-off-white-dim mt-2 mb-5">
              Choose how you want to handle it. Marking as recovered keeps your plan on schedule. Restarting resets
              the plan from this day forward.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="primary" fullWidth onClick={() => handleRecoveryAction("recovered")}>
                Mark as Recovered
              </Button>
              <Button variant="secondary" fullWidth onClick={() => handleRecoveryAction("restart")}>
                Restart From This Day
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setSelectedMissedDay(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
