import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* SECTION 1 - Hero (2-column) */}
      <section className="px-4 pb-8 pt-8 sm:pt-10 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-4 flex items-center space-x-2 md:mb-6">
                  <Sparkles className="h-5 w-5 text-yellow-500 md:h-6 md:w-6" />
                  <span className="rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm md:px-4 md:py-2 md:text-lg">
                    Our Story
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:mt-4 md:mb-6 md:text-6xl"
              >
                About Evocative Cakes
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-base leading-relaxed text-gray-600 sm:text-lg"
              >
                Hi, I'm Cynthia, the creative soul and founder behind Evocative Cakes. I've always had a passion for all things creative,
                from experimenting in the kitchen to trying new art projects—and baking became my favorite canvas.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4 text-base leading-relaxed text-gray-600 sm:text-lg"
              >
                My journey started ten years ago with a very special request: my then 6-year-old son wanted a Lego-themed birthday
                cake. After checking local bakeries, I nearly fell over at the price—and thought, "I can do this myself!" With a little
                research, a lot of trial and error, and some invaluable help from a coworker, I baked and carved out a cake that wowed
                everyone at the party. It didn't just look amazing—it tasted incredible. That first cake sparked a love for custom
                creations that has grown into what is now Evocative Cakes.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-4 text-base leading-relaxed text-gray-600 sm:text-lg"
              >
                Since then, I've baked for family, friends, and soon enough, strangers who became clients. I've learned that a cake is
                more than dessert—it's a centerpiece for memories, a conversation starter, and sometimes even the star of the show.
                My goal is to make every cake a unique, delicious, and unforgettable experience for both the host and the guests.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base leading-relaxed text-gray-600 sm:text-lg"
              >
                At Evocative Cakes, I combine artistry with flavor, crafting custom creations that leave a lasting impression long after
                the candles are blown out. Every cake tells a story—and I can't wait to help tell yours.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-base font-semibold text-purple-600 sm:text-lg mt-2"
              >
                — Cynthia
              </motion.p>
            </div>

            {/* Right Column - Image with floating heart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <img
                src="/images/gallery/WEDDING-CAKES/2_Mike and Gloria.jpg"
                alt="Signature Evocative Cakes design"
                className="h-[340px] w-full rounded-3xl object-cover shadow-2xl sm:h-[500px]"
              />
              {/* Floating heart badge */}
              <motion.div
                className="absolute -right-3 -top-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-rose-400 shadow-2xl sm:-right-6 sm:-top-6 sm:h-24 sm:w-24"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="h-7 w-7 fill-white text-white sm:h-10 sm:w-10" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - Mission */}
      <section className="px-4 py-12 text-center md:py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center justify-center space-x-2 md:mb-6">
              <Sparkles className="h-5 w-5 text-yellow-500 md:h-6 md:w-6" />
              <span className="rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm md:px-4 md:py-2 md:text-lg">
                Our Mission
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 mb-4 text-3xl font-bold text-gray-800 sm:text-4xl md:mt-4 md:mb-6 md:text-5xl"
          >
            Creating Sweet Memories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-8 max-w-3xl text-base text-gray-600 sm:text-lg md:mb-10 md:text-xl"
          >
            To create exceptional cakes that exceed expectations and make every celebration memorable.
            We believe that every cake should be as unique as the person celebrating, crafted with
            the finest ingredients and unlimited creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/contact">
              <button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-600 hover:shadow-2xl md:px-10 md:py-4 md:text-lg">
                Start Your Order →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
