import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import ProductPreview from "../components/ProductPreview";
import StickyMobileCTA from "../components/StickyMobileCTA";
import { phaseDescriptions } from "../data/workoutPlan";
import { stripeConfig } from "../config/stripe";
import { trackEvent } from "../lib/pixel";
import {
  BookIcon,
  CalendarIcon,
  ChartIcon,
  CheckIcon,
  DevicesIcon,
  DumbbellIcon,
  FlameIcon,
  ListCheckIcon,
  MoonIcon,
} from "../components/LandingIcons";

// TESTIMONIAL PLACEHOLDER — intentionally not rendered on the live page.
// Replace with real member quotes (with permission) once available, then
// render them the same way the old fabricated-quote version did. Do not
// display invented quotes or numbers in the meantime.
// const testimonials = [
//   { quote: "", name: "", },
// ];

const features = [
  { icon: CalendarIcon, title: "Complete 28 Day Workout Plan", desc: "Every day mapped out in advance — four phases, no guesswork." },
  { icon: DumbbellIcon, title: "Daily Guided Bodyweight Workouts", desc: "Full exercise breakdown: sets, reps, rest, and form notes." },
  { icon: ChartIcon, title: "Progress Tracking", desc: "A 28 day tracker with streaks, so you can see momentum build." },
  { icon: BookIcon, title: "Exercise Instructions", desc: "Modifications and intensity notes for every single movement." },
  { icon: MoonIcon, title: "Rest & Recovery Guidance", desc: "Built-in recovery days each week — rest is part of the plan." },
  { icon: FlameIcon, title: "Daily Discipline & Motivation", desc: "A standard to hold yourself to, one day at a time." },
  { icon: DevicesIcon, title: "Mobile & Desktop Access", desc: "Log in anywhere. Your progress follows your account." },
  { icon: ListCheckIcon, title: "Removes The Guesswork", desc: "No programming decisions to make. Just show up and execute." },
];

const transformation = [
  "Building consistency",
  "Improving strength and fitness",
  "Creating a daily routine",
  "Developing discipline",
  "Feeling more confident",
  "Completing something difficult",
  "Becoming someone who follows through",
];

const howItWorks = [
  {
    step: "01",
    title: "Join the challenge",
    desc: "Create your account and get immediate access.",
  },
  {
    step: "02",
    title: "Follow the daily plan",
    desc: "Complete a structured workout each day and track your progress.",
  },
  {
    step: "03",
    title: "Raise your standard",
    desc: "Build momentum, improve your fitness, and finish the 28 days stronger and more disciplined.",
  },
];

const trust = [
  "No gym membership required",
  "Beginner friendly modifications included",
  "Workouts can be completed at home",
  "The daily plan is already organised",
  "Progress at your own pace",
  "Secure checkout, powered by Stripe",
  "Immediate access after joining",
];

const faqs = [
  {
    q: "Is this suitable for beginners?",
    a: "Yes. Choose Beginner when you sign up and every workout scales to that level. Every exercise also lists a modification if you need to ease into it.",
  },
  {
    q: "Do I need gym equipment?",
    a: "No. Every workout is bodyweight only — a driveway, a park, or your living room floor is all you need.",
  },
  {
    q: "How long does each workout take?",
    a: "Most days run 25 to 45 minutes depending on the phase and your fitness level. A few longer conditioning and test days run closer to an hour.",
  },
  {
    q: "What happens if I miss a day?",
    a: "The tracker flags it and gives you the choice to mark it as recovered or restart your plan from that day. One missed day doesn't lock you out.",
  },
  {
    q: "Can I complete the workouts at home?",
    a: "Yes — every workout in the program is designed to be done at home with just your bodyweight.",
  },
  {
    q: "When do I get access?",
    a: "Immediately after payment. No waiting, no onboarding calls — you're straight into Day 1.",
  },
  {
    q: "Is this a subscription or a one time payment?",
    a: `A one-time payment of ${stripeConfig.price} AUD. No recurring billing, no subscription.`,
  },
  {
    q: "Can I repeat the challenge after completing it?",
    a: "Yes. Reset your progress anytime from Settings and start again from Day 1.",
  },
];

const included = [
  "28 daily workouts, scaled to your fitness level",
  "28 day progress tracker with streaks",
  "Nutrition guidelines",
  "Before / after photo comparison",
  "Full accountability dashboard",
];

