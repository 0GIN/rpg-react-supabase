-- ============================================
-- QUICK FIX: Make yourself admin
-- ============================================
-- Run these queries ONE BY ONE in Supabase SQL Editor

-- STEP 1: Find your user ID
-- Look at the 'id' column in the result
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- STEP 2: Copy your user ID from STEP 1 and paste it below (replace 'YOUR_USER_ID_HERE')
-- Then run this query:
INSERT INTO admin_users (user_id, is_admin) 
VALUES ('YOUR_USER_ID_HERE', true)
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;

-- Example:
-- INSERT INTO admin_users (user_id, is_admin) 
-- VALUES ('a1b2c3d4-5678-90ab-cdef-1234567890ab', true)
-- ON CONFLICT (user_id) DO UPDATE SET is_admin = true;

-- STEP 3: Verify you are now an admin
SELECT * FROM admin_users;

-- STEP 4: Get a test character nick
SELECT nick, kredyty, experience, street_cred 
FROM postacie 
LIMIT 5;

-- ============================================
-- Now go to the app and test admin panel!
-- ============================================
