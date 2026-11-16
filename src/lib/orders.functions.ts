import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { funnel } from "@/lib/funnel-config";

/**
 * Leads & buyers, stored in the private `funnel_orders` table.
 * The table has no public access: everything goes through these server functions,
 * which use the service-role client on the server only.
 */

const db = async () => (await import("@/integrations/supabase/client.server")).supabaseAdmin;

const contact = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  bump: z.boolean().default(false),
});
const utm = z
  .object({
    utm_source: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
  })
  .default({});

/** Step 1 of checkout: create (or update) the lead. Returns its id. */
export const saveLead = createServerFn({ method: "POST" })
  .inputValidator(contact.extend({ id: z.string().uuid().optional(), utm }))
  .handler(async ({ data }) => {
    const supabase = await db();
    const row = {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      bump: data.bump,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { data: upd } = await supabase
        .from("funnel_orders")
        .update(row)
        .eq("id", data.id)
        .select("id")
        .maybeSingle();
      if (upd) return { id: upd.id };
    }
    const { data: ins, error } = await supabase
      .from("funnel_orders")
      .insert({
        ...row,
        utm_source: data.utm.utm_source ?? null,
        utm_campaign: data.utm.utm_campaign ?? null,
        utm_content: data.utm.utm_content ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

const PRODUCTS = {
  main: { label: "Client Snack System", price: () => funnel.prices.main },
  oto: { label: "DFY Funnel Kit (OTO)", price: () => funnel.prices.oto },
  downsell: { label: "Funnel Templates (downsell)", price: () => funnel.prices.downsell },
} as const;

/** After a successful Whop payment: mark the lead as a buyer and add the purchase (once). */
export const markPaid = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      key: z.enum(["main", "oto", "downsell"]),
      id: z.string().uuid().optional(),
      contact: contact.optional(),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = await db();
    let row: { id: string; bump: boolean; purchases: string[]; total_usd: number } | null = null;
    if (data.id) {
      const { data: r } = await supabase
        .from("funnel_orders")
        .select("id,bump,purchases,total_usd")
        .eq("id", data.id)
        .maybeSingle();
      row = r;
    }
    if (!row && data.contact) {
      const { data: r, error } = await supabase
        .from("funnel_orders")
        .insert({
          name: data.contact.name,
          email: data.contact.email.toLowerCase(),
          phone: data.contact.phone || null,
          bump: data.contact.bump,
        })
        .select("id,bump,purchases,total_usd")
        .single();
      if (error) throw new Error(error.message);
      row = r;
    }
    if (!row) return { ok: false };

    const keys = data.key === "main" && row.bump ? ["main", "bump"] : [data.key];
    const fresh = keys.filter((k) => !row.purchases.includes(k));
    if (fresh.length === 0) return { ok: true, id: row.id };
    const add = fresh.reduce(
      (sum, k) =>
        sum + (k === "bump" ? funnel.prices.bump : PRODUCTS[k as keyof typeof PRODUCTS].price()),
      0,
    );
    await supabase
      .from("funnel_orders")
      .update({
        status: "buyer",
        purchases: [...row.purchases, ...fresh],
        total_usd: Number(row.total_usd) + add,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    return { ok: true, id: row.id };
  });

/** Admin page: list everything, behind the LEADS_ADMIN_PASSWORD secret. */
export const listOrders = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().max(200) }))
  .handler(async ({ data }) => {
    const expected = process.env["LEADS_ADMIN_PASSWORD"];
    if (!expected) return { ok: false as const, error: "not-configured" as const };
    if (!safeEqual(data.password, expected)) {
      await new Promise((r) => setTimeout(r, 800)); // slow down guessing
      return { ok: false as const, error: "wrong-password" as const };
    }
    const supabase = await db();
    const { data: rows, error } = await supabase
      .from("funnel_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(error.message);
    return { ok: true as const, rows: rows ?? [] };
  });

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const productLabel = (k: string) =>
  k === "bump" ? "Snack Templates (bump)" : (PRODUCTS[k as keyof typeof PRODUCTS]?.label ?? k);
