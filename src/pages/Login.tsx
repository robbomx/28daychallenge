import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Field } from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    try {
      const user = await login({ email: email.trim(), password });
      navigate(user.paid ? "/dashboard" : "/pricing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 tactical-grid-bg">
      <Card variant="panel" className="w-full max-w-md p-6 sm:p-8">
        <span className="mono-label text-xs text-op-orange">Access Point</span>
        <h1 className="font-display text-3xl text-op-off-white mt-2 mb-6">Log In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Your password"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-op-off-white-dim">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-op-orange)]"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgotHelp((v) => !v)}
              className="text-xs text-op-orange hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {showForgotHelp && (
            <div className="bg-op-panel border border-op-line rounded-sm p-4 text-xs text-op-off-white-dim leading-relaxed">
              Automatic password reset isn't available yet. Email{" "}
              <a href="mailto:support@the28daystandard.com" className="text-op-orange hover:underline">
                support@the28daystandard.com
              </a>{" "}
              from the address you signed up with and we'll help you reset it manually.
            </div>
          )}

          {error && <p className="text-sm text-op-error">{error}</p>}

          <Button type="submit" variant="primary" fullWidth className="mt-2">
            Log In
          </Button>
        </form>

        <p className="text-xs text-op-off-white-dim text-center mt-6">
          Not enlisted yet?{" "}
          <Link to="/signup" className="text-op-orange hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
