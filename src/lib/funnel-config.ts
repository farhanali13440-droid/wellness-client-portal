/**
 * Funnel settings — edit this one file to change names, prices and payment links.
 *
 * PAYMENT LINKS (Whop)
 * Paste the Whop checkout link of each plan below (they look like
 * https://whop.com/checkout/plan_XXXXXXXXX). The buyer's email is prefilled automatically.
 *
 * In Whop, set the redirect after purchase to   https://YOUR-DOMAIN/after-payment
 * (Settings → Checkout → Redirect link, or on each checkout link). That one page
 * sends buyers to the right next step: main order → /oto, OTO or downsell → /thank-you.
 *
 * While a link is empty, the funnel runs in DEMO MODE: buttons skip straight to the
 * next page so you can click through the whole flow before payments are connected.
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

  paymentLinks: {
    main: "", //            Whop plan: $17 — core product only
    mainWithBump: "", //    Whop plan: $44 — core product + Snack Templates (bump ticked)
    oto: "", //             Whop plan: $97 — Done-For-You Snack Funnel Kit
    downsell: "", //        Whop plan: $47 — Snack Funnel Templates
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

const NEXT_KEY = "snack-next";

/** Where /after-payment should send the buyer: `next` on success, `back` if the payment failed. */
export function loadNextStep(): { next: string; back: string } | null {
  try {
    const raw = sessionStorage.getItem(NEXT_KEY);
    return raw ? (JSON.parse(raw) as { next: string; back: string }) : null;
  } catch {
    return null;
  }
}

/**
 * Send the buyer to a payment link (prefilling their email), remembering which page comes
 * after a successful payment. With no link set (demo mode) it goes straight to `nextPath`.
 */
export function goToPayment(link: string, nextPath: string, email?: string) {
  if (!link) {
    window.location.href = nextPath;
    return;
  }
  try {
    sessionStorage.setItem(
      NEXT_KEY,
      JSON.stringify({ next: nextPath, back: window.location.pathname }),
    );
  } catch {
    /* storage unavailable — /after-payment falls back to /thank-you */
  }
  const url = new URL(link);
  if (email) {
    // Whop (and most processors) read ?email=; Stripe Payment Links use prefilled_email.
    if (url.hostname.includes("stripe.com")) url.searchParams.set("prefilled_email", email);
    else url.searchParams.set("email", email);
  }
  window.location.href = url.toString();
}
