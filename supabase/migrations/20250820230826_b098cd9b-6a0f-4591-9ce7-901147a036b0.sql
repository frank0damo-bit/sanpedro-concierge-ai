-- Create curated packages table
CREATE TABLE public.curated_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  total_price NUMERIC NOT NULL DEFAULT 0,
  party_size INTEGER NOT NULL DEFAULT 1,
  travel_dates JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create curated package items table
CREATE TABLE public.curated_package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.curated_packages(id) ON DELETE CASCADE,
  service_category_id UUID REFERENCES public.service_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.curated_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_package_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for curated_packages
CREATE POLICY "Users can view their own packages" 
ON public.curated_packages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own packages" 
ON public.curated_packages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own packages" 
ON public.curated_packages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all packages" 
ON public.curated_packages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['staff', 'admin', 'owner'])
));

-- RLS policies for curated_package_items
CREATE POLICY "Users can view items for their own packages" 
ON public.curated_package_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.curated_packages 
  WHERE curated_packages.id = package_id 
  AND curated_packages.user_id = auth.uid()
));

CREATE POLICY "Users can create items for their own packages" 
ON public.curated_package_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.curated_packages 
  WHERE curated_packages.id = package_id 
  AND curated_packages.user_id = auth.uid()
));

CREATE POLICY "Users can update items for their own packages" 
ON public.curated_package_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.curated_packages 
  WHERE curated_packages.id = package_id 
  AND curated_packages.user_id = auth.uid()
));

CREATE POLICY "Staff can view all package items" 
ON public.curated_package_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['staff', 'admin', 'owner'])
));

-- Add trigger for updated_at
CREATE TRIGGER update_curated_packages_updated_at
BEFORE UPDATE ON public.curated_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();