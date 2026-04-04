# 🚀 Evocative Cakes - Deployment Guide

## Current Status
✅ **Chatbot:** Fully functional with OpenAI API key configured
✅ **Build:** Production-ready (28.79s build time, zero errors)
✅ **Local Dev:** Running on http://localhost:3002

---

## 🌐 Deploying to Your Live Domain

### **Critical: Environment Variables on Production**

Your `.env.local` file is **NOT** deployed to the live server. Here's what happens:

```
Local Development (.env.local)          Live Server (Environment Variables)
├─ VITE_OPENAI_API_KEY=sk-proj-...     └─ Must be set in hosting dashboard
├─ VITE_SUPABASE_URL=...               └─ Set in hosting environment
└─ VITE_SITE_URL=...                   └─ Set in hosting environment
```

### **How to Deploy to Your Domain**

**Step 1: Choose Your Hosting Platform**
- ✅ Vercel (Recommended - best for Next.js apps)
- ✅ Netlify
- ✅ AWS Amplify
- ✅ Other Node.js hosting

**Step 2: Connect GitHub Repository**
1. Go to your hosting platform (e.g., Vercel)
2. Click "New Project"
3. Connect GitHub account
4. Select `evocative-cakes` repository
5. Click "Import"

**Step 3: Set Environment Variables**

In your hosting dashboard (Vercel/Netlify/etc):
1. Go to Settings → Environment Variables
2. Add these variables:

```
VITE_OPENAI_API_KEY = your-openai-api-key-here

VITE_SUPABASE_URL = your-supabase-url-here

VITE_SUPABASE_ANON_KEY = your-supabase-anon-key-here

VITE_SITE_URL = https://yourdomain.com
```

**Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete (usually 2-5 minutes)
3. Your site is now live!

---

## ✅ What's Working

### **On Local Dev (http://localhost:3002)**
- ✅ Chatbot widget (bottom right corner)
- ✅ All chat features (message, upload, order placement)
- ✅ Gallery with images
- ✅ Hero carousel
- ✅ Contact form
- ✅ All pages and navigation

### **Will Work on Live Domain (once deployed)**
- ✅ Everything above
- ✅ HTTPS/SSL secured
- ✅ Custom domain (evocativecakes.com or your domain)
- ✅ 24/7 uptime
- ✅ Global CDN distribution

---

## 🔐 Security Checklist

✅ API keys are in `.env.local` (not committed to Git)
✅ `.env.local` is in `.gitignore`
✅ OpenAI key is secure and revoked old key
✅ Supabase credentials are safe (public anon key only)
✅ No sensitive data in source code
✅ Environment variables properly scoped

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Verify `.env.local` is NOT in Git (run `git log --oneline --all --full-history -- .env.local`)
- [ ] Test chatbot locally and works properly
- [ ] Confirm OpenAI API key has active credits
- [ ] Review all settings in environment variables
- [ ] Test on staging/preview deployment first
- [ ] Check that all images load properly on live domain
- [ ] Verify contact form submissions to Supabase work
- [ ] Test chatbot responses on live server

---

## 🎯 Vercel Deployment (Step-by-Step)

**Most recommended for Next.js-like apps:**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Select GitHub and find `evocative-cakes`
4. Click "Import"
5. Configure project:
   - Framework: Other (Vite)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Environment Variables"
7. Add all variables from .env.local
8. Click "Deploy"
9. Copy the provided domain or connect custom domain

**Custom Domain Setup:**
1. In Vercel, go to Settings → Domains
2. Add your domain (e.g., evocativecakes.com)
3. Follow DNS setup instructions
4. Wait for SSL certificate (5-10 minutes)

---

## 🛠️ Git Workflow for Deployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"

# Push to GitHub
git push origin main

# Vercel/Netlify automatically deploys!
# (Your hosting platform watches the main branch)
```

---

## 📊 Build Information

```
Total bundle size: 339.18 KB (uncompressed)
Gzipped size: 105.56 KB (production)
Build time: 28.79s
Modules: 1735 transformed
Status: ✅ Zero errors
```

---

## 🔧 Troubleshooting

### Chatbot not working on live site?
1. Verify `VITE_OPENAI_API_KEY` is set in environment variables
2. Check OpenAI API key is valid and has credits
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check browser console for errors (F12 → Console)

### Images not loading?
1. Verify `VITE_SITE_URL` matches your domain
2. Check image paths in code
3. Ensure public/ folder is deployed correctly

### Forms not submitting?
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
2. Check Supabase project is active
3. Verify RLS policies allow public inserts

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev

---

## Summary

Your website is **production-ready**. To go live:

1. ✅ Code is ready (no changes needed)
2. ⏳ Choose hosting platform (Vercel recommended)
3. ⏳ Connect GitHub repository
4. ⏳ Set environment variables in hosting dashboard
5. ⏳ Deploy

**Once deployed, your chatbot, gallery, forms, and all features will work on your live domain!**

---

**Last Updated:** April 3, 2026
**Repository:** https://github.com/JefferyAddaeSecB/evocative-cakes
**Commit:** 761eeb0
