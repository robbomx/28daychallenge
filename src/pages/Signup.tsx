import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import OptionTile from "../components/OptionTile";
import { Field, SelectField } from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import type { BodyType, DesiredOutcome, FitnessLevel, Gender, Goal } from "../types";
import {
  BoltIcon,
  CalendarCheckIcon,
  DumbbellIcon,
  FlameIcon,
  HeartPulseIcon,
  RefreshIcon,
  TargetIcon,
  TrendDownIcon,
} from "../components/SurveyIcons";

const bodyTypeOptions: BodyType[] = ["Slim", "Average build", "Solid build", "Larger build"];
const genderOptions: Gender[] = ["Male", "Female", "Non-binary", "Prefer not to say"];

const goalOptions: { value: Goal; icon: ReactNode }[] = [
  { value: "Lose fat", icon: <FlameIcon /> },
  { value: "Build muscle", icon: <DumbbellIcon /> },
  { value: "Improve discipline", icon: <TargetIcon /> },
  { value: "Improve fitness", icon: <HeartPulseIcon /> },
  { value: "Restart routine", icon: <RefreshIcon /> },
];

const desiredOutcomeOptions: { value: DesiredOutcome; icon: ReactNode }[] = [
  { value: "Feel stronger day to day", icon: <BoltIcon /> },
  { value: "Look leaner", icon: <TrendDownIcon /> },
  { value: "Build visible muscle", icon: <DumbbellIcon /> },
  { value: "Improve endurance and stamina", icon: <HeartPulseIcon /> },
  { value: "Just build a consistent habit", icon: <CalendarCheckIcon /> },
];

const stepBackgrounds = [
  "https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=1200&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514512364185-4c2b0985be01?w=1200&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=1200&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1682048682610-20a91f10b29c?w=1200&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549943365-6bb16fecadeb?w=1200&q=60&auto=format&fit=crop",
];

