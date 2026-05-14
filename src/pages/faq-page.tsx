import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface FAQItem {
  category: string
  question: string
  answer: string[]
}

const faqs: FAQItem[] = [
  {
    category: 'Ordering',
    question: 'How far in advance should I place an order?',
    answer: [
      'For most custom cakes, placing your order at least 2 weeks in advance is the safest option.',
      'For wedding cakes and larger events, plan for 4 to 6 weeks so there is enough time for design planning, scheduling, and production. Rush orders may be possible depending on the design, event date, and current schedule.',
      'Because they require schedule changes and faster turnaround, rush requests can involve additional fees.',
    ],
  },
  {
    category: 'Pricing',
    question: 'Is a deposit required to confirm my order?',
    answer: [
      'Yes. A 50% non-refundable deposit is required for custom cake orders.',
      'Your order is not considered confirmed until you receive written confirmation and the deposit has been received. The remaining balance is due on delivery or pickup.',
    ],
  },
  {
    category: 'Pricing',
    question: 'Do you offer tasting?',
    answer: [
      'Yes. Complimentary tastings are available for wedding cakes and the tasting fee is credited toward the final wedding cake price.',
    ],
  },
  {
    category: 'Design',
    question: 'What flavours do you offer?',
    answer: [
      'Common options include vanilla, chocolate, red velvet, lemon, carrot, and strawberry.',
      'Custom flavor requests may also be possible, so it is worth asking if you want something more specific.',
    ],
  },
  {
    category: 'Design',
    question: 'Can you create a cake based on an inspiration photo?',
    answer: [
      'The beauty of custom cakes is the freedom for clients to express their individuality. We can work from inspiration images and create a design in a similar style with its own signature finish, however we will not be able to reproduce the exact design of your inspiration photos.',
    ],
  },
  {
    category: 'Dietary',
    question: 'How do you handle allergies and cross-contamination concerns?',
    answer: [
      'The bakery makes every effort to accommodate dietary needs, but it also handles common allergens including nuts, dairy, eggs, and gluten.',
      'If you have a severe allergy, mention it clearly before booking because cross-contamination can still occur in a shared kitchen environment.',
    ],
  },
  {
    category: 'Delivery',
    question: 'Do you offer delivery or pickup?',
    answer: [
      'Yes. Delivery is available within the local service area for an additional charge. Delivery fees vary based on distance and cake size or complexity, so the final fee is confirmed with your quote.',
      'Pickup is also available, however cakes 3 tiers or more have to be delivered and the delivery charge will be included in the cake price.',
    ],
  },
  {
    category: 'Delivery',
    question: 'What areas do you serve?',
    answer: [
      'Evocative Cakes is based in Brampton, Ontario and serves the surrounding local area.',
      'If your event is outside the usual delivery range, it is still worth asking because availability can depend on date, distance, and order size.',
    ],
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <section className="px-4 pb-10 pt-8 sm:pt-10 md:py-20">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center md:mb-16"
          >
            <div className="mb-4 flex items-center justify-center space-x-2 md:mb-6">
              <HelpCircle className="h-5 w-5 text-purple-600 md:h-6 md:w-6" />
              <span className="rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm md:px-4 md:py-2 md:text-lg">
                Frequently Asked Questions
              </span>
            </div>

            <h1 className="mt-2 mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:mt-4 md:mb-4 md:text-6xl">
              FAQ
            </h1>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg md:max-w-2xl md:text-xl">
              Find detailed answers about ordering, pricing, dietary options, delivery, and what to expect before your event.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-3 sm:space-y-4">
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
                  className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-purple-50 sm:px-6 sm:py-5"
                >
                  <div className="pr-4">
                    <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-700">
                      {faq.category}
                    </span>
                    <p className="mt-3 font-semibold text-gray-800">{faq.question}</p>
                  </div>
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
                    className="px-4 pb-4 sm:px-6 sm:pb-5"
                  >
                    <div className="space-y-3">
                      {faq.answer.map((paragraph) => (
                        <p key={paragraph} className="text-gray-600 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
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
            className="mt-10 rounded-3xl border border-purple-200 bg-gradient-to-r from-pink-100/80 to-purple-100/80 p-6 text-center backdrop-blur-sm md:mt-16 md:p-8"
          >
            <Sparkles className="mx-auto mb-4 h-7 w-7 text-purple-600 md:h-8 md:w-8" />
            <h3 className="mb-3 text-xl font-bold text-gray-800 md:text-2xl">
              Still have questions?
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base">
              Contact the team for a quote, send inspiration images, or ask the assistant for quick guidance before ordering.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link
                to="/contact"
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-600 hover:shadow-2xl md:px-8"
              >
                Request a Quote
              </Link>
              <Link
                to="/gallery"
                className="rounded-full border-2 border-purple-200 bg-white px-6 py-3 font-semibold text-purple-600 transition-all duration-300 hover:bg-gray-50 md:px-8"
              >
                View Gallery
              </Link>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-chatbot')
                  window.dispatchEvent(event)
                }}
                className="rounded-full border-2 border-purple-200 bg-white px-6 py-3 font-semibold text-purple-600 transition-all duration-300 hover:bg-gray-50 md:px-8"
              >
                Chat with Assistant
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
