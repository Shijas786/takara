import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { prompt, length = "medium", style = "casual" } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback content generation when API key is missing
      const fallbackContent = generateFallbackContent(prompt, length, style)
      return Response.json({ content: fallbackContent })
    }

    const lengthInstructions = {
      short: "Keep it very concise, under 100 characters. Be punchy and direct.",
      medium: "Aim for 100-200 characters. Balance detail with brevity.",
      long: "Can be up to 280 characters. Provide more context and detail.",
    }

    const styleInstructions = {
      based: "Be confident, opinionated, and slightly contrarian. Use strong takes and bold statements.",
      "reply guy": "Be helpful, informative, and add valuable context. Reference trends and provide insights.",
      influencer: "Be aspirational, motivational, and engaging. Use emojis and call-to-actions.",
      casual: "Be conversational, relatable, and authentic. Keep it natural and friendly.",
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a creative social media content generator for Farcaster, a decentralized social protocol. 
      Create engaging, authentic posts that:
      - Are conversational and relatable
      - Include relevant hashtags when appropriate
      - Capture the spirit of Web3 and decentralized social media
      - Are optimized for engagement and community building
      - Avoid overly promotional language
      - Feel human and authentic, not robotic
      
      LENGTH REQUIREMENT: ${lengthInstructions[length as keyof typeof lengthInstructions]}
      STYLE REQUIREMENT: ${styleInstructions[style as keyof typeof styleInstructions]}`,
      prompt: `Create a social media post based on this idea: ${prompt}`,
    })

    return Response.json({ content: text })
  } catch (error) {
    console.error("Error generating content:", error)
    const fallbackContent = generateFallbackContent(
      (await request.json()).prompt || "default content",
      (await request.json()).length || "medium",
      (await request.json()).style || "casual",
    )
    return Response.json({ content: fallbackContent })
  }
}

function generateFallbackContent(prompt: string, length: string, style: string): string {
  const templates = {
    based: {
      short: `Hot take: ${prompt} is the future 🔥`,
      medium: `Unpopular opinion: ${prompt} is going to change everything. Most people just don't see it yet.`,
      long: `Here's a controversial take: ${prompt} represents a fundamental shift that most people are sleeping on. While everyone's focused on the noise, the real builders are quietly revolutionizing the space. #Web3 #Farcaster`,
    },
    "reply guy": {
      short: `Great point about ${prompt}! Here's why it matters...`,
      medium: `This is spot on about ${prompt}. Adding some context: this trend is accelerating because of recent developments in the space.`,
      long: `Excellent observation about ${prompt}! For those following along, this connects to broader trends we're seeing in decentralized social. The implications are huge for creators and communities. #Farcaster #Web3`,
    },
    influencer: {
      short: `${prompt} is your next big opportunity! 💪`,
      medium: `Ready to level up? ${prompt} is the move successful people are making right now. Don't sleep on this! 🚀`,
      long: `Your future self will thank you for paying attention to ${prompt} today. This is how winners think differently. While others hesitate, you take action. Drop a 🔥 if you're ready to make moves! #Success #Web3 #Farcaster`,
    },
    casual: {
      short: `Just thinking about ${prompt}... pretty cool stuff`,
      medium: `Been exploring ${prompt} lately and honestly, it's way more interesting than I expected. Anyone else diving into this?`,
      long: `So I've been down a rabbit hole with ${prompt} and wow, there's so much happening here. The community vibes are immaculate and the potential is wild. What's everyone's take on this? #Farcaster #Web3`,
    },
  }

  const styleTemplates = templates[style as keyof typeof templates] || templates.casual
  return styleTemplates[length as keyof typeof styleTemplates] || styleTemplates.medium
}
