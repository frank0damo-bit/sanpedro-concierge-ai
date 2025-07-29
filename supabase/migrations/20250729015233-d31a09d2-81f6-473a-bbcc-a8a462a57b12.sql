-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'owner', 'admin'));

-- Create RLS policies for admin/staff access to messages
CREATE POLICY "Staff can view all messages" 
ON public.messages 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('staff', 'owner', 'admin')
  )
);

CREATE POLICY "Staff can create messages to customers" 
ON public.messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  sender_type = 'staff' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('staff', 'owner', 'admin')
  )
);

-- Create RLS policies for admin/staff access to bookings
CREATE POLICY "Staff can view all bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('staff', 'owner', 'admin')
  )
);

CREATE POLICY "Staff can update all bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('staff', 'owner', 'admin')
  )
);

-- Create RLS policies for admin/staff access to customer requests
CREATE POLICY "Staff can view all customer requests" 
ON public.customer_requests 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('staff', 'owner', 'admin')
  )
);

CREATE POLICY "Staff can update all customer requests" 
ON public.customer_requests 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('staff', 'owner', 'admin')
  )
);