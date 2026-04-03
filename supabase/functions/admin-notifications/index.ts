type NotificationRequest = {
  audience?: 'admin' | 'customer'
  email?: {
    to?: string | string[]
    subject: string
    html: string
    text?: string
  }
  sms?: {
    to?: string
    message: string
  }
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    },
  })
}

function getAdminEmailRecipients() {
  const rawValue = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || Deno.env.get('RESEND_ADMIN_EMAIL') || ''
  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function getAdminPhoneRecipients() {
  const rawValue = Deno.env.get('ADMIN_NOTIFICATION_PHONE') || ''
  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function normalizeEmailRecipients(value?: string | string[]) {
  if (!value) {
    return []
  }

  return (Array.isArray(value) ? value : [value])
    .map((entry) => entry.trim())
    .filter(Boolean)
}

async function sendEmail(payload: Required<NotificationRequest>['email']) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL')
  const replyToEmail = Deno.env.get('REPLY_TO_EMAIL')?.trim()

  if (!resendApiKey || !fromEmail) {
    return { sent: false, reason: 'Missing Resend configuration' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'evo-cakes-admin-notifications/1.0',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: payload.to,
      reply_to: replyToEmail || undefined,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return { sent: false, reason: errorText || 'Resend request failed' }
  }

  return { sent: true }
}

async function sendSms(payload: Required<NotificationRequest>['sms']) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const fromNumber = Deno.env.get('TWILIO_FROM_NUMBER')

  if (!accountSid || !authToken || !fromNumber) {
    return { sent: false, reason: 'Missing Twilio configuration' }
  }

  const body = new URLSearchParams({
    To: payload.to,
    From: fromNumber,
    Body: payload.message,
  })

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    return { sent: false, reason: errorText || 'Twilio request failed' }
  }

  return { sent: true }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return jsonResponse({ ok: true })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const payload = (await request.json()) as NotificationRequest
    const emailTargets = normalizeEmailRecipients(
      payload.email?.to ||
      (payload.audience === 'admin' ? getAdminEmailRecipients() : [])
    )
    const smsTargets =
      payload.sms?.to
        ? [payload.sms.to]
        : payload.audience === 'admin'
          ? getAdminPhoneRecipients()
          : []

    let emailSent = false
    let smsSent = false
    const errors: string[] = []

    if (payload.email && emailTargets.length > 0) {
      const emailResult = await sendEmail({ ...payload.email, to: emailTargets })
      emailSent = emailResult.sent

      if (!emailResult.sent && emailResult.reason) {
        errors.push(emailResult.reason)
      }
    }

    if (payload.sms && smsTargets.length > 0) {
      const smsResults = await Promise.all(
        smsTargets.map((to) => sendSms({ ...payload.sms!, to }))
      )

      smsSent = smsResults.some((result) => result.sent)
      errors.push(
        ...smsResults
          .filter((result) => !result.sent && result.reason)
          .map((result) => result.reason as string)
      )
    }

    return jsonResponse({
      success: emailSent || smsSent,
      emailSent,
      smsSent,
      errors,
    })
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Unexpected notification error',
      },
      500
    )
  }
})
