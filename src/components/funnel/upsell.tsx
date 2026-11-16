import { useEffect, useState, type ReactNode } from "react";
import { CtaButton, FunnelFooter } from "@/components/funnel/ui";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { readResume, WhopPay } from "@/components/funnel/whop-pay";
import { loadOrder, money } from "@/lib/funnel-config";

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
  const [stateId, setStateId] = useState<string>();
  useEffect(() => {
    const r = readResume();
    if (r?.key === pay.resumeKey) {
      setStateId(r.stateId);
      setOpen(true);
    }
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
          <CtaButton onClick={() => setOpen(true)} sub={yesSub}>
            {yesLabel}
          </CtaButton>
          <button onClick={onNo} className="mt-5 text-sm text-white/60 underline hover:text-white">
            {noLabel}
          </button>
        </div>
      </section>

      <FunnelFooter />
      <UpsellPayDialog pay={pay} open={open} onOpenChange={setOpen} stateId={stateId} />
    </main>
  );
}

function UpsellPayDialog({
  pay,
  open,
  onOpenChange,
  stateId,
}: {
  pay: Pay;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  stateId?: string | undefined;
}) {
  const order = typeof window !== "undefined" ? loadOrder() : null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-none bg-white p-5 font-body text-black sm:max-h-[92vh] sm:rounded-xl sm:p-6">
        <DialogTitle className="font-display text-2xl font-bold uppercase leading-tight">
          Add to your order
        </DialogTitle>
        <DialogDescription className="text-sm text-neutral-600">
          {pay.product} — one-time payment of <strong>{money(pay.price)}</strong>
        </DialogDescription>
        {open && (
          <WhopPay
            planId={pay.planId}
            email={order?.email}
            name={order?.name}
            buttonText={`Add to my order — ${money(pay.price)}`}
            resumeKey={pay.resumeKey}
            stateId={stateId}
            onPaid={() => (window.location.href = "/thank-you")}
          />
        )}
        <p className="text-center text-xs text-neutral-500">
          🔒 Secure payment processed by Whop · 30-day money-back guarantee
        </p>
      </DialogContent>
    </Dialog>
  );
}
