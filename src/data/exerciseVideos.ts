// Curated, verified form-demonstration videos for the exercises that repeat
// most often across the plan. Exercise name variants (e.g. "Incline push-up")
// map to the closest matching curated video. Anything not covered here still
// gets a working link — it falls back to a YouTube search for that exact
// exercise name, rather than a dead link or a made-up video ID.

interface VideoLink {
  title: string;
  url: string;
}

const curated: Record<string, VideoLink> = {
  "push-up": { title: "How to do a Push-Up — NASM", url: "https://www.youtube.com/watch?v=WDIpL0pjun0" },
  "incline push-up": { title: "How to do a Push-Up — NASM", url: "https://www.youtube.com/watch?v=WDIpL0pjun0" },
  "diamond push-up": { title: "How to do a Push-Up — NASM", url: "https://www.youtube.com/watch?v=WDIpL0pjun0" },
  "push-up (emom)": { title: "How to do a Push-Up — NASM", url: "https://www.youtube.com/watch?v=WDIpL0pjun0" },
  squat: { title: "Bodyweight Squat Tutorial — Proper Form", url: "https://www.youtube.com/watch?v=P-yaD24bUE8" },
  "air squat": { title: "Bodyweight Squat Tutorial — Proper Form", url: "https://www.youtube.com/watch?v=P-yaD24bUE8" },
  plank: { title: "How to do a Plank — NASM", url: "https://www.youtube.com/watch?v=mwlp75MS6Rg" },
  "plank accumulation": { title: "How to do a Plank — NASM", url: "https://www.youtube.com/watch?v=mwlp75MS6Rg" },
  "side plank": { title: "How to do a Side Plank — NASM", url: "https://www.youtube.com/watch?v=44ND4bOB-T0" },
  "sit-up": { title: "How To Do a Sit Up Correctly", url: "https://www.youtube.com/watch?v=pCX65Mtc_Kk" },
  "mountain climbers": { title: "Mountain Climbers — Proper Form (NASM)", url: "https://www.youtube.com/watch?v=ELCyvGG8RHA" },
  "walking lunge (short stride)": { title: "Walking Lunge — Proper Form Tutorial", url: "https://www.youtube.com/watch?v=BenhAbJiTsw" },
  "glute bridge": { title: "How to do a Glute Bridge", url: "https://www.youtube.com/watch?v=SKOMwg1JLrU" },
  "chair dip": { title: "How to do a Triceps Dip on a Chair", url: "https://www.youtube.com/watch?v=rjdpMVtMehw" },
  "dip (chair or bench)": { title: "How to do a Triceps Dip on a Chair", url: "https://www.youtube.com/watch?v=rjdpMVtMehw" },
  "bicycle crunch": { title: "Bicycle Crunch — Proper Form (NASM)", url: "https://www.youtube.com/watch?v=Mwo0pNv5EG8" },
  "russian twist": { title: "How to Do a Russian Twist", url: "https://www.youtube.com/watch?v=wkD8rjkodUI" },
};

export function getFormVideoLink(exerciseName: string): VideoLink {
  const key = exerciseName.trim().toLowerCase();
  if (curated[key]) return curated[key];
  // Fall back to a live YouTube search rather than guessing at a specific
  // video — still genuinely useful, never a dead or fabricated link.
  const query = encodeURIComponent(`${exerciseName} proper form tutorial`);
  return {
    title: `Search: ${exerciseName} form`,
    url: `https://www.youtube.com/results?search_query=${query}`,
  };
}

// A short list of exercises where a form video isn't meaningful (walking,
// stretching, cardio machines, rest-day items) — skip showing a video link
// for these rather than showing an irrelevant search result.
const skipVideoFor = new Set([
  "walk",
  "walk or jog",
  "bike ride or fast walk",
  "fast walk or bike",
  "steady bike ride or incline walk",
  "incline walk or bike",
  "stretch",
  "stretch: hips, chest, hamstrings",
  "full body stretching",
  "full body mobility flow",
  "sauna (optional)",
]);

export function shouldShowFormVideo(exerciseName: string): boolean {
  return !skipVideoFor.has(exerciseName.trim().toLowerCase());
}
