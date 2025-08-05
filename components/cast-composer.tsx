"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Wand2, Loader2, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RealFarcasterPoster } from "./RealFarcasterPoster"

export function CastComposer() {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('crypto')
  const [selectedLength, setSelectedLength] = useState('medium')

  const getMaxLength = (length: string) => {
    switch (length) {
      case 'short': return 100
      case 'medium': return 280
      case 'long': return 500
      default: return 280
    }
  }

  const maxLength = getMaxLength(selectedLength)
  const remainingChars = maxLength - text.length

  const styles = [
    { id: 'crypto', name: 'Crypto', icon: '🚀', color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'based', name: 'Based', icon: '⚡', color: 'bg-gradient-to-r from-green-400 to-blue-500' },
    { id: 'influencer', name: 'Influencer', icon: '💎', color: 'bg-gradient-to-r from-pink-500 to-red-500' },
    { id: 'reply', name: 'Reply', icon: '💬', color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
  ]

  const lengths = [
    { id: 'short', name: 'Short', icon: '📝', maxChars: 100, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
    { id: 'medium', name: 'Medium', icon: '📄', maxChars: 280, color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'long', name: 'Long', icon: '📚', maxChars: 500, color: 'bg-gradient-to-r from-purple-500 to-pink-600' },
  ]

  const generateContent = async () => {
    if (!text.trim()) return
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/openai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          style: selectedStyle,
          type: 'farcaster_post',
          length: selectedLength,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data.content)
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const postCast = async (content: string) => {
    try {
      // Check if we're in a Warpcast Mini App environment
      if (typeof window !== 'undefined' && (window as any).warpcast) {
        // Real Farcaster posting via Warpcast Mini App
        const warpcast = (window as any).warpcast;
        
        if (warpcast.actions && warpcast.actions.composeCast) {
          const result = await warpcast.actions.composeCast({
            text: content,
            close: false, // Keep the app open after posting
          });
          
          if (result.cast) {
            console.log('✅ Cast posted successfully:', result.cast);
            setShowSuccess(true);
            setText("");
            setGeneratedContent("");
          } else {
            throw new Error('Failed to post cast');
          }
        } else {
          throw new Error('Warpcast Mini App SDK not available');
        }
      } else {
        // Fallback: Try to use Neynar Mini App SDK if available
        if (typeof window !== 'undefined' && (window as any).neynar) {
          const neynar = (window as any).neynar;
          
          if (neynar.actions && neynar.actions.composeCast) {
            const result = await neynar.actions.composeCast({
              text: content,
              close: false,
            });
            
            if (result.cast) {
              console.log('✅ Cast posted successfully:', result.cast);
              setShowSuccess(true);
              setText("");
              setGeneratedContent("");
            } else {
              throw new Error('Failed to post cast');
            }
          } else {
            throw new Error('Neynar Mini App SDK not available');
          }
        } else {
          // Fallback to mock posting for development
          console.log('📝 Development mode: Mock posting to Farcaster');
          await new Promise(resolve => setTimeout(resolve, 1000));
          setShowSuccess(true);
          setText("");
          setGeneratedContent("");
        }
      }
    } catch (error) {
      console.error('Error posting cast:', error);
      // Show error message to user
      alert(`Failed to post cast: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span>Create Your Cast</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Style & Length Selector */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Choose Style:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedStyle === style.id
                          ? `${style.color} border-transparent text-white shadow-lg`
                          : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{style.icon}</span>
                        <span className="font-medium">{style.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Choose Length:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {lengths.map((length) => (
                    <motion.button
                      key={length.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedLength(length.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedLength === length.id
                          ? `${length.color} border-transparent text-white shadow-lg`
                          : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-lg">{length.icon}</span>
                        <span className="font-medium text-sm">{length.name}</span>
                        <span className="text-xs opacity-75">{length.maxChars} chars</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind? Share your thoughts with the Farcaster community..."
                className="min-h-[120px] resize-none border-border/50 bg-background/50"
                maxLength={maxLength}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {remainingChars} chars left
                  </Badge>
                  {remainingChars < 50 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-orange-400"
                    >
                      ⚠️ Getting close to limit
                    </motion.div>
                  )}
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={generateContent}
                    disabled={!text.trim() || isGenerating}
                    size="sm"
                    variant="outline"
                    className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-400 hover:from-blue-500/20 hover:to-purple-500/20"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {generatedContent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Enhanced Content:</h4>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      AI Generated
                    </Badge>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{generatedContent}</p>
                  
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => postCast(generatedContent)}
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {typeof window !== 'undefined' && ((window as any).warpcast || (window as any).neynar) 
                          ? "Post to Farcaster"
                          : "Post Cast (Mock)"
                        }
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => copyToClipboard(generatedContent)}
                        variant="outline"
                        size="sm"
                      >
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <RealFarcasterPoster 
              content={text}
              onSuccess={() => {
                setText("");
                setGeneratedContent("");
              }}
              onError={(error) => {
                console.error('Posting error:', error);
                alert(`Failed to post cast: ${error}`);
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="h-6 w-6 rounded-full bg-green-500"
              />
              <span>Cast Posted Successfully!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <DialogDescription className="text-sm text-muted-foreground">
              {typeof window !== 'undefined' && ((window as any).warpcast || (window as any).neynar) 
                ? "Your cast has been posted to Farcaster! It's now live and visible to your followers! 🚀"
                : "Development mode: Your cast would be posted to Farcaster in the real app! 📝"
              }
            </DialogDescription>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => setShowSuccess(false)} className="w-full">
                Continue Creating
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 