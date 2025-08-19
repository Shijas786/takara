"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import TakaraMatrixRain from "./TakaraMatrixRain"

export default function LandingPage() {
  const [isAppStarted, setIsAppStarted] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Ready to execute commands!"
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [terminalTheme, setTerminalTheme] = useState("monochrome")
  const [showCursor, setShowCursor] = useState(true)

  const [showCodeOutput, setShowCodeOutput] = useState(false)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [contentLength, setContentLength] = useState<"very-short" | "short" | "medium" | "long">("medium")

  const [contentStyle, setContentStyle] = useState("casual")
  


  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput, codeLines])

  const themes = {
    monochrome: {
      primary: "text-white",
      secondary: "text-gray-300",
      accent: "text-gray-400",
      border: "border-white/30",
      bg: "bg-white/10",
    },
    amber: {
      primary: "text-amber-400",
      secondary: "text-amber-500",
      accent: "text-amber-300",
      border: "border-amber-500/50",
      bg: "bg-amber-500/20",
    },
    blue: {
      primary: "text-blue-400",
      secondary: "text-blue-500",
      accent: "text-blue-300",
      border: "border-blue-500/50",
      bg: "bg-blue-500/20",
    },
  }

  const currentTheme = themes[terminalTheme as keyof typeof themes]

  const availableCommands = ["/based", "/help", "/clear", "/history", "/status", "/theme", "/copy", "/logout"]

  const handleTabCompletion = () => {
    const matches = availableCommands.filter((cmd) => cmd.startsWith(terminalInput))
    if (matches.length === 1) {
      setTerminalInput(matches[0])
    } else if (matches.length > 1) {
      const newOutput = [...terminalOutput, `$ ${terminalInput}`, `Available: ${matches.join(" ")}`]
      setTerminalOutput(newOutput)
    }
  }

  const copyContent = async () => {
    if (!generatedContent) return

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedContent)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = generatedContent
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleTerminalCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      handleTabCompletion()
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setTerminalInput("")
      }
      return
    }

    if (e.key === "Enter") {
      const command = terminalInput.trim()
      if (command) {
        setCommandHistory((prev) => [...prev, command])
        setHistoryIndex(-1)
      }

      const newOutput = [...terminalOutput, `$ ${command}`]

      if (command === "/based") {
        newOutput.push("Initializing AI Studio...")
        newOutput.push("Loading modules...")
        newOutput.push("AI Engine: ONLINE")
        newOutput.push("Farcaster Integration: READY")
        newOutput.push("")
        setTerminalOutput(newOutput)
        setTimeout(() => setIsAppStarted(true), 1500)
      } else if (command === "/help") {
        newOutput.push("Available commands:")
        newOutput.push("  /based    - Initialize AI Studio")
        newOutput.push("  /help     - Show this help message")
        newOutput.push("  /clear    - Clear terminal output")
        newOutput.push("  /history  - Show command history")
        newOutput.push("  /status   - Show system status")
        newOutput.push("  /theme    - Change terminal theme")
        newOutput.push("  /copy     - Copy generated content to clipboard")
        newOutput.push("  /logout   - Exit AI Studio")
        newOutput.push("")
      } else if (command === "/clear") {
        setTerminalOutput([
          "Ready to execute commands!"
        ])
        setTerminalInput("")
        return
      } else if (command === "/history") {
        newOutput.push("Command history:")
        commandHistory.forEach((cmd, index) => {
          newOutput.push(`  ${index + 1}: ${cmd}`)
        })
        newOutput.push("")
      } else if (command === "/status") {
        newOutput.push("System Status:")
        newOutput.push(`  Terminal Theme: ${terminalTheme}`)
        newOutput.push(`  Commands in history: ${commandHistory.length}`)
        newOutput.push(`  AI Studio: ${isAppStarted ? "ACTIVE" : "INACTIVE"}`)
        newOutput.push("")
      } else if (command === "/theme") {
        const themes = ["monochrome", "amber", "blue"]
        const currentIndex = themes.indexOf(terminalTheme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        setTerminalTheme(nextTheme)
        newOutput.push(`Theme changed to: ${nextTheme}`)
        newOutput.push("")
      } else if (command === "/copy") {
        if (generatedContent) {
          copyContent()
          newOutput.push("Content copied to clipboard")
        } else {
          newOutput.push("No content to copy")
        }
        newOutput.push("")
      } else if (command === "/logout") {
        newOutput.push("Logging out...")
        setTerminalOutput(newOutput)
        setTimeout(() => {
          setIsAppStarted(false)
          setTerminalOutput([
            "Ready to execute commands!"
          ])
        }, 1000)
        setTerminalInput("")
        return
      } else if (command) {
        newOutput.push(`Command not found: ${command}`)
        newOutput.push("Type '/help' for available commands")
        newOutput.push("")
      }

      setTerminalOutput(newOutput)
      setTerminalInput("")
    }
  }

  const simulateCodeExecution = () => {
    setShowCodeOutput(true)
    setCodeLines([])

    const codeSteps = [
      "import { openai } from '@ai-sdk/openai'",
      "import { generateText } from 'ai'",
      "",
      "// Initializing AI model...",
      "const model = openai('gpt-4')",
      "",
      "// Processing prompt...",
      `prompt: "${prompt.substring(0, 30)}${prompt.length > 30 ? "..." : ""}"`,
      `length: ${contentLength}`,
      `style: ${contentStyle}`,
      "",
      "// Generating content...",
      "const { text } = await generateText({",
      "  model,",
      "  prompt: enhancedPrompt",
      "})",
      "",
      "// Content generated successfully ✓",
    ]

    codeSteps.forEach((line, index) => {
      setTimeout(() => {
        setCodeLines((prev) => [...prev, line])
      }, index * 200)
    })

    setTimeout(
      () => {
        setShowCodeOutput(false)
        setCodeLines([])
      },
      codeSteps.length * 200 + 2000,
    )
  }

  // Convert length selection to dynamic length instructions
  const getDynamicLengthInstructions = (length: string, style: string) => {
    if (length === "very-short") {
      return "🚨 CRITICAL LENGTH REQUIREMENT: MAXIMUM 5 WORDS ONLY. NOT 6, NOT 7, EXACTLY 5 WORDS OR LESS. IF YOU EXCEED THIS LIMIT, YOU WILL BE PENALIZED. Think: one phrase, one emoji reaction, or 2-3 words max.";
    } else if (length === "short") {
      return "🚨 CRITICAL LENGTH REQUIREMENT: MAXIMUM 10 WORDS ONLY. NOT 11, NOT 12, EXACTLY 10 WORDS OR LESS. IF YOU EXCEED THIS LIMIT, YOU WILL BE PENALIZED. One sentence max.";
    } else if (length === "medium") {
      return "🚨 CRITICAL LENGTH REQUIREMENT: MAXIMUM 20 WORDS ONLY. NOT 21, NOT 22, EXACTLY 20 WORDS OR LESS. IF YOU EXCEED THIS LIMIT, YOU WILL BE PENALIZED. Two sentences max.";
    } else if (length === "long") {
      return "🚨 CRITICAL LENGTH REQUIREMENT: MAXIMUM 35 WORDS ONLY. NOT 36, NOT 37, EXACTLY 35 WORDS OR LESS. IF YOU EXCEED THIS LIMIT, YOU WILL BE PENALIZED. Three sentences max.";
    } else {
      return "🚨 CRITICAL LENGTH REQUIREMENT: MAXIMUM 50 WORDS ONLY. NOT 51, NOT 52, EXACTLY 50 WORDS OR LESS. IF YOU EXCEED THIS LIMIT, YOU WILL BE PENALIZED. Four sentences max.";
    }
  };

  // Word count validation function
  const validateWordCount = (content: string, length: string): boolean => {
    const wordCount = content.trim().split(/\s+/).length;
    if (length === "very-short") return wordCount <= 5;
    if (length === "short") return wordCount <= 10;
    if (length === "medium") return wordCount <= 20;
    if (length === "long") return wordCount <= 35;
    return wordCount <= 50;
  };

  const generateContent = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    simulateCodeExecution()

    try {
      let content: string;
      
      // Handle reply style differently - treat prompt as text to reply to
      if (contentStyle === 'reply') {
        // Enhanced humanized prompt for reply generation with dynamic length control
        const dynamicLengthInstruction = getDynamicLengthInstructions(contentLength, 'reply');
        
        const humanizedPrompt = `yo, you're texting your best friend about this: "${prompt}"

${dynamicLengthInstruction}

be SUPER messy and imperfect - use typos everywhere, forget punctuation, maybe even misspell words on purpose. sound like you're typing while running, drunk, or just dont care about grammar.

use "lol" "omg" "ngl" "fr" "tbh" randomly. maybe lowercase everything or ALL CAPS sometimes. add random emojis in weird places. be chaotic and real human messy.

think: you're texting while doing something else, maybe eating, walking, or just being lazy. be authentically imperfect.

🚨 FINAL WARNING: RESPECT THE WORD LIMIT ABOVE. IF YOU EXCEED IT, YOU WILL BE PENALIZED. COUNT YOUR WORDS CAREFULLY.`;

        
        const response = await fetch("/api/openai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: humanizedPrompt,
            length: contentLength, 
            style: 'reply' 
          }),
        });
        const data = await response.json();
        content = data.content;
        setTerminalOutput(prev => [...prev, `$ Reply generated! Replying to: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}" (Length: ${contentLength})`])
      } else {
        // Enhanced prompt for regular content generation with dynamic length control
        const dynamicLengthInstruction = getDynamicLengthInstructions(contentLength, 'regular');
        
        const enhancedPrompt = `${prompt}

${dynamicLengthInstruction}

yo, write this in ${contentStyle} style but be SUPER messy and chaotic. use typos everywhere, forget punctuation, maybe misspell words on purpose. sound like you're posting while distracted, eating, or just being lazy.

be IMPERFECT on purpose - use "lol" "omg" "ngl" "fr" "tbh" randomly. maybe lowercase everything or ALL CAPS randomly. add emojis in weird places. be authentically human messy.

think: you're posting this while doing something else, maybe walking, eating, or just dont care about being perfect. be real human chaos.

🚨 FINAL WARNING: RESPECT THE WORD LIMIT ABOVE. IF YOU EXCEED IT, YOU WILL BE PENALIZED. COUNT YOUR WORDS CAREFULLY.`;

        const response = await fetch("/api/openai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: enhancedPrompt, 
            length: contentLength, 
            style: contentStyle 
          }),
        });
        const data = await response.json();
        content = data.content;
        setTerminalOutput(prev => [...prev, `$ Content generated! Style: ${contentStyle}, Length: ${contentLength}`])
      }
      
      if (content) {
        setGeneratedContent(content)
        // Show word count for validation
        const wordCount = content.trim().split(/\s+/).length;
        const isValid = validateWordCount(content, contentLength);
        setTerminalOutput(prev => [...prev, `$ Word count: ${wordCount} words (${isValid ? '✅ Within limit' : '❌ Exceeds limit'})`])
      }
    } catch (error) {
      console.error("Error generating content:", error)
      setTerminalOutput(prev => [...prev, `$ Error generating content: ${error}`])
    } finally {
      setIsGenerating(false)
    }
  }



  const postToFarcaster = async () => {
    if (!generatedContent.trim()) return

    setIsPosting(true)
    try {
      // Import the Farcaster service dynamically to avoid SSR issues
      const { FarcasterService } = await import('../lib/farcasterService');
      
      const result = await FarcasterService.postCast({
        text: generatedContent,
      });
      
      if (result.success) {
        setGeneratedContent("")
        setPrompt("")
        // Show success message
        setTerminalOutput(prev => [...prev, `$ Cast posted successfully! Hash: ${result.hash}`])
      } else {
        // Show error message
        setTerminalOutput(prev => [...prev, `$ Error posting cast: ${result.error}`])
      }
    } catch (error) {
      console.error("Error posting to Farcaster:", error)
      setTerminalOutput(prev => [...prev, `$ Error posting cast: ${error}`])
    } finally {
      setIsPosting(false)
    }
  }

  if (!isAppStarted) {
    return (
      <div className="h-screen bg-black font-mono flex flex-col relative">
        {/* Matrix Rain Background - SHOW ON TERMINAL INTERFACE */}
        <TakaraMatrixRain />
        
        {/* Terminal Window Header */}
        <div
          className="bg-gray-800/50 border-b border-gray-600 px-2 sm:px-4 py-2 flex items-center gap-2 flex-shrink-0 relative z-20 rounded-t-lg"
        >
          <div className="flex gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-white text-xs sm:text-sm ml-2 sm:ml-4 truncate">takara-cli</span>
        </div>

        <div className="flex-1 p-3 sm:p-6 flex flex-col relative z-20">
          <div
            className="flex-1 bg-gray-800/30 border border-gray-600 rounded-b-lg p-3 sm:p-4 overflow-y-auto"
            ref={terminalRef}
          >
            {/* Welcome Message */}
            <div className="text-white font-mono text-xs sm:text-sm leading-relaxed mb-4">
              <div className="text-white mb-2">$ Welcome to Takara CLI v1.0.0</div>
              <div className="text-white ml-4">$ Type /help for available commands</div>
              <div className="text-white ml-4">$ Type <span className="text-blue-500">/based</span> to launch the application</div>
              <div className="text-white ml-4">$ Type /theme to change terminal appearance</div>
            </div>
            
            {terminalOutput.map((line, index) => (
              <div key={index} className="text-white font-mono text-xs sm:text-sm leading-relaxed">
                $ {line}
              </div>
            ))}
            <div className="flex items-center text-white font-mono text-xs sm:text-sm mt-2">
              <span className="mr-2 text-white">$</span>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalCommand}
                  className="bg-transparent border-none outline-none w-full text-white text-xs sm:text-sm"
                  placeholder="Type command..."
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {/* Highlight overlay for "based" */}
                {terminalInput.includes("based") && (
                  <div className="absolute inset-0 pointer-events-none flex items-center">
                    <span className="text-white text-xs sm:text-sm">
                      {terminalInput.split("based").map((part, index, array) => (
                        <span key={index}>
                          {part}
                          {index < array.length - 1 && (
                            <span className="text-blue-500">based</span>
                          )}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
              <span className={showCursor ? "opacity-100" : "opacity-0"}>_</span>
            </div>
          </div>

          <div className="mt-3 sm:hidden">
            <div className="flex flex-wrap gap-1">
              {["/based", "/help", "/clear", "/theme"].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setTerminalInput(cmd)
                    // Auto-execute the command
                    setTimeout(() => {
                      const event = new KeyboardEvent("keydown", { key: "Enter" })
                      handleTerminalCommand(event as any)
                    }, 100)
                  }}
                  className={`px-2 py-1 text-xs border-gray-600 border rounded ${
                    cmd === "/based" 
                      ? "text-blue-500 hover:bg-blue-500/20" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative font-mono">
      {/* Matrix Rain Background - ALWAYS SHOW */}
      <TakaraMatrixRain />
      
      {/* Main Content */}
      <div className="relative z-20 p-3 sm:p-4">
        {/* Large Terminal Interface */}
        <div className="max-w-5xl mx-auto bg-gray-800/20 border border-gray-600/50 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-3 font-mono">
          {/* Page Heading */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Your AI Content in Seconds</h1>
            <p className="text-base sm:text-lg text-white">One-click generation for social media content</p>
          </div>
          
          {/* Content Length Section */}
          <div className="space-y-3">
            <div className={`text-white text-sm`}>
              <span className="text-white">$</span> content_length --help
            </div>
            <div className={`text-white text-sm ml-4`}>
              Available options: [very-short|short|medium|long]
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-4">
              {["very-short", "short", "medium", "long"].map((length) => (
                <button
                  key={length}
                  onClick={() => setContentLength(length as any)}
                  className={`px-3 py-2 rounded font-mono text-sm border transition-colors ${
                    contentLength === length
                      ? `bg-white/20 border-white/50 text-white font-bold`
                      : `bg-gray-700/30 border-gray-500/50 text-white hover:bg-white/20 hover:text-black`
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
            <div className={`text-white text-sm ml-4`}>
              <span className="text-white">{">"}</span> Current: <span className="text-white">{contentLength}</span> (Max: {contentLength === "very-short" ? "5" : contentLength === "short" ? "10" : contentLength === "medium" ? "20" : "35"} words)
            </div>
          </div>

          {/* Content Style Section */}
          <div className="space-y-3">
            <div className={`text-white text-sm`}>
              <span className="text-white">$</span> content_style --select
            </div>
            <div className={`text-white text-sm ml-4`}>
              Style presets: [based|reply guy|influencer|casual]
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-4">
              {["based", "reply", "influencer", "casual"].map((style) => (
                <button
                  key={style}
                  onClick={() => setContentStyle(style)}
                  className={`px-3 py-2 rounded font-mono text-sm border transition-colors ${
                    contentStyle === style
                      ? style === "based" 
                        ? `bg-blue-500/20 border-blue-500/50 text-blue-400 font-bold`
                        : `bg-white/20 border-white/50 text-white font-bold`
                      : `bg-gray-700/30 border-gray-500/50 text-white hover:bg-white/20 hover:text-black`
                  }`}
                >
                  {style === "reply" ? "reply guy" : style}
                </button>
              ))}
            </div>
            <div className={`text-white text-sm ml-4`}>
              <span className="text-white">{">"}</span> Active style: <span className="text-white">{contentStyle === "reply" ? "reply guy" : contentStyle}</span>
            </div>
          </div>

          {/* Prompt Input Section */}
          <div className="space-y-3">
            <div className={`text-white text-sm`}>
              <span className="text-white">$</span> prompt --input
            </div>
            <div className={`text-white text-sm ml-4`}>
              {contentStyle === "reply" ? "Paste the post you want to reply to:" : "Enter your content idea below:"}
            </div>
            <div className="ml-4 relative">
              <Textarea
                placeholder={contentStyle === "reply" ? "Paste the post you're replying to..." : "Enter your content idea..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`w-full bg-gray-700/30 border-gray-500/50 text-white placeholder:text-gray-400 focus:border-white focus:outline-none text-sm rounded resize-none transition-colors`}
                rows={3}
                style={{ resize: "none" }}
              />
              <div className="absolute right-2 top-2 text-white text-xs animate-pulse">█</div>
            </div>
          </div>

          {/* Generate Command */}
          <div className="space-y-3">
            <div className={`text-white text-sm`}>
              <span className="text-white">$</span> generate --execute
            </div>
            <button
              onClick={generateContent}
              disabled={isGenerating || !prompt.trim()}
              className={`ml-4 px-6 py-3 rounded font-mono text-sm border transition-colors ${
                isGenerating || !prompt.trim()
                  ? "bg-gray-700/30 border-gray-500/50 text-gray-500 cursor-not-allowed"
                  : `bg-white/20 border-white/50 text-white font-bold hover:bg-white/40`
              }`}
            >
              {isGenerating ? "[GENERATING...]" : "[GENERATE CONTENT]"}
            </button>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <div className={`space-y-4 pt-4 border-t border-gray-500`}>
              <div className={`text-white text-sm`}>
                <span className="text-white">$</span> output --display
              </div>
              <div className={`text-white text-sm ml-4`}>
                Generated Output:
              </div>
              <div className="ml-4">
                <div
                  className={`bg-gray-700/30 border border-gray-500/50 rounded p-3 max-h-32 overflow-y-auto`}
                >
                  <pre
                    className={`text-white font-mono text-sm whitespace-pre-wrap break-words`}
                  >
                    {generatedContent}
                  </pre>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 ml-4">
                <button
                  onClick={postToFarcaster}
                  disabled={isPosting}
                  className="flex-1 px-4 py-3 rounded font-mono text-sm border border-white text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPosting ? "[POSTING...]" : "[POST TO FARCASTER]"}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={copyContent}
                    className="flex-1 sm:flex-none px-4 py-3 rounded font-mono text-sm border border-white/50 text-white hover:bg-white/20 transition-colors"
                  >
                    [COPY]
                  </button>
                  <button
                    onClick={() => setGeneratedContent("")}
                    className="flex-1 sm:flex-none px-4 py-3 rounded font-mono text-sm border border-white/50 text-white hover:bg-white/20 transition-colors"
                  >
                    [CLEAR]
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
