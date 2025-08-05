"use client"

import { motion } from "framer-motion"
import { Sparkles, MessageCircle } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function AnimatedHeader() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Takara
            </h1>
            <p className="text-xs text-muted-foreground">AI Content Creation</p>
          </div>
        </motion.div>

        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-9 items-center rounded-full bg-muted/50 px-3 text-sm font-medium"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Mini App
          </motion.div>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
