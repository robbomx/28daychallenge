import { Link } from "react-router-dom";
import Button from "./Button";
import { trackEvent } from "../lib/pixel";

export default function StickyMobileCTA() {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-op-black/95 backdrop-blur border-t border-op-line">
      <Link to="/signup" onClick={() => trackEvent("Lead", { content_name: "sticky_mobile_cta" })}>
        <Button variant="primary" size="lg" fullWidth>
          Start My 28 Day Challenge
        </Button>
      </Link>
    </div>
  );
}
