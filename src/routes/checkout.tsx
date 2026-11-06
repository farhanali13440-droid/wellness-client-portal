import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { funnel, goToPayment, money, saveOrder } from "@/lib/funnel-config";
import { CtaButton, FunnelFooter, GuaranteeSeal } from "@/components/funnel/ui";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: `Checkout | ${funnel.product}` }, { name: "robots", content: "noindex" }],
  }),
  component: Checkout,
});

const demo = !funnel.paymentLinks.main;

function Checkout() {
  const [bump, setBump] = useState(false);
  const [sending, setSending] = useState(false);
  const total = funnel.prices.main + (bump ? funnel.prices.bump : 0);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const order = {
      name: String(f.get("name")).trim(),
      email: String(f.get("email")).trim(),
      phone: String(f.get("phone")).trim(),
      bump,
    };
    setSending(true);
    saveOrder(order);
    const link = bump
      ? funnel.paymentLinks.mainWithBump || funnel.paymentLinks.main
      : funnel.paymentLinks.main;
    goToPayment(link, "/oto", order.email);
  }

  const input =
    "w-full rounded-md border border-neutral-300 bg-white px-3 py-3 text-base text-black outline-none focus:border-snack-yellow-dark focus:ring-2 focus:ring-snack-yellow";

  return (
    <main className="min-h-screen bg-neutral-100 font-body text-black">
      <div className="bg-snack-black px-4 py-3 text-center">
        <p className="font-display text-lg font-bold uppercase text-white sm:text-xl">
          You're one step away from your{" "}
          <span className="text-snack-yellow">first paying buyers</span>
        </p>
      </div>

      {/* Progress */}
      <div className="mx-auto flex max-w-md items-center justify-center gap-2 px-4 pt-5 text-xs font-semibold">
        <span className="rounded-full bg-snack-black px-3 py-1 text-snack-yellow">
          1. Your details
        </span>
        <span className="h-px w-6 bg-neutral-400" />
        <span className="rounded-full bg-neutral-300 px-3 py-1 text-neutral-600">2. Access</span>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-[1fr_380px]">
        <form onSubmit={onSubmit} className="order-2 space-y-5 md:order-1">
          {/* Contact */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="font-display text-xl font-bold uppercase">
              Where should we send your access?
            </h2>
            <div className="mt-4 space-y-3">
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Full name"
                className={input}
              />
              <input
                name="email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                placeholder="Best email address"
                className={input}
              />
              <input
                name="phone"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                placeholder="Phone / WhatsApp"
                className={input}
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              🔒 Your details are safe. We never share or sell them.
            </p>
          </div>

          {/* Order bump */}
          <label className="block cursor-pointer rounded-lg border-[3px] border-dashed border-snack-red bg-yellow-50 p-4 shadow-sm">
            <div className="flex items-center gap-3 rounded bg-snack-yellow px-3 py-2">
              <span className="animate-pulse text-xl">➜</span>
              <input
                type="checkbox"
                checked={bump}
                onChange={(e) => setBump(e.target.checked)}
                className="size-5 accent-snack-red"
              />
              <span className="font-extrabold leading-tight">
                Yes, I want my snack launched this week!
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              <strong className="text-snack-red">ONE TIME OFFER (72% OFF):</strong> Get the{" "}
              <strong>3 Proven Fitness Snack Templates</strong> — copy-and-paste a ready-made
              fat-loss, meal-prep and beginner-strength snack, each with its product outline, sales
              page copy, emails, social posts and ad copy. Skip the blank page and go live in a
              weekend. Normally {money(funnel.prices.bumpAnchor)} —{" "}
              <strong>
                today just {money(funnel.prices.bump)}{" "}
                <s className="font-normal text-neutral-500">{money(funnel.prices.bumpAnchor)}</s>
              </strong>
            </p>
          </label>

          {/* Summary + pay */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex justify-between text-sm">
              <span>{funnel.product}</span>
              <span className="font-semibold">{money(funnel.prices.main)}</span>
            </div>
            {bump && (
              <div className="mt-2 flex justify-between text-sm">
                <span>3 Proven Fitness Snack Templates</span>
                <span className="font-semibold">{money(funnel.prices.bump)}</span>
              </div>
            )}
            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total today</span>
              <span>{money(total)}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              One-time payment · No subscription · No hidden fees
            </p>

            <div className="mt-4">
              <CtaButton
                type="submit"
                disabled={sending}
                sub="Instant access · 30-day money-back guarantee"
              >
                {sending ? "Processing…" : `Complete my order — ${money(total)}`}
              </CtaButton>
            </div>
            {demo && (
              <p className="mt-3 rounded bg-neutral-100 p-2 text-center text-[11px] text-neutral-500">
                Demo mode: no payment link set yet in src/lib/funnel-config.ts — this button skips
                to the next page.
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-neutral-600">
              {funnel.paymentBadges.map((b) => (
                <span key={b} className="rounded border border-neutral-300 px-2 py-1">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* Product side panel */}
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
            <p className="mt-2 text-sm text-white/80">
              Turn your free workouts & meal plans into a $17 digital snack that brings you paying
              buyers every day — and upgrades the best into 1:1 clients.
            </p>
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
          <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
            <strong>What happens next?</strong> Your access details arrive by email within minutes
            of your order.
          </div>
        </aside>
      </div>

      <FunnelFooter />
    </main>
  );
}
