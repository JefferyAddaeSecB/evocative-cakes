import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import ImageUploadZone from '@/components/ImageUploadZone'
import { createOrder } from '@/lib/supabase'

interface ContactFormData {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  message: string
  dietaryRestrictions: string
  servingSize: string
}

interface FormFeedback {
  tone: 'success' | 'warning' | 'error'
  title: string
  description: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [formFeedback, setFormFeedback] = useState<FormFeedback | null>(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setFormFeedback(null)

    try {
      // Create order in Supabase with images
      const result = await createOrder({
        source: 'contact_form',
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        event_type: data.eventType,
        event_date: data.eventDate || undefined,
        cake_description: data.message,
        dietary_restrictions: data.dietaryRestrictions || undefined,
        serving_size: data.servingSize || undefined,
        design_preferences: undefined
      }, uploadedImages)

      reset()
      setUploadedImages([])

      const acknowledgementMessage = result.customerAcknowledgementSent
        ? 'A confirmation email has been sent and our team will follow up within the next 24 hours.'
        : 'Our team will follow up within the next 24 hours.'

      if (result.hasImageUploadIssues) {
        setFormFeedback({
          tone: 'warning',
          title: 'Your cake request was received.',
          description: result.hasStoragePolicyIssue
            ? `${acknowledgementMessage} Your inspiration image could not be attached this time, so we may ask you to resend it.`
            : `${acknowledgementMessage} Some inspiration images could not be attached, but your request has been received.`,
        })
      } else {
        setFormFeedback({
          tone: 'success',
          title: 'Your cake request was sent successfully.',
          description: acknowledgementMessage,
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormFeedback({
        tone: 'error',
        title: 'We could not submit your request.',
        description: 'Please try again or contact us directly and our team will assist you.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <section className="px-4 pb-10 pt-8 sm:pt-10 md:py-20">
        <div className="container mx-auto max-w-6xl">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center md:mb-16"
          >
            <div className="mb-4 flex items-center justify-center space-x-2 md:mb-6">
              <Sparkles className="h-5 w-5 text-yellow-500 md:h-6 md:w-6" />
              <span className="rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm md:px-4 md:py-2 md:text-lg">
                Get In Touch
              </span>
            </div>

            <h1 className="mt-2 mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:mt-4 md:mb-4 md:text-6xl">
              Contact Us
            </h1>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg md:max-w-2xl md:text-xl">
              Let's bring your vision to life. Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {/* LEFT - Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
            >
              <h2 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">Order Details</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Event Type (select) */}
                <div>
                  <select
                    {...register('eventType', { required: 'Please select an event type' })}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                  >
                    <option value="">Event Type *</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.eventType && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
                  )}
                </div>

                {/* Event Date */}
                <div>
                  <input
                    type="date"
                    placeholder="Event Date"
                    {...register('eventDate')}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your cake vision and design preferences *"
                    {...register('message', { required: 'Please tell us about your cake vision' })}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <input
                    type="text"
                    placeholder="Dietary Restrictions (optional)"
                    {...register('dietaryRestrictions')}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                  />
                </div>

                {/* Serving Size */}
                <div>
                  <input
                    type="text"
                    placeholder="Serving Size (e.g., 20-25 people)"
                    {...register('servingSize')}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Cake Inspiration Images (Optional)
                  </label>
                  <ImageUploadZone
                    onImagesChange={setUploadedImages}
                    maxFiles={5}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send My Cake Request'}
                </button>

                {formFeedback && (
                  <div
                    aria-live="polite"
                    className={`rounded-2xl border px-5 py-4 text-sm shadow-sm ${
                      formFeedback.tone === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : formFeedback.tone === 'warning'
                          ? 'border-amber-200 bg-amber-50 text-amber-900'
                          : 'border-red-200 bg-red-50 text-red-900'
                    }`}
                  >
                    <p className="font-semibold">{formFeedback.title}</p>
                    <p className="mt-1 leading-relaxed">{formFeedback.description}</p>
                  </div>
                )}
              </form>
            </motion.div>

            {/* RIGHT - Contact Info */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8"
              >
                <h3 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href="tel:+14169101439"
                        className="font-semibold text-gray-800 no-underline transition-colors hover:text-purple-600"
                      >
                        416-910-1439
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">evocativecakes@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-800">Brampton, Ontario, Canada</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Business Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8"
              >
                <h3 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">Business Hours</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold text-gray-800">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold text-gray-800">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-gray-800">Closed</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Tip Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-3xl border border-purple-200 bg-gradient-to-r from-pink-100/80 to-purple-100/80 p-6 backdrop-blur-sm sm:p-8"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Quick Tip
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  For custom designs, please allow at least 2 weeks notice. Rush orders may be available with additional fees.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
