-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin', 'owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create service categories table
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  features TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_category_id UUID REFERENCES public.service_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  preferred_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customer requests table
CREATE TABLE public.customer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table for admin conversations
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.customer_requests(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'staff')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK ((booking_id IS NOT NULL AND request_id IS NULL) OR (booking_id IS NULL AND request_id IS NOT NULL))
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service categories policies (public read)
CREATE POLICY "Anyone can view active service categories" ON public.service_categories FOR SELECT USING (active = true);
CREATE POLICY "Staff can manage service categories" ON public.service_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
);
CREATE POLICY "Staff can update all bookings" ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
);

-- Customer requests policies
CREATE POLICY "Users can view their own requests" ON public.customer_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own requests" ON public.customer_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own requests" ON public.customer_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all requests" ON public.customer_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
);
CREATE POLICY "Staff can update all requests" ON public.customer_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
);

-- Messages policies
CREATE POLICY "Users can view messages for their bookings/requests" ON public.messages FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
);
CREATE POLICY "Users can create messages for their bookings/requests" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_requests_updated_at BEFORE UPDATE ON public.customer_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default service categories
INSERT INTO public.service_categories (name, description, icon_name, active) VALUES
('Airport Transfer', 'Professional airport pickup and drop-off services', 'car', true),
('Private Chef', 'Personal chef services for your dining needs', 'chef-hat', true),
('Spa & Wellness', 'Relaxing spa treatments and wellness services', 'heart', true),
('Water Sports', 'Exciting water activities and sports equipment', 'waves', true),
('Cultural Experience', 'Local cultural tours and authentic experiences', 'camera', true),
('Event Planning', 'Professional event planning and coordination', 'calendar', true),
('Photography', 'Professional photography services', 'camera', true),
('Personal Shopping', 'Personalized shopping and styling services', 'shopping-bag', true),
('Laundry & Housekeeping', 'Professional cleaning and laundry services', 'home', true),
('Grocery Essentials', 'Fresh groceries and essential items delivery', 'shopping-cart', true),
('Medical Emergency', '24/7 medical assistance and emergency services', 'heart-pulse', true),
('Fishing Charter', 'Deep sea fishing charters and boat rentals', 'fish', true);