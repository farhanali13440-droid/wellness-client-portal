import { useState, type FormEvent } from "react";
import { funnel, loadOrder, money, saveOrder, type OrderDraft } from "@/lib/funnel-config";
import { CtaButton } from "@/components/funnel/ui";
import { WhopPay } from "@/components/funnel/whop-pay";

const input =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-3 text-base text-black outline-none focus:border-snack-yellow-dark focus:ring-2 focus:ring-snack-yellow";

/**
 * Two-step checkout.
 * Step 1: name, email, phone (+ the order bump).
 * Step 2: Whop's embedded card form for the right plan. On success → /oto.
 */
export function CheckoutFlow({ resumeToPayment }: { resumeToPayment?: boolean | undefined }) {
  const saved = typeof window !== "undefined" ? loadOrder() : null;
  const [step, setStep] = useState<1 | 2>(resumeToPayment && saved ? 2 : 1);
  const [order, setOrder] = useState<OrderDraft>(
    saved ?? { name: "", email: "", phone: "", bump: false },
  );
  const p = funnel.prices;
  const total = p.main + (order.bump ? p.bump : 0);
  const planId = order.bump ? funnel.whopPlans.mainWithBump : funnel.whopPlans.main;

  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const o = {
      name: String(f.get("name")).trim(),
      email: String(f.get("email")).trim(),
      phone: String(f.get("phone")).trim(),
      bump: order.bump,
    };
    setOrder(o);
    saveOrder(o);
    setStep(2);
  }

  function setBump(bump: boolean) {
    const o = { ...order, bump };
    setOrder(o);
    saveOrder(o);
  }

  return (
    <div className="font-body text-black">
      <Steps step={step} />

      {step === 1 ? (
        <form onSubmit={next} className="mt-5 space-y-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight">
              Where should we send your access?
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {funnel.product} — {money(p.main)}{" "}
              <s className="text-neutral-400">{money(p.mainAnchor)}</s>
            </p>
          </div>
          <div className="space-y-3">
            <input
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Full name"
              defaultValue={order.name}
              className={input}
            />
            <input
              name="email"
              type="email"
              required
              maxLength={255}
              autoComplete="email"
              placeholder="Best email address"
              defaultValue={order.email}
              className={input}
            />
            <input
              name="phone"
              type="tel"
              required
              maxLength={30}
              autoComplete="tel"
              placeholder="Phone / WhatsApp"
              defaultValue={order.phone}
              className={input}
            />
          </div>

          <Bump checked={order.bump} onChange={setBump} />

          <CtaButton type="submit" sub="Step 2: secure card payment">
            Continue to payment →
          </CtaButton>
          <p className="text-center text-xs text-neutral-500">
            🔒 Your details are safe. We never share or sell them.
          </p>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg bg-neutral-100 p-4 text-sm">
            <div className="flex justify-between">
              <span>{funnel.product}</span>
              <span className="font-semibold">{money(p.main)}</span>
            </div>
            {order.bump && (
              <div className="mt-1.5 flex justify-between">
                <span>3 Proven Fitness Snack Templates</span>
                <span className="font-semibold">{money(p.bump)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-neutral-300 pt-2 text-base font-bold">
              <span>Total today</span>
              <span>{money(total)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
              <span>
                Sending access to <strong className="text-neutral-700">{order.email}</strong>
              </span>
              <button onClick={() => setStep(1)} className="underline">
                Edit
              </button>
            </div>
          </div>

          {!order.bump && <Bump checked={false} onChange={setBump} compact />}

          <WhopPay
            planId={planId}
            email={order.email}
            name={order.name}
            resumeKey="main"
            onPaid={() => (window.location.href = "/oto")}
          />

          <div className="flex items-start gap-2 text-xs text-neutral-600">
            <span className="text-base leading-none">🛡️</span>
            <p>
              <strong>30-day money-back guarantee.</strong> One-time payment, no subscription.
              Payments are processed securely by Whop.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Steps({ step }: { step: 1 | 2 }) {
  const item = (n: number, label: string) => (
    <div className="flex flex-1 items-center gap-2">
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
          step >= n ? "bg-snack-yellow text-black" : "bg-neutral-200 text-neutral-500"
        }`}
      >
        {step > n ? "✓" : n}
      </span>
      <span
        className={`text-xs font-bold uppercase ${step >= n ? "text-black" : "text-neutral-400"}`}
      >
        {label}
      </span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 pr-6">
      {item(1, "Your details")}
      <span className="h-px w-8 bg-neutral-300" />
      {item(2, "Payment")}
    </div>
  );
}

function Bump({
  checked,
  onChange,
  compact,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  compact?: boolean;
}) {
  const p = funnel.prices;
  return (
    <label className="block cursor-pointer rounded-lg border-[3px] border-dashed border-snack-red bg-yellow-50 p-3">
      <div className="flex items-center gap-3 rounded bg-snack-yellow px-3 py-2">
        <span className="animate-pulse text-lg">➜</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="size-5 accent-snack-red"
        />
        <span className="text-sm font-extrabold leading-tight">
          Yes, I want my snack launched this week! (+{money(p.bump)})
        </span>
      </div>
      {!compact && (
        <p className="mt-2 text-xs leading-relaxed sm:text-sm">
          <strong className="text-snack-red">ONE TIME OFFER (72% OFF):</strong> Get the{" "}
          <strong>3 Proven Fitness Snack Templates</strong> — a ready-made fat-loss, meal-prep and
          beginner-strength snack, each with its outline, sales page copy, emails, posts and ad
          copy. Normally {money(p.bumpAnchor)} — today just <strong>{money(p.bump)}</strong>.
        </p>
      )}
    </label>
  );
}
