"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Hash, Users, Sparkles } from "lucide-react"

const trendingTopics = [
  { id: 1, tag: "Base", posts: 1247, trending: true },
  { id: 2, tag: "DeFi", posts: 892, trending: true },
  { id: 3, tag: "NFTs", posts: 654, trending: false },
  { id: 4, tag: "Web3", posts: 543, trending: false },
  { id: 5, tag: "Crypto", posts: 432, trending: false },
  { id: 6, tag: "AI", posts: 321, trending: true },
]

const featuredCreators = [
  { id: 1, name: "Crypto Enthusiast", followers: "15.4K", verified: true },
  { id: 2, name: "Web3 Builder", followers: "8.9K", verified: true },
  { id: 3, name: "DeFi Explorer", followers: "12.3K", verified: false },
  { id: 4, name: "NFT Collector", followers: "5.7K", verified: false },
]

export function ExploreSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Explore</h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-muted-foreground"
        >
          Discover trending content
        </motion.div>
      </div>

      {/* Trending Topics */}
      <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>Trending Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">#{topic.tag}</span>
                {topic.trending && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    Trending
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{topic.posts.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Featured Creators */}
      <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>Featured Creators</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {featuredCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {creator.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{creator.name}</span>
                    {creator.verified && (
                      <Badge variant="secondary" className="h-3 px-1 text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{creator.followers} followers</p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge variant="outline" className="text-xs">
                  Follow
                </Badge>
              </motion.div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.section>
  )
} 