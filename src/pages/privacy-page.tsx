import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
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
              <Shield className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                Your Privacy Matters
              </span>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4 mb-4">
              Privacy Policy
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  At EVO Cakes, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">2.1 Personal Information</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-3">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-base mb-4">
                  <li>Name, email address, and phone number</li>
                  <li>Delivery address</li>
                  <li>Event details and cake preferences</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Photos you upload for cake inspiration</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">2.2 Chatbot Conversations</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  When you use our AI chatbot, we collect and store conversation history to improve service quality and fulfill your cake orders.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">2.3 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-base">
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed text-base mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-base">
                  <li>Process and fulfill your cake orders</li>
                  <li>Communicate with you about your order status</li>
                  <li>Improve our AI chatbot and customer service</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Analyze website traffic and user behavior</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Information Sharing and Disclosure</h2>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">4.1 Third-Party Service Providers</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-3">
                  We share your information with trusted third parties who assist us in:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-base mb-4">
                  <li>Payment processing (Stripe, PayPal, etc.)</li>
                  <li>Email communications (Resend)</li>
                  <li>Website hosting (Vercel, Supabase)</li>
                  <li>AI services (OpenAI for chatbot functionality)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">4.2 Legal Requirements</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  We may disclose your information if required by law or to protect our rights, property, or safety.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">4.3 Business Transfers</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Security</h2>
                <p className="text-gray-600 leading-relaxed text-base mb-3">
                  We implement appropriate technical and organizational measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-base">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure database storage with row-level security</li>
                  <li>Regular security audits</li>
                  <li>Limited employee access to personal data</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed text-base mb-3">
                  We use cookies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-base mb-3">
                  <li>Remember your preferences</li>
                  <li>Analyze website traffic</li>
                  <li>Improve user experience</li>
                </ul>
                <p className="text-gray-600 leading-relaxed text-base">
                  You can disable cookies in your browser settings, but some features may not work properly.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your Rights and Choices</h2>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">7.1 Access and Correction</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  You have the right to access and update your personal information. Contact us to request access or corrections.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">7.2 Data Deletion</h3>
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  You may request deletion of your personal data. Note that we may retain certain information as required by law or for legitimate business purposes.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">7.3 Marketing Communications</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  You can opt out of promotional emails by clicking the unsubscribe link in any email or contacting us directly.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. International Data Transfers</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website with an updated "Last Updated" date.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed text-base mb-3">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="text-gray-700 space-y-1">
                  <p><strong>Email:</strong> privacy@evocakes.com</p>
                  <p><strong>Phone:</strong> 416-910-1439</p>
                  <p><strong>Location:</strong> Brampton, Ontario, Canada</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-800">GDPR & CCPA Compliance:</strong> We are committed to complying with applicable data protection laws, including GDPR and CCPA. California residents have additional rights under CCPA, including the right to know what personal information is collected and the right to opt-out of the sale of personal information (we do not sell your data).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
