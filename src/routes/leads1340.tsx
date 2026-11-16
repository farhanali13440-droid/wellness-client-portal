import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { listOrders, productLabel } from "@/lib/orders.functions";

/** Private admin page: leads (filled in step 1) and buyers (paid). Password = LEADS_ADMIN_PASSWORD secret. */
export const Route = createFileRoute("/leads1340")({
  head: () => ({
    meta: [{ title: "Leads & Buyers" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: LeadsPage,
});

type Row = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  bump: boolean;
  status: string;
  purchases: string[];
  total_usd: number;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
};

const PW_KEY = "leads-admin-pw";
type Range = "today" | "7d" | "30d" | "all";
type Filter = "all" | "buyers" | "leads";

function LeadsPage() {
  const [pw, setPw] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date>();

  async function load(password: string) {
    setLoading(true);
    setError(undefined);
    try {
      const res = await listOrders({ data: { password } });
      if (!res.ok) {
        setError(
          res.error === "not-configured"
            ? "Set the LEADS_ADMIN_PASSWORD secret in Lovable (Project Settings → Secrets) first."
            : "Wrong password.",
        );
        setPw(null);
        try {
          sessionStorage.removeItem(PW_KEY);
        } catch {
          /* ignore */
        }
        return;
      }
      setRows(res.rows as Row[]);
      setPw(password);
      setUpdatedAt(new Date());
      try {
        sessionStorage.setItem(PW_KEY, password);
      } catch {
        /* ignore */
      }
    } catch {
      setError("Couldn't load data. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(PW_KEY);
    } catch {
      /* ignore */
    }
    if (saved) void load(saved);
  }, []);

  if (!pw || !rows) return <Login onSubmit={(p) => void load(p)} error={error} loading={loading} />;

  return (
    <Dashboard
      rows={rows}
      loading={loading}
      updatedAt={updatedAt}
      onRefresh={() => void load(pw)}
      onLogout={() => {
        try {
          sessionStorage.removeItem(PW_KEY);
        } catch {
          /* ignore */
        }
        setPw(null);
        setRows(null);
      }}
    />
  );
}

function Login({
  onSubmit,
  error,
  loading,
}: {
  onSubmit: (pw: string) => void;
  error: string | undefined;
  loading: boolean;
}) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(String(new FormData(e.currentTarget).get("pw") ?? ""));
  }
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-100 px-4 font-body">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl font-bold uppercase">Leads &amp; Buyers</h1>
        <p className="mt-1 text-sm text-neutral-500">Enter your admin password.</p>
        <input
          name="pw"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="mt-4 w-full rounded-md border border-neutral-300 px-3 py-3 outline-none focus:ring-2 focus:ring-snack-yellow"
          placeholder="Password"
          required
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="mt-4 w-full rounded-md bg-snack-black py-3 font-semibold text-snack-yellow disabled:opacity-60"
        >
          {loading ? "Checking…" : "Open"}
        </button>
      </form>
    </main>
  );
}

