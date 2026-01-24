# PlebTest Authentication Setup Guide

This guide covers the configuration of authentication providers for PlebTest.

## Overview

PlebTest uses Supabase Auth with the following providers:
- Email/Password (built-in)
- Google OAuth
- GitHub OAuth

## Environment-Specific Redirect URLs

Add ALL of the following redirect URLs in Supabase Dashboard under **Authentication > URL Configuration > Redirect URLs**:

```
http://localhost:3000/auth/callback
https://plebteststaging-staging.up.railway.app/auth/callback
https://plebtest.com/auth/callback
```

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Select **External** user type (or Internal for testing)
3. Fill in the required fields:
   - **App name**: PlebTest
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Save and continue

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: PlebTest Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://plebteststaging-staging.up.railway.app
     https://plebtest.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
     ```
     (Get this URL from Supabase Dashboard > Authentication > Providers > Google)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### Step 4: Configure in Supabase

1. Go to Supabase Dashboard > **Authentication > Providers**
2. Enable **Google**
3. Paste your **Client ID** and **Client Secret**
4. Save

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps > New OAuth App**
3. Fill in:
   - **Application name**: PlebTest
   - **Homepage URL**: `https://plebtest.com` (or `http://localhost:3000` for dev)
   - **Authorization callback URL**:
     ```
     https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
     ```
     (Get this URL from Supabase Dashboard > Authentication > Providers > GitHub)
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it

### Step 2: Configure in Supabase

1. Go to Supabase Dashboard > **Authentication > Providers**
2. Enable **GitHub**
3. Paste your **Client ID** and **Client Secret**
4. Save

## Email/Password Authentication

Email/Password auth is enabled by default in Supabase.

### Recommended Settings

1. Go to Supabase Dashboard > **Authentication > Settings**
2. Configure:
   - **Site URL**: `https://plebtest.com` (production) or your staging URL
   - **Redirect URLs**: Add all environment URLs (see above)

### Email Templates (Optional)

1. Go to **Authentication > Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

## Local Development Setup

### Using Local Supabase

1. Ensure local Supabase is running:
   ```bash
   supabase start
   ```

2. Access local Supabase Dashboard:
   ```
   http://127.0.0.1:54323
   ```

3. For OAuth testing locally, you'll need to:
   - Use the hosted Supabase project, OR
   - Configure [ngrok](https://ngrok.com/) to expose localhost, OR
   - Test OAuth only on staging/production

### Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

For staging/production, these should point to your hosted Supabase project.

## Testing Authentication

### Email/Password

1. Navigate to `/signup`
2. Create an account with email/password
3. Check email for confirmation (if enabled)
4. Navigate to `/login` and sign in

### OAuth (Google/GitHub)

1. Navigate to `/login`
2. Click "Sign in with Google" or "Sign in with GitHub"
3. Complete the OAuth flow
4. Verify redirect to `/dashboard`

## Troubleshooting

### "Redirect URI mismatch" Error
- Verify the redirect URL in your OAuth app matches exactly
- Check for trailing slashes
- Ensure the correct environment URL is configured

### Session Not Persisting
- Check that middleware is properly configured
- Verify cookies are being set (check browser dev tools)
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### OAuth Callback Failing
- Check the browser console for errors
- Verify the `code` parameter is present in the callback URL
- Check Supabase logs in the dashboard

## Security Considerations

1. **Never commit OAuth secrets** to version control
2. Use environment variables for all sensitive configuration
3. Enable Row Level Security (RLS) on all tables
4. Regularly rotate OAuth client secrets
5. Review OAuth app permissions periodically
