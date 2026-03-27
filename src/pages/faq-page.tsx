import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: "How far in advance should I order my cake?",
    answer: "We recommend ordering at least 2 weeks in advance for custom cakes. For wedding cakes or large events, please allow 4-6 weeks. Rush orders may be available with additional fees."
  },
  {
    question: "Do you offer cake tastings?",
    answer: "Yes! We offer complimentary tastings for wedding cakes and orders over $200. Schedule a tasting appointment by contacting us through our contact form or chatbot."
  },
  {
    question: "What flavors do you offer?",
    answer: "We offer vanilla, chocolate, red velvet, lemon, carrot, strawberry, and many more! We can also create custom flavors based on your preferences. Just ask!"
  },
  {
    question: "Can you accommodate dietary restrictions?",
    answer: "Absolutely! We offer gluten-free, vegan, nut-free, and dairy-free options. Please specify your dietary requirements when ordering, and we'll create the perfect cake for you."
  },
  {
    question: "How do I know what size cake to order?",
    answer: "As a general guide: 6-inch cake serves 8-10 people, 8-inch serves 15-20, 10-inch serves 25-30, and 12-inch serves 40-50. For larger events, we can create multi-tier cakes."
  },
  {
    question: "Do you deliver?",
    answer: "Yes! We offer delivery within a 30-mile radius. Delivery fees vary based on distance and cake size. We also offer pickup at our bakery if you prefer."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Orders can be cancelled up to 72 hours before the event date for a full refund. Cancellations within 72 hours may be subject to a 50% fee, as ingredients have already been purchased."
  },
  {
    question: "Can I see photos of your previous work?",
    answer: "Of course! Visit our Gallery page to see examples of our cakes. You can also upload inspiration photos through our chatbot or contact form."
  },
  {
    question: "How should I store my cake?",
    answer: "Most cakes should be refrigerated and taken out 1-2 hours before serving for best taste. Fondant cakes can be stored at room temperature. We'll provide specific storage instructions with your order."
  },
  {
    question: "Do you offer payment plans?",
    answer: "For orders over $300, we offer a 50% deposit upfront and the remaining 50% on delivery day. Payment can be made via cash, card, or bank transfer."
  },
  {
    question: "Can you create a cake from a picture?",
    answer: "Yes! Simply upload your inspiration image through our contact form or AI chatbot, and our pastry chefs will recreate it with our signature touch."
  },
  {
    question: "What areas do you serve?",
    answer: "We're based in [Your City] and deliver within a 30-mile radius. For events outside this area, please contact us to discuss options."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <HelpCircle className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                Frequently Asked Questions
              </span>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4 mb-4">
              FAQ
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about ordering, delivery, and our cakes
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-purple-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-600 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-5"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-200"
          >
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-700 mb-6">
              We're here to help! Contact us or chat with our AI assistant.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/contact"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Contact Us
              </a>
              <button
                onClick={() => {
                  // Trigger chatbot open
                  const event = new CustomEvent('open-chatbot')
                  window.dispatchEvent(event)
                }}
                className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-3 rounded-full font-semibold border-2 border-purple-200 transition-all duration-300"
              >
                Chat with AI
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
