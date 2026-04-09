interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('Note: API key is handled on the backend for security.')
}

let openaiClientPromise: Promise<any | null> | null = null

async function getOpenAIClient() {
  // OpenAI client is no longer used in the browser
  return null
}

const BAKERY_FACTS = `
EVO Cakes facts:
- Birthday cakes shown on the site start around $65-$85.
- Custom design cakes shown on the site start around $85-$150+.
- Wedding cakes shown on the site start around $279-$399+.
- Final pricing depends on serving size, design complexity, ingredients, and decorations. Quotes are valid for 30 days.
- Order lead time: at least 2 weeks for most custom cakes, and 4-6 weeks for wedding cakes or large events. Rush orders may be available for an extra fee.
- Complimentary tastings are available for wedding cakes and orders over $200.
- Common flavors include vanilla, chocolate, red velvet, lemon, carrot, and strawberry, plus custom flavors on request.
- Dietary options include gluten-free, vegan, nut-free, and dairy-free.
- Size guide: 6-inch serves 8-10, 8-inch serves 15-20, 10-inch serves 25-30, 12-inch serves 40-50.
- Delivery is available within a 30-mile radius. Delivery fees vary by distance and cake size. Pickup is also available.
- Orders over $300 can use a 50% deposit upfront and the remaining balance on delivery day. Custom cake orders require a 50% deposit to confirm.
- Cancellations more than 72 hours before the event may be refunded minus the deposit. Cancellations within 24 hours are not refunded.
- Customers can upload inspiration images, and the bakery can recreate a similar design with its own signature touch.
`

const SYSTEM_PROMPT = `You are the EVO Cakes website assistant. You help customers with questions, concerns, and cake orders.

${BAKERY_FACTS}

Behavior:
1. Be warm, polished, and concise.
2. Answer direct questions about pricing, flavors, delivery, dietary options, lead times, tastings, storage, payments, cancellations, and inspiration photos.
3. If the customer asks about pricing, give the relevant starting ranges above and clearly say the final quote depends on size and design complexity.
4. If the customer wants to place an order, guide them step by step, acknowledge what they just shared, and ask only one focused follow-up question at a time.
5. For orders, collect: customer_name, customer_email, customer_phone, event_type, event_date, serving_size, cake_description, design_preferences, dietary_restrictions.
6. If the customer uploads an image, react enthusiastically, briefly describe the style you notice, and confirm EVO Cakes can work from it.
7. Do not invent unavailable services, exact pricing, or scheduling guarantees that are not in the facts above.
8. When the user is already in an order flow, interpret short replies in context. For example, "wedding", "21st April", "10", or "vanilla" can be valid answers to the current step.
9. When an order is in progress, do not switch into generic FAQ mode just because the latest reply contains a flavor or cake keyword. Treat it as part of the order unless the user clearly asks a separate question.
10. Keep normal replies to 2-4 short sentences.
11. Once you have enough details, briefly summarize the captured order before confirming the next step.
12. When you have at least customer_name, customer_email, customer_phone, event_type, and cake_description, include a short friendly confirmation for the customer and then end with a new line in this exact format:
ORDER_COMPLETE: {"customer_name":"...","customer_email":"...","customer_phone":"...","event_type":"...","event_date":"...","cake_description":"...","dietary_restrictions":"...","serving_size":"...","design_preferences":"..."}
13. The JSON must be valid and use double quotes only.`

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface OrderCapture {
  customer_name: string
  customer_email: string
  customer_phone: string
  event_type: string
  event_date?: string
  cake_description: string
  dietary_restrictions?: string
  serving_size?: string
  design_preferences?: string
}

type OrderDraft = Partial<OrderCapture>

const MONTH_PATTERN =
  '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)'

const EVENT_TYPE_MATCHERS = [
  { regex: /baby shower/i, value: 'Baby Shower' },
  { regex: /bridal shower/i, value: 'Bridal Shower' },
  { regex: /graduation/i, value: 'Graduation' },
  { regex: /anniversary/i, value: 'Anniversary' },
  { regex: /corporate/i, value: 'Corporate Event' },
  { regex: /retirement/i, value: 'Retirement' },
  { regex: /engagement/i, value: 'Engagement' },
  { regex: /wedding/i, value: 'Wedding' },
  { regex: /birthday/i, value: 'Birthday' },
]

