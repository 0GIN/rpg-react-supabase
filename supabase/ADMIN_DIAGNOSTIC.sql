-- ADMIN PANEL DIAGNOSTIC SCRIPT
-- Run this in Supabase SQL Editor to check admin setup

-- 1. Check if admin_users table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'admin_users'
) as admin_table_exists;

-- 2. List all admin users
SELECT * FROM admin_users;

-- 3. Get current user ID from auth
-- (You need to get this from auth.users or from browser console: supabase.auth.getUser())
-- Replace 'YOUR_USER_ID' with your actual user_id

-- 4. Check if YOU are an admin (replace with your user_id)
-- SELECT * FROM admin_users WHERE user_id = 'YOUR_USER_ID_HERE';

-- 5. If you're NOT in the table, add yourself:
-- INSERT INTO admin_users (user_id, is_admin) 
-- VALUES ('YOUR_USER_ID_HERE', true)
-- ON CONFLICT (user_id) DO UPDATE SET is_admin = true;

-- 6. Check items table
SELECT COUNT(*) as item_count FROM items;

-- 7. Check ekwipunek table
SELECT COUNT(*) as ekwipunek_count FROM ekwipunek;

-- 8. Check audit_log structure
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'audit_log'
) as audit_log_exists;

-- 9. Test query: Find a character by nick (case insensitive)
SELECT id, nick, kredyty, experience, level, street_cred 
FROM postacie 
WHERE nick ILIKE '%test%' -- Replace 'test' with partial nick
LIMIT 5;

-- 10. Check RLS policies on admin functions
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('admin_users', 'audit_log')
ORDER BY tablename, policyname;
