-- Add relocation-specific services
INSERT INTO service_categories (name, description, icon_name, is_active, category_group) VALUES
('Long-Term Rentals', 'Find the perfect long-term home in San Pedro', 'home', true, 'Relocation'),
('Utility Setup', 'Assistance with setting up electricity, water, and internet', 'settings', true, 'Relocation'),
('Vehicle Purchase & Registration', 'Help with finding and registering a vehicle in Belize', 'car', true, 'Relocation'),
('Residency Assistance', 'Guidance through the Belize residency application process', 'file-text', true, 'Relocation'),
('School Enrollment', 'Assistance with enrolling children in local schools', 'book', true, 'Relocation'),
('Bank Account Setup', 'Help with opening a local bank account', 'landmark', true, 'Relocation');
