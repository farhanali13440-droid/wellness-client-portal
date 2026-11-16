import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";

/**
 * Whop Elements checkout (card, plus Apple/Google Pay where available), rendered inside our page.
 * Loaded only in the browser: the SDK is served from Whop's CDN.
 */
let modules: Promise<[typeof import("@whop/elements-react"), typeof import("@whop/elements")]>;
function loadModules() {
  modules ??= Promise.all([import("@whop/elements-react"), import("@whop/elements")]);
  return modules;
}

/**
 * Start downloading the checkout code and Whop's SDK in the background, so the card form
 * appears instantly later. Call it when a page that sells something loads.
 */
export function warmUpWhop() {
  if (typeof window === "undefined") return;
  const go = () =>
    void loadModules()
      .then(([, { loadWhop }]) => loadWhop())
      .catch(() => {
        /* shown to the buyer (with a retry) if it still fails when the form is needed */
      });
  if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 2000 });
  else setTimeout(go, 500);
}

/** Connection hints for the sales pages' <head>: start talking to Whop before it's needed. */
export const whopPreconnectLinks = [
  { rel: "preconnect", href: "https://cdn.whop.com" },
  { rel: "preconnect", href: "https://api.whop.com", crossOrigin: "anonymous" as const },
  { rel: "dns-prefetch", href: "https://whop.com" },
];

const WhopElementsCheckout = lazy(async () => {
  const [{ WhopElements, Checkout, CheckoutElement }, { loadWhop }] = await loadModules();
  const elements = loadWhop();

  function Inner({
    planId,
    email,
    name,
    returnUrl,
    onPaid,
  }: {
    planId: string;
    email: string | undefined;
    name: string | undefined;
    returnUrl: string;
    onPaid: () => void;
  }) {
    return (
      <WhopElements
        elements={elements}
        appearance={{ theme: { appearance: "light", accentColor: "amber" } }}
      >
        <Checkout
          key={planId}
          plan={planId}
          returnUrl={returnUrl}
          onComplete={(r) => {
            if (r.result === "payment") onPaid();
          }}
          fallback={<Loading />}
        >
          <CheckoutElement
            {...(email ? { buyerEmail: email, lockBuyerEmail: true } : {})}
            {...(name ? { defaultValues: { billingDetails: { name } } } : {})}
          />
        </Checkout>
      </WhopElements>
    );
  }
  return { default: Inner };
});

/**
 * The payment step. Shows Whop's checkout for `planId`; `onPaid` runs when the payment succeeds.
 * With no `planId` (demo mode) it shows a "continue" button instead.
 */
export function WhopPay({
  planId,
  email,
  name,
  resumeKey,
  onPaid,
  preload,
}: {
  planId: string;
  email?: string | undefined;
  name?: string | undefined;
  /** Identifies this payment step, so a buyer returning from a bank (3-D Secure) check lands back here. */
  resumeKey: string;
  onPaid: () => void;
  /** Load the form invisibly ahead of time (e.g. while the buyer fills in step 1). */
  preload?: boolean | undefined;
}) {
  const [returnUrl, setReturnUrl] = useState<string>();
  useEffect(() => {
    const u = new URL(window.location.href);
    u.search = "";
    u.searchParams.set("resume", resumeKey);
    setReturnUrl(u.toString());
  }, [resumeKey]);

  if (!planId) {
    if (preload) return null;
    return (
      <div className="rounded-lg border-2 border-dashed border-neutral-300 p-5 text-center">
        <p className="text-sm text-neutral-600">
          <strong>Demo mode</strong> — no Whop plan ID set yet in{" "}
          <code className="text-xs">src/lib/funnel-config.ts</code>. The Whop card form will appear
          here.
        </p>
        <button
          onClick={onPaid}
          className="mt-4 rounded-md bg-snack-black px-5 py-3 font-semibold text-snack-yellow"
        >
          Continue (demo) →
        </button>
      </div>
    );
  }

  if (!returnUrl) return preload ? null : <Loading />;

  return (
    <div
      className={preload ? "pointer-events-none invisible h-0 overflow-hidden" : "min-h-[320px]"}
      aria-hidden={preload || undefined}
    >
      <LoadErrorBoundary>
        <Suspense fallback={<Loading />}>
          <WhopElementsCheckout
            planId={planId}
            email={email}
            name={name}
            returnUrl={returnUrl}
            onPaid={onPaid}
          />
        </Suspense>
      </LoadErrorBoundary>
    </div>
  );
}

/** If Whop's checkout can't load (ad blocker, bad connection), show a retry instead of breaking the popup. */
class LoadErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 p-5 text-center text-sm text-neutral-600">
        <p>
          <strong className="text-black">The secure payment form didn't load.</strong>
          <br />
          Please check your connection or pause any ad blocker, then try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-snack-black px-5 py-3 font-semibold text-snack-yellow"
        >
          Try again
        </button>
      </div>
    );
  }
}

function Loading() {
  return (
    <div className="flex min-h-[320px] items-center justify-center text-sm text-neutral-500">
      <span className="mr-3 size-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
      Loading secure checkout…
    </div>
  );
}

/**
 * After an off-site bank check, Whop sends the buyer back to `?resume=<key>&payment=…&status=…`.
 * Returns that (and cleans the URL), or null on a normal visit.
 */
export function readResume(): { key: string; paid: boolean } | null {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search);
  const key = q.get("resume");
  if (!key) return null;
  window.history.replaceState(null, "", window.location.pathname);
  return { key, paid: q.get("status") === "succeeded" };
}
