-- Create payments table to track one-time payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Allow nulls for guest payments
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  guest_email TEXT, -- Store email for guest payments
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
FOR SELECT
USING (user_id = auth.uid());

-- Allow edge functions to insert and update payments
CREATE POLICY "Edge functions can insert payments" ON public.payments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Edge functions can update payments" ON public.payments
FOR UPDATE
USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();