function CtaBlock({ label = "Start My 28 Day Challenge", source }: { label?: string; source: string }) {
  return (
    <div className="flex justify-center">
      <Link to="/signup" onClick={() => trackEvent("Lead", { content_name: source })}>
        <Button variant="primary" size="lg">
          {label}
        </Button>
      </Link>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="pb-20 sm:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-op-line">
        <div className="absolute inset-0 tactical-grid-bg opacity-60 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-24 relative">
          <div className="max-w-2xl">
            <Badge tone="orange">The 28 Day Standard</Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-5 leading-[1.05] text-op-off-white">
              Build Discipline. Transform Your Body. Raise Your Standard.
            </h1>
            <p className="text-op-off-white-dim mt-6 text-base sm:text-lg leading-relaxed max-w-lg">
              A guided, military inspired 28 day bodyweight challenge you can complete at home with minimal
              equipment — built for people who want structure, not guesswork.
            </p>
            <div className="mt-8">
              <Link to="/signup" onClick={() => trackEvent("Lead", { content_name: "hero_cta" })}>
                <Button variant="primary" size="lg" fullWidth className="sm:w-auto">
                  Start My 28 Day Challenge
                </Button>
              </Link>
              <p className="text-xs text-op-off-white-dim mt-3">Instant access. Start today. No gym required.</p>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* What's included */}
      <section id="what-is-it" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <span className="mono-label text-xs text-op-orange">What You Get</span>
        <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white max-w-2xl">
          Everything you need. Nothing you don't.
        </h2>
        <p className="text-op-off-white-dim mt-4 max-w-2xl leading-relaxed">
          One payment gets you the full 28 days — no add-ons to figure out, no upsells later.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {features.map((f) => (
            <Card key={f.title} variant="panel" className="p-5">
              <f.icon size={26} className="text-op-orange mb-3" />
              <h3 className="font-display text-base text-op-off-white leading-tight">{f.title}</h3>
              <p className="text-xs text-op-off-white-dim mt-2 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <CtaBlock source="what_is_included" />
        </div>
      </section>

      {/* Photo banner */}
      <section className="relative border-y border-op-line overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=1600&q=70&auto=format&fit=crop"
          alt="Person doing a push-up outdoors"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-op-black via-op-black/80 to-op-black/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
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

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <span className="mono-label text-xs text-op-orange">How It Works</span>
        <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white">Three Steps. Twenty-Eight Days.</h2>

        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          {howItWorks.map((s) => (
            <Card key={s.step} variant="panel" className="p-6">
              <span className="font-display text-4xl text-op-line">{s.step}</span>
              <h3 className="font-display text-lg text-op-off-white mt-2">{s.title}</h3>
              <p className="text-sm text-op-off-white-dim mt-3 leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <CtaBlock source="how_it_works" />
        </div>
      </section>

      {/* Four phases */}
      <section id="weeks" className="border-y border-op-line bg-op-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <span className="mono-label text-xs text-op-orange">The Plan</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white">Four Phases. Four Weeks.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {(["Foundation", "Intensity", "Hardening", "Chiseled Phase"] as const).map((phase, i) => (
              <Card key={phase} variant="panel" className="p-6 clip-notch">
                <span className="font-display text-4xl text-op-line">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-lg text-op-off-white mt-2">{phase}</h3>
                <p className="mono-label text-[11px] text-op-orange mt-1">{phaseDescriptions[phase].range}</p>
                <p className="text-sm text-op-off-white-dim mt-3 leading-relaxed">
                  {phaseDescriptions[phase].description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <span className="mono-label text-xs text-op-orange">More Than A Workout</span>
        <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white max-w-2xl">
          This is about who you become in the process.
        </h2>
        <p className="text-op-off-white-dim mt-4 max-w-2xl leading-relaxed">
          Twenty-eight days of showing up builds something that outlasts the challenge itself.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-8 max-w-2xl">
          {transformation.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-op-off-white">
              <span className="text-op-orange flex-shrink-0">
                <CheckIcon size={16} />
              </span>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-12">
          <CtaBlock source="transformation" />
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-op-line bg-op-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <span className="mono-label text-xs text-op-orange">Before You Start</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white">No Surprises.</h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-8 max-w-3xl">
            {trust.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-op-off-white-dim">
                <span className="text-op-success flex-shrink-0">
                  <CheckIcon size={16} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
        <h2 className="font-display text-2xl sm:text-3xl text-op-off-white">
          You Do Not Need Another Monday. Start Day 1 Today.
        </h2>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <span className="mono-label text-xs text-op-orange">Questions</span>
        <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white mb-10">Before You Ask.</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((f) => (
            <Card key={f.q} variant="panel" className="p-5">
              <h3 className="font-display text-base text-op-off-white">{f.q}</h3>
              <p className="text-sm text-op-off-white-dim mt-2 leading-relaxed">{f.a}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12">
          <CtaBlock source="faq" />
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-op-line bg-op-olive-dark/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <span className="mono-label text-xs text-op-orange text-center block">Pricing</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 text-op-off-white text-center">
            Simple. Transparent. One Payment.
          </h2>
          <Card variant="panel" className="p-6 sm:p-8 mt-10">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl text-op-off-white">{stripeConfig.price}</span>
              <span className="mono-label text-xs text-op-off-white-dim">AUD · {stripeConfig.priceNote}</span>
            </div>
            <ul className="flex flex-col gap-3 mt-6">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-op-off-white-dim">
                  <span className="text-op-orange flex-shrink-0 mt-0.5">
                    <CheckIcon size={16} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-op-off-white-dim mt-6">
              Access begins immediately after payment. Full refund within 7 days if you haven't completed more
              than 3 days — see{" "}
              <Link to="/terms" className="text-op-orange hover:underline">
                Terms
              </Link>
              .
            </p>
            <div className="mt-6">
              <Link
                to="/signup"
                onClick={() => trackEvent("Lead", { content_name: "pricing_section" })}
              >
                <Button variant="primary" size="lg" fullWidth>
                  Join The 28 Day Standard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <StickyMobileCTA />
    </div>
  );
}
