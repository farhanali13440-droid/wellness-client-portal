/**
 * Funnel settings — edit this one file to change names, prices and payment links.
 *
 * PAYMENT LINKS
 * Paste the hosted checkout links from your payment processor (Stripe Payment Links,
 * PayPal, Lemon Squeezy, Gumroad, etc.). In the processor, set the "after payment"
 * redirect of each link to the page listed next to it.
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
    main: "", //            $17            → redirect after payment to /oto
    mainWithBump: "", //    $17 + $27 bump → redirect after payment to /oto
    oto: "", //             $97            → redirect after payment to /thank-you?oto=1
    downsell: "", //        $47            → redirect after payment to /thank-you?oto=1
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

/** Send the buyer to a payment link (prefilling email where the processor supports it), or to the demo fallback. */
export function goToPayment(link: string, fallbackPath: string, email?: string) {
  if (!link) {
    window.location.href = fallbackPath;
    return;
  }
  const url = new URL(link);
  if (email) {
    // Stripe Payment Links use prefilled_email; most others ignore unknown params.
    if (url.hostname.includes("stripe.com")) url.searchParams.set("prefilled_email", email);
    else url.searchParams.set("email", email);
  }
  window.location.href = url.toString();
}
