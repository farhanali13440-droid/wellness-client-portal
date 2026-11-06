import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { funnel, loadOrder, type OrderDraft } from "@/lib/funnel-config";
import { CtaButton, FunnelFooter } from "@/components/funnel/ui";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [{ title: `You're in! | ${funnel.brand}` }, { name: "robots", content: "noindex" }],
  }),
  component: ThankYou,
});

function ThankYou() {
  const [order, setOrder] = useState<OrderDraft | null>(null);
  useEffect(() => setOrder(loadOrder()), []);
  const firstName = order?.name?.split(" ")[0];

  return (
    <main className="min-h-screen bg-snack-black font-body text-white">
      <div className="mx-auto max-w-xl px-4 pt-5">
        <div className="h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-full rounded-full bg-snack-green" />
        </div>
      </div>

      <section className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
          {firstName ? `You're in, ${firstName}!` : "You're in!"}
        </h1>
        <p className="mt-3 text-lg text-white/85">
          Thank you for your order. Your access to <strong>{funnel.product}</strong> is on its way.
        </p>

        <div className="mt-8 space-y-3 text-left">
          {[
            [
              "1",
              "Check your inbox",
              `Your login and access links are sent to ${order?.email || "your email"} within a few minutes. Not there? Check spam/promotions.`,
            ],
            [
              "2",
              "Start with Step 1 today",
              "Pick your snack idea using the AI prompt — it takes about 20 minutes.",
            ],
            [
              "3",
              "Aim to launch within 72 hours",
              "Record your snack, build your page, turn on your $10/day ads. Done beats perfect.",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-4 rounded-lg bg-snack-panel p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-snack-yellow font-display text-lg font-bold text-black">
                {n}
              </span>
              <div>
                <div className="font-semibold">{t}</div>
                <p className="text-sm text-white/75">{d}</p>
              </div>
            </div>
          ))}
        </div>

        {funnel.workshopUrl && (
          <div className="mt-10 rounded-lg border-2 border-snack-yellow p-6">
            <div className="font-display text-2xl font-bold uppercase">
              Want us to build your snack <span className="text-snack-yellow">with you, live?</span>
            </div>
            <p className="mt-2 text-white/80">
              Join the "Build Your Snack" workshop — we build attendees' offers live, so you leave
              with a snack ready to launch the same day.
            </p>
            <div className="mt-5">
              <CtaButton href={funnel.workshopUrl}>Save my workshop seat</CtaButton>
            </div>
          </div>
        )}

        {funnel.dfyCallUrl && (
          <p className="mt-8 text-white/75">
            Rather have the whole system installed for you?{" "}
            <a href={funnel.dfyCallUrl} className="text-snack-yellow underline">
              Book a done-for-you install call
            </a>
            .
          </p>
        )}

        <p className="mt-10 text-sm text-white/60">
          Need help? Email{" "}
          <a className="underline" href={`mailto:${funnel.supportEmail}`}>
            {funnel.supportEmail}
          </a>
        </p>
      </section>
      <FunnelFooter />
    </main>
  );
}
