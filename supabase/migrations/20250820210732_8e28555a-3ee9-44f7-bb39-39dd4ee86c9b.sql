-- Add new columns for service categorization and ordering
ALTER TABLE public.service_categories 
ADD COLUMN category_group text,
ADD COLUMN sort_order integer DEFAULT 0;

-- Clear existing test data and add curated Belize travel services
DELETE FROM public.service_categories;

-- Transportation Services
INSERT INTO public.service_categories (name, description, icon_name, image_url, price, features, category_group, sort_order, active) VALUES
('Flight Booking', 'Round-trip flights to Belize City with major airlines. We handle all arrangements including connections and seat preferences.', 'plane', '/src/assets/airport-transfer.jpg', 800.00, ARRAY['Round-trip flights', 'Seat selection', 'Meal preferences', 'Travel insurance options'], 'Transportation', 1, true),
('Airport Transfer', 'Private transfer service from Belize City airport to your accommodation. Professional drivers with air-conditioned vehicles.', 'car', '/src/assets/airport-transfer.jpg', 75.00, ARRAY['Private vehicle', 'Professional driver', 'Airport pickup', 'Direct to hotel'], 'Transportation', 2, true),
('Golf Cart Rental', 'Essential transportation for San Pedro and Caye Caulker. Daily or weekly rentals with full insurance coverage.', 'truck', '/src/assets/water-sports.jpg', 45.00, ARRAY['Daily/weekly rates', 'Full insurance', 'Free delivery', '24/7 support'], 'Transportation', 3, true),
('Water Taxi Service', 'Regular ferry service between the mainland and cayes. Comfortable boats with scenic coastal views.', 'ship', '/src/assets/water-sports.jpg', 25.00, ARRAY['Scheduled departures', 'Scenic route', 'Luggage included', 'Weather protection'], 'Transportation', 4, true);

-- Lodging Services
INSERT INTO public.service_categories (name, description, icon_name, image_url, price, features, category_group, sort_order, active) VALUES
('Resort Booking', 'Luxury beachfront resorts and eco-lodges. From all-inclusive packages to boutique jungle retreats.', 'hotel', '/src/assets/san-pedro-hero.jpg', 250.00, ARRAY['Beachfront locations', 'All-inclusive options', 'Spa services', 'Activity packages'], 'Lodging', 1, true),
('Vacation Rental', 'Private homes, condos, and villas for families and groups. Fully equipped with kitchens and local amenities.', 'home', '/src/assets/san-pedro-hero.jpg', 180.00, ARRAY['Full kitchen', 'Private space', 'Local neighborhood', 'Weekly discounts'], 'Lodging', 2, true),
('Eco-Lodge Booking', 'Sustainable jungle lodges and wildlife sanctuaries. Perfect for nature lovers and adventure seekers.', 'trees', '/src/assets/cultural-experience.jpg', 120.00, ARRAY['Sustainable practices', 'Wildlife viewing', 'Guided nature walks', 'Educational programs'], 'Lodging', 3, true);

