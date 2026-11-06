import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Nutrition & Online Fitness Coaching — Start Today" },
      {
        name: "description",
        content:
          "Personalized nutrition plans and online fitness training. Book your free consultation.",
      },
      { property: "og:title", content: "Nutrition & Online Fitness Coaching" },
      {
        property: "og:description",
        content:
          "Personalized nutrition plans and online fitness training. Book your free consultation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const services = [
  {
    title: "Nutrition Plans",
    text: "Meal plans built around your body, goals and food preferences.",
  },
  { title: "Online Training", text: "Workout programs you can follow at home or in the gym." },
  {
    title: "Weekly Check-ins",
    text: "Progress reviews and adjustments so you keep moving forward.",
  },
];

function Index() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    const { error } = await supabase.from("client_inquiries").insert({
      full_name: String(f.get("full_name")).trim(),
      email: String(f.get("email")).trim(),
      phone: String(f.get("phone") || "").trim() || null,
      service: String(f.get("service")),
      goal: String(f.get("goal")),
      message: String(f.get("message") || "").trim() || null,
    });
    setStatus(error ? "error" : "done");
  }

  const input =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Nutrition & Fitness Coaching
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Eat better. Train smarter. Feel stronger.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Get a personal nutrition plan and online training program designed just for you. Fill in
          the form for a free consultation.
        </p>
        <a
          href="#start"
          className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Book a free consultation
        </a>
      </header>

      <section className="mx-auto grid max-w-3xl gap-4 px-6 sm:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="rounded-lg border p-5">
            <h2 className="font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </section>

      <section id="start" className="mx-auto max-w-xl px-6 py-16">
        <h2 className="text-2xl font-bold">Start your journey</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us a little about yourself and we'll get back to you.
        </p>

        {status === "done" ? (
          <div className="mt-6 rounded-lg border p-6 text-center">
            <h3 className="font-semibold">Thank you!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your request has been received. We'll contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              name="full_name"
              required
              maxLength={100}
              placeholder="Full name"
              className={input}
            />
            <input
              name="email"
              type="email"
              required
              maxLength={255}
              placeholder="Email"
              className={input}
            />
            <input
              name="phone"
              maxLength={30}
              placeholder="Phone / WhatsApp (optional)"
              className={input}
            />
            <select name="service" required className={input} defaultValue="">
              <option value="" disabled>
                What do you need?
              </option>
              <option>Nutrition plan</option>
              <option>Online fitness training</option>
              <option>Both nutrition & training</option>
            </select>
            <select name="goal" required className={input} defaultValue="">
              <option value="" disabled>
                Your main goal
              </option>
              <option>Lose weight</option>
              <option>Build muscle</option>
              <option>Improve health & energy</option>
              <option>Sports performance</option>
            </select>
            <textarea
              name="message"
              maxLength={1000}
              rows={4}
              placeholder="Anything else we should know? (optional)"
              className={input}
            />
            {status === "error" && (
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            )}
            <button
              disabled={status === "sending"}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Get my free consultation"}
            </button>
          </form>
        )}
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nutrition & Fitness Coaching
      </footer>
    </main>
  );
}
