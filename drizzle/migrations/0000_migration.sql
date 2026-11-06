CREATE TABLE public.client_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text NOT NULL,
  goal text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.client_inquiries TO anon, authenticated;
GRANT ALL ON public.client_inquiries TO service_role;
ALTER TABLE public.client_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.client_inquiries
FOR INSERT TO anon, authenticated
WITH CHECK (char_length(full_name) BETWEEN 1 AND 100 AND char_length(email) BETWEEN 3 AND 255 AND char_length(coalesce(message,'')) <= 1000);