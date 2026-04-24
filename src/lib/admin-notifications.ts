import { formatOrderStatus, type OrderStatus } from '@/lib/admin-workflow'

export interface NotificationOrderContext {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  event_type: string | null
  event_date: string | null
  cake_description: string
  design_preferences: string | null
  dietary_restrictions: string | null
  serving_size: string | null
}

export interface NotificationDraft {
  subject: string
  html: string
  text: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toSentenceCase(value: string | null | undefined, fallback: string) {
  if (!value) return fallback
  return value.trim()
}

function formatEventDate(value: string | null) {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function resolveSiteUrl() {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim()
  if (configuredSiteUrl) return configuredSiteUrl.replace(/\/+$/, '')
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return 'https://evocativecakes.com'
}

export function buildDashboardOrderLink(orderId: string, siteUrl = resolveSiteUrl()) {
  return `${siteUrl}/admin/dashboard?view=orders&order=${encodeURIComponent(orderId)}`
}

function formatOrderReference(orderId: string) {
  return orderId.slice(0, 8).toUpperCase()
}

// ─── Shared layout wrappers ─────────────────────────────────────────────────

function emailWrapper(bodyContent: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EVO Cakes</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f3ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🎂 EVO Cakes</p>
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:1px;text-transform:uppercase;">Custom Cake Studio</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;border-left:1px solid #ede9fe;border-right:1px solid #ede9fe;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf5ff;border:1px solid #ede9fe;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#7c3aed;font-weight:600;">EVO Cakes</p>
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">Questions? Reply to this email or reach us at <a href="mailto:evocativecakes@gmail.com" style="color:#8b5cf6;text-decoration:none;">evocativecakes@gmail.com</a></p>
              <p style="margin:0;font-size:11px;color:#d1d5db;">© ${new Date().getFullYear()} EVO Cakes. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#6b7280;width:38%;vertical-align:top;border-bottom:1px solid #f3f4f6;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;font-size:14px;color:#1f2937;vertical-align:top;border-bottom:1px solid #f3f4f6;">${escapeHtml(value)}</td>
    </tr>`
}

function infoCard(title: string, content: string, accentColor = '#faf5ff', borderColor = '#ede9fe') {
  return `
    <div style="background:${accentColor};border:1px solid ${borderColor};border-radius:12px;padding:20px 24px;margin:16px 0;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(title)}</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${escapeHtml(content)}</p>
    </div>`
}

function ctaButton(label: string, url: string) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
      <tr>
        <td style="background:linear-gradient(135deg,#ec4899,#8b5cf6);border-radius:999px;padding:0;">
          <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;letter-spacing:0.2px;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>`
}

function statusBadge(label: string, color: string) {
  return `<span style="display:inline-block;background:${color};color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.5px;text-transform:uppercase;">${escapeHtml(label)}</span>`
}

// ─── Admin: New order notification ──────────────────────────────────────────

export function buildAdminNewOrderNotification(
  order: NotificationOrderContext,
  dashboardUrl: string
): NotificationDraft & { sms: string } {
  const eventType = toSentenceCase(order.event_type, 'Custom cake request')
  const eventDate = formatEventDate(order.event_date)
  const servingSize = toSentenceCase(order.serving_size, 'Not provided')
  const dietary = toSentenceCase(order.dietary_restrictions, 'None noted')
  const designNotes = toSentenceCase(order.design_preferences, 'No additional design notes')
  const ref = formatOrderReference(order.id)
  const subject = `🎂 New Order: ${order.customer_name} — Ref #${ref}`

  const html = emailWrapper(`
    <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1f2937;">New order received</p>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">A new cake inquiry just came in and is ready for your review.</p>

    ${statusBadge('New Order', '#8b5cf6')}

    <div style="margin:24px 0;background:#fafafa;border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Reference', `#${ref}`)}
        ${detailRow('Customer', order.customer_name)}
        ${detailRow('Email', order.customer_email)}
        ${detailRow('Phone', order.customer_phone)}
        ${detailRow('Event', eventType)}
        ${detailRow('Event Date', eventDate)}
        ${detailRow('Serving Size', servingSize)}
        ${detailRow('Dietary Notes', dietary)}
      </table>
    </div>

    ${infoCard('Cake Description', order.cake_description)}
    ${infoCard('Design Preferences', designNotes, '#fdf2f8', '#fce7f3')}

    ${ctaButton('Open in Dashboard →', dashboardUrl)}

    <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">This alert was sent to the EVO Cakes admin team. Do not reply to this automated message.</p>
  `)

  const text = [
    `New EVO Cakes Order — Ref #${ref}`,
    '',
    `Customer: ${order.customer_name}`,
    `Email: ${order.customer_email}`,
    `Phone: ${order.customer_phone}`,
    `Event: ${eventType}`,
    `Event Date: ${eventDate}`,
    `Serving Size: ${servingSize}`,
    `Dietary Notes: ${dietary}`,
    '',
    'Cake Description:',
    order.cake_description,
    '',
    'Design Preferences:',
    designNotes,
    '',
    `Review in dashboard: ${dashboardUrl}`,
  ].join('\n')

  const sms = `🎂 New EVO Cakes order from ${order.customer_name} (Ref #${ref}). Review: ${dashboardUrl}`

  return { subject, html, text, sms }
}

// ─── Customer: Order acknowledgement ────────────────────────────────────────

export function buildCustomerOrderAcknowledgementNotification(
  order: NotificationOrderContext
): NotificationDraft {
  const eventType = toSentenceCase(order.event_type, 'custom cake')
  const eventDate = formatEventDate(order.event_date)
  const servingSize = toSentenceCase(order.serving_size, 'Not provided')
  const dietary = toSentenceCase(order.dietary_restrictions, 'None noted')
  const designNotes = toSentenceCase(order.design_preferences, 'No extra design notes were included')
  const ref = formatOrderReference(order.id)
  const subject = `We got your order, ${order.customer_name}! 🎂 — Ref #${ref}`

  const html = emailWrapper(`
    <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#1f2937;">Thank you, ${escapeHtml(order.customer_name)}! 🎉</p>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">Your cake request has landed safely with us. Our team will review the details and get back to you within <strong style="color:#7c3aed;">24 hours</strong> with next steps, availability, and any quote information.</p>

    <div style="background:linear-gradient(135deg,#fdf2f8,#faf5ff);border:1px solid #ede9fe;border-radius:12px;padding:20px 24px;margin:0 0 20px;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.8px;">Your Order Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Reference #', ref)}
        ${detailRow('Event', eventType)}
        ${detailRow('Event Date', eventDate)}
        ${detailRow('Serving Size', servingSize)}
        ${detailRow('Dietary Notes', dietary)}
      </table>
    </div>

    ${infoCard('Design Description on File', order.cake_description)}
    ${infoCard('Additional Preferences', designNotes, '#fdf2f8', '#fce7f3')}

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px 22px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#15803d;line-height:1.6;">💬 <strong>Need to add something?</strong> Simply reply to this email with any extra photos, ideas, or notes and we'll attach them to your order.</p>
    </div>

    <p style="margin:24px 0 4px;font-size:15px;color:#374151;">We can't wait to bring your vision to life.</p>
    <p style="margin:0;font-size:15px;color:#374151;">Warm regards,<br /><strong style="color:#7c3aed;">The EVO Cakes Team</strong></p>
  `)

  const text = [
    `Thank you, ${order.customer_name}!`,
    '',
    "Your cake request has been received. We'll be in touch within 24 hours.",
    '',
    `Reference: #${ref}`,
    `Event: ${eventType}`,
    `Event Date: ${eventDate}`,
    `Serving Size: ${servingSize}`,
    `Dietary Notes: ${dietary}`,
    '',
    'Design Description on File:',
    order.cake_description,
    '',
    `Additional Preferences: ${designNotes}`,
    '',
    'Questions? Just reply to this email.',
    '',
    'Warm regards,',
    'The EVO Cakes Team',
  ].join('\n')

  return { subject, html, text }
}

// ─── Customer: Status update ─────────────────────────────────────────────────

function getStatusConfig(status: OrderStatus): {
  heading: string
  subheading: string
  paragraphs: string[]
  badgeColor: string
  icon: string
} {
  switch (status) {
    case 'started':
      return {
        heading: 'Your order has been accepted',
        subheading: "We've reviewed your request and you're officially in the schedule.",
        paragraphs: [
          "Your cake order has been confirmed and is now on our production schedule. We're excited to start working on your creation.",
          "If we need anything further from you before the event date, a member of our team will reach out directly.",
        ],
        badgeColor: '#0ea5e9',
        icon: '✅',
      }
    case 'in_progress':
      return {
        heading: 'Your cake is being made',
        subheading: "Things are in motion — your order is actively moving through production.",
        paragraphs: [
          "Your custom cake is currently being prepared. Our team is working through the design and finishing details to ensure everything is perfect.",
          "We're continuing to give your order the attention it deserves right through to completion.",
        ],
        badgeColor: '#8b5cf6',
        icon: '🎨',
      }
    case 'completed':
      return {
        heading: 'Your order is complete',
        subheading: "Everything is done — your cake is ready.",
        paragraphs: [
          "Your custom cake has been completed successfully. We're so proud of how it turned out.",
          "If pickup, delivery, or final coordination is still pending, our team will confirm the handoff details with you directly.",
        ],
        badgeColor: '#10b981',
        icon: '🎂',
      }
    default:
      return {
        heading: 'Your order has been received',
        subheading: "We have your request and it's now under review.",
        paragraphs: [
          "Thank you for reaching out to EVO Cakes. Your request is in our queue and will be reviewed shortly.",
          "We'll follow up with the next steps, quote details, and confirmation information as soon as possible.",
        ],
        badgeColor: '#f59e0b',
        icon: '📬',
      }
  }
}

export function buildCustomerOrderStatusNotification(
  order: NotificationOrderContext,
  nextStatus: OrderStatus,
  previousStatus?: OrderStatus
): NotificationDraft {
  const config = getStatusConfig(nextStatus)
  const eventType = toSentenceCase(order.event_type, 'custom cake')
  const eventDate = formatEventDate(order.event_date)
  const ref = formatOrderReference(order.id)
  const currentLabel = formatOrderStatus(nextStatus)
  const previousLabel = previousStatus ? formatOrderStatus(previousStatus) : null
  const subject = `${config.icon} EVO Cakes Update: ${currentLabel} — Ref #${ref}`

  const html = emailWrapper(`
    <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#1f2937;">${config.icon} ${escapeHtml(config.heading)}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">${escapeHtml(config.subheading)}</p>

    ${statusBadge(currentLabel, config.badgeColor)}
    ${previousLabel ? `<span style="font-size:12px;color:#9ca3af;margin-left:10px;">previously: ${escapeHtml(previousLabel)}</span>` : ''}

    <div style="background:#fafafa;border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin:24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Reference #', ref)}
        ${detailRow('Customer', order.customer_name)}
        ${detailRow('Event', eventType)}
        ${detailRow('Event Date', eventDate)}
        ${detailRow('Status', currentLabel)}
      </table>
    </div>

    ${config.paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:14px;color:#374151;line-height:1.7;">${escapeHtml(p)}</p>`).join('')}

    ${infoCard('Design on File', order.cake_description)}

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px 22px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#15803d;line-height:1.6;">💬 <strong>Have a question?</strong> Just reply to this email and we'll get back to you.</p>
    </div>

    <p style="margin:24px 0 4px;font-size:15px;color:#374151;">Thank you for choosing EVO Cakes.</p>
    <p style="margin:0;font-size:15px;color:#374151;">Warm regards,<br /><strong style="color:#7c3aed;">The EVO Cakes Team</strong></p>
  `)

  const text = [
    `${config.icon} EVO Cakes Order Update`,
    '',
    `Hello ${order.customer_name},`,
    '',
    config.heading,
    config.subheading,
    '',
    ...config.paragraphs,
    '',
    `Reference: #${ref}`,
    `Event: ${eventType}`,
    `Event Date: ${eventDate}`,
    `Status: ${currentLabel}${previousLabel ? ` (previously ${previousLabel})` : ''}`,
    '',
    'Design on File:',
    order.cake_description,
    '',
    'Questions? Reply to this email.',
    '',
    'Warm regards,',
    'The EVO Cakes Team',
  ].join('\n')

  return { subject, html, text }
}
