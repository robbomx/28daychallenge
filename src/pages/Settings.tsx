import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getToken, resetChallenge, updateNotifications } from "../lib/storage";
import { changePassword, updateProfile } from "../lib/api";
import { Field, SelectField } from "../components/AuthForm";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import type { FitnessLevel, Goal } from "../types";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  if (!user) return null;

  const [notifications, setNotifications] = useState(user.notifications);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(user.fitnessLevel);
  const [goal, setGoal] = useState<Goal>(user.goal);

  const handleSaveNotifications = () => {
    setUser(updateNotifications(user, notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveProfile = async () => {
    setProfileError("");
    const token = getToken();
    if (!token) {
      setProfileError("You've been logged out. Log back in and try again.");
      return;
    }
    setProfileSaving(true);
    try {
      const { user: updated } = await updateProfile(token, { fitnessLevel, goal });
      setUser({ ...user, fitnessLevel: updated.fitnessLevel, goal: updated.goal });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleReset = () => {
    setUser(resetChallenge(user));
    setConfirmingReset(false);
    navigate("/dashboard");
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!currentPassword || !newPassword) {
      setPasswordError("Fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    const token = getToken();
    if (!token) {
      setPasswordError("You've been logged out. Log back in and try again.");
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword(token, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
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
        <SelectField
          id="fitnessLevel"
          label="Fitness Level"
          value={fitnessLevel}
          onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </SelectField>
        <SelectField id="goal" label="Goal" value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
          <option>Lose fat</option>
          <option>Build muscle</option>
          <option>Improve discipline</option>
          <option>Improve fitness</option>
          <option>Restart routine</option>
        </SelectField>
        <div>
          <p className="mono-label text-xs text-op-off-white-dim mb-1">Challenge Start Date</p>
          <p className="text-sm text-op-off-white">{new Date(user.startDate).toLocaleDateString()}</p>
        </div>
        <p className="text-xs text-op-off-white-dim">
          Name and email aren't editable yet. Fitness level and goal can be updated below.
        </p>
        {profileError && <p className="text-sm text-op-error">{profileError}</p>}
        <Button variant="primary" onClick={handleSaveProfile} disabled={profileSaving}>
          {profileSaving ? "Saving…" : profileSaved ? "Saved" : "Save Changes"}
        </Button>
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

      <Card variant="panel" className="p-6 flex flex-col gap-4 mb-8">
        <h3 className="font-display text-lg text-op-off-white mb-1">Change Password</h3>
        <Field
          id="currentPassword"
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Field
          id="newPassword"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        <Field
          id="confirmNewPassword"
          label="Confirm New Password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        {passwordError && <p className="text-sm text-op-error">{passwordError}</p>}
        <Button variant="primary" onClick={handleChangePassword} disabled={passwordSaving}>
          {passwordSaving ? "Saving…" : passwordSaved ? "Password Updated" : "Change Password"}
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
