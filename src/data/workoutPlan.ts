import type { Exercise, FitnessLevel, Phase, WorkoutDay } from "../types";

// ---- Fitness level scaling ----
// Beginner = the plan as written. Intermediate and Advanced scale up
// reps/rounds and durations so the same daily structure gets progressively harder.
const LEVEL_FACTOR: Record<FitnessLevel, number> = {
  Beginner: 1,
  Intermediate: 1.2,
  Advanced: 1.4,
};

function scaleNumber(n: number, factor: number): number {
  if (factor === 1 || n < 5) return n;
  const scaled = n * factor;
  if (n >= 20) return Math.round(scaled / 5) * 5;
  return Math.round(scaled);
}

function scaleNumbersInString(value: string, factor: number): string {
  if (factor === 1) return value;
  return value.replace(/\d+(\.\d+)?/g, (match) => {
    const num = parseFloat(match);
    if (Number.isNaN(num)) return match;
    return String(scaleNumber(num, factor));
  });
}

// Only bump the round/set count for the simple "N rounds" form so we don't
// mangle special formats like ladders or EMOMs, where the structure itself
// (not the round count) is part of the exercise.
function scaleSetsOrRounds(value: string, factor: number): string {
  const match = value.match(/^(\d+) rounds$/);
  if (!match) return value;
  const n = parseInt(match[1], 10);
  return `${scaleNumber(n, factor)} rounds`;
}

function scaleExercise(exercise: Exercise, factor: number): Exercise {
  if (factor === 1) return exercise;
  return {
    ...exercise,
    setsOrRounds: scaleSetsOrRounds(exercise.setsOrRounds, factor),
    repsOrTime: scaleNumbersInString(exercise.repsOrTime, factor),
  };
}

function scaleDayForLevel(day: WorkoutDay, level: FitnessLevel): WorkoutDay {
  const factor = LEVEL_FACTOR[level];
  if (factor === 1 || day.isRecoveryDay) return day;
  return {
    ...day,
    duration: scaleNumbersInString(day.duration, factor),
    exercises: day.exercises.map((e) => scaleExercise(e, factor)),
    finisher: day.finisher.map((f) => scaleNumbersInString(f, factor)),
  };
}

const ex = (
  name: string,
  setsOrRounds: string,
  repsOrTime: string,
  rest: string,
  modification: string,
  intensityNote: string
): Exercise => ({ name, setsOrRounds, repsOrTime, rest, modification, intensityNote });

const STANDARD_WARMUP = [
  "2 min light marching or jogging on the spot",
  "10x arm circles each direction",
  "10x bodyweight good mornings",
  "8x world's greatest stretch, each side",
];

const STANDARD_COOLDOWN = [
  "60 sec chest doorway stretch",
  "60 sec quad stretch, each leg",
  "60 sec child's pose",
  "5 deep breaths, box breathing pattern",
];

const RECOVERY_WARMUP = ["3 min easy walk to loosen up before stretching"];
const RECOVERY_COOLDOWN = [
  "Hip flexor stretch, 60 sec each side",
  "Chest and shoulder stretch, 60 sec",
  "Hamstring stretch, 60 sec each leg",
];

interface RawDay {
  dayNumber: number;
  title: string;
  duration: string;
  difficulty: WorkoutDay["difficulty"];
  exercises: Exercise[];
  finisher: string[];
  notes: string;
  isRecoveryDay: boolean;
}

