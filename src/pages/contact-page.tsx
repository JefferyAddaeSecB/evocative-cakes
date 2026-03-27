import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ContactFormData {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  message: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // TODO: Integrate with Supabase or your backend API
      console.log('Form submitted:', data)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Thank you! Your cake order request has been received. We\'ll get back to you soon!')
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Oops! Something went wrong. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                Get In Touch
              </span>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4 mb-4">
              Contact Us
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let's bring your vision to life. Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* LEFT - Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>

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
                    rows={5}
                    placeholder="Tell us about your vision, dietary restrictions, serving size, design preferences, etc. *"
                    {...register('message', { required: 'Please tell us about your cake vision' })}
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
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
              </form>
            </motion.div>

            {/* RIGHT - Contact Info */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">(555) 123-CAKE</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">hello@evocakes.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-800">123 Sweet Street, Bakery City</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Business Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h3>
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
                className="bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-200"
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