const DIETARY_MATCHERS = [
  { regex: /gluten[- ]?free/i, value: 'gluten-free' },
  { regex: /vegan/i, value: 'vegan' },
  { regex: /nut[- ]?free/i, value: 'nut-free' },
  { regex: /dairy[- ]?free/i, value: 'dairy-free' },
]

export async function sendChatMessage(messages: Message[], imageUrl?: string): Promise<string> {
  try {
    const apiUrl = import.meta.env.PROD 
      ? '/api/chat'  // On Vercel, calls the serverless function
      : 'http://localhost:3001/api/chat'  // Locally, calls Express server
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    })

    if (!response.ok) {
      console.error('Chat API error:', response.status, response.statusText)
      return "I'm having technical trouble right now. You can still ask your question again, or use the contact form for a manual quote."
    }

    const data = await response.json()
    return data.content || "I'm sorry, I had trouble with that. Please try your message again."
  } catch (error) {
    console.error('Chat request error:', error)
    return "I'm having technical trouble right now. You can still ask your question again, or use the contact form for a manual quote."
  }
}

function getFallbackResponse(messages: Message[], hasImage: boolean): string {
  const userMessages = messages.filter((message) => message.role === 'user')
  const allUserText = normalizeWhitespace(userMessages.map((message) => message.content).join(' '))
  const lastMessage = normalizeWhitespace(userMessages[userMessages.length - 1]?.content || '')
  const lastMessageLower = lastMessage.toLowerCase()
  const draft = buildOrderDraft(userMessages, hasImage)
  const wantsOrder = hasOrderIntent(allUserText, draft)

  if (wantsOrder) {
    const missingField = getNextMissingField(draft)

    if (!missingField) {
      const finalizedOrder = finalizeDraft(draft)
      const orderSummary = summarizeDraft(finalizedOrder)

      return `Perfect. Here is the order summary I captured: ${orderSummary}. Our team will follow up to confirm the final quote and next steps.
ORDER_COMPLETE: ${JSON.stringify(finalizedOrder)}`
    }

    return getOrderQuestion(missingField, draft)
  }

  if (hasImage) {
    return 'That inspiration looks lovely. We can absolutely create something in a similar style. What kind of event is the cake for, and about how many people should it serve?'
  }

  if (matchesAny(lastMessageLower, ['price', 'pricing', 'cost', 'quote', 'how much'])) {
    return 'Birthday cakes on the site start around $65-$85, custom designs start around $85-$150+, and wedding cakes start around $279-$399+. Final pricing depends on size, flavor, and design detail. If you want, I can help you build a quote step by step.'
  }

  if (matchesAny(lastMessageLower, ['delivery', 'deliver', 'pickup', 'pick up'])) {
    return 'Yes, EVO Cakes delivers within a 30-mile radius, and pickup is also available. Delivery fees vary based on distance and cake size. Would you like help starting an order for delivery or pickup?'
  }

  if (matchesAny(lastMessageLower, ['flavor', 'flavour', 'vanilla', 'chocolate', 'red velvet', 'lemon', 'carrot', 'strawberry'])) {
    return 'We offer vanilla, chocolate, red velvet, lemon, carrot, strawberry, and custom flavor options. If you already have a cake idea in mind, I can help you turn it into an order request.'
  }

  if (matchesAny(lastMessageLower, ['dietary', 'vegan', 'gluten', 'nut-free', 'dairy-free'])) {
    return 'Yes, EVO Cakes offers gluten-free, vegan, nut-free, and dairy-free options. Tell me which dietary needs you have, and I can factor that into your order request.'
  }

  if (matchesAny(lastMessageLower, ['how far', 'advance', 'lead time', 'rush'])) {
    return 'For most custom cakes, ordering at least 2 weeks ahead is best. For weddings or larger events, allow 4-6 weeks. Rush orders may be possible depending on the design and date.'
  }

  if (matchesAny(lastMessageLower, ['tasting', 'sample'])) {
    return 'Wedding cakes and orders over $200 can qualify for a complimentary tasting. If you want, I can start your order request and note that you are interested in a tasting.'
  }

  if (matchesAny(lastMessageLower, ['cancel', 'refund'])) {
    return 'Orders cancelled more than 72 hours before the event may be refunded minus the deposit. Cancellations closer to the event can incur fees, and orders within 24 hours are typically non-refundable.'
  }

  if (matchesAny(lastMessageLower, ['store', 'storage', 'refrigerate', 'fridge'])) {
    return 'Most cakes should be refrigerated and brought out 1-2 hours before serving. Fondant cakes can often stay at room temperature, and EVO Cakes will provide storage guidance with the order.'
  }

  return 'Welcome to EVO Cakes. I can help with pricing, flavors, delivery, dietary questions, or take your order step by step. Tell me what you need, or say "I want to place an order."'
}

