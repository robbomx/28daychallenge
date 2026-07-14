// Minimal Meta (Facebook/Instagram) Pixel integration. Does nothing unless
// VITE_META_PIXEL_ID is set — safe to ship with no pixel configured at all.
// No keys or secrets here: a Pixel ID is meant to be public (it's visible in
// every page's source on every site that uses one), so there's nothing
// sensitive being exposed by having this in the client bundle.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

let initialized = false;

export function initPixel() {
  if (!PIXEL_ID || initialized || typeof window === "undefined") return;
  initialized = true;

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq?.("init", PIXEL_ID);
  window.fbq?.("track", "PageView");
}

// Fires a standard (or custom) Meta Pixel event. Safe no-op if the pixel
// isn't configured — every call site can fire these unconditionally.
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}

// One-time guard so a repeat visit to /dashboard doesn't re-fire Purchase.
export function hasTrackedPurchase(userId: string): boolean {
  try {
    return localStorage.getItem(`standard28_purchase_tracked_${userId}`) === "1";
  } catch {
    return false;
  }
}

export function markPurchaseTracked(userId: string) {
  try {
    localStorage.setItem(`standard28_purchase_tracked_${userId}`, "1");
  } catch {
    // ignore — worst case, Purchase fires again on a future visit
  }
}