const rawDays: RawDay[] = [
  // ---------------- WEEK 1 — FOUNDATION ----------------
  {
    dayNumber: 1,
    title: "Upper Body Volume",
    duration: "35-40 min",
    difficulty: "Moderate",
    exercises: [
      ex("Push-up", "5 rounds", "15 reps", "Minimal — move straight to the next exercise", "Knee push-up", "Full range, chest near the floor"),
      ex("Incline push-up", "5 rounds", "10 reps", "Minimal — move straight to the next exercise", "Hands higher (against a wall) for an easier angle", "Hands elevated on a step, chair, or bench"),
      ex("Mountain climbers", "5 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Slow controlled tempo", "Drive knees toward the chest, keep hips level"),
      ex("Plank", "5 rounds", "30 sec", "60-90 sec after completing the round", "Knee plank", "Brace the core, keep a neutral spine"),
    ],
    finisher: ["20 minute brisk walk"],
    notes: "Foundation week starts with volume, not intensity. Get the movement patterns clean before week 2 adds load.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 2,
    title: "Conditioning + Core",
    duration: "30 min",
    difficulty: "Moderate",
    exercises: [
      ex("Shadow boxing", "4 rounds", "40 sec", "20 sec between exercises", "Slower punches, focus on form", "Stay light on your feet, keep hands up"),
      ex("Sit-up", "4 rounds", "20 reps", "20 sec between exercises", "Bent-knee crunch instead of full sit-up", "Control the descent, don't use momentum"),
      ex("Glute bridge", "4 rounds", "15 reps", "20 sec between exercises", "Reduce range of motion", "Squeeze glutes hard at the top"),
      ex("Side plank", "4 rounds", "30 sec each side", "60 sec after completing the round", "Knee-supported side plank", "Stack hips, don't let them sag"),
    ],
    finisher: ["15 minute bike ride"],
    notes: "Conditioning days are about keeping your heart rate up without letting form break down.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 3,
    title: "Military Circuit",
    duration: "30-35 min",
    difficulty: "Moderate",
    exercises: [
      ex("Push-up", "6 rounds", "10 reps", "Minimal rest", "Knee push-up", "Full range each rep"),
      ex("Bodyweight row or towel row", "6 rounds", "10 reps", "Minimal rest", "Reduce lean-back angle", "Use a sturdy table edge or towel looped around a door"),
      ex("Air squat", "6 rounds", "15 reps", "Minimal rest", "Squat to a comfortable, controlled depth", "Knees track over toes, full stand at the top"),
      ex("Marching high knees", "6 rounds", "20 reps", "Minimal rest", "March slower, lower knee height", "Drive knees to hip height, stay tall through the torso"),
      ex("Plank", "6 rounds", "30 sec", "60-90 sec after completing the round", "Knee plank", "Brace like you're about to be tapped in the stomach"),
    ],
    finisher: [],
    notes: "Minimal rest between exercises. This is a circuit, not a series of separate sets — keep moving.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 4,
    title: "Recovery",
    duration: "45-55 min",
    difficulty: "Low",
    exercises: [
      ex("Walk", "1 session", "45 min", "None", "Shorten the route if needed", "Easy, conversational pace — this is not a training effort"),
      ex("Stretch: hips, chest, hamstrings", "1 session", "10-15 min", "None", "Hold each stretch for as long as is comfortable", "Move slowly, never stretch into sharp pain"),
      ex("Sauna (optional)", "1 session", "10-15 min", "None", "Skip if unavailable or not medically advised", "Hydrate well before and after if you use one"),
    ],
    finisher: [],
    notes: "Recovery days are part of the program, not a day off from it. Skipping them slows the rest of the week down.",
    isRecoveryDay: true,
  },
  {
    dayNumber: 5,
    title: "Chest + Arms",
    duration: "35 min",
    difficulty: "Moderate",
    exercises: [
      ex("Push-up", "5 rounds", "20 reps", "Minimal — move straight to the next exercise", "Knee push-up", "Full range each rep"),
      ex("Diamond push-up", "5 rounds", "10 reps", "Minimal — move straight to the next exercise", "From the knees if needed", "Elbows stay tucked, triceps take more of the load"),
      ex("Chair dip", "5 rounds", "15 reps", "Minimal — move straight to the next exercise", "Bend knees, feet close to the chair", "Elbows track backward, not flared out"),
      ex("Bicycle crunch", "5 rounds", "20 reps", "60-90 sec after completing the round", "Slower tempo, feet down between reps", "Rotate from the ribs, not by yanking the neck"),
    ],
    finisher: ["5 minute plank accumulation (break it into segments as needed)"],
    notes: "The plank accumulation at the end can be broken into as many pieces as you need — the total time is what matters.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 6,
    title: "Conditioning",
    duration: "50-55 min",
    difficulty: "Moderate",
    exercises: [
      ex("Steady bike ride or incline walk", "1 session", "30 min", "None", "Reduce incline or resistance as needed", "Steady, sustainable pace throughout"),
      ex("Sit-up", "4 rounds", "15 reps", "20-30 sec between exercises", "Bent-knee crunch", "Control the descent, don't use momentum"),
      ex("Flutter kicks", "4 rounds", "20 reps total", "20-30 sec between exercises", "Bend knees slightly, smaller range", "Keep low back pressed toward the floor"),
      ex("Russian twist", "4 rounds", "20 reps total", "60-90 sec after completing the round", "Feet down, smaller rotation", "Rotate through the torso, not just the arms"),
    ],
    finisher: [],
    notes: "The cardio block comes first today, then the core circuit — pace the bike or walk so you still have something left for the rounds.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 7,
    title: "Long Walk + Mobility",
    duration: "60-70 min",
    difficulty: "Low",
    exercises: [
      ex("Walk", "1 session", "60 min", "None", "Split into two shorter walks if easier", "Easy, sustainable pace"),
      ex("Full body stretching", "1 session", "10 min", "None", "Hold each stretch as long as comfortable", "Cover shoulders, hips, hamstrings, and calves"),
    ],
    finisher: [],
    notes: "Week 1 closes here. You've set the standard — week 2 raises it.",
    isRecoveryDay: true,
  },

  // ---------------- WEEK 2 — INTENSITY ----------------
  {
    dayNumber: 8,
    title: "Full Body Volume",
    duration: "35-40 min",
    difficulty: "High",
    exercises: [
      ex("Push-up", "7 rounds", "15 reps", "Minimal — move straight to the next exercise", "Knee push-up", "Full range each rep, even as fatigue builds"),
      ex("Squat", "7 rounds", "15 reps", "Minimal — move straight to the next exercise", "Reduce depth if needed", "Full stand at the top of every rep"),
      ex("Mountain climbers", "7 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Slow controlled tempo", "Keep hips level, avoid bouncing"),
      ex("Plank", "7 rounds", "30 sec", "60-90 sec after completing the round", "Knee plank", "Reset your brace if your hips start to sag"),
    ],
    finisher: [],
    notes: "Same movements as Day 1, more rounds. This is intensity phase — expect it to be harder than week 1, that's the design.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 9,
    title: "Core Focus",
    duration: "40 min",
    difficulty: "Moderate",
    exercises: [
      ex("Sit-up", "5 rounds", "25 reps", "Minimal — move straight to the next exercise", "Bent-knee crunch", "Control the descent, don't use momentum"),
      ex("Leg raise", "5 rounds", "20 reps", "Minimal — move straight to the next exercise", "Bend knees to reduce lever length", "Keep low back pressed to the floor throughout"),
      ex("Hollow hold", "5 rounds", "30 sec", "Minimal — move straight to the next exercise", "Bend knees, hands on thighs", "Low back stays flat against the floor"),
      ex("Side plank", "5 rounds", "30 sec each side", "60-90 sec after completing the round", "Knee-supported side plank", "Stack hips, avoid rotating forward"),
    ],
    finisher: ["20 minute incline walk"],
    notes: "This is the heaviest pure-core day so far. Quality of the brace matters more than finishing quickly.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 10,
    title: "EMOM Push + Accessories",
    duration: "35 min",
    difficulty: "High",
    exercises: [
      ex("Push-up (EMOM)", "10 min", "10 reps every minute on the minute", "Remainder of the minute after your reps", "Reduce to 6-8 reps per minute if needed", "Use the leftover time in each minute to recover before the next set"),
      ex("Chair dip", "5 rounds", "10 reps", "Minimal — move straight to the next exercise", "Bend knees, feet close to the chair", "Elbows track backward, not flared"),
      ex("Glute bridge", "5 rounds", "15 reps", "Minimal — move straight to the next exercise", "Reduce range of motion", "Squeeze glutes hard at the top of each rep"),
      ex("Flutter kicks", "5 rounds", "20 reps total", "45-60 sec after completing the round", "Bend knees slightly", "Keep low back pressed toward the floor"),
    ],
    finisher: [],
    notes: "EMOM means Every Minute On the Minute — start a fresh set of push-ups at the top of every minute for 10 minutes straight.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 11,
    title: "Recovery",
    duration: "30-40 min",
    difficulty: "Low",
    exercises: [
      ex("Walk", "1 session", "30 min", "None", "Shorten the route if needed", "Easy, conversational pace"),
      ex("Stretch", "1 session", "10 min", "None", "Hold each stretch as long as comfortable", "Focus on whatever feels tightest from the last 6 days"),
      ex("Sauna (optional)", "1 session", "10-15 min", "None", "Skip if unavailable or not medically advised", "Hydrate well before and after"),
    ],
    finisher: [],
    notes: "Two intense weeks in, this recovery day matters as much as any workout so far.",
    isRecoveryDay: true,
  },
  {
    dayNumber: 12,
    title: "Military Conditioning Circuit",
    duration: "35 min",
    difficulty: "High",
    exercises: [
      ex("Push-up", "6 rounds", "15 reps", "Minimal — move straight to the next exercise", "Knee push-up", "Full range each rep"),
      ex("Walking lunge (short stride)", "6 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Stationary reverse lunge", "Short controlled stride, front knee stacked over ankle"),
      ex("Mountain climbers", "6 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Slow controlled tempo", "Keep hips level throughout"),
      ex("Bicycle crunch", "6 rounds", "20 reps total", "60-90 sec after completing the round", "Slower tempo, feet down between reps", "Rotate from the ribs"),
    ],
    finisher: [],
    notes: "This circuit is a preview of what week 3 looks like — pace yourself across all 6 rounds rather than sprinting the first two.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 13,
    title: "Cardio Day",
    duration: "50 min",
    difficulty: "Moderate",
    exercises: [
      ex("Bike ride or fast walk", "1 session", "40 min", "None", "Reduce pace or resistance as needed", "Sustainable effort you can hold the whole time"),
      ex("Plank", "3 rounds", "1 min", "45-60 sec between rounds", "Knee plank", "Brace hard, break up the minute if you need to"),
      ex("Sit-up", "3 rounds", "20 reps", "45-60 sec between rounds", "Bent-knee crunch", "Control the descent, don't use momentum"),
    ],
    finisher: [],
    notes: "Cardio first, core second. Don't empty the tank on the bike or walk — you need it for the plank and sit-up rounds after.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 14,
    title: "Recovery + Mobility",
    duration: "30-40 min",
    difficulty: "Low",
    exercises: [
      ex("Walk", "1 session", "25-30 min", "None", "Shorten the route if needed", "Easy, conversational pace"),
      ex("Full body mobility flow", "1 session", "10-15 min", "None", "Hold each position as long as comfortable", "Move slowly through hips, shoulders, and spine"),
    ],
    finisher: [],
    notes: "Week 2 is done. This is usually where people quit — you didn't. That's the whole standard, right there.",
    isRecoveryDay: true,
  },

  // ---------------- WEEK 3 — HARDENING PHASE ----------------
  {
    dayNumber: 15,
    title: "Upper + Lower Volume",
    duration: "40 min",
    difficulty: "High",
    exercises: [
      ex("Push-up", "8 rounds", "15 reps", "Minimal — move straight to the next exercise", "Knee push-up", "Full range each rep, even under fatigue"),
      ex("Dip (chair or bench)", "8 rounds", "15 reps", "Minimal — move straight to the next exercise", "Bend knees, feet close to the bench", "Elbows track backward, not flared"),
      ex("Squat", "8 rounds", "20 reps", "Minimal — move straight to the next exercise", "Reduce depth if needed", "Full stand at the top of every rep"),
      ex("Mountain climbers", "8 rounds", "20 reps total", "60-90 sec after completing the round", "Slow controlled tempo", "Keep hips level, avoid bouncing"),
    ],
    finisher: [],
    notes: "Eight rounds is the longest circuit yet. Pace it like you're planning to finish all eight, not sprint the first three.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 16,
    title: "Core Destruction",
    duration: "35 min",
    difficulty: "High",
    exercises: [
      ex("Sit-up", "5 rounds", "25 reps", "Minimal — move straight to the next exercise", "Bent-knee crunch", "Control the descent, don't use momentum"),
      ex("Flutter kicks", "5 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Bend knees slightly", "Keep low back pressed toward the floor"),
      ex("Russian twist", "5 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Feet down, smaller rotation", "Rotate through the torso, not just the arms"),
      ex("Plank", "5 rounds", "1 min", "60-90 sec after completing the round", "Knee plank, or break the minute into segments", "Brace hard, reset your position if form breaks down"),
    ],
    finisher: [],
    notes: "This is the hardest pure-core day in the program. If the minute plank breaks down, stop, reset, and finish it — don't grind through bad form.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 17,
    title: "Military Ladder",
    duration: "30-35 min",
    difficulty: "High",
    exercises: [
      ex(
        "Push-up ladder",
        "7 sets (ladder: 5-10-15-20-15-10-5)",
        "5, 10, 15, 20, then back down 15, 10, 5 reps",
        "Only the mountain climbers between sets — no extra rest",
        "Cap every rung at 10-12 reps if 20 isn't there yet",
        "The top rung of 20 is the test — everything before it is the build-up"
      ),
      ex("Mountain climbers", "6 rounds (between every ladder set)", "20 reps total", "None — go straight into the next ladder set", "Slow controlled tempo", "This is the active recovery between each push-up rung"),
    ],
    finisher: [],
    notes: "A ladder means the reps climb then come back down: 5, 10, 15, 20, 15, 10, 5. Do 20 mountain climbers between every set on the ladder.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 18,
    title: "Recovery",
    duration: "30-40 min",
    difficulty: "Low",
    exercises: [
      ex("Walk", "1 session", "30 min", "None", "Shorten the route if needed", "Easy, conversational pace"),
      ex("Stretch", "1 session", "10-15 min", "None", "Hold each stretch as long as comfortable", "Focus on whatever's tightest after the ladder session"),
    ],
    finisher: [],
    notes: "After the ladder, this recovery day earns its place. Don't skip it to get ahead.",
    isRecoveryDay: true,
  },
  {
    dayNumber: 19,
    title: "Full Body Circuit",
    duration: "40 min",
    difficulty: "High",
    exercises: [
      ex("Push-up", "7 rounds", "10 reps", "Minimal — move straight to the next exercise", "Knee push-up", "Full range each rep"),
      ex("Bodyweight row", "7 rounds", "10 reps", "Minimal — move straight to the next exercise", "Reduce lean-back angle", "Use a sturdy table edge or towel around a door"),
      ex("Squat", "7 rounds", "15 reps", "Minimal — move straight to the next exercise", "Reduce depth if needed", "Full stand at the top of every rep"),
      ex("Glute bridge", "7 rounds", "15 reps", "Minimal — move straight to the next exercise", "Reduce range of motion", "Squeeze glutes hard at the top"),
      ex("Sit-up", "7 rounds", "20 reps", "60-90 sec after completing the round", "Bent-knee crunch", "Control the descent, don't use momentum"),
    ],
    finisher: [],
    notes: "Five movements, seven rounds. This is the broadest circuit in the program — pace it evenly across every movement.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 20,
    title: "Conditioning",
    duration: "55-60 min",
    difficulty: "High",
    exercises: [
      ex("Incline walk or bike", "1 session", "45 min", "None", "Reduce incline or resistance as needed", "Sustainable pace you can hold the whole time"),
      ex("Plank", "4 rounds", "1 min", "45-60 sec between rounds", "Knee plank, or break the minute into segments", "Brace hard, reset if form breaks down"),
      ex("Bicycle crunch", "4 rounds", "20 reps total", "45-60 sec between rounds", "Slower tempo, feet down between reps", "Rotate from the ribs, not the neck"),
    ],
    finisher: [],
    notes: "The longest steady cardio block in the program so far. Save enough for the four plank and crunch rounds afterward.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 21,
    title: "Mobility + Long Walk",
    duration: "60-70 min",
    difficulty: "Low",
    exercises: [
      ex("Walk", "1 session", "50-60 min", "None", "Split into two shorter walks if easier", "Easy, sustainable pace"),
      ex("Full body mobility flow", "1 session", "10-15 min", "None", "Hold each position as long as comfortable", "Cover shoulders, hips, hamstrings, and calves"),
    ],
    finisher: [],
    notes: "Week 3 is the hardening test. Everything in week 4 builds on what you just proved you can do.",
    isRecoveryDay: true,
  },

  // ---------------- WEEK 4 — CHISELED PHASE ----------------
  {
    dayNumber: 22,
    title: "Fast Pace Full Body",
    duration: "30 min",
    difficulty: "Peak",
    exercises: [
      ex("Push-up", "10 rounds", "10 reps", "Minimal — fast pace throughout", "Knee push-up", "Move quickly between exercises, but keep every rep clean"),
      ex("Squat", "10 rounds", "10 reps", "Minimal — fast pace throughout", "Reduce depth if needed", "Full stand at the top of every rep"),
      ex("Mountain climbers", "10 rounds", "10 reps total", "Minimal — fast pace throughout", "Slow controlled tempo", "Keep hips level even at speed"),
      ex("Sit-up", "10 rounds", "10 reps", "Brief rest between rounds only if needed", "Bent-knee crunch", "Control the descent even when moving fast"),
    ],
    finisher: [],
    notes: "Fast pace. Ten short rounds beat four long ones today — keep the transitions tight.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 23,
    title: "Core",
    duration: "30 min",
    difficulty: "High",
    exercises: [
      ex("Sit-up", "6 rounds", "25 reps", "Minimal — move straight to the next exercise", "Bent-knee crunch", "Control the descent, don't use momentum"),
      ex("Flutter kicks", "6 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Bend knees slightly", "Keep low back pressed toward the floor"),
      ex("Plank", "6 rounds", "1 min", "60-90 sec after completing the round", "Knee plank, or break the minute into segments", "Brace hard, reset your position if form breaks down"),
    ],
    finisher: [],
    notes: "Six rounds of a full minute plank is the biggest core test in the program outside of Day 16.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 24,
    title: "Upper Body Burnout",
    duration: "40-50 min",
    difficulty: "Peak",
    exercises: [
      ex("Push-up", "1 session", "100 reps total", "Break however needed", "Knee push-up for some or all reps", "Split the 100 into as many sets as it takes — track your total, not your set count"),
      ex("Chair dip", "1 session", "50 reps total", "Break however needed", "Bend knees, feet close to the chair", "Same approach — break it up however you need to"),
      ex("Mountain climbers", "1 session", "100 reps total", "Break however needed", "Slow controlled tempo", "Finish the total any way you can while keeping form honest"),
    ],
    finisher: [],
    notes: "Break however needed. This is a volume target, not a set-and-rep prescription — 100 push-ups, 50 dips, 100 mountain climbers, however you get there.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 25,
    title: "Recovery",
    duration: "30-40 min",
    difficulty: "Low",
    exercises: [
      ex("Walk", "1 session", "30 min", "None", "Shorten the route if needed", "Easy, conversational pace"),
      ex("Stretch", "1 session", "10-15 min", "None", "Hold each stretch as long as comfortable", "Focus on whatever's tightest after the burnout session"),
    ],
    finisher: [],
    notes: "Three days out from Day 28. Use this one properly.",
    isRecoveryDay: true,
  },
  {
    dayNumber: 26,
    title: "Military Conditioning",
    duration: "40-45 min",
    difficulty: "Peak",
    exercises: [
      ex("Push-up", "8 rounds", "15 reps", "Minimal — move straight to the next exercise", "Knee push-up", "Full range each rep, even under fatigue"),
      ex("Squat", "8 rounds", "20 reps", "Minimal — move straight to the next exercise", "Reduce depth if needed", "Full stand at the top of every rep"),
      ex("Mountain climbers", "8 rounds", "20 reps total", "Minimal — move straight to the next exercise", "Slow controlled tempo", "Keep hips level, avoid bouncing"),
      ex("Bicycle crunch", "8 rounds", "20 reps total", "60-90 sec after completing the round", "Slower tempo, feet down between reps", "Rotate from the ribs, not the neck"),
    ],
    finisher: [],
    notes: "This repeats the Day 15 structure at Day 15's hardest volume. Compare how it feels — that's real, measurable progress.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 27,
    title: "Final Conditioning Day",
    duration: "70-75 min",
    difficulty: "Peak",
    exercises: [
      ex("Fast walk or bike", "1 session", "60 min", "None", "Reduce pace as needed, split into two sessions if easier", "Push the pace today — tomorrow is a rest before the test"),
      ex("Plank accumulation", "1 session", "5 min total", "Break into segments as needed", "Knee plank for some or all segments", "Total time is what matters, broken up however you need"),
      ex("Sit-up", "1 session", "100 reps total", "Break however needed", "Bent-knee crunch", "Split the 100 into sets, track the total"),
    ],
    finisher: [],
    notes: "This is the last conditioning day before the test. Give it real effort, then rest properly tonight.",
    isRecoveryDay: false,
  },
  {
    dayNumber: 28,
    title: "Test Day",
    duration: "45-60 min",
    difficulty: "Peak",
    exercises: [
      ex("Push-up", "1 set", "100 reps", "None — complete for time", "Knee push-up for some or all reps if needed", "Log your total time, not just completion"),
      ex("Sit-up", "1 set", "100 reps", "None — complete for time", "Bent-knee crunch", "Log your total time"),
      ex("Squat", "1 set", "100 reps", "None — complete for time", "Reduce depth if needed", "Log your total time"),
      ex("Walk or jog", "1 set", "2 km", "None — complete for time", "Walk instead of jog", "Finish at whatever pace is honest for you today"),
    ],
    finisher: [],
    notes: "Complete for time. Track your finish time, then compare it to how Day 1 felt. Take your Day 28 photos today — that comparison is the whole point of the last 28 days.",
    isRecoveryDay: false,
  },
];

