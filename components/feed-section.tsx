"use client"

import { motion } from "framer-motion"
import { CastCard } from "@/components/cast-card"
import { mockCasts } from "@/lib/utils"

export function FeedSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Casts</h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-muted-foreground"
        >
          Latest from the community
        </motion.div>
      </div>

      <div className="space-y-4">
        {mockCasts.map((cast, index) => (
          <CastCard key={cast.id} cast={cast} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center py-8"
      >
        <p className="text-sm text-muted-foreground">
          You&apos;re all caught up! 🎉
        </p>
      </motion.div>
    </motion.section>
  )
}
