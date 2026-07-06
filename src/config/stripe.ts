// Display-only pricing info shown on the Pricing page. The actual Stripe
// Payment Link lives on the backend (server/.env -> PAYMENT_LINK_BASE_URL)
// since it needs to be personalized per user (see /api/checkout-link).

export const stripeConfig = {
  price: "$39",
  priceNote: "one-time payment · full 28 day program",
};
