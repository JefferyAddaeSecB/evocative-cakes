2425# 🤖 Chatbot Setup Guide - OpenAI Integration

## ⚠️ SECURITY FIRST

Your API key that was shared in chat is now **EXPOSED**. You MUST:

1. **Immediately revoke the exposed key:**
   - Go to https://platform.openai.com/api-keys
   - Find and DELETE: `sk-proj-wchEmlAkbSGQdBZUgJbQJuYmtrBgyYTTmwOoOtUW8lyJuOErRWathcRNS85iKZ7...`
   - Create a NEW API key

2. **Replace the placeholder in `.env.local`:**
   ```
   VITE_OPENAI_API_KEY=YOUR_NEW_OPENAI_KEY_HERE
   ```
   Replace `YOUR_NEW_OPENAI_KEY_HERE` with your actual new OpenAI API key

3. **NEVER share API keys in messages or commits**

---

## ✅ Current Setup Status

### Already Implemented:
- ✅ Environment variable support (`VITE_OPENAI_API_KEY`)
- ✅ Safe client-side initialization with `dangerouslyAllowBrowser: true`
- ✅ Fallback responses if API key is missing
- ✅ ChatbotWidget component with full functionality
- ✅ Message history and conversation management
- ✅ Image upload support for inspiration photos
- ✅ Order extraction from conversation
- ✅ Supabase integration for order storage

### Chatbot Features:
- Quick action buttons (Order, Pricing, Flavors, Delivery)
- Full conversation history
- Image upload capability
- Order placement through chat
- Fallback responses when API unavailable
- Toast notifications for user feedback

---

## 🔧 How to Enable the Chatbot

### Step 1: Get a New OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...` or `sk-proj-...`)

### Step 2: Update `.env.local`
Edit `/Users/jefferyaddae/Desktop/evo-cakes-nextjs/.env.local`:

```dotenv
VITE_SUPABASE_URL=https://hvqpwkcipucmnubtwxpi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=https://evocativecakes.com
VITE_OPENAI_API_KEY=sk-your-actual-new-key-here
```

### Step 3: Test the Chatbot
1. Run `npm run dev`
2. Visit the website
3. Click the chatbot icon (bottom right)
4. Try sending a message

---

## 📋 Bakery Facts (Built into Chatbot)

The chatbot has been pre-trained with EVO Cakes information:
- Pricing for different cake types
- Flavors and dietary options
- Delivery and pickup info
- Order lead times
- Size guide
- Tasting availability
- Cancellation policy

---

## 🛡️ Security Best Practices

✅ **DO:**
- Store API keys in `.env.local` (never committed)
- Use environment variables
- Rotate keys periodically
- Use separate keys for dev/production
- Monitor API usage in OpenAI dashboard

❌ **DON'T:**
- Share API keys in messages
- Commit keys to Git
- Use same key for multiple projects
- Hard-code keys in source files
- Leave old keys active

---

## 🔄 Production Deployment

For production (Vercel, etc.):
1. Create a new API key in OpenAI
2. Set `VITE_OPENAI_API_KEY` as environment variable in your hosting
3. Never commit `.env.local` to Git
4. Use `.env.local` only for local development

---

## 📞 Support

If the chatbot isn't working:
1. Check `.env.local` has the correct key
2. Verify OpenAI API key is active (not revoked)
3. Check browser console for errors (F12 → Console)
4. Ensure API key has Credits/Quota in OpenAI dashboard

---

**Last Updated:** April 3, 2026
**Status:** Ready for activation - awaiting new OpenAI API key


