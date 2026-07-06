import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { getCheckoutLink } from "../lib/api";
import { getToken } from "../lib/storage";
import { stripeConfig } from "../config/stripe";

const included = [
  "28 daily workouts, scaled to your fitness level",
  "28 day progress tracker with streaks",
  "Nutrition guidelines and recipe ideas",
  "Before / after photo comparison",
  "Full accountability dashboard",
];

export default function Pricing() {
  const { user } = useAuth();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.paid) return;
    const token = getToken();
    if (!token) return;
    getCheckoutLink(token)
      .then(({ url }) => setCheckoutUrl(url))
      .catch((err) => setLinkError(err instanceof Error ? err.message : "Couldn't reach checkout."));
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <span className="mono-label text-xs text-op-orange">Enlistment</span>
      <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2 mb-3">
        Join The 28 Day Standard
      </h1>
      <p className="text-sm text-op-off-white-dim max-w-xl mb-10">
        One payment. One standard to hold yourself to for the next 28 days.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card variant="panel" className="p-6">
          <Badge tone="orange">Full Program</Badge>
          <h2 className="font-display text-2xl text-op-off-white mt-3">The 28 Day Standard</h2>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-display text-4xl text-op-off-white">{stripeConfig.price}</span>
            <span className="mono-label text-xs text-op-off-white-dim">{stripeConfig.priceNote}</span>
          </div>
          <ul className="flex flex-col gap-3 mt-6">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-op-off-white-dim">
                <span className="w-1.5 h-1.5 mt-1.5 bg-op-orange flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="panel" className="p-6 flex flex-col justify-center gap-4">
          <p className="mono-label text-xs text-op-off-white-dim">Checkout</p>

          {user?.paid ? (
            <>
              <p className="text-sm text-op-off-white">
                You're already checked in. Day {1} is waiting for you.
              </p>
              <Link to="/dashboard">
                <Button variant="primary" fullWidth>
                  Go to Dashboard
                </Button>
              </Link>
            </>
          ) : !user ? (
            <>
              <p className="text-sm text-op-off-white-dim">
                Create your account first — checkout is linked to your account so we know it's you.
              </p>
              <Link to="/signup">
                <Button variant="primary" size="lg" fullWidth>
                  Create Account to Continue
                </Button>
              </Link>
              <p className="text-xs text-op-off-white-dim text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-op-orange hover:underline">
                  Log in
                </Link>
              </p>
            </>
          ) : linkError ? (
            <p className="text-sm text-op-error">{linkError}</p>
          ) : checkoutUrl ? (
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" fullWidth>
                Checkout with Stripe — {stripeConfig.price}
              </Button>
            </a>
          ) : (
            <p className="text-sm text-op-off-white-dim">Preparing checkout…</p>
          )}

          <p className="text-xs text-op-off-white-dim text-center">
            Secure payment powered by Stripe. Card details never touch this site.
          </p>
        </Card>
      </div>
    </div>
  );
}