function buildOrderDraft(messages: Message[], hasImage: boolean): OrderDraft {
  const userContents = messages.map((message) => normalizeWhitespace(message.content)).filter(Boolean)
  const combinedText = normalizeWhitespace(userContents.join(' '))

  const eventType = extractEventType(combinedText)
  const eventDate = extractEventDate(userContents)
  const servingSize = extractServingSize(userContents)
  const dietaryRestrictions = extractDietaryRestrictions(combinedText)
  const customerEmail = extractEmail(combinedText)
  const customerPhone = extractPhone(combinedText)
  const customerName = extractName(combinedText)
  const cakeDescription = extractCakeDescription(userContents, hasImage)

  return {
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    event_type: eventType,
    event_date: eventDate,
    cake_description: cakeDescription,
    dietary_restrictions: dietaryRestrictions,
    serving_size: servingSize,
    design_preferences: cakeDescription,
  }
}

function extractEventType(text: string): string | undefined {
  for (const matcher of EVENT_TYPE_MATCHERS) {
    if (matcher.regex.test(text)) {
      return matcher.value
    }
  }

  return undefined
}

function extractEventDate(messages: string[]): string | undefined {
  const candidates = [...messages].reverse()

  for (const message of candidates) {
    const extractedDate = extractEventDateFromText(message)
    if (extractedDate) {
      return extractedDate
    }
  }

  return extractEventDateFromText(messages.join(' '))
}

