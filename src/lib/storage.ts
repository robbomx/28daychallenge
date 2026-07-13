import type { AppUser, DailyChecklistState, LocalUserRecord, PhotoRecord, ProgressRecord } from "../types";
import type { BackendUser } from "./api";
import { syncProgress } from "./api";

const TOKEN_KEY = "standard28_token";
const ADMIN_TOKEN_KEY = "standard28_admin_token";
const LOCAL_RECORDS_KEY = "standard28_local_records"; // keyed by user id

// ---- Admin session token (fully separate from user login) ----

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// ---- Session token (identity/payment lives on the backend) ----

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ---- Local per-user progress (day-to-day tracker data) ----

function readAllLocalRecords(): Record<string, LocalUserRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_RECORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAllLocalRecords(records: Record<string, LocalUserRecord>) {
  localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(records));
}

function defaultLocalRecord(startDate: string): LocalUserRecord {
  return {
    startDate,
    notifications: { dailyReminder: true, weeklyMilestone: true, streakAlerts: true },
    progress: {},
    photos: {},
  };
}

function getLocalRecord(userId: string, fallbackStartDate: string): LocalUserRecord {
  const records = readAllLocalRecords();
  return records[userId] ?? defaultLocalRecord(fallbackStartDate);
}

function saveLocalRecord(userId: string, record: LocalUserRecord) {
  const records = readAllLocalRecords();
  records[userId] = record;
  writeAllLocalRecords(records);
}

// Combines two progress records (e.g. one from the server, one from a
// browser's local cache) without losing data from either side — this
// matters because two devices can each have real, different completed days
// if someone used the app before cross-device sync existed, or if a sync
// request ever failed silently. For any day recorded in both, a completed
// entry wins over a non-completed one; if both are completed, the one with
// the later completedAt timestamp wins.
function mergeProgressRecords(a: ProgressRecord, b: ProgressRecord): ProgressRecord {
  const dayNumbers = new Set([...Object.keys(a), ...Object.keys(b)].map(Number));
  const merged: ProgressRecord = {};
  dayNumbers.forEach((day) => {
    const ra = a[day];
    const rb = b[day];
    if (!ra) {
      merged[day] = rb;
      return;
    }
    if (!rb) {
      merged[day] = ra;
      return;
    }
    if (ra.status === "completed" && rb.status !== "completed") {
      merged[day] = ra;
      return;
    }
    if (rb.status === "completed" && ra.status !== "completed") {
      merged[day] = rb;
      return;
    }
    const aTime = ra.completedAt ? new Date(ra.completedAt).getTime() : 0;
    const bTime = rb.completedAt ? new Date(rb.completedAt).getTime() : 0;
    merged[day] = bTime > aTime ? rb : ra;
  });
  return merged;
}

// The true start of someone's challenge shouldn't move later just because a
// device that never recorded a start date synced after one that did — always
// prefer the earlier of the two if both exist.
function earlierDate(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return new Date(a).getTime() <= new Date(b).getTime() ? a : b;
}

export function mergeUser(backendUser: BackendUser): AppUser {
  const local = getLocalRecord(backendUser.id, backendUser.createdAt);

  // Reconcile rather than pick one side — this is what makes it safe
  // regardless of which device (phone or desktop) happens to sync first.
  const progress = mergeProgressRecords(backendUser.progress ?? {}, local.progress ?? {});
  const startDate = earlierDate(backendUser.startDate, local.startDate) ?? backendUser.createdAt;
  const notifications = backendUser.notifications ?? local.notifications;

  const merged: AppUser = {
    ...backendUser,
    startDate,
    notifications,
    progress,
    photos: local.photos, // photos stay local-only — see savePhoto below
  };

  // Keep the local cache aligned with whatever we just decided is authoritative,
  // so the fast local-first reads/writes elsewhere in the app stay correct.
  saveLocalRecord(backendUser.id, { startDate, notifications, progress, photos: local.photos });

  return merged;
}

function saveUserLocalPart(user: AppUser) {
  saveLocalRecord(user.id, {
    startDate: user.startDate,
    notifications: user.notifications,
    progress: user.progress,
    photos: user.photos,
  });
}

function toCalendarDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getCurrentDay(user: AppUser): number {
  const start = toCalendarDate(new Date(user.startDate));
  const now = toCalendarDate(new Date());
  const diffDays = Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diffDays, 1), 28);
}

export function markWorkoutComplete(user: AppUser, dayNumber: number): AppUser {
  const record = {
    checklist: { workoutCompleted: true } as DailyChecklistState,
    status: "completed" as const,
    completedAt: new Date().toISOString(),
  };
  const updated: AppUser = { ...user, progress: { ...user.progress, [dayNumber]: record } };
  saveUserLocalPart(updated);
  syncToServer(updated);
  return updated;
}

export function markDayMissedRecovered(user: AppUser, dayNumber: number, action: "recovered" | "restart"): AppUser {
  let updated: AppUser;
  if (action === "recovered") {
    const record = {
      checklist: { workoutCompleted: true } as DailyChecklistState,
      status: "completed" as const,
      completedAt: new Date().toISOString(),
    };
    updated = { ...user, progress: { ...user.progress, [dayNumber]: record } };
  } else {
    const progress = { ...user.progress };
    Object.keys(progress).forEach((key) => {
      if (Number(key) >= dayNumber) delete progress[Number(key)];
    });
    const newStart = new Date();
    newStart.setDate(newStart.getDate() - (dayNumber - 1));
    updated = { ...user, progress, startDate: newStart.toISOString() };
  }
  saveUserLocalPart(updated);
  syncToServer(updated);
  return updated;
}

export function savePhoto(user: AppUser, slot: keyof PhotoRecord, dataUrl: string): AppUser {
  const updated = { ...user, photos: { ...user.photos, [slot]: dataUrl } };
  saveUserLocalPart(updated);
  return updated;
}

export function resetChallenge(user: AppUser): AppUser {
  const updated: AppUser = { ...user, progress: {}, startDate: new Date().toISOString() };
  saveUserLocalPart(updated);
  syncToServer(updated);
  return updated;
}

export function updateNotifications(user: AppUser, notifications: AppUser["notifications"]): AppUser {
  const updated = { ...user, notifications };
  saveUserLocalPart(updated);
  syncToServer(updated);
  return updated;
}

export function computeStreak(user: AppUser): number {
  let streak = 0;
  const currentDay = getCurrentDay(user);
  for (let d = currentDay; d >= 1; d--) {
    const rec = user.progress[d];
    if (rec && rec.status === "completed") {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function computeTotalCompleted(user: AppUser): number {
  return Object.values(user.progress).filter((r) => r.status === "completed").length;
}

// Pushes the full progress state to the backend — this is what makes
// progress follow a person across devices, not just a nice-to-have for the
// admin dashboard. Fire-and-forget — never awaited, never blocks the UI. If
// it fails, the local copy still has everything; the next successful sync
// will catch the server back up.
export function syncToServer(user: AppUser) {
  const token = getToken();
  if (!token) return;
  const currentDay = getCurrentDay(user);
  const completedDays = Object.entries(user.progress)
    .filter(([, r]) => r.status === "completed")
    .map(([day]) => Number(day));
  const lastCompletedDay = completedDays.length ? Math.max(...completedDays) : null;
  syncProgress(token, {
    progress: user.progress,
    startDate: user.startDate,
    notifications: user.notifications,
    currentDay,
    totalCompleted: computeTotalCompleted(user),
    streak: computeStreak(user),
    lastCompletedDay,
  });
}
