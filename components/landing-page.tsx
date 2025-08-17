"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export default function LandingPage() {
  const [isAppStarted, setIsAppStarted] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to TAKARA AI Terminal",
    "Type '/start' to initialize AI Studio...",
    "Type '/help' for available commands",
    "",
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [terminalTheme, setTerminalTheme] = useState("green")
  const [showCursor, setShowCursor] = useState(true)

  const [showCodeOutput, setShowCodeOutput] = useState(false)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [contentLength, setContentLength] = useState<"short" | "medium" | "long">("medium")
  const [lengthSlider, setLengthSlider] = useState(50) // 0-100 scale for precise length control
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
    green: {
      primary: "text-green-400",
      secondary: "text-green-500",
      accent: "text-green-300",
      border: "border-green-500/50",
      bg: "bg-green-500/20",
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

  const availableCommands = ["/start", "/help", "/clear", "/history", "/status", "/theme", "/copy", "/logout"]

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

      if (command === "/start") {
        newOutput.push("Initializing AI Studio...")
        newOutput.push("Loading modules...")
        newOutput.push("AI Engine: ONLINE")
        newOutput.push("Farcaster Integration: READY")
        newOutput.push("")
        setTerminalOutput(newOutput)
        setTimeout(() => setIsAppStarted(true), 1500)
      } else if (command === "/help") {
        newOutput.push("Available commands:")
        newOutput.push("  /start    - Initialize AI Studio")
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
          "Welcome to TAKARA AI Terminal",
          "Type '/start' to initialize AI Studio...",
          "Type '/help' for available commands",
          "",
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
        const themes = ["green", "amber", "blue"]
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
            "Welcome to TAKARA AI Terminal",
            "Type '/start' to initialize AI Studio...",
            "Type '/help' for available commands",
            "",
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

  // Convert slider value to dynamic length instructions
  const getDynamicLengthInstructions = (sliderValue: number, style: string) => {
    if (style === 'reply') {
      if (sliderValue <= 25) {
        return "CRITICAL: Maximum 1 sentence only. Keep it extremely short and casual. No more than 15-20 words.";
      } else if (sliderValue <= 50) {
        return "CRITICAL: Maximum 2 sentences only. Keep it very brief and casual. No more than 25-30 words total.";
      } else if (sliderValue <= 75) {
        return "CRITICAL: Maximum 3 sentences only. Include personality but stay concise. No more than 40-50 words total.";
      } else {
        return "CRITICAL: Maximum 4 sentences only. Add detail but maintain brevity. No more than 60-70 words total.";
      }
    } else {
      if (sliderValue <= 25) {
        return "CRITICAL: Maximum 1 sentence only. Extremely brief. No more than 15-20 words.";
      } else if (sliderValue <= 50) {
        return "CRITICAL: Maximum 2 sentences only. Very brief with minimal detail. No more than 25-30 words total.";
      } else if (sliderValue <= 75) {
        return "CRITICAL: Maximum 3 sentences only. Some detail but stay concise. No more than 40-50 words total.";
      } else {
        return "CRITICAL: Maximum 4 sentences only. Comprehensive but controlled. No more than 60-70 words total.";
      }
    }
  };

  // Word count validation function
  const validateWordCount = (content: string, sliderValue: number): boolean => {
    const wordCount = content.trim().split(/\s+/).length;
    if (sliderValue <= 25) return wordCount <= 20;
    if (sliderValue <= 50) return wordCount <= 30;
    if (sliderValue <= 75) return wordCount <= 50;
    return wordCount <= 70;
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
        const dynamicLengthInstruction = getDynamicLengthInstructions(lengthSlider, 'reply');
        
        const humanizedPrompt = `You are a real human responding to this text: "${prompt}"

CRITICAL LENGTH REQUIREMENT: ${dynamicLengthInstruction}

Generate a natural, human-like reply that:
- Sounds exactly like a real person, not AI
- Uses casual language, emojis, and natural expressions
- Includes personal reactions and authentic voice
- Relates directly to what was said
- Uses varied sentence structures and natural flow
- Includes typos, abbreviations, or casual punctuation when appropriate
- Shows genuine interest or emotion

IMPORTANT: If you exceed the word limit, you will be penalized. Stay within the exact limits specified above.

Your reply:`;
        
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
        setTerminalOutput(prev => [...prev, `$ Reply generated! Replying to: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}" (Length: ${lengthSlider}%)`])
      } else {
        // Enhanced prompt for regular content generation with dynamic length control
        const dynamicLengthInstruction = getDynamicLengthInstructions(lengthSlider, 'regular');
        
        const enhancedPrompt = `${prompt}

CRITICAL LENGTH REQUIREMENT: ${dynamicLengthInstruction}

Requirements:
- Style: ${contentStyle}
- Make it sound natural and human-like
- Include relevant emojis and casual language

IMPORTANT: If you exceed the word limit, you will be penalized. Stay within the exact limits specified above.`;

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
        setTerminalOutput(prev => [...prev, `$ Content generated! Style: ${contentStyle}, Length: ${lengthSlider}%`])
      }
      
      if (content) {
        setGeneratedContent(content)
        // Show word count for validation
        const wordCount = content.trim().split(/\s+/).length;
        const isValid = validateWordCount(content, lengthSlider);
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
      <div className="h-screen bg-black font-mono flex flex-col">
        {/* Terminal Window Header */}
        <div
          className={`bg-gray-900 border-b ${currentTheme.border} px-2 sm:px-4 py-2 flex items-center gap-2 flex-shrink-0`}
        >
          <div className="flex gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          </div>
          <span className={`${currentTheme.primary} text-xs sm:text-sm ml-2 sm:ml-4 truncate`}>takara@terminal:~$</span>
        </div>

        <div className="flex-1 p-3 sm:p-6 flex flex-col">
          <div
            className={`flex-1 bg-gray-900/30 border ${currentTheme.border} rounded-lg p-3 sm:p-4 overflow-y-auto`}
            ref={terminalRef}
          >
            {terminalOutput.map((line, index) => (
              <div key={index} className={`${currentTheme.primary} font-mono text-xs sm:text-sm leading-relaxed`}>
                {line}
              </div>
            ))}
            <div className={`flex items-center ${currentTheme.primary} font-mono text-xs sm:text-sm mt-2`}>
              <span className="mr-2">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalCommand}
                className={`bg-transparent border-none outline-none flex-1 ${currentTheme.primary} text-xs sm:text-sm`}
                placeholder="Type command..."
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <span className={showCursor ? "opacity-100" : "opacity-0"}>_</span>
            </div>
          </div>

          <div className="mt-3 sm:hidden">
            <div className="flex flex-wrap gap-1">
              {["/start", "/help", "/clear", "/theme"].map((cmd) => (
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
                  className={`px-2 py-1 text-xs ${currentTheme.border} border rounded ${currentTheme.secondary} hover:${currentTheme.bg}`}
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
    <div className="min-h-screen bg-black font-mono flex flex-col">
      {/* Terminal Window Header */}
      <div
        className={`bg-gray-900 border-b ${currentTheme.border} px-2 sm:px-4 py-2 flex items-center gap-2 flex-shrink-0`}
      >
        <div className="flex gap-1 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
        </div>
        <span className={`${currentTheme.primary} text-xs sm:text-sm ml-2 sm:ml-4 truncate`}>
          takara@terminal:~/ai-studio$
        </span>

        <button
          onClick={() => {
            const themes = ["green", "amber", "blue"]
            const currentIndex = themes.indexOf(terminalTheme)
            const nextTheme = themes[(currentIndex + 1) % themes.length]
            setTerminalTheme(nextTheme)
          }}
          className={`ml-auto px-2 py-1 text-xs ${currentTheme.border} border rounded ${currentTheme.secondary}`}
        >
          Theme
        </button>
      </div>

      <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 ${currentTheme.bg} border ${currentTheme.border} rounded flex items-center justify-center`}
              >
                <span className={`text-lg sm:text-xl font-bold ${currentTheme.primary}`}>T</span>
              </div>
              <div>
                <h1 className={`text-xl sm:text-3xl font-bold ${currentTheme.primary}`}>TAKARA AI STUDIO</h1>
                <p className={`${currentTheme.secondary} text-xs sm:text-sm`}>Content Generation Terminal</p>
              </div>
            </div>
            <Badge className={`${currentTheme.bg} ${currentTheme.primary} ${currentTheme.border} font-mono text-xs`}>
              [SYSTEM ONLINE] AI Engine Active
            </Badge>
          </div>

          {showCodeOutput && (
            <div className={`bg-gray-900/50 border ${currentTheme.border} rounded-lg p-3 sm:p-4`}>
              <div className={`${currentTheme.primary} text-xs sm:text-sm font-mono mb-2`}>[EXECUTING CODE]</div>
              <div className="space-y-1 max-h-40 sm:max-h-none overflow-y-auto">
                {codeLines.map((line, index) => (
                  <div key={index} className={`${currentTheme.accent} font-mono text-xs break-all`}>
                    {line}
                  </div>
                ))}
                <div className={`${currentTheme.primary} animate-pulse`}>_</div>
              </div>
            </div>
          )}

          {/* Content Generation Interface */}
          <div className={`bg-gray-900/30 border ${currentTheme.border} rounded-lg p-4 sm:p-6 space-y-4`}>
            {/* Length Options */}
            {/* Content Length Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`${currentTheme.primary} text-xs sm:text-sm font-mono`}>Content Length:</label>
                <span className={`${currentTheme.secondary} text-xs font-mono`}>{lengthSlider}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lengthSlider}
                  onChange={(e) => setLengthSlider(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${currentTheme.bg} ${currentTheme.border}`}
                  style={{
                    background: `linear-gradient(to right, ${currentTheme.border.replace('/50', '/30')} 0%, ${currentTheme.border.replace('/50', '/70')} ${lengthSlider}%, ${currentTheme.border.replace('/50', '/30')} ${lengthSlider}%)`
                  }}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={`${currentTheme.secondary} font-mono`}>Very Short</span>
                  <span className={`${currentTheme.secondary} font-mono`}>Short</span>
                  <span className={`${currentTheme.secondary} font-mono`}>Medium</span>
                  <span className={`${currentTheme.secondary} font-mono`}>Long</span>
                  <span className={`${currentTheme.secondary} font-mono`}>Very Long</span>
                </div>
              </div>
              {/* Word Limit Display */}
              <div className={`text-xs ${currentTheme.secondary} font-mono text-center`}>
                {lengthSlider <= 25 && "Max: 20 words"}
                {lengthSlider > 25 && lengthSlider <= 50 && "Max: 30 words"}
                {lengthSlider > 50 && lengthSlider <= 75 && "Max: 50 words"}
                {lengthSlider > 75 && "Max: 70 words"}
              </div>
            </div>

            {/* Style Options */}
            <div className="space-y-2">
              <label className={`${currentTheme.primary} text-xs sm:text-sm font-mono`}>Content Style:</label>
              <div className="grid grid-cols-2 sm:flex gap-1 sm:gap-2">
                {["based", "reply", "influencer", "casual"].map((style) => (
                  <Button
                    key={style}
                    variant={contentStyle === style ? "default" : "outline"}
                    size="sm"
                    onClick={() => setContentStyle(style)}
                    className={`font-mono text-xs ${
                      contentStyle === style
                        ? `${currentTheme.bg} ${currentTheme.border} ${currentTheme.accent}`
                        : `bg-transparent ${currentTheme.border} ${currentTheme.secondary} hover:${currentTheme.bg.replace("/20", "/10")}`
                    }`}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className={`${currentTheme.primary} text-xs sm:text-sm font-mono`}>Content Prompt:</label>
              <Textarea
                placeholder={contentStyle === 'reply' ? "Paste the text you want to reply to..." : "Enter your content idea..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`bg-gray-900 ${currentTheme.border} ${currentTheme.accent} placeholder:${currentTheme.secondary} focus:${currentTheme.border.replace("/50", "")} focus:ring-${terminalTheme}-400/20 font-mono text-xs sm:text-sm`}
                rows={3}
                style={{ resize: "none" }}
              />
            </div>

            <Button
              onClick={generateContent}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full ${currentTheme.bg} border ${currentTheme.border} ${currentTheme.primary} hover:${currentTheme.bg.replace("/20", "/30")} font-mono text-xs sm:text-sm py-3 sm:py-2`}
            >
              {isGenerating ? "[GENERATING...]" : contentStyle === 'reply' ? "[GENERATE REPLY]" : "[GENERATE CONTENT]"}
            </Button>

            {/* Generated Content */}
            {generatedContent && (
              <div className={`space-y-3 pt-4 border-t ${currentTheme.border}`}>
                <label className={`${currentTheme.primary} text-xs sm:text-sm font-mono`}>Generated Output:</label>
                <div
                  className={`bg-gray-900 border ${currentTheme.border} rounded p-3 sm:p-4 max-h-40 sm:max-h-none overflow-y-auto`}
                >
                  <pre
                    className={`${currentTheme.accent} font-mono text-xs sm:text-sm whitespace-pre-wrap break-words`}
                  >
                    {generatedContent}
                  </pre>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={postToFarcaster}
                    disabled={isPosting}
                    className="flex-1 bg-blue-500/20 border border-blue-500 text-blue-400 hover:bg-blue-500/30 font-mono text-xs sm:text-sm py-3 sm:py-2"
                  >
                    {isPosting ? "[POSTING...]" : "[POST TO FARCASTER]"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyContent}
                      className="flex-1 sm:flex-none border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-mono text-xs sm:text-sm"
                    >
                      [COPY]
                    </Button>
                    <Button
                      onClick={() => setGeneratedContent("")}
                      className="flex-1 sm:flex-none border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono text-xs sm:text-sm"
                    >
                      [CLEAR]
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}