function extractEventDateFromText(text: string): string | undefined {
  const isoDate = text.match(/\b\d{4}-\d{2}-\d{2}\b/)
  if (isoDate) {
    return isoDate[0]
  }

  const longDate = text.match(new RegExp(`\\b${MONTH_PATTERN}\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s+\\d{4})?\\b`, 'i'))
  if (longDate) {
    return normalizeWhitespace(longDate[0])
  }

  const dayMonthDate = text.match(new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+${MONTH_PATTERN}(?:,?\\s+\\d{4})?\\b`, 'i'))
  if (dayMonthDate) {
    return normalizeWhitespace(dayMonthDate[0])
  }

  const numericDate = text.match(/\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})\b/)
  if (numericDate) {
    return numericDate[0]
  }

  return undefined
}

function extractServingSize(messages: string[]): string | undefined {
  const candidates = [...messages].reverse()

  for (const message of candidates) {
    const extractedServingSize = extractServingSizeFromText(message)
    if (extractedServingSize) {
      return extractedServingSize
    }
  }

  return extractServingSizeFromText(messages.join(' '))
}

function extractServingSizeFromText(text: string): string | undefined {
  const normalizedText = normalizeWhitespace(text)
  const explicitRange = text.match(/\b\d+\s*(?:-\s*\d+)?\s*(?:people|guests|servings?)\b/i)
  if (explicitRange) {
    return normalizeWhitespace(explicitRange[0])
  }

  const servePattern = text.match(/\bserv(?:e|es|ing)\s+\d+\s*(?:-\s*\d+)?\b/i)
  if (servePattern) {
    return normalizeWhitespace(servePattern[0])
  }

  const bareNumber = normalizedText.match(/^(?:about|around)?\s*(\d{1,3})$/i)
  if (bareNumber) {
    return `${bareNumber[1]} people`
  }

  return undefined
}

function extractDietaryRestrictions(text: string): string | undefined {
  const matches = DIETARY_MATCHERS.filter((matcher) => matcher.regex.test(text)).map((matcher) => matcher.value)

  if (matches.length === 0) {
    return undefined
  }

  return Array.from(new Set(matches)).join(', ')
}

function extractEmail(text: string): string | undefined {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return match?.[0]
}

function extractPhone(text: string): string | undefined {
  const match = text.match(/\+?\d[\d\s().-]{7,}\d/)
  return match ? normalizeWhitespace(match[0]) : undefined
}

function extractName(text: string): string | undefined {
  const match = text.match(/(?:my name is|i am|i'm|this is)\s+([a-z][a-z'.-]*(?:\s+[a-z][a-z'.-]*){0,2})/i)

  if (!match) {
    return undefined
  }

  return toTitleCase(match[1])
}

function extractCakeDescription(userContents: string[], hasImage: boolean): string | undefined {
  const candidates = [...userContents].reverse()

  for (const message of candidates) {
    if (!message || message === '(uploaded image)') {
      continue
    }

    if (isContactOnlyMessage(message)) {
      continue
    }

    if (/^i want to place an order\.?$/i.test(message)) {
      continue
    }

    if (/^(pricing|price|delivery|flavors?|dietary options|questions?)\??$/i.test(message)) {
      continue
    }

    if (
      /\b(cake|tier|tiers|buttercream|fondant|cupcake|dessert|vanilla|chocolate|red velvet|lemon|carrot|strawberry|theme|design|flowers?|sprinkles?|custom|topper|photo|picture|image)\b/i.test(
        message
      )
    ) {
      return message
    }
  }

  if (hasImage) {
    return 'Customer shared an inspiration image for the cake design.'
  }

  return undefined
}

function isContactOnlyMessage(message: string): boolean {
  const normalized = normalizeWhitespace(message)

  return Boolean(
    extractEmail(normalized) ||
      extractPhone(normalized) ||
      /^(my name is|i am|i'm|this is)\s+[a-z][a-z'.-]*(?:\s+[a-z][a-z'.-]*){0,2}$/i.test(normalized)
  )
}

function hasOrderIntent(allUserText: string, draft: OrderDraft): boolean {
  if (
    /\b(place an order|want to place an order|want to order|i need a cake|need a cake|book a cake|custom cake|start an order|cake order|quote me)\b/i.test(
      allUserText
    )
  ) {
    return true
  }

  const populatedFields = [
    draft.event_type,
    draft.event_date,
    draft.serving_size,
    draft.cake_description,
    draft.customer_email,
    draft.customer_phone,
  ].filter(Boolean)

  return populatedFields.length >= 2
}

function getNextMissingField(draft: OrderDraft) {
  if (!draft.event_type) {
    return 'event_type'
  }

  if (!draft.event_date) {
    return 'event_date'
  }

  if (!draft.serving_size) {
    return 'serving_size'
  }

  if (!draft.cake_description) {
    return 'cake_description'
  }

  if (!draft.customer_name) {
    return 'customer_name'
  }

  if (!draft.customer_email) {
    return 'customer_email'
  }

  if (!draft.customer_phone) {
    return 'customer_phone'
  }

  return null
}

function getOrderQuestion(field: ReturnType<typeof getNextMissingField>, draft: OrderDraft): string {
  switch (field) {
    case 'event_type':
      return 'I can help with that. What kind of event is the cake for?'
    case 'event_date':
      return draft.event_type
        ? `Got it, this is for a ${draft.event_type.toLowerCase()}. What date is the event?`
        : 'Great. What date is the event?'
    case 'serving_size':
      return draft.event_date
        ? `Perfect, I have the date as ${draft.event_date}. About how many people should the cake serve?`
        : 'About how many people should the cake serve?'
    case 'cake_description':
      return 'Lovely. What style, flavor, or design would you like for the cake? Feel free to mention colors, theme, or tiers.'
    case 'customer_name':
      return 'Great, I have the cake details. What name should I put on the order request?'
    case 'customer_email':
      return draft.customer_name
        ? `Thanks, ${draft.customer_name}. What is the best email address for the quote and follow-up?`
        : 'What is the best email address for the quote and follow-up?'
    case 'customer_phone':
      return 'What phone number should the team use if they need to confirm any details?'
    default:
      return 'Tell me a bit more about the cake you have in mind.'
  }
}

function finalizeDraft(draft: OrderDraft): OrderCapture {
  return {
    customer_name: draft.customer_name || 'Not provided',
    customer_email: draft.customer_email || 'Not provided',
    customer_phone: draft.customer_phone || 'Not provided',
    event_type: draft.event_type || 'Custom Cake',
    event_date: draft.event_date,
    cake_description: draft.cake_description || 'Custom cake request',
    dietary_restrictions: draft.dietary_restrictions || 'none',
    serving_size: draft.serving_size,
    design_preferences: draft.design_preferences,
  }
}

function summarizeDraft(draft: OrderDraft) {
  const summaryParts = [
    draft.event_type ? `${draft.event_type} cake` : 'cake order',
    draft.event_date ? `for ${draft.event_date}` : undefined,
    draft.serving_size ? `serving ${draft.serving_size}` : undefined,
    draft.cake_description ? `with ${draft.cake_description}` : undefined,
    draft.dietary_restrictions && draft.dietary_restrictions !== 'none'
      ? `dietary note: ${draft.dietary_restrictions}`
      : undefined,
  ].filter(Boolean)

  return summaryParts.join(', ')
}

function buildOrderContextPrompt(draft: OrderDraft, wantsOrder: boolean) {
  const capturedFields = [
    `event_type: ${draft.event_type || 'missing'}`,
    `event_date: ${draft.event_date || 'missing'}`,
    `serving_size: ${draft.serving_size || 'missing'}`,
    `cake_description: ${draft.cake_description || 'missing'}`,
    `design_preferences: ${draft.design_preferences || 'missing'}`,
    `dietary_restrictions: ${draft.dietary_restrictions || 'missing'}`,
    `customer_name: ${draft.customer_name || 'missing'}`,
    `customer_email: ${draft.customer_email || 'missing'}`,
    `customer_phone: ${draft.customer_phone || 'missing'}`,
  ]

  return `Current order context:
- Order in progress: ${wantsOrder ? 'yes' : 'no'}
- Next missing field: ${wantsOrder ? getNextMissingField(draft) || 'none' : 'n/a'}
- Captured fields:
${capturedFields.map((field) => `  - ${field}`).join('\n')}

When the user gives a short answer, interpret it as the answer to the current missing field when that makes sense.`
}

function matchesAny(message: string, keywords: string[]) {
  return keywords.some((keyword) => message.includes(keyword))
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function sanitizeAssistantResponse(aiResponse: string): string {
  return aiResponse.split('ORDER_COMPLETE:')[0].trim()
}

export function extractOrderFromConversation(aiResponse: string): OrderCapture | null {
  const match = aiResponse.match(/ORDER_COMPLETE:\s*({[\s\S]*})/)

  if (!match) {
    return null
  }

  try {
    return JSON.parse(match[1]) as OrderCapture
  } catch (error) {
    console.error('Failed to parse order:', error)
    return null
  }
}

export function extractOrderFromMessages(messages: ConversationMessage[], hasImage = false): OrderCapture | null {
  const userMessages = messages
    .filter((message) => message.role === 'user')
    .map((message) => ({ role: 'user' as const, content: message.content }))

  const draft = buildOrderDraft(userMessages, hasImage)
  const wantsOrder = hasOrderIntent(
    normalizeWhitespace(userMessages.map((message) => message.content).join(' ')),
    draft
  )

  if (!wantsOrder) {
    return null
  }

  if (getNextMissingField(draft)) {
    return null
  }

  return finalizeDraft(draft)
}
