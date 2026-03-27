import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'

export default function TermsPage() {
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
              <Scale className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                Legal
              </span>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4 mb-4">
              Terms of Service
            </h1>

            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100"
          >
            <div className="space-y-10">
              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  By accessing and using EVO Cakes' website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Orders and Payments</h2>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">2.1 Order Confirmation</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  All orders must be confirmed in writing (email or written contract). Orders are not considered final until you receive confirmation from EVO Cakes.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">2.2 Deposits</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  A non-refundable deposit of 50% is required for all custom cake orders. The remaining balance is due upon delivery or pickup.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">2.3 Pricing</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  Prices quoted are valid for 30 days from the date of quote. Final pricing may vary based on design complexity and ingredient costs.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Cancellations and Refunds</h2>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">3.1 Cancellation Policy</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-base mb-4">
                  <li>Orders cancelled more than 72 hours before the event date: Full refund minus deposit</li>
                  <li>Orders cancelled within 72 hours: 50% refund (ingredients already purchased)</li>
                  <li>Orders cancelled within 24 hours: No refund</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">3.2 Weather and Unforeseen Circumstances</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  In case of severe weather or unforeseen circumstances preventing delivery, we will work with you to reschedule or provide a full refund.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Delivery and Pickup</h2>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">4.1 Delivery</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  We deliver within a 30-mile radius of our bakery. Delivery fees are calculated based on distance and cake complexity. Delivery times are estimates and may vary due to traffic conditions.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">4.2 Pickup</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  Cakes must be picked up within the agreed timeframe. Late pickups may incur storage fees.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">4.3 Liability</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  Once the cake is delivered or picked up, EVO Cakes is not responsible for damage, melting, or quality issues caused by improper handling or storage.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Allergens and Dietary Requirements</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  While we make every effort to accommodate dietary restrictions, our bakery processes common allergens including nuts, dairy, eggs, and gluten. Cross-contamination may occur. Please inform us of any severe allergies.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Design and Customization</h2>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">6.1 Custom Designs</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  We reserve the right to make minor adjustments to designs based on ingredient availability or technical limitations while maintaining the overall aesthetic.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">6.2 Intellectual Property</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  We do not reproduce copyrighted characters or logos without proper licensing. Customers are responsible for obtaining necessary permissions.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Photography and Marketing</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  EVO Cakes reserves the right to photograph cakes for marketing purposes unless you explicitly opt out in writing.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  EVO Cakes' liability is limited to the purchase price of the cake. We are not liable for any consequential damages, including but not limited to event cancellations or disappointments.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-3 text-gray-700 space-y-1">
                  <p><strong>Email:</strong> hello@evocakes.com</p>
                  <p><strong>Phone:</strong> (555) 123-CAKE</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-gray-600">
                  By placing an order with EVO Cakes, you acknowledge that you have read, understood, and agree to these Terms of Service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
