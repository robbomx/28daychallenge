import Card from "../components/Card";
import Badge from "../components/Badge";
import { dailyNonNegotiables, nutritionRules } from "../data/workoutPlan";
import { foodGroups } from "../data/nutritionFoodList";

export default function Nutrition() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <span className="mono-label text-xs text-op-orange">Fuel Standard</span>
      <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2 mb-3">Nutrition Guidelines</h1>
      <p className="text-sm text-op-off-white-dim max-w-2xl mb-10">
        These are the daily non-negotiables and nutrition rules for the full 28 days. They're principles to hold
        yourself to, not a rigid diet plan.
      </p>

      <h2 className="font-display text-2xl text-op-off-white mb-4">Daily Non-Negotiables</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        {dailyNonNegotiables.map((item) => (
          <Card key={item} variant="panel" className="p-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-op-orange flex-shrink-0" />
            <span className="text-sm text-op-off-white">{item}</span>
          </Card>
        ))}
      </div>

      <h2 className="font-display text-2xl text-op-off-white mb-4">Nutrition Rules</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <Card variant="panel" className="p-5">
          <p className="mono-label text-xs text-op-orange mb-3">Aim</p>
          <ul className="flex flex-col gap-2">
            {nutritionRules.aim.map((item) => (
              <li key={item} className="text-sm text-op-off-white-dim">
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card variant="panel" className="p-5">
          <p className="mono-label text-xs text-op-success mb-3">Focus On</p>
          <ul className="flex flex-col gap-2">
            {nutritionRules.focus.map((item) => (
              <li key={item} className="text-sm text-op-off-white-dim">
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card variant="panel" className="p-5">
          <p className="mono-label text-xs text-op-error mb-3">Avoid</p>
          <ul className="flex flex-col gap-2">
            {nutritionRules.avoid.map((item) => (
              <li key={item} className="text-sm text-op-off-white-dim">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h2 className="font-display text-2xl text-op-off-white">Allowed Food List</h2>
      </div>
      <p className="text-sm text-op-off-white-dim max-w-2xl mb-6">
        Sticking to these foods and hitting your portions consistently matters far more than any single meal.
        Portions use a simple visual guide — palms, fists and thumbs — instead of exact weights.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {foodGroups.map((group) => (
          <Card key={group.title} variant="panel" className="p-5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-display text-lg text-op-off-white">{group.title}</h3>
              <Badge tone={group.tone}>{group.portionGuide}</Badge>
            </div>
            {group.note && <p className="text-xs text-op-off-white-dim mt-2 mb-3">{group.note}</p>}
            <ul className={`grid grid-cols-2 gap-x-4 gap-y-1.5 ${group.note ? "" : "mt-4"}`}>
              {group.items.map((item) => (
                <li key={item} className="text-sm text-op-off-white-dim flex items-start gap-2">
                  <span className="w-1 h-1 mt-2 bg-op-off-white-dim/60 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
