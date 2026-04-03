import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key not found. Chatbot will use fallback responses.')
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // For development - move to Edge Function in production
}) : null

const SYSTEM_PROMPT = `You are an AI assistant for EVO Cakes, a premium custom cake bakery. Your role is to help customers place cake orders in a friendly, conversational way.

Guidelines:
1. Be warm, enthusiastic, and helpful
2. Ask about the event type (wedding, birthday, anniversary, corporate, baby shower, graduation, etc.)
3. Inquire about event date and serving size (number of people)
4. Discuss cake flavors (vanilla, chocolate, red velvet, lemon, etc.)
5. Ask about design preferences and any special decorations
6. Inquire about dietary restrictions (gluten-free, vegan, nut-free, etc.)
7. **IMPORTANT**: When customer uploads an image, BE VERY ENTHUSIASTIC! Say things like:
   - "What a beautiful cake! 😍 We can absolutely create something like this!"
   - "Love that design! Our pastry chefs would be thrilled to recreate this!"
   - "Gorgeous! We've made similar cakes and they're always a hit!"
   - Describe what you see in the image and confirm you can make it
8. Collect customer contact information (name, email, phone number)
9. Summarize the order details before finalizing
10. Be specific about gathering ALL required information

When you have gathered ALL necessary information (name, email, phone, event type, cake description), respond with:
"ORDER_COMPLETE: [JSON object with all details]"

Example: "ORDER_COMPLETE: {"customer_name": "John Doe", "customer_email": "john@example.com", "customer_phone": "555-1234", "event_type": "Wedding", "event_date": "2026-06-15", "cake_description": "3-tier vanilla cake with roses", "dietary_restrictions": "none", "serving_size": "100 people"}"

Keep responses concise (2-3 sentences max) and always ask one question at a time.`

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function sendChatMessage(messages: Message[], imageUrl?: string): Promise<string> {
  if (!openai) {
    return getFallbackResponse(messages)
  }

  try {
    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      } as OpenAI.ChatCompletionMessageParam))
    ]

    // If there's an image, add it to the last user message
    if (imageUrl && chatMessages[chatMessages.length - 1].role === 'user') {
      const lastMessage = chatMessages[chatMessages.length - 1]
      const messageText = (lastMessage.content as string) || 'What do you think of this cake?'

      chatMessages[chatMessages.length - 1] = {
        role: 'user',
        content: [
          { type: 'text', text: messageText },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
              detail: 'high' // Use high detail for better cake analysis
            }
          }
        ]
      }
    }

    const response = await openai.chat.completions.create({
      model: imageUrl ? 'gpt-4o' : 'gpt-4o-mini', // Use gpt-4o for vision, gpt-4o-mini for text
      messages: chatMessages,
      max_tokens: 300,
      temperature: 0.8,
    })

    return response.choices[0].message.content || 'I apologize, I had trouble understanding. Could you please rephrase that?'
  } catch (error) {
    console.error('OpenAI error:', error)
    return 'I apologize, I\'m having technical difficulties. Please try again or use our contact form.'
  }
}

// Fallback responses when OpenAI is not available
function getFallbackResponse(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''

  if (messages.length === 1) {
    return "Hi! 👋 I'm here to help you create your dream cake! What type of event are you planning?"
  }

  if (lastMessage.includes('wedding')) {
    return "A wedding cake - how exciting! 💍 How many guests will you be serving?"
  }

  if (lastMessage.includes('birthday')) {
    return "Perfect! 🎉 What's the age or theme you'd like for the cake?"
  }

  if (lastMessage.match(/\d+\s*(people|guests|servings)/)) {
    return "Great! What flavors do you love? We offer vanilla, chocolate, red velvet, lemon, and many custom options!"
  }

  return "That sounds wonderful! Could you tell me more about your vision for the cake design?"
}

// Extract order data from conversation
export function extractOrderFromConversation(aiResponse: string): any | null {
  if (aiResponse.includes('ORDER_COMPLETE:')) {
    try {
      const jsonStr = aiResponse.split('ORDER_COMPLETE:')[1].trim()
      return JSON.parse(jsonStr)
    } catch (error) {
      console.error('Failed to parse order:', error)
      return null
    }
  }
  return null
}
