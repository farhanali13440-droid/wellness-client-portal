import { useEffect, useState, type ReactNode } from "react";
import { CtaButton, FunnelFooter } from "@/components/funnel/ui";
import { readResume, WhopPay } from "@/components/funnel/whop-pay";
import { loadOrder, money } from "@/lib/funnel-config";
import { purchaseThenGo, track } from "@/lib/pixel";

type Pay = { planId: string; product: string; price: number; resumeKey: string };

/** Shared layout for OTO + downsell pages: progress bar, warning headline, offer, yes/no. */
export function UpsellLayout({
  step,
  warning,
  headline,
  children,
  yesLabel,
  yesSub,
  pay,
  noLabel,
  onNo,
}: {
  step: number;
  warning: string;
  headline: ReactNode;
  children: ReactNode;
  yesLabel: string;
  yesSub: string;
  /** The Whop plan the "yes" button sells — paid in a popup on this page. */
  pay: Pay;
  noLabel: string;
  onNo: () => void;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const r = readResume();
    if (r?.key !== pay.resumeKey) return;
    if (r.paid)
      purchaseThenGo(pay.resumeKey, { value: pay.price, content_name: pay.product }, "/thank-you");
    else setOpen(true);
  }, [pay.resumeKey]);

  return (
    <main className="min-h-screen bg-snack-black font-body text-white">
      <div className="bg-snack-red px-4 py-2 text-center text-xs font-extrabold uppercase sm:text-sm">
        {warning}
      </div>

      {/* Progress bar */}
      <div className="mx-auto max-w-xl px-4 pt-5">
        <div className="flex justify-between text-[11px] font-bold uppercase text-white/70">
          <span>Order placed</span>
          <span>Customize order</span>
          <span>Access</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-snack-yellow" style={{ width: `${step}%` }} />
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-4 py-8 text-center">
        <h1 className="font-display text-3xl font-bold uppercase leading-tight sm:text-5xl">
          {headline}
        </h1>
        <div className="mt-8 text-left">{children}</div>

        <div className="mx-auto mt-10 max-w-xl">
          <CtaButton
            onClick={() => {
              track("InitiateCheckout", {
                content_name: pay.product,
                value: pay.price,
                currency: "USD",
              });
              setOpen(true);
            }}
            sub={yesSub}
          >
            {yesLabel}
          </CtaButton>
          <button onClick={onNo} className="mt-5 text-sm text-white/60 underline hover:text-white">
            {noLabel}
          </button>
        </div>
      </section>

      <FunnelFooter />
      <UpsellPayDialog pay={pay} open={open} onOpenChange={setOpen} />
    </main>
  );
}

/**
 * Payment popup for the OTO / downsell. It stays mounted (hidden) from page load, so Whop's
 * card form is already loaded by the time the buyer clicks "Yes".
 */
function UpsellPayDialog({
  pay,
  open,
  onOpenChange,
}: {
  pay: Pay;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [order, setOrder] = useState<ReturnType<typeof loadOrder>>(null);
  useEffect(() => setOrder(loadOrder()), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 sm:p-4 ${
        open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
      } transition-opacity`}
      onClick={() => onOpenChange(false)}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upsell-pay-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[100dvh] w-full max-w-lg overflow-y-auto bg-white p-5 font-body text-black sm:max-h-[92vh] sm:rounded-xl sm:p-6"
      >
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-sm text-2xl leading-none text-neutral-500 hover:text-black"
        >
          ×
        </button>
        <h2
          id="upsell-pay-title"
          className="pr-8 font-display text-2xl font-bold uppercase leading-tight"
        >
          Add to your order
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          {pay.product} — one-time payment of <strong>{money(pay.price)}</strong>
        </p>
        <div className="mt-4">
          <WhopPay
            planId={pay.planId}
            email={order?.email}
            name={order?.name}
            resumeKey={pay.resumeKey}
            onPaid={() =>
              purchaseThenGo(
                pay.resumeKey,
                { value: pay.price, content_name: pay.product },
                "/thank-you",
              )
            }
          />
        </div>
        <p className="mt-3 text-center text-xs text-neutral-500">
          🔒 Secure payment processed by Whop · 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
