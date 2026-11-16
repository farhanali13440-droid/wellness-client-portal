/**
 * Funnel settings — edit this one file to change names, prices and Whop plans.
 *
 * WHOP PLANS
 * Payments happen inside a popup on this site using Whop's embedded checkout —
 * buyers never leave for whop.com. Paste each plan's ID below (it looks like
 * plan_XXXXXXXXXXXX — in Whop: Dashboard → Products → your product → pricing option → copy ID).
 *
 * While a plan ID is empty, that step runs in DEMO MODE: the popup shows a
 * "continue (demo)" button instead of the card form, so you can click through the flow.
 */
export const funnel = {
  brand: "The Client Snack System",
  product: "The 72-Hour Client Snack System",
  supportEmail: "farhanali13440@gmail.com",
  currency: "$",

  prices: {
    main: 17,
    mainAnchor: 197, // "real value" shown crossed out
    bump: 27,
    bumpAnchor: 97,
    oto: 97,
    otoAnchor: 497,
    downsell: 47,
  },

  whopPlans: {
    main: "", //            $17 — core product only
    mainWithBump: "", //    $44 — core product + Snack Templates (bump ticked)
    oto: "", //             $97 — Done-For-You Snack Funnel Kit
    downsell: "", //        $47 — Snack Funnel Templates
  },

  /** Trust badges on the checkout — keep only the methods your processor actually accepts. */
  paymentBadges: [
    "🔒 256-bit SSL secure",
    "VISA",
    "Mastercard",
    "AMEX",
    "PayPal",
    "Apple Pay",
    "Google Pay",
  ],

  /** Optional links used on the thank-you page. Leave empty to hide. */
  workshopUrl: "", // "Build Your Snack" live workshop booking page
  dfyCallUrl: "", //  Done-for-you install — call booking page
};

export const money = (n: number) => `${funnel.currency}${n}`;

/** Checkout details kept for the rest of the funnel (this browser only). */
export type OrderDraft = { name: string; email: string; phone: string; bump: boolean };

const KEY = "snack-order";

export function saveOrder(o: OrderDraft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* storage unavailable — funnel still works */
  }
}

export function loadOrder(): OrderDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OrderDraft) : null;
  } catch {
    return null;
  }
}
