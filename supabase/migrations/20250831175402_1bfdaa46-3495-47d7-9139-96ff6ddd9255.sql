-- Security hardening migration: enable RLS and protect roles
-- 1) Profiles: make role safe and immutable for non-admins
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Guard against unauthorized role changes on INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.role IS NULL THEN
      NEW.role := 'customer';
    END IF;

    IF NEW.role <> 'customer' AND NOT EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND p.role IN ('staff','admin','owner')
    ) THEN
      RAISE EXCEPTION 'Only staff/admin/owner can set role value';
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND p.role IN ('staff','admin','owner')
    ) THEN
      RAISE EXCEPTION 'Only staff/admin/owner can change role';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_role_guard ON public.profiles;
CREATE TRIGGER trg_profiles_role_guard
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_unauthorized_role_change();

-- 2) Enable RLS on public tables flagged by the linter
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_vendors ENABLE ROW LEVEL SECURITY;

-- 3) service_vendors: restrict access to staff/admin/owner only
DROP POLICY IF EXISTS "Staff can select service_vendors" ON public.service_vendors;
CREATE POLICY "Staff can select service_vendors"
ON public.service_vendors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('staff','admin','owner')
  )
);

DROP POLICY IF EXISTS "Staff can insert service_vendors" ON public.service_vendors;
CREATE POLICY "Staff can insert service_vendors"
ON public.service_vendors
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('staff','admin','owner')
  )
);

DROP POLICY IF EXISTS "Staff can update service_vendors" ON public.service_vendors;
CREATE POLICY "Staff can update service_vendors"
ON public.service_vendors
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('staff','admin','owner')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('staff','admin','owner')
  )
);

DROP POLICY IF EXISTS "Staff can delete service_vendors" ON public.service_vendors;
CREATE POLICY "Staff can delete service_vendors"
ON public.service_vendors
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('staff','admin','owner')
  )
);
