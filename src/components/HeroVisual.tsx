import ProgressRing from "./ProgressRing";
import Badge from "./Badge";

export default function HeroVisual() {
  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square max-w-md mx-auto border border-op-line overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=900&q=70&auto=format&fit=crop"
        alt="Person doing a push-up on concrete"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-op-black via-op-black/30 to-op-black/60" />
      <div className="absolute inset-0 tactical-grid-bg opacity-40" />

      <div className="absolute top-4 left-4 stamp-rotate">
        <Badge tone="orange">Field Copy</Badge>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ProgressRing percent={46} label="D13" sublabel="Intensity Phase" size={170} strokeWidth={11} />
      </div>

      <div className="absolute bottom-5 left-5 right-5 bg-op-panel/95 border border-op-line rounded-md p-4 clip-notch shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="mono-label text-[10px] text-op-orange">Today's Workout</span>
          <Badge tone="warning">Moderate</Badge>
        </div>
        <p className="font-display text-base text-op-off-white uppercase">Cardio Day</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 bg-op-line overflow-hidden">
            <div className="h-full bg-op-orange" style={{ width: "60%" }} />
          </div>
          <span className="mono-label text-[10px] text-op-off-white-dim">2/3</span>
        </div>
      </div>
    </div>
  );
}
