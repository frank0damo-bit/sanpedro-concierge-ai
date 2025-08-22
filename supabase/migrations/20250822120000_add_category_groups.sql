-- Add category_group column to service_categories table
ALTER TABLE public.service_categories
ADD COLUMN category_group TEXT;

-- Update existing services with category groups
UPDATE service_categories SET category_group = 'Travel & Transport' WHERE name IN ('Airport Transfers', 'Golf Cart Rentals');
UPDATE service_categories SET category_group = 'Activities & Leisure' WHERE name IN ('Excursions', 'Water Sports Equipment', 'Fishing Charters', 'Cultural Experiences');
UPDATE service_categories SET category_group = 'At Home Services' WHERE name IN ('Private Chef Services', 'Personal Shopping', 'Grocery & Essentials', 'Laundry & Housekeeping');
UPDATE service_categories SET category_group = 'Wellness & Events' WHERE name IN ('Spa & Wellness', 'Photography Services', 'Event Planning', 'Restaurants');
UPDATE service_categories SET category_group = 'Support' WHERE name IN ('Medical & Emergency');
