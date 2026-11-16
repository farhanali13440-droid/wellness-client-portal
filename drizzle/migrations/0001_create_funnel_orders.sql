CREATE TABLE public.funnel_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  bump boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'buyer')),
  purchases text[] NOT NULL DEFAULT '{}',
  total_usd numeric NOT NULL DEFAULT 0,
  utm_source text,
  utm_campaign text,
  utm_content text
);
GRANT ALL ON public.funnel_orders TO service_role;
REVOKE ALL ON public.funnel_orders FROM anon, authenticated;
ALTER TABLE public.funnel_orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX funnel_orders_created_at_desc_idx ON public.funnel_orders (created_at DESC);
CREATE INDEX funnel_orders_lower_email_idx ON public.funnel_orders (lower(email));