-- Experiences & Excursions
INSERT INTO public.service_categories (name, description, icon_name, image_url, price, features, category_group, sort_order, active) VALUES
('Scuba Diving', 'Explore the Belize Barrier Reef, Blue Hole, and pristine coral formations. All skill levels welcome.', 'waves', '/src/assets/water-sports.jpg', 120.00, ARRAY['Blue Hole dives', 'Barrier reef exploration', 'Equipment included', 'Certified instructors'], 'Experiences', 1, true),
('Snorkeling Tours', 'Half and full-day snorkeling adventures to the best reef sites. Perfect for families and beginners.', 'fish', '/src/assets/water-sports.jpg', 65.00, ARRAY['Equipment provided', 'Marine life spotting', 'Lunch included', 'Multiple sites'], 'Experiences', 2, true),
('Fishing Charter', 'Deep sea and reef fishing with experienced local captains. Catch tarpon, snapper, and trophy fish.', 'anchor', '/src/assets/fishing-charter.jpg', 400.00, ARRAY['Experienced captain', 'Equipment included', 'Bait provided', 'Fish cleaning service'], 'Experiences', 3, true),
('Mayan Ruins Tour', 'Guided tours to ancient Mayan sites including Caracol, Xunantunich, and Lamanai. Rich cultural history.', 'landmark', '/src/assets/cultural-experience.jpg', 95.00, ARRAY['Expert guides', 'Transportation included', 'Historical insights', 'Photo opportunities'], 'Experiences', 4, true),
('Cave Tubing', 'Float through ancient cave systems on inner tubes. Unique underground adventure with crystal formations.', 'mountain', '/src/assets/cultural-experience.jpg', 85.00, ARRAY['Equipment provided', 'Safety briefing', 'Underground caves', 'Crystal formations'], 'Experiences', 5, true),
('Zip Line Adventure', 'Canopy tours through the jungle with breathtaking views. Multiple platforms and safety equipment.', 'zap', '/src/assets/cultural-experience.jpg', 75.00, ARRAY['Safety equipment', 'Multiple platforms', 'Jungle views', 'Photography service'], 'Experiences', 6, true);

-- Essential Services
INSERT INTO public.service_categories (name, description, icon_name, image_url, price, features, category_group, sort_order, active) VALUES
('Travel Insurance', 'Comprehensive coverage for your Belize adventure including medical, trip cancellation, and adventure sports.', 'shield-check', '/src/assets/medical-emergency.jpg', 45.00, ARRAY['Medical coverage', 'Trip cancellation', 'Adventure sports', '24/7 assistance'], 'Essentials', 1, true),
('Currency Exchange', 'Secure money exchange services with competitive rates. US dollars widely accepted in Belize.', 'banknote', '/src/assets/personal-shopping.jpg', 5.00, ARRAY['Competitive rates', 'Secure service', 'Multiple currencies', 'Convenient locations'], 'Essentials', 2, true),
('Local SIM Card', 'Stay connected with local mobile service. Data plans and calling packages for your entire stay.', 'smartphone', '/src/assets/personal-shopping.jpg', 25.00, ARRAY['Data packages', 'Local calling', 'Easy setup', 'Coverage nationwide'], 'Essentials', 3, true),
('Grocery Shopping', 'Pre-arrival grocery service for vacation rentals. Stock your kitchen with local and imported goods.', 'shopping-bag', '/src/assets/grocery-essentials.jpg', 15.00, ARRAY['Pre-arrival service', 'Local products', 'Custom requests', 'Delivery included'], 'Essentials', 4, true);

-- Luxury Services
INSERT INTO public.service_categories (name, description, icon_name, image_url, price, features, category_group, sort_order, active) VALUES
('Private Chef', 'Personal chef service featuring local Belizean cuisine and international dishes. Perfect for special occasions.', 'chef-hat', '/src/assets/private-chef.jpg', 180.00, ARRAY['Local cuisine', 'Custom menus', 'Shopping included', 'Special occasions'], 'Luxury', 1, true),
('Spa & Wellness', 'Relaxing spa treatments and wellness services. Massage, facials, and holistic healing in paradise.', 'heart', '/src/assets/spa-wellness.jpg', 95.00, ARRAY['Professional therapists', 'Natural products', 'Beachside treatments', 'Couples packages'], 'Luxury', 2, true),
('Photography Service', 'Professional vacation photography to capture your Belize memories. Engagement, family, and adventure shoots.', 'camera', '/src/assets/photography.jpg', 150.00, ARRAY['Professional equipment', 'Multiple locations', 'Digital gallery', 'Print packages'], 'Luxury', 3, true),
('Event Planning', 'Complete wedding and event planning services. From beach ceremonies to jungle celebrations.', 'calendar', '/src/assets/event-planning.jpg', 500.00, ARRAY['Full planning service', 'Vendor coordination', 'Decoration setup', 'Day-of coordination'], 'Luxury', 4, true);