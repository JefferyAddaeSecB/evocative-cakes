# EVO Cakes Backend Implementation Plan

## Tech Stack

### Core Backend
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (image uploads)
- **Real-time**: Supabase Subscriptions
- **Authentication**: Supabase Auth (email/password for single admin)

### AI & Communication
- **Chatbot AI**: OpenAI API (GPT-4 or GPT-3.5-turbo)
- **Email Service**: **Resend** (Recommended)
  - Simple API integration
  - $20/month for 50,000 emails
  - Excellent deliverability
  - Custom domain support
  - Perfect for both auto-notifications and manual admin emails

### Frontend Integration
- **Supabase Client**: @supabase/supabase-js
- **OpenAI Client**: openai npm package
- **File Upload**: react-dropzone
- **Email**: resend npm package

---

## Database Schema

### Table: `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN ('contact_form', 'chatbot')),

  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Event Details
  event_type TEXT,
  event_date DATE,

  -- Cake Specifications
  cake_description TEXT NOT NULL,
  dietary_restrictions TEXT,
  serving_size TEXT,
  design_preferences TEXT,

  -- Order Management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Index for admin dashboard queries
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Table: `order_images`
```sql
CREATE TABLE order_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_images_order_id ON order_images(order_id);
```

### Table: `chatbot_conversations`
```sql
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  messages JSONB NOT NULL, -- Array of {role: 'user'|'assistant', content: string, timestamp: string}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chatbot_order_id ON chatbot_conversations(order_id);
```

### Table: `admin_users`
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Supabase Storage Buckets

### Bucket: `order-images`
- **Public Access**: No (authenticated reads only for admin)
- **File Size Limit**: 10MB per image
- **Allowed MIME Types**: image/jpeg, image/png, image/webp
- **Path Structure**: `{order_id}/{timestamp}_{filename}`

---

## Row Level Security (RLS) Policies

### Orders Table
```sql
-- Admin can view all orders
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Admin can update orders
CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- Public can insert orders (from contact form and chatbot)
CREATE POLICY "Public can create orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);
```

### Order Images Table
```sql
-- Admin can view all images
CREATE POLICY "Admin can view all images"
  ON order_images FOR SELECT
  TO authenticated
  USING (true);

-- Public can insert images (during order creation)
CREATE POLICY "Public can upload images"
  ON order_images FOR INSERT
  TO anon
  WITH CHECK (true);
```

### Chatbot Conversations Table
```sql
-- Admin can view all conversations
CREATE POLICY "Admin can view conversations"
  ON chatbot_conversations FOR SELECT
  TO authenticated
  USING (true);

-- Public can insert/update conversations (during chat)
CREATE POLICY "Public can create conversations"
  ON chatbot_conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update conversations"
  ON chatbot_conversations FOR UPDATE
  TO anon
  USING (true);
```

---

## API Endpoints & Edge Functions

### Edge Function: `send-admin-notification`
**Trigger**: Database trigger on `orders` INSERT
**Purpose**: Send email to admin when new order created
**Implementation**:
```typescript
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

// Triggered automatically on new order
export async function handler(req: Request) {
  const { order } = await req.json()

  await resend.emails.send({
    from: 'notifications@evocakes.com',
    to: 'admin@evocakes.com',
    subject: `New Cake Order from ${order.customer_name}`,
    html: `
      <h2>New Order Alert</h2>
      <p><strong>Customer:</strong> ${order.customer_name}</p>
      <p><strong>Email:</strong> ${order.customer_email}</p>
      <p><strong>Phone:</strong> ${order.customer_phone}</p>
      <p><strong>Event Type:</strong> ${order.event_type}</p>
      <p><strong>Event Date:</strong> ${order.event_date}</p>
      <p><strong>Description:</strong> ${order.cake_description}</p>
      <a href="https://evocakes.com/admin">View in Dashboard</a>
    `
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
```

### Edge Function: `send-completion-email`
**Trigger**: Manual call from admin dashboard
**Purpose**: Send personalized completion email to customer
**Implementation**:
```typescript
export async function handler(req: Request) {
  const { orderId, customerEmail, customerName, message } = await req.json()

  await resend.emails.send({
    from: 'hello@evocakes.com',
    to: customerEmail,
    subject: 'Your Custom Cake Order is Ready!',
    html: `
      <h2>Hi ${customerName}!</h2>
      <p>${message}</p>
      <p>Thank you for choosing EVO Cakes ✨</p>
    `
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
```

### API Route: `/api/chatbot`
**Purpose**: Handle OpenAI chat completion with order extraction
**Implementation**: Server-side Next.js API route or Supabase Edge Function

---

## Implementation Phases

### Phase 1: Supabase Setup ✅
1. Create Supabase project
2. Run database migrations (tables + indexes)
3. Configure storage buckets
4. Set up RLS policies
5. Create admin user account
6. Configure environment variables

### Phase 2: Enhanced Contact Form 🔄
1. Install dependencies: `@supabase/supabase-js`, `react-dropzone`
2. Update ContactPage component:
   - Add phone number field
   - Add file upload dropzone (multi-image support)
   - Integrate Supabase client
   - Upload images to storage
   - Save order + images to database
   - Show upload progress
3. Test form submission flow

