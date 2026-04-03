"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Contact() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="bg-white/60 backdrop-blur-sm border border-purple-200 text-purple-600 text-sm font-medium px-4 py-2 rounded-full inline-block mb-6">
              ⭐ Get In Touch
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Customize Your Dream Cake
            </h1>
            <p className="text-xl text-gray-600">
              Let's bring your vision to life
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🎂 Order Details
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name*</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address*</label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number*</label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type*</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                    required
                  >
                    <option value="">Select an event type</option>
                    <option>Birthday</option>
                    <option>Wedding</option>
                    <option>Anniversary</option>
                    <option>Corporate</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Event*</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time (Optional)</label>
                    <input
                      type="time"
                      className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all"
                    />
                  </div>
                </div>

                <textarea
                  rows={4}
                  placeholder="Tell us about your vision, dietary restrictions, serving size, etc."
                  className="w-full rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none px-4 py-3 text-gray-700 bg-white transition-all resize-none"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  Send My Cake Idea
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  📞 Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-purple-500" />
                    (555) 123-CAKE
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5 text-purple-500" />
                    evocativecakes@gmail.com
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    123 Sweet Street, Bakery City
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  ⏰ Business Hours
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white text-center"
              >
                <h3 className="text-2xl font-bold mb-4">Need It Urgently?</h3>
                <p className="mb-6">Call us directly for rush orders and same-day consultations.</p>
                <button className="bg-white text-purple-600 rounded-full px-8 py-3 font-semibold hover:bg-gray-100 transition-all">
                  Call Now
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
