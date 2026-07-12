import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Field, SelectField } from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import type { FitnessLevel, Goal } from "../types";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("Beginner");
  const [goal, setGoal] = useState<Goal>("Improve fitness");
  const [agreed, setAgreed] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    if (!ageConfirmed) {
      setError("You need to confirm you're 16 or older to sign up.");
      return;
    }
    if (!agreed) {
      setError("You need to acknowledge the disclaimer to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await signup({ firstName: firstName.trim(), email: email.trim(), password, fitnessLevel, goal });
      navigate(user.paid ? "/dashboard" : "/pricing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 tactical-grid-bg">
      <Card variant="panel" className="w-full max-w-md p-6 sm:p-8">
        <span className="mono-label text-xs text-op-orange">Enlistment Form</span>
        <h1 className="font-display text-3xl text-op-off-white mt-2 mb-2">Create Your Account</h1>
        <p className="text-xs text-op-off-white-dim mb-6">
          Create your account first, then you'll be taken to payment to activate the full 28 days.
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
          <SelectField id="goal" label="Goal" value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
            <option>Lose fat</option>
            <option>Build muscle</option>
            <option>Improve discipline</option>
            <option>Improve fitness</option>
            <option>Restart routine</option>
          </SelectField>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--color-op-orange)] flex-shrink-0"
            />
            <span className="text-xs text-op-off-white-dim leading-relaxed">I confirm I am 16 years of age or older.</span>
          </label>

          <label className="flex items-start gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--color-op-orange)] flex-shrink-0"
            />
            <span className="text-xs text-op-off-white-dim leading-relaxed">
              I understand this is general fitness guidance and I should consult a professional if I have injuries
              or health concerns.
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

          <Button type="submit" variant="primary" fullWidth disabled={submitting}>
            {submitting ? "Creating…" : "Create Account"}
          </Button>
        </form>

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
