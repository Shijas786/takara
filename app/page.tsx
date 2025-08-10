"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedHeader } from "@/components/animated-header"
import { HeroSection } from "@/components/hero-section"
import { UserProfileCard } from "@/components/user-profile-card"
import { CastComposer } from "@/components/cast-composer"
import { FeedSection } from "@/components/feed-section"
import { ExploreSection } from "@/components/explore-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { mockUser } from "@/lib/utils"
import { useMiniKit, useAddFrame, useOpenUrl } from "@coinbase/onchainkit/minikit"

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(true)

  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  const handleAddFrame = async () => {
    const result = await addFrame()
    if (result) {
      console.log('Frame added:', result.url, result.token)
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="flex justify-end items-center p-3 gap-2">
          <button
            type="button"
            className="cursor-pointer bg-transparent font-semibold text-sm px-2 py-1 border rounded"
            onClick={handleAddFrame}
          >
            Save Frame
          </button>
          <button
            type="button"
            className="cursor-pointer bg-transparent font-semibold text-sm px-2 py-1 border rounded"
            onClick={() => openUrl('https://base.org/builders/minikit')}
          >
            BUILT WITH MINIKIT
          </button>
        </div>

        <AnimatedHeader />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <HeroSection />

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <Tabs defaultValue="feed" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm border border-border/50">
                <TabsTrigger value="feed" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Feed
                </TabsTrigger>
                <TabsTrigger value="create" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Create
                </TabsTrigger>
                <TabsTrigger value="explore" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Explore
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent key="feed" value="feed" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FeedSection />
                  </motion.div>
                </TabsContent>

                <TabsContent key="create" value="create" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-6 md:grid-cols-2"
                  >
                    <UserProfileCard user={mockUser} isSignedIn={isSignedIn} />
                    <CastComposer />
                  </motion.div>
                </TabsContent>

                <TabsContent key="explore" value="explore" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExploreSection />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </TooltipProvider>
  )
} 