function Dashboard({
  rows,
  loading,
  updatedAt,
  onRefresh,
  onLogout,
}: {
  rows: Row[];
  loading: boolean;
  updatedAt: Date | undefined;
  onRefresh: () => void;
  onLogout: () => void;
}) {
  const [range, setRange] = useState<Range>("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const inRange = useMemo(() => {
    if (range === "all") return rows;
    const now = new Date();
    const start =
      range === "today"
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
        : new Date(now.getTime() - (range === "7d" ? 7 : 30) * 864e5);
    return rows.filter((r) => new Date(r.created_at) >= start);
  }, [rows, range]);

  const stats = useMemo(() => {
    const buyers = inRange.filter((r) => r.status === "buyer");
    const has = (k: string) => buyers.filter((r) => r.purchases.includes(k)).length;
    const revenue = buyers.reduce((s, r) => s + Number(r.total_usd), 0);
    const mainBuyers = has("main") || buyers.length;
    return {
      leads: inRange.length,
      buyers: buyers.length,
      conv: inRange.length ? (buyers.length / inRange.length) * 100 : 0,
      revenue,
      aov: buyers.length ? revenue / buyers.length : 0,
      bump: mainBuyers ? (has("bump") / mainBuyers) * 100 : 0,
      oto: mainBuyers ? (has("oto") / mainBuyers) * 100 : 0,
      downsell: mainBuyers ? (has("downsell") / mainBuyers) * 100 : 0,
    };
  }, [inRange]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return inRange.filter(
      (r) =>
        (filter === "all" || (filter === "buyers" ? r.status === "buyer" : r.status !== "buyer")) &&
        (!s ||
          r.name.toLowerCase().includes(s) ||
          r.email.includes(s) ||
          (r.phone ?? "").includes(s)),
    );
  }, [inRange, filter, q]);

  return (
    <main className="min-h-screen bg-neutral-100 font-body text-neutral-900">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="font-display text-xl font-bold uppercase">Leads &amp; Buyers</h1>
            <p className="text-xs text-neutral-500">
              The Client Snack System
              {updatedAt && ` · updated ${updatedAt.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="rounded-md bg-snack-black px-4 py-2 text-sm font-semibold text-snack-yellow disabled:opacity-60"
            >
              {loading ? "Refreshing…" : "↻ Refresh"}
            </button>
            <button
              onClick={() => downloadCsv(shown)}
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold"
            >
              Export CSV
            </button>
            <button onClick={onLogout} className="px-2 text-sm text-neutral-500 underline">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5">
        <Seg
          value={range}
          onChange={setRange}
          options={[
            ["today", "Today"],
            ["7d", "Last 7 days"],
            ["30d", "Last 30 days"],
            ["all", "All time"],
          ]}
        />

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Leads" value={stats.leads} />
          <Stat label="Buyers" value={stats.buyers} accent />
          <Stat label="Lead → buyer" value={`${stats.conv.toFixed(1)}%`} />
          <Stat label="Revenue" value={`$${stats.revenue.toFixed(0)}`} accent />
          <Stat label="Avg order value" value={`$${stats.aov.toFixed(2)}`} />
          <Stat label="Bump take rate" value={`${stats.bump.toFixed(0)}%`} />
          <Stat label="OTO take rate" value={`${stats.oto.toFixed(0)}%`} />
          <Stat label="Downsell take rate" value={`${stats.downsell.toFixed(0)}%`} />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Seg
            value={filter}
            onChange={setFilter}
            options={[
              ["all", `All (${inRange.length})`],
              ["buyers", `Buyers (${stats.buyers})`],
              ["leads", `Didn't buy (${inRange.length - stats.buyers})`],
            ]}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email or phone"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm sm:w-72"
          />
        </div>

        {shown.length === 0 ? (
          <p className="rounded-xl bg-white p-10 text-center text-neutral-500">
            Nothing here yet. Leads appear as soon as someone fills in step 1 of the checkout.
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-neutral-50 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Purchased</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-neutral-50">
                      <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                        {fmtDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3 font-semibold">{r.name}</td>
                      <td className="px-4 py-3">
                        <a className="hover:underline" href={`mailto:${r.email}`}>
                          {r.email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Phone phone={r.phone} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge buyer={r.status === "buyer"} />
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {r.purchases.length ? r.purchases.map(productLabel).join(", ") : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {Number(r.total_usd) ? `$${Number(r.total_usd).toFixed(0)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-500">{source(r)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {shown.map((r) => (
                <div key={r.id} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-xs text-neutral-500">{fmtDate(r.created_at)}</div>
                    </div>
                    <Badge buyer={r.status === "buyer"} />
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <a className="block break-all" href={`mailto:${r.email}`}>
                      {r.email}
                    </a>
                    <Phone phone={r.phone} />
                    {r.purchases.length > 0 && (
                      <div className="text-neutral-600">
                        {r.purchases.map(productLabel).join(", ")} ·{" "}
                        <b>${Number(r.total_usd).toFixed(0)}</b>
                      </div>
                    )}
                    {source(r) !== "—" && (
                      <div className="text-xs text-neutral-500">{source(r)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <p className="text-center text-xs text-neutral-400">
          Buyers are marked when the payment succeeds on the site. Whop's dashboard is the final
          record for payments and refunds.
        </p>
      </div>
    </main>
  );
}

function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg bg-white p-1 shadow-sm">
      {options.map(([v, l]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
            value === v
              ? "bg-snack-black text-snack-yellow"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 shadow-sm ${accent ? "bg-snack-yellow" : "bg-white"}`}>
      <div
        className={`text-xs font-semibold uppercase ${accent ? "text-black/70" : "text-neutral-500"}`}
      >
        {label}
      </div>
      <div className="mt-1 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function Badge({ buyer }: { buyer: boolean }) {
  return buyer ? (
    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
      Buyer
    </span>
  ) : (
    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">
      Lead
    </span>
  );
}

function Phone({ phone }: { phone: string | null }) {
  if (!phone) return <span className="text-neutral-400">—</span>;
  const digits = phone.replace(/[^\d]/g, "");
  return (
    <span>
      {phone}{" "}
      {digits.length >= 8 && (
        <a
          href={`https://wa.me/${digits}`}
          target="_blank"
          rel="noreferrer"
          className="ml-1 rounded bg-green-600 px-1.5 py-0.5 text-[11px] font-bold text-white"
        >
          WhatsApp
        </a>
      )}
    </span>
  );
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

const source = (r: Row) =>
  [r.utm_source, r.utm_campaign, r.utm_content].filter(Boolean).join(" / ") || "—";

function downloadCsv(rows: Row[]) {
  const head = [
    "Date",
    "Name",
    "Email",
    "Phone",
    "Status",
    "Purchased",
    "Total USD",
    "UTM source",
    "UTM campaign",
    "UTM content",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      new Date(r.created_at).toISOString(),
      r.name,
      r.email,
      r.phone,
      r.status,
      r.purchases.map(productLabel).join("; "),
      r.total_usd,
      r.utm_source,
      r.utm_campaign,
      r.utm_content,
    ]
      .map(esc)
      .join(","),
  );
  const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
