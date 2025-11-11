// Simple script to generate SQL for deleting test users
// Since we can't run psql directly, this generates SQL you can copy/paste

console.log(`
=========================================
SQL TO DELETE TEST USERS
=========================================

Copy and paste these SQL commands into your PostgreSQL client:

-- Option 1: Delete specific test users
DELETE FROM users 
WHERE email IN ('testcompany@example.com', 'mashruf526@gmail.com')
   OR mobile_no IN ('+919876543210', '+918630549203');

-- Option 2: Delete all users (be careful!)
-- DELETE FROM users;

-- To verify deletion:
SELECT email, mobile_no FROM users;

=========================================

Alternative: Just use different credentials in the registration form!
- Use a new email like: test2@example.com
- Use a new mobile like: +919111111111

=========================================
`);
