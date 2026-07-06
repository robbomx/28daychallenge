import ProgressRing from "./ProgressRing";
import Badge from "./Badge";

export default function HeroVisual() {
  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 tactical-grid-bg border border-op-line bg-op-charcoal scanline-fade" />
      <div className="absolute inset-0 flex items-center justify-center">
        <ProgressRing percent={46} label="D13" sublabel="Intensity Phase" size={190} strokeWidth={12} />
      </div>

      <div className="absolute top-4 left-4 stamp-rotate">
        <Badge tone="orange">Field Copy</Badge>
      </div>

      <div className="absolute bottom-5 left-5 right-5 bg-op-panel border border-op-line rounded-md p-4 clip-notch shadow-lg">
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
