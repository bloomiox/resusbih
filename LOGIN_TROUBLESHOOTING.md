# Login Troubleshooting Guide

## Current Login Credentials

### Primary Authentication (Supabase)
- **Email**: Check your Supabase Auth users
- **Password**: Set in Supabase dashboard

### Fallback Authentication
- **Email**: `office@resusbih.org`
- **Password**: `AmelWeb1.1`

## Common Issues & Solutions

### 1. "Neispravni podaci za prijavu" Error
**Possible causes:**
- Incorrect email/password
- Supabase connection issues
- Environment variables not loaded

**Solutions:**
1. Try the fallback credentials: `office@resusbih.org` / `AmelWeb1.1`
2. Check browser console for detailed error messages
3. Verify environment variables are loaded correctly

### 2. Environment Variable Issues
**Check these in your `.env` file:**
```env
VITE_SUPABASE_URL=https://hywmnhwrzebubmnimdow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Supabase Authentication Setup
1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Create a new user or check existing users
4. Ensure the user has the correct email and password

### 4. Debug Steps
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try logging in and check for error messages
4. In development, you can run `debugAuth()` in console for more info

### 5. Network Issues
- Check if you can access: https://hywmnhwrzebubmnimdow.supabase.co
- Verify your internet connection
- Check if any firewall is blocking Supabase

## Quick Test
1. Open the login page
2. Try: `office@resusbih.org` / `AmelWeb1.1`
3. If that works, the issue is with Supabase auth
4. If that doesn't work, check console errors

## Need Help?
- Check browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure Supabase project is active and accessible