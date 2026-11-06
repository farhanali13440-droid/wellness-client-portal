import { createFileRoute } from "@tanstack/react-router";
import { funnel, goToPayment, loadOrder, money } from "@/lib/funnel-config";
import { Check } from "@/components/funnel/ui";
import { UpsellLayout } from "@/components/funnel/upsell";

export const Route = createFileRoute("/oto")({
  head: () => ({
    meta: [
      { title: `Wait — your order isn't complete | ${funnel.brand}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Oto,
});

function Oto() {
  const p = funnel.prices;
  return (
    <UpsellLayout
      step={66}
      warning="Wait! Your order is not complete yet — don't close this page"
      headline={
        <>
          Want your snack funnel <span className="text-snack-yellow">done for you</span> so you can
          launch <span className="text-snack-red">tomorrow</span> instead of next week?
        </>
      }
      yesLabel={`Yes! Upgrade my order — ${money(p.oto)}`}
      yesSub="Add to your order · Covered by the 30-day guarantee"
      onYes={() => goToPayment(funnel.paymentLinks.oto, "/thank-you?oto=1", loadOrder()?.email)}
      noLabel="No thanks — I'll build the funnel myself from scratch"
      onNo={() => (window.location.href = "/downsell")}
      demo={!funnel.paymentLinks.oto}
    >
      <div className="space-y-4 text-base leading-relaxed text-white/85 sm:text-lg">
        <p>Congratulations — you're in. Your access is on its way to your inbox.</p>
        <p>
          Here's what usually happens next: you'll pick your snack, record it, and then spend days
          figuring out the sales page, the checkout, the delivery emails, and how everything
          connects. Some coaches launch in a weekend. Others get stuck on the tech for weeks.
        </p>
        <p className="font-semibold text-white">
          The Done-For-You Snack Funnel Kit removes that whole step.
        </p>
        <div className="rounded-lg border-2 border-snack-yellow bg-snack-panel p-5">
          <div className="font-display text-2xl font-bold uppercase text-snack-yellow">
            Done-For-You Snack Funnel Kit
          </div>
          <ul className="mt-4 space-y-3">
            <Check>
              <strong>Plug-and-play sales page + checkout template</strong> — the same short-form
              layout you just bought from, ready to duplicate and fill in
            </Check>
            <Check>
              <strong>Order bump + upsell page templates</strong> so every buyer is worth more than
              $17 and your ads fund themselves
            </Check>
            <Check>
              <strong>Delivery email automation</strong> — welcome, access and 7-day follow-up
              emails, pre-written
            </Check>
            <Check>
              <strong>50 done-for-you ad creatives & hooks</strong> for fitness and nutrition snacks
            </Check>
            <Check>
              <strong>Step-by-step setup video</strong> — go live in an afternoon, no tech skills
              needed
            </Check>
          </ul>
          <p className="mt-5 text-center">
            Normally <s>{money(p.otoAnchor)}</s> — today only, as a one-time upgrade:{" "}
            <span className="font-display text-3xl font-bold text-snack-yellow">
              {money(p.oto)}
            </span>
          </p>
        </div>
        <p className="text-sm text-white/60">
          This offer is only available on this page, right after your order.
        </p>
      </div>
    </UpsellLayout>
  );
}
