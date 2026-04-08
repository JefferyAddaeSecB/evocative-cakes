import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import OpenAI from 'openai'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

// Initialize OpenAI
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

When a customer wants to place an order, collect:
- Full name
- Email address
- Phone number
- Event type (birthday, wedding, custom, etc.)
- Event date
- Cake description (flavors, size, design ideas, dietary needs)

Be warm, professional, and helpful. Always confirm details before finalizing orders.`

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' })
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' })
    }

    // Add system prompt to messages
    const messagesWithSystem = [
      {
        role: 'system' as const,
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0].message.content

    return res.json({
      role: 'assistant',
      content,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)

    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' })
    }

    return res.status(500).json({ error: 'Failed to process chat request' })
  }
})

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
})