const TOTAL_STEPS = 7;

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  // Survey answers
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [bodyType, setBodyType] = useState<BodyType | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [desiredOutcome, setDesiredOutcome] = useState<DesiredOutcome | null>(null);
  const [notes, setNotes] = useState("");

  // Account creation
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("Beginner");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const goNext = () => {
    setError("");
    if (step === 0) {
      const ageNum = Number(age);
      if (!age || !Number.isFinite(ageNum)) return setError("Enter your age to continue.");
      if (ageNum < 16) return setError("You need to be 16 or older to sign up for this program.");
      if (ageNum > 100) return setError("Double check the age you entered.");
    }
    if (step === 1 && !gender) return setError("Pick one to continue.");
    if (step === 2 && !bodyType) return setError("Pick one to continue.");
    if (step === 3 && !goal) return setError("Pick one to continue.");
    if (step === 4 && !desiredOutcome) return setError("Pick one to continue.");
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !email.trim() || !password) {
      setError("Fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You need to acknowledge the disclaimer to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await signup({
        firstName: firstName.trim(),
        email: email.trim(),
        password,
        fitnessLevel,
        goal: goal ?? "Improve fitness",
        profile: {
          age: Number(age),
          gender: gender ?? "Prefer not to say",
          bodyType: bodyType ?? "Average build",
          desiredOutcome: desiredOutcome ?? "Just build a consistent habit",
          notes: notes.trim(),
        },
      });
      navigate(user.paid ? "/dashboard" : "/pricing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      <img
        src={stepBackgrounds[step % stepBackgrounds.length]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-op-black/85" />
      <div className="absolute inset-0 tactical-grid-bg opacity-30" />

      <Card variant="panel" className="relative w-full max-w-md p-6 sm:p-8">
        {/* Progress indicator */}
        <div className="flex items-center gap-1.5 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-op-orange" : "bg-op-line"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <StepShell eyebrow="Intake · 1 of 7" title="How old are you?">
            <Field
              id="age"
              label="Age"
              type="number"
              inputMode="numeric"
              min={16}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 32"
              autoFocus
            />
          </StepShell>
        )}

        {step === 1 && (
          <StepShell eyebrow="Intake · 2 of 7" title="What's your gender?">
            <div className="flex flex-col gap-2.5">
              {genderOptions.map((g) => (
                <OptionTile key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />
              ))}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell eyebrow="Intake · 3 of 7" title="Which best describes your build right now?">
            <div className="flex flex-col gap-2.5">
              {bodyTypeOptions.map((b) => (
                <OptionTile key={b} label={b} selected={bodyType === b} onClick={() => setBodyType(b)} />
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell eyebrow="Intake · 4 of 7" title="What's your primary goal?">
            <div className="flex flex-col gap-2.5">
              {goalOptions.map((g) => (
                <OptionTile key={g.value} label={g.value} icon={g.icon} selected={goal === g.value} onClick={() => setGoal(g.value)} />
              ))}
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell eyebrow="Intake · 5 of 7" title="What does success look like after 28 days?">
            <div className="flex flex-col gap-2.5">
              {desiredOutcomeOptions.map((d) => (
                <OptionTile
                  key={d.value}
                  label={d.value}
                  icon={d.icon}
                  selected={desiredOutcome === d.value}
                  onClick={() => setDesiredOutcome(d.value)}
                />
              ))}
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell eyebrow="Intake · 6 of 7" title="Anything else worth knowing?">
            <p className="text-xs text-op-off-white-dim mb-3">
              Injuries, limitations, schedule constraints — optional, but it helps.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="e.g. dodgy left knee, travel a lot for work, mornings only"
              className="w-full bg-op-panel border border-op-line focus:border-op-orange px-3 py-2.5 text-sm text-op-off-white rounded-sm outline-none placeholder:text-op-off-white-dim/50"
            />
          </StepShell>
        )}

        {step === 0 || step <= 5 ? (
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button variant="ghost" onClick={goBack}>
                Back
              </Button>
            )}
            <Button variant="primary" fullWidth onClick={goNext}>
              Continue
            </Button>
          </div>
        ) : null}

        {step === 6 && (
          <>
            <Badge tone="orange">Enlistment Form · 7 of 7</Badge>
            <h1 className="font-display text-2xl text-op-off-white mt-3 mb-2">Create Your Account</h1>
            <p className="text-xs text-op-off-white-dim mb-6">
              Last step — create your account, then you'll be taken to payment to activate the full 28 days.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Alex"
                required
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Field
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
              <Field
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <SelectField
                id="fitnessLevel"
                label="Fitness Level"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </SelectField>

              <label className="flex items-start gap-3 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[var(--color-op-orange)] flex-shrink-0"
                />
                <span className="text-xs text-op-off-white-dim leading-relaxed">
                  I understand this is general fitness guidance and I should consult a professional if I have
                  injuries or health concerns.
                </span>
              </label>

              {error && <p className="text-sm text-op-error">{error}</p>}

              <p className="text-xs text-op-off-white-dim">
                By creating an account you agree to our{" "}
                <Link to="/terms" target="_blank" className="text-op-orange hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" target="_blank" className="text-op-orange hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="flex gap-3 mt-2">
                <Button type="button" variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button type="submit" variant="primary" fullWidth disabled={submitting}>
                  {submitting ? "Creating…" : "Create Account"}
                </Button>
              </div>
            </form>
          </>
        )}

        {step < 6 && error && <p className="text-sm text-op-error mt-3">{error}</p>}

        <p className="text-xs text-op-off-white-dim text-center mt-6">
          Already enlisted?{" "}
          <Link to="/login" className="text-op-orange hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}

function StepShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div>
      <span className="mono-label text-xs text-op-orange">{eyebrow}</span>
      <h1 className="font-display text-2xl text-op-off-white mt-2 mb-5">{title}</h1>
      {children}
    </div>
  );
}
