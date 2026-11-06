import type { ReactNode } from "react";
import { CtaButton, FunnelFooter } from "@/components/funnel/ui";

/** Shared layout for OTO + downsell pages: progress bar, warning headline, offer, yes/no. */
export function UpsellLayout({
  step,
  warning,
  headline,
  children,
  yesLabel,
  yesSub,
  onYes,
  noLabel,
  onNo,
  demo,
}: {
  step: number;
  warning: string;
  headline: ReactNode;
  children: ReactNode;
  yesLabel: string;
  yesSub: string;
  onYes: () => void;
  noLabel: string;
  onNo: () => void;
  demo: boolean;
}) {
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
          <CtaButton onClick={onYes} sub={yesSub}>
            {yesLabel}
          </CtaButton>
          {demo && (
            <p className="mt-2 text-[11px] text-white/50">
              Demo mode: no payment link set yet — this skips ahead.
            </p>
          )}
          <button onClick={onNo} className="mt-5 text-sm text-white/60 underline hover:text-white">
            {noLabel}
          </button>
        </div>
      </section>

      <FunnelFooter />
    </main>
  );
}
