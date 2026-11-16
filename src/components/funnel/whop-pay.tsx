import { lazy, Suspense, useEffect, useState } from "react";

// Whop's embed touches `window`, so load it only in the browser.
const WhopCheckoutEmbed = lazy(() =>
  import("@whop/checkout/react").then((m) => ({ default: m.WhopCheckoutEmbed })),
);

/**
 * Whop's embedded card form (card, and Apple/Google Pay where available).
 * The buyer pays without leaving the page; `onPaid` fires when the payment succeeds.
 * With no `planId` (demo mode) it shows a "continue" button instead.
 */
export function WhopPay({
  planId,
  email,
  name,
  buttonText,
  resumeKey,
  stateId,
  onPaid,
}: {
  planId: string;
  email?: string | undefined;
  name?: string | undefined;
  buttonText: string;
  /** Identifies this payment step so a buyer returning from a bank / PayPal check can be put back here. */
  resumeKey: string;
  stateId?: string | undefined;
  onPaid: () => void;
}) {
  const [returnUrl, setReturnUrl] = useState<string>();
  useEffect(() => {
    const u = new URL(window.location.href);
    u.search = "";
    u.searchParams.set("resume", resumeKey);
    setReturnUrl(u.toString());
  }, [resumeKey]);

  if (!planId) {
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

  if (!returnUrl) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <WhopCheckoutEmbed
        key={planId}
        planId={planId}
        theme="light"
        skipRedirect
        hidePrice={false}
        disableEmail={!!email}
        prefill={{ ...(email ? { email } : {}), ...(name ? { address: { name } } : {}) }}
        themeOptions={{ accentColor: "#f2b705", borderRadius: 8, buttonText }}
        collectPhoneNumbers={false}
        returnUrl={returnUrl}
        {...(stateId ? { stateId } : {})}
        onComplete={() => onPaid()}
        fallback={<Loading />}
      />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[320px] items-center justify-center text-sm text-neutral-500">
      <span className="mr-3 size-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
      Loading secure checkout…
    </div>
  );
}

/** Read and clear `?resume=…&state_id=…` left by Whop after an off-site authorization step. */
export function readResume(): { key: string; stateId: string } | null {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search);
  const key = q.get("resume");
  const stateId = q.get("state_id");
  if (!key || !stateId) return null;
  window.history.replaceState(null, "", window.location.pathname);
  return { key, stateId };
}
