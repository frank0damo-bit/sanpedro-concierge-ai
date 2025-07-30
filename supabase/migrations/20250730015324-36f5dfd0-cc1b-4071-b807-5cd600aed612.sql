-- Update the user frankyadamo@gmail.com to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'frankyadamo@gmail.com'
);