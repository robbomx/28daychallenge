import { useState } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { dailyNonNegotiables, nutritionRules } from "../data/workoutPlan";
import { carbRecipes, proteinRecipes, vegRecipes } from "../data/recipeLinks";

const proteinOptions = ["Chicken", "Eggs", "Greek yogurt", "Steak", "Tuna"];
const carbOptions = ["Rice", "Potatoes", "Fruit", "Oats"];
const vegOptions = ["Mixed vegetables", "Broccoli", "Spinach", "Peppers", "Salad greens"];
const fatOptions = ["Olive oil", "Avocado", "Nuts", "Nut butter"];

export default function Nutrition() {
  const [protein, setProtein] = useState(proteinOptions[0]);
  const [carb, setCarb] = useState(carbOptions[0]);
  const [veg, setVeg] = useState(vegOptions[0]);
  const [fat, setFat] = useState(fatOptions[0]);

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

      <h2 className="font-display text-2xl text-op-off-white mb-4">Simple Meal Builder</h2>
      <Card variant="panel" className="p-6 mb-6">
        <div className="grid sm:grid-cols-4 gap-4">
          <BuilderColumn label="Protein" options={proteinOptions} value={protein} onChange={setProtein} />
          <BuilderColumn label="Carb" options={carbOptions} value={carb} onChange={setCarb} />
          <BuilderColumn label="Vegetable" options={vegOptions} value={veg} onChange={setVeg} />
          <BuilderColumn label="Fat" options={fatOptions} value={fat} onChange={setFat} />
        </div>
        <div className="mt-6 pt-5 border-t border-op-line flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-op-off-white">
            Your plate: <span className="text-op-orange">{protein}</span> +{" "}
            <span className="text-op-orange">{carb}</span> + <span className="text-op-orange">{veg}</span> +{" "}
            <span className="text-op-orange">{fat}</span>
          </p>
          <Badge tone="neutral">Example only</Badge>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-display text-2xl text-op-off-white">Recipe Ideas For Your Plate</h2>
        <Badge tone="neutral">via RecipeTinEats</Badge>
      </div>
      <p className="text-sm text-op-off-white-dim max-w-2xl mb-5">
        Based on what's in your plate above, here are real recipes to cook it properly instead of just eating it plain.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        <RecipeCard eyebrow="Protein" ingredient={protein} recipe={proteinRecipes[protein]} />
        <RecipeCard eyebrow="Carb" ingredient={carb} recipe={carbRecipes[carb]} />
        <RecipeCard eyebrow="Vegetable" ingredient={veg} recipe={vegRecipes[veg]} />
      </div>
    </div>
  );
}

function RecipeCard({
  eyebrow,
  ingredient,
  recipe,
}: {
  eyebrow: string;
  ingredient: string;
  recipe?: { title: string; url: string };
}) {
  return (
    <Card variant="outline" className="p-5 flex flex-col gap-2">
      <p className="mono-label text-xs text-op-orange">
        {eyebrow} · {ingredient}
      </p>
      {recipe ? (
        <a
          href={recipe.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-op-off-white hover:text-op-orange hover:underline underline-offset-4"
        >
          {recipe.title} →
        </a>
      ) : (
        <p className="text-sm text-op-off-white-dim">No recipe on file for this one yet.</p>
      )}
    </Card>
  );
}

function BuilderColumn({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mono-label text-[11px] text-op-off-white-dim mb-2">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-op-charcoal border border-op-line focus:border-op-orange rounded-sm px-2 py-2 text-xs text-op-off-white outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
