import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { funnel, loadNextStep } from "@/lib/funnel-config";

/**
 * Whop redirects here after every purchase (set this URL as the redirect in Whop).
 * We forward the buyer to the step saved before they left: main order → /oto,
 * OTO / downsell → /thank-you. A failed or canceled payment goes back where it came from.
 */
export const Route = createFileRoute("/after-payment")({
  head: () => ({
    meta: [
      { title: `Processing your order | ${funnel.brand}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AfterPayment,
});

function AfterPayment() {
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    const step = loadNextStep();
    const failed = status === "failed" || status === "canceled";
    const target = failed ? step?.back || "/checkout" : step?.next || "/thank-you";
    window.location.replace(target);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-snack-black font-body text-white">
      <div className="text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-white/20 border-t-snack-yellow" />
        <p className="mt-4 font-display text-xl font-bold uppercase">Processing your order…</p>
        <p className="mt-1 text-sm text-white/60">Please don't close this page.</p>
      </div>
    </main>
  );
}
