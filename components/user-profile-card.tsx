"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Edit, Settings, TrendingUp, Users } from "lucide-react"
import { User as UserType, formatNumber } from "@/lib/utils"

interface UserProfileCardProps {
  user: UserType
  isSignedIn?: boolean
}

export function UserProfileCard({ user, isSignedIn = true }: UserProfileCardProps) {
  if (!isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4"
            >
              <User className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="mb-2 text-lg font-semibold">Not Signed In</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Sign in to access your profile and start creating content
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="w-full">
                Sign In with Farcaster
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg"
              >
                {user.pfpUrl ? (
                  <img
                    src={user.pfpUrl}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
                {user.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-500 p-0.5"
                  >
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
              <div>
                <h3 className="font-semibold">{user.displayName}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {user.verified && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Verified
                </Badge>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <p className="text-sm text-muted-foreground">{user.bio}</p>
          
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="font-semibold">{formatNumber(user.followers)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="font-semibold">{formatNumber(user.following)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">#{user.fid}</div>
              <p className="text-xs text-muted-foreground">FID</p>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outline" className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 