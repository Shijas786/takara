"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Heart, MessageCircle, Repeat, Share, MoreHorizontal } from "lucide-react"
import { Cast, formatNumber, formatTimestamp } from "@/lib/utils"

interface CastCardProps {
  cast: Cast
  index: number
}

export function CastCard({ cast, index }: CastCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(cast.likes)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex space-x-3">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex-shrink-0"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg">
                {cast.author.pfpUrl ? (
                  <img
                    src={cast.author.pfpUrl}
                    alt={cast.author.displayName}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-sm truncate">
                  {cast.author.displayName}
                </span>
                {cast.author.verified && (
                  <Badge variant="secondary" className="h-4 px-1 text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                    ✓
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  @{cast.author.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {formatTimestamp(cast.timestamp)}
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-3">
                {cast.text}
              </p>

              {/* Embeds */}
              {cast.embeds && cast.embeds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-3 rounded-lg overflow-hidden border border-border/50"
                >
                  <img
                    src={cast.embeds[0]}
                    alt="Cast embed"
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`h-8 px-2 text-xs ${
                        liked ? 'text-red-400' : 'text-muted-foreground'
                      }`}
                    >
                      <Heart className={`mr-1 h-3 w-3 ${liked ? 'fill-current' : ''}`} />
                      {formatNumber(likeCount)}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground"
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      {formatNumber(cast.replies)}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground"
                    >
                      <Repeat className="mr-1 h-3 w-3" />
                      {formatNumber(cast.recasts)}
                    </Button>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Share className="h-3 w-3" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* More options */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 