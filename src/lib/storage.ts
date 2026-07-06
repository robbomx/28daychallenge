import type { AppUser, DailyChecklistState, LocalUserRecord, PhotoRecord } from "../types";
import type { BackendUser } from "./api";

const TOKEN_KEY = "standard28_token";
const LOCAL_RECORDS_KEY = "standard28_local_records"; // keyed by user id

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

export function mergeUser(backendUser: BackendUser): AppUser {
  const local = getLocalRecord(backendUser.id, backendUser.createdAt);
  return { ...backendUser, ...local };
}

function saveUserLocalPart(user: AppUser) {
  saveLocalRecord(user.id, {
    startDate: user.startDate,
    notifications: user.notifications,
    progress: user.progress,
    photos: user.photos,
  });
}

export function getCurrentDay(user: AppUser): number {
  const start = new Date(user.startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diffDays, 1), 28);
}

export function updateChecklist(user: AppUser, dayNumber: number, checklist: DailyChecklistState): AppUser {
  const record = user.progress[dayNumber] ?? { checklist, status: "available" as const };
  record.checklist = checklist;
  const allDone = Object.values(checklist).every(Boolean);
  if (allDone) {
    record.status = "completed";
    record.completedAt = new Date().toISOString();
  }
  const updated: AppUser = { ...user, progress: { ...user.progress, [dayNumber]: record } };
  saveUserLocalPart(updated);
  return updated;
}

export function markWorkoutComplete(user: AppUser, dayNumber: number): AppUser {
  const existing = user.progress[dayNumber]?.checklist ?? {
    workoutCompleted: false,
    stepsCompleted: false,
    waterCompleted: false,
    proteinTarget: false,
    sleepTarget: false,
  };
  const checklist = { ...existing, workoutCompleted: true };
  return updateChecklist(user, dayNumber, checklist);
}

export function markDayMissedRecovered(user: AppUser, dayNumber: number, action: "recovered" | "restart"): AppUser {
  let updated: AppUser;
  if (action === "recovered") {
    const record = user.progress[dayNumber] ?? {
      checklist: {
        workoutCompleted: true,
        stepsCompleted: false,
        waterCompleted: false,
        proteinTarget: false,
        sleepTarget: false,
      },
      status: "completed" as const,
    };
    record.status = "completed";
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
  return updated;
}

export function updateNotifications(user: AppUser, notifications: AppUser["notifications"]): AppUser {
  const updated = { ...user, notifications };
  saveUserLocalPart(updated);
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
