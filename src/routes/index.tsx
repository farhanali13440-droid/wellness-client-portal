import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { funnel, money } from "@/lib/funnel-config";
import {
  Check,
  CtaButton,
  FunnelFooter,
  GuaranteeRow,
  GuaranteeSeal,
  SectionTitle,
} from "@/components/funnel/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const title = "Turn Your Free Workouts & Meal Plans Into Paying Buyers | The Client Snack System";
const description =
  "For online fitness trainers & nutritionists: launch a $17 digital snack in 72 hours and turn the buyers into 1:1 coaching clients — without posting all day or sending cold DMs.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SalesPage,
});

/**
 * Testimonials — add real ones as they come in (screenshots go in /public).
 * The section stays hidden while this list is empty.
 */
const testimonials: { name: string; role: string; quote: string; image?: string }[] = [];

function Cta({ label = "Yes! I want paying buyers every day" }: { label?: string }) {
  return (
    <div className="mx-auto max-w-xl">
      <CtaButton
        href="/checkout"
        sub={
          <>
            → Get instant access now for just {money(funnel.prices.main)}{" "}
            <s className="opacity-60">{money(funnel.prices.mainAnchor)}</s>
          </>
        }
      >
        🛒 {label}
      </CtaButton>
      <p className="mt-3 text-center text-xs text-white/60">
        One-time payment · Instant access · 30-day money-back guarantee
      </p>
    </div>
  );
}

function Block({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto max-w-3xl px-4 py-12 sm:py-16 ${className}`}>{children}</section>
  );
}

function Copy({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 space-y-4 text-base leading-relaxed text-white/85 sm:text-lg">
      {children}
    </div>
  );
}

const Hl = ({ children }: { children: ReactNode }) => (
  <span className="text-snack-red">{children}</span>
);
const Y = ({ children }: { children: ReactNode }) => (
  <span className="text-snack-yellow">{children}</span>
);

const steps = [
  {
    n: "Step 1",
    t: "Create Your Digital Snack (in 3 hours)",
    d: "Pick the one problem your clients keep asking you about — and turn it into a $7–$27 product. You'll get 20+ proven fitness & nutrition snack ideas, the 4-part snack structure, and how to record it raw on Loom or your phone. No fancy editing, no studio.",
  },
  {
    n: "Step 2",
    t: "Build Your One-Page Snack Sales Page",
    d: "The short 5-element page that sells while you sleep: pre-headline, headline, subheadline, product image, one button. Plus fill-in-the-blank headlines written for coaches, the order bump that lifts every sale, and a clean checkout.",
  },
  {
    n: "Step 3",
    t: "Launch $10/Day Meta Ads That Pay For Themselves",
    d: "The beginner-friendly ad copy framework, pixel tracking, custom audiences, and the exact campaign + duplication setup. Because buyers pay you upfront, your ads can fund themselves instead of draining your card.",
  },
  {
    n: "Step 4",
    t: "Turn Snack Buyers Into 1:1 Coaching Clients",
    d: "Why someone who pays you $17 is far more likely to pay you $1,500 later — and the 3-tier path (snack → short program → premium coaching) that upgrades them at the moment they trust you most. No pushy sales calls.",
  },
];

const bonuses = [
  {
    t: "Snack Offer Creator AI Prompt",
    d: "Finds your most sellable snack idea from what you already know.",
    v: 47,
  },
  {
    t: "Snack Builder GPT",
    d: "Interviews you and outlines your whole product in 60 minutes.",
    v: 97,
  },
  {
    t: "Fitness Coach Ad Swipe File",
    d: "30 scroll-stopping hooks and ad angles for coaches.",
    v: 67,
  },
  {
    t: "7-Day Snack-to-Client Email Templates",
    d: "Copy-and-paste emails that warm buyers up for coaching.",
    v: 97,
  },
];

const faqs = [
  {
    q: "Is this for fitness coaches or is it generic marketing?",
    a: "It's built for online personal trainers, fitness coaches and nutritionists. Every example, idea list and template uses fitness and nutrition offers — meal plans, workout programs, habit challenges and so on.",
  },
  {
    q: "I've never run an ad. Do I need experience?",
    a: "No. Step 3 assumes you've never opened Ads Manager. You'll follow a simple setup and can start with around $10 a day.",
  },
  {
    q: "I don't have a big following. Will this work?",
    a: "Yes — that's the point. You're not relying on followers. Ads put your snack in front of new people every day, and your audience grows from buyers, not likes.",
  },
  {
    q: "What would I even sell?",
    a: "You don't need to invent anything. Most snacks come from content you already give away: a 7-day meal plan, a home workout, a fat-loss checklist. The AI prompt and GPT help you pick and outline it.",
  },
  {
    q: "Do I have to build the funnel myself?",
    a: "You'll build one simple page and a checkout. Step 2 walks you through it, and the order bump on the next page gives you ready-made templates if you want to go faster.",
  },
  {
    q: "How fast will I see results?",
    a: "It depends on how quickly you move. The system is designed so you can build your snack in a weekend and have ads live within 72 hours. Results vary with your offer, market and budget.",
  },
  {
    q: "How does a $17 buyer turn into a high-ticket client?",
    a: "Through trust. Once someone buys your snack and gets a quick win, you're no longer a stranger. Step 4 shows you how to invite them to the next step at the right moment.",
  },
  {
    q: "Is this a subscription?",
    a: `No. It's a single one-time payment of ${money(funnel.prices.main)}. No recurring charges, no hidden fees.`,
  },
  {
    q: "What if it's not for me?",
    a: "Email us within 30 days and you'll get a full refund. No hoops.",
  },
];

