import type { ReactNode } from "react";
import { funnel, money } from "@/lib/funnel-config";

/** Big yellow call-to-action button (two lines: promise + price). */
export function CtaButton({
  children,
  sub,
  onClick,
  href,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  sub?: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls =
    "group block w-full rounded-md bg-snack-yellow px-4 py-4 text-center text-black shadow-[0_6px_0_var(--snack-yellow-dark)] transition active:translate-y-1 active:shadow-[0_2px_0_var(--snack-yellow-dark)] hover:brightness-105 disabled:opacity-60";
  const inner = (
    <>
      <span className="block font-display text-lg font-bold uppercase leading-tight sm:text-2xl">
        {children}
      </span>
      {sub && <span className="mt-1 block text-xs font-semibold sm:text-sm">{sub}</span>}
    </>
  );
  if (href)
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

export function GuaranteeSeal({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid size-20 shrink-0 place-items-center rounded-full border-4 border-double border-snack-yellow bg-gradient-to-b from-snack-yellow to-snack-yellow-dark text-center text-black ${className}`}
    >
      <div className="font-display leading-none">
        <div className="text-2xl font-bold">30</div>
        <div className="text-[9px] font-bold uppercase">Day Money</div>
        <div className="text-[9px] font-bold uppercase">Back</div>
      </div>
    </div>
  );
}

export function GuaranteeRow() {
  return (
    <div className="mx-auto flex max-w-md items-center gap-4 text-left text-sm text-white/85">
      <GuaranteeSeal />
      <p>
        <strong className="text-white">Get your first buyers or get your money back.</strong> You're
        covered by a no-questions-asked 30-day guarantee. Just email us for a full refund.
      </p>
    </div>
  );
}

/** Original product mockup built in CSS — laptop + 4 step guides + bonus cards + price badge. */
export function ProductMockup() {
  const books = [
    { n: "01", t: "Create Your Snack" },
    { n: "02", t: "Snack Sales Page" },
    { n: "03", t: "$10/Day Ads" },
    { n: "04", t: "Buyers → Clients" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md select-none pt-6" aria-hidden>
      {/* Laptop */}
      <div className="relative mx-auto w-[78%]">
        <div className="rounded-t-lg border-[6px] border-neutral-800 bg-neutral-900 p-3 shadow-2xl">
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded bg-gradient-to-br from-neutral-950 to-neutral-800 text-center">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded bg-snack-yellow font-display text-sm font-bold text-black">
                72
              </span>
              <span className="font-display text-xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                Client <span className="text-snack-yellow">Snack</span>
              </span>
            </div>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
              System
            </span>
            <span className="rounded bg-snack-yellow px-2 py-0.5 text-[8px] font-bold uppercase text-black sm:text-[10px]">
              For fitness coaches & nutritionists
            </span>
          </div>
        </div>
        <div className="mx-[-8%] h-3 rounded-b-xl bg-gradient-to-b from-neutral-500 to-neutral-700" />
      </div>

      {/* Price badge */}
      <div className="absolute right-[8%] top-0 grid size-16 rotate-12 place-items-center rounded-full bg-gradient-to-b from-snack-yellow to-snack-yellow-dark font-display text-2xl font-bold text-black shadow-lg sm:size-20 sm:text-3xl">
        {money(funnel.prices.main)}
      </div>

      {/* Step guides */}
      <div className="relative -mt-10 flex items-end justify-center gap-1.5 sm:gap-3">
        {books.map((b, i) => (
          <div
            key={b.n}
            className="flex aspect-[3/4] w-[21%] flex-col justify-between rounded-sm border border-snack-yellow/60 bg-gradient-to-b from-neutral-900 to-black p-1.5 shadow-xl sm:p-2.5"
            style={{ transform: `translateY(${i % 2 ? 0 : 8}px) rotate(${(i - 1.5) * 2}deg)` }}
          >
            <span className="font-display text-lg font-bold text-snack-yellow sm:text-2xl">
              {b.n}
            </span>
            <span className="font-display text-[9px] font-bold uppercase leading-tight text-white sm:text-sm">
              {b.t}
            </span>
            <span className="h-1 w-full rounded bg-snack-yellow" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FunnelFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-8 text-center text-[11px] leading-relaxed text-white/50">
      <p className="font-semibold text-white/70">{funnel.brand}</p>
      <p className="mt-1">
        Questions?{" "}
        <a className="underline" href={`mailto:${funnel.supportEmail}`}>
          {funnel.supportEmail}
        </a>
      </p>
      <p className="mx-auto mt-3 max-w-2xl">
        This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is
        NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
      </p>
      <p className="mx-auto mt-2 max-w-2xl">
        Earnings disclaimer: results vary. We make no guarantee of income. Any examples are not
        typical and depend on your offer, effort, market and ad spend.
      </p>
      <p className="mt-3">
        © {new Date().getFullYear()} {funnel.brand}. All rights reserved.
      </p>
    </footer>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
      {children}
    </h2>
  );
}

export function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-snack-green text-xs font-bold text-black">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}
