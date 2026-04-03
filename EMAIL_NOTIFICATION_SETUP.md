# Email Notification Setup

This project is now wired for:

- admin email alerts when a new order is submitted
- optional admin SMS alerts when a new order is submitted
- customer acknowledgement emails when a new order is submitted
- customer status emails when an admin moves an order forward

## What The App Now Expects

Order sources:

- contact form
- chatbot

Status flow:

- `new`
- `started`
- `in_progress`
- `completed`

Rules:

- admins can only move an order to the next status
- backwards and skipped transitions are blocked
- each forward move can trigger the matching customer email

## Required Supabase Setup

1. Run [`supabase-admin-upgrade.sql`](/Users/jefferyaddae/Desktop/evo-cakes-nextjs/supabase-admin-upgrade.sql) in the Supabase SQL Editor if it has not already been applied.
2. Deploy the Edge Function in [`supabase/functions/admin-notifications/index.ts`](/Users/jefferyaddae/Desktop/evo-cakes-nextjs/supabase/functions/admin-notifications/index.ts).
3. Add the required Edge Function secrets in Supabase.

Required secrets:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `REPLY_TO_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`

Optional secrets:

- `ADMIN_NOTIFICATION_PHONE`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`

Important:

- `RESEND_FROM_EMAIL` should be a sender address on a domain you have verified inside Resend.
- `REPLY_TO_EMAIL` can be your Gmail address, for example `evocativecakes@gmail.com`, so replies to automated emails go back to Gmail.
- `ADMIN_NOTIFICATION_EMAIL` can be `evocativecakes@gmail.com`.
- if you want admin SMS alerts, Twilio must be configured and the admin phone must be in `ADMIN_NOTIFICATION_PHONE`

## Required App Environment

Set these in the app environment used by the frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL`

`VITE_SITE_URL` should match the live site URL so admin notification emails open the correct dashboard link.

## Suggested CLI Flow

If you use the Supabase CLI, the common flow is:

```bash
npm run deploy:notifications
```

You can also deploy and manage the function from the Supabase Dashboard.

## Suggested Secrets File

Create a local `.env.notifications` file that is not committed:

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=EVO Cakes <orders@updates.your-domain.com>
REPLY_TO_EMAIL=evocativecakes@gmail.com
ADMIN_NOTIFICATION_EMAIL=evocativecakes@gmail.com
ADMIN_NOTIFICATION_PHONE=+14169101439
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

## Gmail Setup With This System

This codebase does not send mail through Gmail SMTP. It sends through Resend, and Gmail is best used in two places:

- as the admin inbox that receives new-order alerts
- as the reply-to inbox for customer responses

Recommended setup:

1. Keep `ADMIN_NOTIFICATION_EMAIL=evocativecakes@gmail.com`.
2. Set `REPLY_TO_EMAIL=evocativecakes@gmail.com`.
3. In Resend, verify a domain you control.
4. Set `RESEND_FROM_EMAIL` to an address on that verified domain, for example `EVO Cakes <orders@updates.your-domain.com>`.
5. Deploy the Edge Function again after saving the secrets.

Important:

- with the current implementation, `@gmail.com` should be the inbox and reply address
- the actual automated sender should be the verified-domain `RESEND_FROM_EMAIL`
- once `.env.notifications` contains the real values and your Supabase CLI is logged in, you can run `npm run deploy:notifications`

## Live Smoke Test

1. Submit a test order through the contact form.
2. Confirm the admin email arrives.
3. Confirm the customer acknowledgement email arrives.
4. Open the dashboard and move the order from `New` to `Started`.
5. Confirm the customer receives the `Started` update.
6. Move the order to `In Progress`, then `Completed`, and confirm each email.
7. Confirm the dashboard blocks moving the order backwards or skipping ahead.

## Local Behavior Notes

- if notifications are not configured, orders still save successfully
- the UI will show success even if the email function is unavailable, but it will report that the email was not sent
- media management remains separate from the order notification flow
