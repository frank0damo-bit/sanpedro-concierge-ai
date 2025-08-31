-- Create payments table for tracking payment information
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (user_id = auth.uid() OR auth.uid() IS NULL AND email = current_setting('request.jwt.claims', true)::jsonb->>'email');

-- Staff can view all payments
CREATE POLICY "Staff can view all payments" 
ON public.payments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('staff', 'admin', 'owner')
));

-- Allow edge functions to insert payments
CREATE POLICY "Edge functions can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

-- Allow edge functions to update payment status
CREATE POLICY "Edge functions can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();