### Phase 3: AI Chatbot 🔄
1. Install dependencies: `openai`
2. Create ChatbotWidget component:
   - Floating chat button (bottom-right)
   - Chat window with message history
   - Image upload capability within chat
   - Typing indicators
   - Message timestamps
3. Create chatbot API endpoint:
   - OpenAI integration with system prompt
   - Extract order details from conversation
   - Save conversation + order to Supabase
4. Add to Layout component (available on all pages)

### Phase 4: Admin Dashboard 🔄
1. Create `/admin` route
2. Build AdminLoginPage:
   - Email/password form
   - Supabase auth integration
   - Redirect to dashboard on success
3. Build AdminDashboardPage:
   - Real-time order feed (Supabase subscriptions)
   - Order cards with customer details + phone
   - Image gallery for each order
   - Status update buttons (new → in progress → completed)
   - Filter/search/sort functionality
   - Manual email sending interface
4. Protect route with auth middleware

### Phase 5: Email Notifications 🔄
1. Install dependency: `resend`
2. Set up Resend account + API key
3. Create Edge Function for admin notifications
4. Set up database trigger on orders INSERT
5. Create manual email sending interface in admin dashboard
6. Test both auto and manual email flows

### Phase 6: Real-time Features 🔄
1. Set up Supabase real-time subscriptions in admin dashboard
2. Auto-refresh order list on new orders
3. Toast notifications for admin
4. Live status updates across sessions

---

## Environment Variables

### `.env.local`
```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
VITE_OPENAI_API_KEY=sk-...

# Resend (server-side only)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=notifications@evocakes.com
RESEND_ADMIN_EMAIL=admin@evocakes.com
```

---

## OpenAI Chatbot System Prompt

```text
You are an AI assistant for EVO Cakes, a premium custom cake bakery. Your role is to help customers place cake orders in a friendly, conversational way.

Guidelines:
1. Ask about the event type (wedding, birthday, anniversary, etc.)
2. Inquire about event date and serving size
3. Discuss cake flavors, design preferences, and dietary restrictions
4. If the customer uploads an image, acknowledge it and ask if they want a similar design
5. Collect customer contact information (name, email, phone)
6. Summarize the order details before finalizing
7. Be warm, enthusiastic, and helpful

When you have gathered all necessary information, respond with a JSON object:
{
  "order_ready": true,
  "customer_name": "...",
  "customer_email": "...",
  "customer_phone": "...",
  "event_type": "...",
  "event_date": "...",
  "cake_description": "...",
  "dietary_restrictions": "...",
  "serving_size": "...",
  "design_preferences": "..."
}
```

---

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   ├── openai.ts            # OpenAI client setup
│   └── email.ts             # Resend email helpers
├── components/
│   ├── ChatbotWidget.tsx    # Floating AI chat widget
│   ├── ImageUploadZone.tsx  # Reusable dropzone component
│   └── OrderCard.tsx        # Admin dashboard order card
├── pages/
│   ├── contact-page.tsx     # Enhanced with image upload
│   ├── admin-login.tsx      # Admin authentication
│   └── admin-dashboard.tsx  # Real-time order management
├── hooks/
│   ├── useSupabase.ts       # Supabase helpers
│   └── useRealtime.ts       # Real-time subscription hook
└── types/
    └── database.types.ts    # Supabase auto-generated types
```

---

## Testing Checklist

### Contact Form
- [ ] Form validation works (required fields)
- [ ] Image upload shows preview
- [ ] Multi-image upload supported (max 5 images)
- [ ] Order saves to Supabase database
- [ ] Images upload to Supabase Storage
- [ ] Admin receives email notification
- [ ] Success toast appears

### AI Chatbot
- [ ] Chat window opens/closes smoothly
- [ ] Messages send and receive correctly
- [ ] OpenAI responses are contextual
- [ ] Image upload works within chat
- [ ] Order extraction captures all fields
- [ ] Conversation saves to database
- [ ] Admin receives email notification

### Admin Dashboard
- [ ] Login works with email/password
- [ ] Orders display in real-time
- [ ] Phone numbers visible for each order
- [ ] Images display in gallery
- [ ] Status updates work (new → in progress → completed)
- [ ] Manual email interface sends successfully
- [ ] Search/filter functionality works
- [ ] Real-time updates appear without refresh

### Email System
- [ ] Auto-notification sends on new order
- [ ] Email contains all order details
- [ ] Manual completion emails send from dashboard
- [ ] Emails arrive in inbox (not spam)

---

## Deployment

1. **Supabase**: Already hosted, no deployment needed
2. **Resend**: Already hosted, no deployment needed
3. **Frontend**: Deploy to Vercel (already set up)
4. **Environment Variables**: Add to Vercel dashboard
5. **Custom Domain**: Configure DNS for email sending (evocakes.com)

---

## Cost Estimate

- **Supabase Free Tier**: $0/month (500MB database, 1GB storage, 2GB bandwidth)
- **Resend**: $20/month (50,000 emails)
- **OpenAI API**: ~$0.002 per conversation (GPT-3.5-turbo)
- **Vercel**: $0/month (hobby plan)

**Total**: ~$20-25/month

---

## Next Steps

1. Create Supabase project
2. Run database migrations
3. Install npm packages
4. Update contact form with image upload
5. Build AI chatbot widget
6. Create admin dashboard
7. Set up email notifications
8. Test end-to-end flow