const phaseForWeek: Record<number, Phase> = {
  1: "Foundation",
  2: "Intensity",
  3: "Hardening",
  4: "Chiseled Phase",
};

function buildPlan(): WorkoutDay[] {
  return rawDays.map((d) => {
    const week = Math.ceil(d.dayNumber / 7);
    return {
      dayNumber: d.dayNumber,
      week,
      phase: phaseForWeek[week],
      title: d.title,
      duration: d.duration,
      difficulty: d.difficulty,
      warmup: d.isRecoveryDay ? RECOVERY_WARMUP : STANDARD_WARMUP,
      exercises: d.exercises,
      finisher: d.finisher,
      cooldown: d.isRecoveryDay ? RECOVERY_COOLDOWN : STANDARD_COOLDOWN,
      notes: d.notes,
      isRecoveryDay: d.isRecoveryDay,
    };
  });
}

export const workoutPlan: WorkoutDay[] = buildPlan();

export const getDayData = (
  dayNumber: number,
  level: FitnessLevel = "Beginner"
): WorkoutDay | undefined => {
  const day = workoutPlan.find((d) => d.dayNumber === dayNumber);
  if (!day) return undefined;
  return scaleDayForLevel(day, level);
};

export const phaseDescriptions: Record<Phase, { range: string; description: string }> = {
  Foundation: {
    range: "Days 1-7",
    description: "Build clean movement patterns and the daily habit with push-up, conditioning, and core circuits.",
  },
  Intensity: {
    range: "Days 8-14",
    description: "The same movements, more rounds. This is where the routine gets tested for real.",
  },
  Hardening: {
    range: "Days 15-21",
    description: "Longer circuits, a push-up ladder, and the hardest pure-core day in the program.",
  },
  "Chiseled Phase": {
    range: "Days 22-28",
    description: "Fast-paced full body work, a burnout day, and a Day 28 benchmark test — completed for time.",
  },
};

export const dailyNonNegotiables: string[] = [
  "10,000+ steps per day",
  "3L water minimum",
  "Protein every meal",
  "Sleep 7.5+ hours",
  "No alcohol for 28 days",
  "Limit takeaway to once weekly",
  "15 minute walk after dinner",
];

export const nutritionRules = {
  aim: ["High protein", "Moderate carbs", "Lower processed food", "Slight calorie deficit"],
  focus: ["Chicken", "Eggs", "Greek yogurt", "Steak", "Tuna", "Rice", "Potatoes", "Fruit", "Vegetables"],
  avoid: ["Sugary drinks", "Late night snacking", "Fried food", "Liquid calories"],
};