function SalesPage() {
  return (
    <main className="min-h-screen bg-snack-black font-body text-white">
      {/* Top bar */}
      <div className="bg-white px-3 py-1.5 text-center text-[11px] font-bold uppercase text-black sm:text-xs">
        Introductory price {money(funnel.prices.main)} — goes up to $47 soon 🔥
      </div>

      {/* HERO — above the fold */}
      <header className="mx-auto max-w-3xl px-4 pt-6 pb-10 text-center">
        <p className="mx-auto inline-block rounded-sm bg-snack-yellow px-3 py-1.5 text-xs font-extrabold uppercase text-black sm:text-sm">
          For Online Fitness Trainers & Nutritionists: Get Your First Paying Buyers In 72 Hours Or
          Less
        </p>

        <h1 className="mt-5 font-display text-[1.75rem] font-bold uppercase leading-[1.12] sm:text-[2.6rem]">
          How To Turn Your Free Workouts & Meal Plans Into A <Hl>$17 Digital Snack</Hl> That Brings
          You <Hl>Paying Buyers Every Day</Hl> — And Upgrades The Best Into 1:1 Clients
        </h1>
        <div className="mx-auto mt-4 h-0.5 w-2/3 bg-snack-red" />

        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
          Build your own digital snack in 3 hours and launch it within the next 72 hours… even if
          you've never run an ad, never built a funnel, and have fewer than 1,000 followers.
        </p>

        <div className="-mx-2 mt-6 sm:-mx-16">
          <img
            src="/product-stack.webp"
            alt="The Client Snack System: 4-step install guide, walkthrough videos, members area and 4 bonuses for $17"
            width={2279}
            height={1485}
            fetchPriority="high"
            className="h-auto w-full"
          />
        </div>

        <p className="mt-10 font-display text-lg font-bold uppercase sm:text-xl">
          Stop giving your best workouts away for free — start getting paid in 72 hours
        </p>
        <div className="mt-4">
          <Cta />
        </div>
        <div className="mt-8">
          <GuaranteeRow />
        </div>
      </header>

      {/* PROBLEM */}
      <div className="bg-snack-panel">
        <Block>
          <SectionTitle>
            Here's the problem nobody in the <Y>fitness space</Y> wants to admit
          </SectionTitle>
          <Copy>
            <p>You became a coach because you're good at changing people's bodies and habits.</p>
            <p>
              Not to spend your life filming reels, writing captions, posting three times a day,
              replying to comments and sliding into DMs… only to hear{" "}
              <em>"sounds great, but I can't afford it right now."</em>
            </p>
            <p>
              You're doing everything you were told. The transformations. The recipes. The workout
              clips. You're basically running a one-person media company.
            </p>
            <p className="font-semibold text-white">
              And your bank account still doesn't reflect any of it.
            </p>
            <p>
              Without a reliable way to get <strong>paying</strong> people into your world, you're a
              content creator who occasionally coaches. Your income stops the moment you stop
              posting. And every "free consult" is a coin flip.
            </p>
            <p>
              <strong className="text-white">It's not your fault.</strong> The coaching industry
              doesn't reward the best coaches. It rewards the ones with the best system.
            </p>
          </Copy>
        </Block>
      </div>

      {/* MECHANISM */}
      <Block>
        <SectionTitle>
          What if strangers <Y>paid you first</Y> — before you ever spoke to them?
        </SectionTitle>
        <Copy>
          <p>
            Instead of convincing cold strangers to trust you with $1,000+ right away, you let them
            prove they're a buyer first.
          </p>
          <p>
            You take one piece of content you'd normally give away — a 7-day meal plan, a 20-minute
            home workout, a "lose your first 3 kg" checklist — and package it as a{" "}
            <strong className="text-white">Digital Snack</strong>: a small $7–$27 product that
            solves one problem fast.
          </p>
          <p>
            A simple ad sends people to a one-page offer. They buy. You get paid immediately — which
            means your ads can pay for themselves.
          </p>
          <p>
            And here's the part that feels almost unfair: the people who buy a $17 snack and get a
            quick win are the same people who later want your 1:1 coaching. Freebie-seekers filter
            themselves out. Real buyers filter themselves in.
          </p>
        </Copy>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Snack", "A $17 product that solves one problem in 7 days or less"],
            ["2", "Buyers", "Low-cost ads turn strangers into paying customers"],
            ["3", "Clients", "The best buyers upgrade to your premium coaching"],
          ].map(([n, t, d]) => (
            <div
              key={n}
              className="rounded-lg border border-snack-yellow/40 bg-snack-panel p-5 text-center"
            >
              <div className="font-display text-4xl font-bold text-snack-yellow">{n}</div>
              <div className="mt-1 font-display text-xl font-bold uppercase">{t}</div>
              <p className="mt-2 text-sm text-white/75">{d}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* INTRO / STORY — edit this to your own story */}
      <div className="bg-snack-panel">
        <Block>
          <SectionTitle>
            Let me introduce myself <span className="text-white/60">(briefly, I promise)</span>
          </SectionTitle>
          <Copy>
            <p>My name is Farhan, and I build client-getting systems for health businesses.</p>
            <p>
              I've spent years running lead generation, websites and Meta ads for clinics and health
              professionals — people who are brilliant at what they do but were stuck relying on
              referrals and endless posting.
            </p>
            <p>
              The pattern was always the same: the ones who grew fastest weren't the best at their
              craft. They had a system that brought in people who had <em>already paid</em> for
              something small. Those buyers trusted them, showed up, and said yes to the bigger
              offer.
            </p>
            <p>
              So I took the same low-ticket "buyer first" approach that direct-response marketers
              have used for decades and rebuilt it step by step for fitness trainers and
              nutritionists — in plain language, with examples from your world.
            </p>
            <p className="font-semibold text-white">
              That's exactly what {funnel.product} gives you.
            </p>
          </Copy>
        </Block>
      </div>

      {/* EVEN IF */}
      <Block>
        <SectionTitle>
          This works <Y>even if…</Y>
        </SectionTitle>
        <ul className="mt-6 space-y-3 text-base text-white/85 sm:text-lg">
          <Check>
            You've never run an ad in your life (Step 3 walks you through it click by click)
          </Check>
          <Check>You don't have a big audience or many followers</Check>
          <Check>
            You've tried ads before and lost money (selling a snack first is completely different
            from sending cold traffic to a coaching call)
          </Check>
          <Check>You're not "techy" and the word funnel makes your eye twitch</Check>
          <Check>You have no idea what product to make yet</Check>
        </ul>
        <div className="mt-10">
          <Cta />
        </div>
      </Block>

      {/* WHAT'S INSIDE */}
      <div className="bg-snack-panel">
        <Block>
          <SectionTitle>
            The 4-step install: <Y>what's inside</Y>
          </SectionTitle>
          <p className="mt-3 text-white/75">
            A step-by-step guide with a short walkthrough video for every step. No fluff, no mindset
            chapter — just the system, in the right order.
          </p>
          <div className="mt-8 space-y-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-lg border-l-4 border-snack-yellow bg-black/50 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-snack-yellow">
                  {s.n}
                </div>
                <h3 className="mt-1 font-display text-xl font-bold uppercase sm:text-2xl">{s.t}</h3>
                <p className="mt-2 text-white/80">{s.d}</p>
              </div>
            ))}
          </div>
        </Block>
      </div>

      {/* YOU COULD FIGURE IT OUT */}
      <Block>
        <SectionTitle>You could figure this out yourself. But…</SectionTitle>
        <Copy>
          <p>
            You'd need to study direct-response marketing for months, run dozens of failed ad tests
            with your own money, and learn offer creation, funnel building, ad copy and the
            psychology of low-ticket buyers — all from sources that don't agree with each other.
          </p>
          <p className="font-semibold text-white">
            Or you can get the whole thing compressed, organized and built for fitness coaches —
            today.
          </p>
        </Copy>
      </Block>

      {/* VALUE STACK + PRICE */}
      <div className="bg-snack-panel">
        <Block className="text-center">
          <SectionTitle>
            Here's <Y>everything</Y> you get today
          </SectionTitle>
          <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-lg border-2 border-snack-yellow text-left">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-black/60 p-4">
              <div>
                <div className="font-display text-lg font-bold uppercase">{funnel.product}</div>
                <div className="text-sm text-white/70">
                  The complete 4-step install guide + walkthrough videos
                </div>
              </div>
              <div className="shrink-0 font-bold text-snack-yellow">
                {money(funnel.prices.mainAnchor)}
              </div>
            </div>
            {bonuses.map((b, i) => (
              <div
                key={b.t}
                className="flex items-start justify-between gap-4 border-b border-white/10 p-4"
              >
                <div>
                  <div className="text-xs font-bold uppercase text-snack-yellow">
                    Bonus #{i + 1}
                  </div>
                  <div className="font-semibold">{b.t}</div>
                  <div className="text-sm text-white/70">{b.d}</div>
                </div>
                <div className="shrink-0 font-bold text-snack-yellow">{money(b.v)}</div>
              </div>
            ))}
            <div className="bg-snack-yellow p-4 text-center text-black">
              <div className="text-sm font-bold uppercase">
                Total value:{" "}
                <s>{money(funnel.prices.mainAnchor + bonuses.reduce((a, b) => a + b.v, 0))}</s>
              </div>
              <div className="font-display text-3xl font-bold uppercase">
                Today: just {money(funnel.prices.main)}
              </div>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-white/80">
            That's less than a protein shake and a coffee. The kind of money you'd spend without
            thinking — except this could change how your business gets clients.
          </p>
          <div className="mt-8">
            <Cta label={`Yes — give me the system for ${money(funnel.prices.main)}`} />
          </div>
        </Block>
      </div>

      {/* TESTIMONIALS (hidden until you add real ones) */}
      {testimonials.length > 0 && (
        <Block>
          <SectionTitle>Don't just take my word for it</SectionTitle>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-lg bg-snack-panel p-5">
                {t.image && <img src={t.image} alt="" className="mb-3 w-full rounded" />}
                <blockquote className="text-white/85">"{t.quote}"</blockquote>
                <figcaption className="mt-3 text-sm font-semibold">
                  {t.name} <span className="font-normal text-white/60">· {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Block>
      )}

      {/* WHY SO CHEAP */}
      <Block>
        <SectionTitle>
          Why is this only <Y>{money(funnel.prices.main)}</Y>?
        </SectionTitle>
        <Copy>
          <p>
            <strong className="text-white">First:</strong> a $2,000 course sits unopened in people's
            inboxes. A $17 guide gets opened, used and implemented. That's better for both of us.
          </p>
          <p>
            <strong className="text-white">Second:</strong> when it works for you, some of you will
            want more help — a live workshop, or to have the whole system installed for you.
            Charging $17 to prove I know what I'm talking about is a smart long-term strategy.
          </p>
          <p>
            <strong className="text-white">Third:</strong> spending $17 filters <em>you</em> in.
            You're not here to collect free PDFs. Coaches who act for $17 tend to get results.
          </p>
          <p>Yes, I'm using the exact system I'm teaching you. That's the point.</p>
        </Copy>
      </Block>

      {/* GUARANTEE */}
      <div className="bg-snack-panel">
        <Block>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <GuaranteeSeal className="size-28" />
            <div>
              <SectionTitle>The no-brainer guarantee</SectionTitle>
              <p className="mt-3 text-white/85 sm:text-lg">
                Go through the system. If you don't feel it was worth far more than{" "}
                {money(funnel.prices.main)}, email{" "}
                <span className="text-snack-yellow">{funnel.supportEmail}</span> within 30 days and
                you'll get every cent back. No forms, no questions, no hard feelings.
              </p>
            </div>
          </div>
        </Block>
      </div>

      {/* PRICE GOING UP + WARNING */}
      <Block>
        <SectionTitle>One more thing: the price will go up</SectionTitle>
        <Copy>
          <p>
            {money(funnel.prices.main)} is an introductory price. There's no fake countdown timer on
            this page — but the next time you land here it may say $47 or more.
          </p>
        </Copy>
        <div className="mt-10 rounded-lg border-2 border-snack-red p-6">
          <div className="font-display text-2xl font-bold uppercase text-snack-red">⚠ Warning</div>
          <p className="mt-3 text-white/85">
            If you're hoping to watch the videos, feel inspired for a day and go back to posting and
            praying — please don't buy this. It's built for coaches who are ready to do the work and
            build a system that makes getting clients predictable.
          </p>
        </div>
      </Block>

      {/* FINAL CTA */}
      <div className="bg-gradient-to-b from-snack-panel to-snack-black">
        <Block className="text-center">
          <SectionTitle>
            This is your chance to stop <Hl>chasing</Hl> clients
          </SectionTitle>
          <ul className="mx-auto mt-6 max-w-lg space-y-3 text-left text-white/85">
            <Check>Paying buyers coming in from people who've never heard of you</Check>
            <Check>Buyers who upgrade to 1:1 coaching without cold DMs</Check>
            <Check>A business that doesn't depend on whether the algorithm liked your reel</Check>
          </ul>
          <p className="mt-6 font-semibold">
            It's {money(funnel.prices.main)}. The guarantee is real. The system works when you work
            it.
          </p>
          <div className="mt-6">
            <Cta label="Yes — I'm ready for paying buyers" />
          </div>
        </Block>
      </div>

      {/* FAQ */}
      <Block>
        <SectionTitle>Questions you might have</SectionTitle>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-white/15">
              <AccordionTrigger className="text-left text-base font-semibold text-white hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-white/80">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-8 text-center text-white/70">
          More questions? Email{" "}
          <a className="text-snack-yellow underline" href={`mailto:${funnel.supportEmail}`}>
            {funnel.supportEmail}
          </a>{" "}
          — I actually reply.
        </p>
        <div className="mt-8">
          <Cta />
        </div>
      </Block>

      <FunnelFooter />
    </main>
  );
}
