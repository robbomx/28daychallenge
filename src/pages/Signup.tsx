import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Field, SelectField } from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import type { BodyType, DesiredOutcome, FitnessLevel, Gender, Goal } from "../types";

const bodyTypeOptions: BodyType[] = ["Slim", "Average build", "Solid build", "Larger build"];
const genderOptions: Gender[] = ["Male", "Female", "Non-binary", "Prefer not to say"];
const desiredOutcomeOptions: DesiredOutcome[] = [
  "Feel stronger day to day",
  "Look leaner",
  "Build visible muscle",
  "Improve endurance and stamina",
  "Just build a consistent habit",
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");

  // Step 1 — quick profile, used to personalize tone and shown to you in the
  // admin dashboard. It does not change the underlying workouts — fitness
  // level (picked in step 2) is what drives that scaling.
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("Prefer not to say");
  const [bodyType, setBodyType] = useState<BodyType>("Average build");
  const [goal, setGoal] = useState<Goal>("Improve fitness");
  const [desiredOutcome, setDesiredOutcome] = useState<DesiredOutcome>("Just build a consistent habit");
  const [notes, setNotes] = useState("");

  // Step 2 — account creation
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("Beginner");
  const [agreed, setAgreed] = useState(false);

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const ageNum = Number(age);
    if (!age || !Number.isFinite(ageNum)) {
      setError("Enter your age to continue.");
      return;
    }
    if (ageNum < 16) {
      setError("You need to be 16 or older to sign up for this program.");
      return;
    }
    if (ageNum > 100) {
      setError("Double check the age you entered.");
      return;
    }
    setStep(2);
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

    try {
      const user = await signup({
        firstName: firstName.trim(),
        email: email.trim(),
        password,
        fitnessLevel,
        goal,
        profile: {
          age: Number(age),
          gender,
          bodyType,
          desiredOutcome,
          notes: notes.trim(),
        },
      });
      navigate(user.paid ? "/dashboard" : "/pricing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 tactical-grid-bg">
      <Card variant="panel" className="w-full max-w-md p-6 sm:p-8">
        {step === 1 ? (
          <>
            <span className="mono-label text-xs text-op-orange">Intake Form · Step 1 of 2</span>
            <h1 className="font-display text-3xl text-op-off-white mt-2 mb-2">Tell Us About You</h1>
            <p className="text-xs text-op-off-white-dim mb-6">
              A few quick questions so the program fits where you're starting from. Your account and payment come
              next.
            </p>

            <form onSubmit={handleContinue} className="flex flex-col gap-4">
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
                required
              />
              <SelectField id="gender" label="Gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                {genderOptions.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </SelectField>
              <SelectField
                id="bodyType"
                label="Which best describes your build right now?"
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as BodyType)}
              >
                {bodyTypeOptions.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </SelectField>
              <SelectField id="goal" label="Primary goal" value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
                <option>Lose fat</option>
                <option>Build muscle</option>
                <option>Improve discipline</option>
                <option>Improve fitness</option>
                <option>Restart routine</option>
              </SelectField>
              <SelectField
                id="desiredOutcome"
                label="What does success look like to you after 28 days?"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value as DesiredOutcome)}
              >
                {desiredOutcomeOptions.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </SelectField>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="notes" className="mono-label text-xs text-op-off-white-dim">
                  Anything else worth knowing? (injuries, limitations, schedule — optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. dodgy left knee, travel a lot for work, mornings only"
                  className="bg-op-panel border border-op-line focus:border-op-orange px-3 py-2.5 text-sm text-op-off-white rounded-sm outline-none placeholder:text-op-off-white-dim/50"
                />
              </div>

              {error && <p className="text-sm text-op-error">{error}</p>}

              <Button type="submit" variant="primary" fullWidth className="mt-2">
                Continue
              </Button>
            </form>
          </>
        ) : (
          <>
            <span className="mono-label text-xs text-op-orange">Enlistment Form · Step 2 of 2</span>
            <h1 className="font-display text-3xl text-op-off-white mt-2 mb-2">Create Your Account</h1>
            <p className="text-xs text-op-off-white-dim mb-6">
              Create your account, then you'll be taken to payment to activate the full 28 days.
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

              <div className="flex gap-3 mt-2">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  Create Account
                </Button>
              </div>
            </form>
          </>
        )}

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
