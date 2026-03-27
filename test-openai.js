import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  throw new Error('Set OPENAI_API_KEY before running this script.')
}

console.log('🔍 Testing OpenAI with new key...\n')

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

try {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful bakery assistant.' },
      { role: 'user', content: 'Hi! I need a birthday cake.' }
    ],
    max_tokens: 100
  })

  console.log('✅ OpenAI API working!')
  console.log('AI Response:', response.choices[0].message.content)
} catch (error) {
  console.error('❌ Error:', error.message)
}
