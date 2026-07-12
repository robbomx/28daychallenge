export type FitnessLevel = "Beginner" | "Intermediate" | "Advanced";

export type Goal =
  | "Lose fat"
  | "Build muscle"
  | "Improve discipline"
  | "Improve fitness"
  | "Restart routine";

export type Gender = "Male" | "Female" | "Non-binary" | "Prefer not to say";

export type BodyType = "Slim" | "Average build" | "Solid build" | "Larger build";

export type DesiredOutcome =
  | "Feel stronger day to day"
  | "Look leaner"
  | "Build visible muscle"
  | "Improve endurance and stamina"
  | "Just build a consistent habit";

export interface OnboardingProfile {
  age: number;
  gender: Gender;
  bodyType: BodyType;
  desiredOutcome: DesiredOutcome;
  notes: string;
}

export interface Exercise {
  name: string;
  setsOrRounds: string;
  repsOrTime: string;
  rest: string;
  modification: string;
  intensityNote: string;
}

export type Phase = "Foundation" | "Intensity" | "Hardening" | "Chiseled Phase";

export interface WorkoutDay {
  dayNumber: number;
  week: number;
  phase: Phase;
  title: string;
  duration: string;
  difficulty: "Low" | "Moderate" | "High" | "Peak";
  warmup: string[];
  exercises: Exercise[];
  finisher: string[];
  cooldown: string[];
  notes: string;
  isRecoveryDay: boolean;
}

export type DayStatus = "locked" | "available" | "completed" | "missed" | "recovery";

export interface DailyChecklistState {
  workoutCompleted: boolean;
}

export interface ProgressRecord {
  [dayNumber: number]: {
    checklist: DailyChecklistState;
    status: DayStatus;
    completedAt?: string;
  };
}

export interface PhotoRecord {
  day1?: string;
  day14?: string;
  day28?: string;
}

export interface LocalUserRecord {
  startDate: string;
  notifications: {
    dailyReminder: boolean;
    weeklyMilestone: boolean;
    streakAlerts: boolean;
  };
  progress: ProgressRecord;
  photos: PhotoRecord;
}

// The user object used throughout the app: identity + payment status come
// from the backend (src/lib/api.ts), day-to-day progress stays local to the
// browser (src/lib/storage.ts), and the two are merged here.
export interface AppUser {
  id: string;
  firstName: string;
  email: string;
  fitnessLevel: FitnessLevel;
  goal: Goal;
  paid: boolean;
  createdAt: string;
  startDate: string;
  notifications: LocalUserRecord["notifications"];
  progress: ProgressRecord;
  photos: PhotoRecord;
  profile?: OnboardingProfile | null;
}
