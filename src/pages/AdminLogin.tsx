import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Field } from "../components/AuthForm";
import { adminLogin } from "../lib/api";
import { setAdminToken } from "../lib/storage";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminLogin(password);
      setAdminToken(token);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 tactical-grid-bg">
      <Card variant="panel" className="w-full max-w-sm p-6 sm:p-8">
        <span className="mono-label text-xs text-op-orange">Restricted Access</span>
        <h1 className="font-display text-3xl text-op-off-white mt-2 mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            id="adminPassword"
            label="Admin Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          {error && <p className="text-sm text-op-error">{error}</p>}
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Checking…" : "Log In"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
