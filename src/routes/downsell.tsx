import { createFileRoute } from "@tanstack/react-router";
import { funnel, goToPayment, loadOrder, money } from "@/lib/funnel-config";
import { Check } from "@/components/funnel/ui";
import { UpsellLayout } from "@/components/funnel/upsell";

export const Route = createFileRoute("/downsell")({
  head: () => ({
    meta: [
      { title: `One last thing before you go | ${funnel.brand}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Downsell,
});

function Downsell() {
  const p = funnel.prices;
  return (
    <UpsellLayout
      step={80}
      warning="Hold on — one last option before we send your access"
      headline={
        <>
          OK, no full kit. But how about the{" "}
          <span className="text-snack-yellow">templates only</span> for{" "}
          <span className="text-snack-red">less than half</span>?
        </>
      }
      yesLabel={`Yes — give me the templates for ${money(p.downsell)}`}
      yesSub="Add to your order · Covered by the 30-day guarantee"
      onYes={() =>
        goToPayment(funnel.paymentLinks.downsell, "/thank-you?oto=1", loadOrder()?.email)
      }
      noLabel="No thanks — take me to my purchase"
      onNo={() => (window.location.href = "/thank-you")}
      demo={!funnel.paymentLinks.downsell}
    >
      <div className="space-y-4 text-base leading-relaxed text-white/85 sm:text-lg">
        <p>
          I get it — maybe you don't need the ad creatives or the setup video. But the part that
          slows most coaches down is the blank page. So here's the core of the kit on its own:
        </p>
        <div className="rounded-lg border-2 border-snack-yellow bg-snack-panel p-5">
          <div className="font-display text-2xl font-bold uppercase text-snack-yellow">
            Snack Funnel Templates
          </div>
          <ul className="mt-4 space-y-3">
            <Check>Plug-and-play sales page + checkout template</Check>
            <Check>Order bump + upsell page templates</Check>
            <Check>Pre-written delivery & 7-day follow-up emails</Check>
          </ul>
          <p className="mt-5 text-center">
            <s>{money(p.oto)}</s> → today just{" "}
            <span className="font-display text-3xl font-bold text-snack-yellow">
              {money(p.downsell)}
            </span>
          </p>
        </div>
      </div>
    </UpsellLayout>
  );
}
