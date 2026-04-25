import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const BAKERY_FACTS = `
Evocative Cakes facts:
- Birthday cakes shown on the site start around $65-$85.
- Wedding cakes start around $200-$300+ depending on guests and design.
- Cupcakes are available in dozens or custom sets.
- Custom cakes are fully personalized for any event.
- Cookies & treats include macarons, cookies, brownies, and more.
- Standard lead time: 2+ weeks for regular orders.
- Wedding orders: 4-6 weeks recommended.
- Dietary accommodations available (gluten-free, vegan, nut-free, etc.).
- Delivery available within 15 miles for a flat fee.
- Pickup available at the bakery.
- Color options: Any color available, custom designs welcome.
- Flavors: Chocolate, Vanilla, Red Velvet, Lemon, Carrot Cake, and seasonal specials.
- Price range: From $65 for small cakes to $500+ for elaborate wedding cakes.
- Custom consultations available via email or phone.
- Contact: evocativecakes@gmail.com or call for quotes.
`

const SYSTEM_PROMPT = `You are a helpful customer service assistant for Evocative Cakes, a premium custom cake bakery. 

${BAKERY_FACTS}

Your role is to:
1. Answer questions about cakes, pricing, flavors, dietary options, and delivery
2. Help customers place orders by gathering their details (name, email, phone, event type, date, cake description)
3. Provide friendly, professional assistance
4. Suggest appropriate cake options based on their event
5. Explain pricing tiers and customization options
6. If a customer shares an inspiration image, react enthusiastically, briefly describe what you see (style, colors, tiers, decorations), and confirm EVO Cakes can create something in that style

When a customer wants to place an order, collect:
- Full name
- Email address
- Phone number
- Event type (birthday, wedding, custom, etc.)
- Event date
- Cake description (flavors, size, design ideas, dietary needs)

Be warm, professional, and helpful. Always confirm details before finalizing orders.`

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  if (request.method === 'OPTIONS') {
    response.status(200).end()
    return
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = request.body

    if (!process.env.OPENAI_API_KEY) {
      return response.status(500).json({ error: 'OpenAI API key not configured' })
    }

    if (!messages || !Array.isArray(messages)) {
      return response.status(400).json({ error: 'Messages array required' })
    }

    // Add system prompt to messages
    const messagesWithSystem = [
      {
        role: 'system' as const,
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ]

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messagesWithSystem as any,
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = chatResponse.choices[0].message.content

    return response.json({
      role: 'assistant',
      content,
    })
  } catch (error: any) {
    const errorMessage = error?.message || String(error)
    const errorStatus = error?.status || 500
    console.error('Chat API error:', errorStatus, errorMessage, error)

    if (errorStatus === 401) {
      return response.status(401).json({ error: 'Invalid API key' })
    }

    return response.status(500).json({ error: 'Failed to process chat request', detail: errorMessage })
  }
}
