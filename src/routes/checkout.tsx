import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { funnel, money } from "@/lib/funnel-config";
import { FunnelFooter, GuaranteeSeal } from "@/components/funnel/ui";
import { CheckoutFlow } from "@/components/funnel/checkout-flow";
import { readResume } from "@/components/funnel/whop-pay";

/** Standalone checkout page (same two-step flow as the sales-page popup) for direct links. */
export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: `Checkout | ${funnel.product}` }, { name: "robots", content: "noindex" }],
  }),
  component: Checkout,
});

function Checkout() {
  const [ready, setReady] = useState(false);
  const [stateId, setStateId] = useState<string>();
  useEffect(() => {
    const r = readResume();
    if (r?.key === "main") setStateId(r.stateId);
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-100 font-body text-black">
      <div className="bg-snack-black px-4 py-3 text-center">
        <p className="font-display text-lg font-bold uppercase text-white sm:text-xl">
          You're one step away from your{" "}
          <span className="text-snack-yellow">first paying buyers</span>
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-[1fr_380px]">
        <div className="order-2 rounded-lg bg-white p-5 shadow-sm md:order-1">
          {ready && <CheckoutFlow resumeStateId={stateId} />}
        </div>

        <aside className="order-1 space-y-4 md:order-2">
          <div className="rounded-lg bg-snack-black p-5 text-white">
            <img
              src="/product-stack.webp"
              alt=""
              width={2279}
              height={1485}
              className="mb-4 h-auto w-full"
            />
            <div className="text-xs font-bold uppercase text-snack-yellow">You're getting</div>
            <h1 className="mt-1 font-display text-2xl font-bold uppercase leading-tight">
              {funnel.product}
            </h1>
            <ul className="mt-4 space-y-1.5 text-sm text-white/85">
              <li>✓ The 4-step install guide + walkthrough videos</li>
              <li>✓ Snack Offer Creator AI Prompt</li>
              <li>✓ Snack Builder GPT</li>
              <li>✓ Fitness Coach Ad Swipe File</li>
              <li>✓ 7-Day Snack-to-Client Email Templates</li>
            </ul>
            <div className="mt-4 font-display text-3xl font-bold text-snack-yellow">
              {money(funnel.prices.main)}{" "}
              <s className="text-lg font-normal text-white/50">{money(funnel.prices.mainAnchor)}</s>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
            <GuaranteeSeal />
            <p className="text-sm">
              <strong>30-day money-back guarantee.</strong> If it's not for you, email{" "}
              {funnel.supportEmail} and get a full refund. No questions asked.
            </p>
          </div>
        </aside>
      </div>

      <FunnelFooter />
    </main>
  );
}
