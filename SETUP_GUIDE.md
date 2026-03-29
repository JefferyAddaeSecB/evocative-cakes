# EVO Cakes Backend Setup Guide

Follow these steps to set up the complete backend system for EVO Cakes.

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: evo-cakes
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your location
5. Click "Create new project" and wait for setup to complete (~2 minutes)

---

## Step 2: Set Up Database Tables

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql` from this project
4. Paste into the SQL editor
5. Click "Run" to execute
6. You should see: "Success. No rows returned"

This creates all tables, indexes, RLS policies, and triggers.

---

## Step 3: Create Storage Bucket

1. Click "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Fill in:
   - **Name**: `order-images`
   - **Public bucket**: **OFF** (leave unchecked)
   - **File size limit**: 10 MB
4. Click "Create bucket"

### Configure Bucket Policies

1. Click on the `order-images` bucket
2. Click "Policies" tab
3. Click "New Policy" → "For full customization"
4. Add the following policies:

**Policy 1: Admin can view images**
```sql
CREATE POLICY "Admin can view images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'order-images');
```

**Policy 2: Public can upload images**
```sql
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'order-images');
```

If uploads ever fail with `new row violates row-level security policy`, run `supabase-storage-fix.sql` in the Supabase SQL Editor to recreate the bucket rules cleanly.

---

## Step 4: Create Admin User

1. Click "Authentication" in the left sidebar
2. Click "Users" tab
3. Click "Add user" → "Create new user"
4. Fill in:
   - **Email**: your admin email (e.g., admin@evocakes.com)
   - **Password**: Choose a strong password
   - **Auto Confirm User**: **ON** (check this)
5. Click "Create user"

### Add to admin_users table

1. Go back to "SQL Editor"
2. Run this query (replace with your admin email):

```sql
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@evocakes.com';
```

---

## Step 5: Get API Keys

1. Click "Settings" (gear icon) in the left sidebar
2. Click "API" under Project Settings
3. Copy these values:

   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. Keep these safe for the next step!

---

## Step 6: Configure Environment Variables

1. Create a `.env.local` file in the project root (copy from `.env.example`)
2. Add your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI API (we'll add this later)
VITE_OPENAI_API_KEY=sk-...

# Resend API (we'll add this later)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=notifications@evocakes.com
RESEND_ADMIN_EMAIL=admin@evocakes.com
```

3. **IMPORTANT**: Never commit `.env.local` to Git (already in `.gitignore`)

---

## Step 7: Set Up OpenAI API

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Click your profile icon → "API keys"
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)
6. Add to `.env.local`:

```env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**Cost**: ~$0.002 per conversation (GPT-3.5-turbo) or ~$0.03 per conversation (GPT-4)

---

## Step 8: Set Up Resend (Email Service)

1. Go to [https://resend.com](https://resend.com)
2. Sign up for an account
3. Click "API Keys" in the left sidebar
4. Click "Create API Key"
5. Copy the key (starts with `re_...`)
6. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=notifications@evocakes.com
RESEND_ADMIN_EMAIL=admin@evocakes.com
```

### Verify Domain (for production)

1. Click "Domains" in Resend dashboard
2. Click "Add Domain"
3. Enter `evocakes.com`
4. Follow DNS setup instructions
5. Wait for verification (~5-10 minutes)

**For testing**, you can use `onboarding@resend.dev` as the FROM email temporarily.

**Cost**: Free for 100 emails/day, then $20/month for 50,000 emails

---

## Step 9: Test the Setup

### Test Contact Form

1. Start the dev server: `npm run dev`
2. Navigate to `/contact`
3. Fill out the form with test data
4. Upload a test image
5. Submit the form
6. Check Supabase dashboard:
   - Click "Table Editor" → "orders" (should see new order)
   - Click "Storage" → "order-images" (should see uploaded image)

### Verify Database

Run this query in SQL Editor to see your test order:

```sql
SELECT o.*, oi.image_url
FROM orders o
LEFT JOIN order_images oi ON o.id = oi.order_id
ORDER BY o.created_at DESC
LIMIT 5;
```

---

## Step 10: Set Up Email Notifications (Supabase Edge Function)

Coming soon! This will auto-send emails to admin when orders are created.

For now, you can manually check the Supabase dashboard for new orders.

---

## Next Steps

Once the basic setup is complete:

1. ✅ Enhanced contact form with image upload
2. 🔄 AI-powered chatbot widget (in progress)
3. 🔄 Admin dashboard with real-time updates (coming next)
4. 🔄 Email notification automation (coming next)

---

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env.local` exists in the project root
- Verify the variable names start with `VITE_`
- Restart the dev server after adding env variables

### "Auth session missing" when uploading images

- This is expected for public users
- Images are uploaded using the anon key (configured in RLS policies)
- Admin will need to authenticate to view images in dashboard

### Images not uploading

- Check Storage bucket exists: `order-images`
- Verify bucket policies are set correctly
- Check browser console for detailed errors
- Ensure images are under 10MB and valid formats (jpg, png, webp)

### Form submission fails

- Check Supabase URL and anon key are correct
- Open browser DevTools → Network tab to see API errors
- Verify RLS policies allow public INSERT on `orders` table

---

## Security Notes

- ✅ RLS policies protect data (public can only INSERT, admin can SELECT/UPDATE)
- ✅ Storage bucket is private (images only viewable by authenticated admin)
- ✅ API keys are in `.env.local` (not committed to Git)
- ✅ Supabase handles rate limiting and DDoS protection
- ⚠️ In production, consider adding CAPTCHA to contact form to prevent spam

---

## Cost Summary

**Monthly costs for production:**

- **Supabase**: $0 (Free tier: 500MB DB, 1GB storage, 2GB bandwidth)
- **OpenAI**: ~$5-10/month (estimated for ~200 chat conversations)
- **Resend**: $20/month (50,000 emails, or free for 100/day)
- **Vercel**: $0 (Hobby plan)

**Total**: ~$20-30/month

Upgrade Supabase to Pro ($25/month) if you need:
- 8GB database (vs 500MB)
- 100GB storage (vs 1GB)
- Daily backups
- Better performance

---

## Support

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs → Postgres/Storage
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test Supabase connection in SQL Editor

For Supabase help: [https://supabase.com/docs](https://supabase.com/docs)
For OpenAI help: [https://platform.openai.com/docs](https://platform.openai.com/docs)
For Resend help: [https://resend.com/docs](https://resend.com/docs)
