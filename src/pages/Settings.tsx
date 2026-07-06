import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resetChallenge, updateNotifications } from "../lib/storage";
import { Field, SelectField } from "../components/AuthForm";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const [notifications, setNotifications] = useState(user.notifications);

  const handleSaveNotifications = () => {
    setUser(updateNotifications(user, notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setUser(resetChallenge(user));
    setConfirmingReset(false);
    navigate("/dashboard");
  };

  const handleDeleteAndLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="mono-label text-xs text-op-orange">Personnel File</span>
      <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2 mb-8">Profile & Settings</h1>

      <Card variant="panel" className="p-6 flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <p className="mono-label text-xs text-op-off-white-dim">Account</p>
          <Badge tone={user.paid ? "success" : "warning"}>{user.paid ? "Paid" : "Payment pending"}</Badge>
        </div>
        <Field id="firstName" label="Name" value={user.firstName} disabled />
        <Field id="email" label="Email" type="email" value={user.email} disabled />
        <SelectField id="fitnessLevel" label="Fitness Level" value={user.fitnessLevel} disabled>
          <option>{user.fitnessLevel}</option>
        </SelectField>
        <SelectField id="goal" label="Goal" value={user.goal} disabled>
          <option>{user.goal}</option>
        </SelectField>
        <div>
          <p className="mono-label text-xs text-op-off-white-dim mb-1">Challenge Start Date</p>
          <p className="text-sm text-op-off-white">{new Date(user.startDate).toLocaleDateString()}</p>
        </div>
        <p className="text-xs text-op-off-white-dim">
          Profile fields are managed by your account and aren't editable in this prototype yet.
        </p>
      </Card>

      <Card variant="panel" className="p-6 flex flex-col gap-3 mb-8">
        <h3 className="font-display text-lg text-op-off-white mb-1">Notification Preferences</h3>
        <ToggleRow
          label="Daily workout reminder"
          checked={notifications.dailyReminder}
          onChange={(v) => setNotifications({ ...notifications, dailyReminder: v })}
        />
        <ToggleRow
          label="Weekly milestone summary"
          checked={notifications.weeklyMilestone}
          onChange={(v) => setNotifications({ ...notifications, weeklyMilestone: v })}
        />
        <ToggleRow
          label="Streak alerts"
          checked={notifications.streakAlerts}
          onChange={(v) => setNotifications({ ...notifications, streakAlerts: v })}
        />
        <Button variant="primary" onClick={handleSaveNotifications} className="mt-2">
          {saved ? "Saved" : "Save Preferences"}
        </Button>
      </Card>

      <Card variant="outline" className="p-6 border-op-error/40">
        <h3 className="font-display text-lg text-op-error mb-1">Reset Challenge</h3>
        <p className="text-sm text-op-off-white-dim mb-4">
          This clears all tracked progress and restarts your 28 days from Day 1. This cannot be undone.
        </p>
        {confirmingReset ? (
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleReset}>
              Confirm Reset
            </Button>
            <Button variant="ghost" onClick={() => setConfirmingReset(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmingReset(true)}>
            Reset Challenge
          </Button>
        )}
      </Card>

      <button onClick={handleDeleteAndLogout} className="mono-label text-xs text-op-off-white-dim hover:text-op-error mt-8">
        Log out of this account
      </button>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm text-op-off-white-dim">{label}</span>
      <span
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-op-orange" : "bg-op-line"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-op-off-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </label>
  );
}
