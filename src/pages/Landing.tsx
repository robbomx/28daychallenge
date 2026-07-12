import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import HeroVisual from "../components/HeroVisual";
import { phaseDescriptions } from "../data/workoutPlan";

const whoItsFor = [
  "People who want structure, not guesswork",
  "People restarting fitness after time off",
  "People who prefer bodyweight training",
  "People who want a real challenge without a gym",
  "People who want a disciplined daily routine",
];

const included = [
  "28 daily workouts",
  "28 day progress tracker",
  "Workout completion streak",
  "Automatic daily completion tracking",
  "Nutrition principles",
  "Before and after photo uploads",
  "Weekly milestones",
  "Accountability dashboard",
];

const weeks = [
  { phase: "Foundation" as const, num: "01" },
  { phase: "Intensity" as const, num: "02" },
  { phase: "Hardening" as const, num: "03" },
  { phase: "Chiseled Phase" as const, num: "04" },
];

const testimonials = [
  {
    quote: "I stopped negotiating with myself every morning. The plan just told me what to do.",
    name: "Marcus T.",
  },
  {
    quote: "First program I've actually finished all 28 days of. The tracker made it hard to quit.",
    name: "Priya R.",
  },
  {
    quote: "No gym, no equipment, no excuses left. That was the point.",
    name: "Jake Sullivan",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-op-line">
        <div className="absolute inset-0 tactical-grid-bg opacity-60 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge tone="orange">The 28 Day Standard</Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-5 leading-[1.05] text-op-off-white">
              28 Days. No Excuses. Build The Standard.
            </h1>
            <p className="text-op-off-white-dim mt-6 text-base sm:text-lg leading-relaxed max-w-lg">
              A military inspired calisthenics challenge built to improve strength, conditioning, discipline and
              visual definition in four weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/pricing">
                <Button variant="primary" size="lg" fullWidth>
                  Start the Challenge
                </Button>
              </Link>
              <a href="#weeks">
                <Button variant="secondary" size="lg" fullWidth>
                  View the Plan
                </Button>
              </a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* What is the challenge */}
      <section id="what-is-it" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <span className="mono-label text-xs text-op-orange">What Is The Challenge</span>
        <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white max-w-2xl">
          A structured 28 day bodyweight program
        </h2>
        <p className="text-op-off-white-dim mt-4 max-w-2xl leading-relaxed">
          Every day is planned for you: daily workouts, conditioning intervals, core work, and built-in recovery
          days. No programming decisions to make — just show up and execute what's in front of you.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mt-12 items-start">
          <div className="lg:order-2">
            <h3 className="font-display text-xl text-op-off-white mb-4">Who It's For</h3>
            <ul className="flex flex-col gap-3">
              {whoItsFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-op-off-white-dim">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-op-orange flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:order-3">
            <h3 className="font-display text-xl text-op-off-white mb-4">What You Get</h3>
            <ul className="grid grid-cols-1 gap-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-op-off-white-dim">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-op-olive-light flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:order-1 lg:row-span-2">
            <img
              src="https://images.unsplash.com/photo-1514512364185-4c2b0985be01?w=800&q=70&auto=format&fit=crop"
              alt="Person holding a plank position outdoors"
              className="w-full aspect-[4/5] object-cover border border-op-line"
            />
          </div>
        </div>
      </section>

      {/* Challenge preview */}
      <section id="weeks" className="border-y border-op-line bg-op-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <span className="mono-label text-xs text-op-orange">The Plan</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white">Four Phases. Four Weeks.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {weeks.map((w) => (
              <Card key={w.phase} variant="panel" className="p-6 clip-notch">
                <span className="font-display text-4xl text-op-line">{w.num}</span>
                <h3 className="font-display text-lg text-op-off-white mt-2">{w.phase}</h3>
                <p className="mono-label text-[11px] text-op-orange mt-1">{phaseDescriptions[w.phase].range}</p>
                <p className="text-sm text-op-off-white-dim mt-3 leading-relaxed">
                  {phaseDescriptions[w.phase].description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo banner */}
      <section className="relative border-b border-op-line overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=1600&q=70&auto=format&fit=crop"
          alt="Person doing a push-up outdoors"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-op-black via-op-black/80 to-op-black/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-md">
            <Badge tone="orange">No Gym. No Equipment.</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-op-off-white mt-4">
              Just You, The Ground, And The Standard.
            </h2>
            <p className="text-op-off-white-dim mt-4 leading-relaxed">
              Every workout in this program can be done in a driveway, a park, or a living room. The only
              equipment required is your own bodyweight and the discipline to show up.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <span className="mono-label text-xs text-op-orange">Reports From The Field</span>
        <h2 className="font-display text-3xl sm:text-4xl text-op-off-white mt-3 mb-3">What Others Have Said</h2>
        <p className="text-xs text-op-off-white-dim mb-10">Illustrative examples of the kind of feedback the program is built to earn.</p>
        <div className="grid sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Card key={i} variant="outline" className="p-6">
              <p className="text-sm text-op-off-white leading-relaxed">"{t.quote}"</p>
              <p className="mono-label text-[11px] text-op-off-white-dim mt-4">— {t.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-op-line bg-op-olive-dark/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-op-off-white">
            Commit To The Next 28 Days.
          </h2>
          <p className="text-op-off-white-dim mt-4 max-w-lg mx-auto">
            No equipment. No gym membership. Just a plan, a tracker, and a standard to hold yourself to.
          </p>
          <Link to="/pricing" className="inline-block mt-8">
            <Button variant="primary" size="lg">
              Start the Challenge
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
