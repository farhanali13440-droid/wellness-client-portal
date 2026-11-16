import { loadOrder, saveOrder, type OrderDraft } from "@/lib/funnel-config";
import { markPaid, saveLead } from "@/lib/orders.functions";

const UTM_KEY = "snack-utm";
type Utm = { utm_source?: string; utm_campaign?: string; utm_content?: string };

/** Remember the ad's UTM tags from the landing URL (first visit in this tab wins). */
export function captureUtm() {
  try {
    const q = new URLSearchParams(window.location.search);
    const utm: Utm = {};
    for (const k of ["utm_source", "utm_campaign", "utm_content"] as const) {
      const v = q.get(k);
      if (v) utm[k] = v.slice(0, 200);
    }
    if (Object.keys(utm).length && !sessionStorage.getItem(UTM_KEY))
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch {
    /* ignore */
  }
}

function loadUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}") as Utm;
  } catch {
    return {};
  }
}

/** Save (or update) the lead in the background; keeps its id with the order. */
export async function recordLead(order: OrderDraft) {
  try {
    const { id } = await saveLead({
      data: {
        name: order.name,
        email: order.email,
        phone: order.phone,
        bump: order.bump,
        ...(order.id ? { id: order.id } : {}),
        utm: loadUtm(),
      },
    });
    const latest = loadOrder();
    if (latest) saveOrder({ ...latest, id });
  } catch (e) {
    console.warn("Lead not saved", e);
  }
}

/** Mark the buyer after a successful payment. Never blocks for more than ~3 seconds. */
export async function recordPaid(key: "main" | "oto" | "downsell") {
  const o = loadOrder();
  const call = markPaid({
    data: {
      key,
      ...(o?.id ? { id: o.id } : {}),
      ...(o?.email
        ? { contact: { name: o.name || "—", email: o.email, phone: o.phone, bump: o.bump } }
        : {}),
    },
  }).catch((e) => console.warn("Purchase not recorded", e));
  await Promise.race([call, new Promise((r) => setTimeout(r, 3000))]);
}
