import OpenAI from 'openai';
import { config } from './config';
import { Influencer, PostGenerationRequest, ThreadGenerationRequest } from '../types';
import { getTrainingData, getTweetsByStyle } from './tweetTrainingData';

// Initialize OpenAI client only when needed and make it browser-safe
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    // Check if API key is properly configured
    if (!config.openai.apiKey || config.openai.apiKey === 'placeholder_openai_key') {
      throw new Error('OpenAI API key not configured. Please add your OpenAI API key to the .env.local file. See API_KEYS_SETUP.md for instructions.');
    }
    
    openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }
  return openai;
}

export class OpenAIService {
  // Post-process content to remove hashtags and @ mentions
  private async cleanContent(content: string): Promise<string> {
    try {
      // Use AI to clean hashtags more intelligently
      const completion = await getOpenAIClient().chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `You are a tweet content cleaner. Given a tweet, remove all hashtags (e.g., #crypto, #AI) from the post while keeping the rest of the text intact. Do not replace them with anything. Only remove the hashtag words and leave punctuation, emojis, and sentence structure untouched.`
          },
          {
            role: 'user',
            content: `Please clean this tweet by removing hashtags:

${content}

Return only the cleaned tweet.`
          }
        ],
        max_tokens: 200,
        temperature: 0.1,
      });

      const cleaned = completion.choices[0]?.message?.content || content;
      return cleaned.trim();
    } catch (error) {
      console.warn('AI cleaning failed, falling back to regex:', error);
      // Fallback to regex cleaning
      let cleaned = content.replace(/#\w+/g, '');
      cleaned = cleaned.replace(/@\w+/g, '');
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      return cleaned;
    }
  }

  async generateShitpost(request: PostGenerationRequest, influencer: Influencer, mixedInfluencer?: Influencer): Promise<string> {
    // Handle BASED style separately
    if (request.style === 'based') {
      const text = request.prompt || 'Base chain is the future of Ethereum scaling';
      return this.generateBased(text, request.length);
    }

    // Handle REPLY style separately
    if (request.style === 'reply') {
      const originalPost = request.prompt || 'Someone posted something interesting';
      return this.generateReply(originalPost, request.length);
    }

    // Handle INFLUENCER style separately
    if (request.style === 'influencer') {
      const text = request.prompt || 'Generate content in influencer style';
      return this.generateInfluencerStyle(text, request.length);
    }

    const prompt = this.buildPrompt(request, influencer, mixedInfluencer);
    
    // Get enhanced training data based on style and influencer
    const trainingTweets = this.getEnhancedTrainingTweets(request.style, influencer);
    const trainingExamples = trainingTweets.slice(0, 8).join('\n\n'); // More examples for better training

    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `CRITICAL INSTRUCTION: NEVER USE HASHTAGS (#), @ MENTIONS, OR ANY TAGS IN YOUR RESPONSES. GENERATE ONLY CLEAN TEXT WITHOUT ANY SYMBOLS.

You are a crypto Twitter shitpost generator trained on ${getTrainingData().totalCount} real tweets from Base chain influencers. 

CRITICAL: Make the content sound 100% human and natural. Avoid any AI-like patterns:
- Use natural sentence structures and flow
- Include casual language, slang, and informal expressions
- Add personal touches and authentic voice
- Use varied sentence lengths and natural rhythm
- Include typos, abbreviations, and casual punctuation when appropriate
- Make it sound like a real person typing naturally

Generate authentic, viral posts that match the influencer's style. Use emojis, slang, and hooks liberally. Be authentic to crypto Twitter culture.

LENGTH REQUIREMENT: ${request.length === 'short' ? 'Keep it very short (under 100 characters).' : request.length === 'medium' ? 'Keep it medium length (under 280 characters).' : 'Can be longer (under 500 characters).'}

ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT.

Here are real examples of ${request.style} tweets from similar influencers:

${trainingExamples}

Key style elements to include:
- Crypto slang: "ser", "anon", "wen", "moon", "diamond hands"
- Emojis: 🚀 🌙 💎 📈 🔥 
- Hooks: "Breaking:", "Hot take:", "You're not ready for..."
- Authentic voice: Natural, conversational tone without forced engagement
- Human patterns: Casual language, natural flow, personal touches
- ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: request.length === 'short' ? 50 : request.length === 'medium' ? 150 : 250,
        temperature: 0.9, // Higher temperature for more natural variation
        presence_penalty: 0.2, // Encourage more diverse language
        frequency_penalty: 0.3, // Reduce repetitive patterns
      });

      const generatedContent = completion.choices[0]?.message?.content || 'Failed to generate post';
      const cleanedContent = await this.cleanContent(generatedContent);
      
      // Enforce length limits
      const maxChars = request.length === 'short' ? 100 : request.length === 'medium' ? 280 : 500;
      if (cleanedContent.length > maxChars) {
        // Truncate to fit within limit, trying to break at word boundaries
        const truncated = cleanedContent.substring(0, maxChars - 3) + '...';
        return truncated;
      }
      
      return cleanedContent;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate post');
    }
  }

  async generateReply(originalPost: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
    // Get reply-style training examples
    const replyTweets = getTweetsByStyle('community');
    const trainingExamples = replyTweets.slice(0, 5).join('\n\n');

    const prompt = `Generate a witty, engaging reply to this post:

Original Post: ${originalPost}

Make it sound like a crypto Twitter reply - engaging, witty, and authentic.`;

    const lengthInstruction = length === 'short' ? 'Keep it very brief and punchy (1-2 sentences max).' : 
                             length === 'medium' ? 'Make it a medium-length reply (2-3 sentences).' : 
                             'Make it a longer, more detailed reply (3-4 sentences).';

    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `CRITICAL INSTRUCTION: NEVER USE HASHTAGS (#), @ MENTIONS, OR ANY TAGS IN YOUR RESPONSES. GENERATE ONLY CLEAN TEXT WITHOUT ANY SYMBOLS.

You are a crypto Twitter reply generator trained on ${getTrainingData().totalCount} real tweets. Generate witty, engaging replies that sound authentic and conversational.

CRITICAL: Make the reply sound 100% human and natural:
- Use conversational, casual language
- Include natural reactions and emotions
- Add personal touches and authentic voice
- Use varied sentence structures and natural flow
- Include casual punctuation and informal expressions
- Make it sound like a real person responding naturally

LENGTH REQUIREMENT: ${lengthInstruction}

ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT.

Here are real reply examples:
${trainingExamples}

Key reply elements to include:
- Engaging and conversational tone
- Witty responses that add value
- Crypto culture references when relevant
- Emojis: 😂 🚀 💯 🔥 👀
- Natural flow and authenticity
- Human-like patterns and expressions
- ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: length === 'short' ? 80 : length === 'medium' ? 150 : 250,
        temperature: 0.85, // Higher temperature for more natural variation
        presence_penalty: 0.2,
        frequency_penalty: 0.3,
      });

      const generatedContent = completion.choices[0]?.message?.content || 'Failed to generate reply';
      const cleanedContent = await this.cleanContent(generatedContent);
      
      // Enforce length limits
      const maxChars = length === 'short' ? 100 : length === 'medium' ? 280 : 500;
      if (cleanedContent.length > maxChars) {
        const truncated = cleanedContent.substring(0, maxChars - 3) + '...';
        return truncated;
      }
      
      return cleanedContent;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate reply');
    }
  }

  async generateBased(text: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
    // Get Base chain and builder-style training examples
    const baseTweets = getTweetsByStyle('technical');
    const builderTweets = getTweetsByStyle('educational');
    const trainingExamples = [...baseTweets, ...builderTweets].slice(0, 6).join('\n\n');

    const prompt = `Transform this text into a BASED Base chain tweet with builder energy:

Original: ${text}

Make it sound like a Base chain builder/developer with technical insights, ecosystem focus, and "based" energy.`;

    const lengthInstruction = length === 'short' ? 'Keep it very concise and punchy (1-2 sentences max).' : 
                             length === 'medium' ? 'Make it a medium-length post (2-3 sentences).' : 
                             'Make it a longer, more detailed post (3-4 sentences).';

    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `CRITICAL INSTRUCTION: NEVER USE HASHTAGS (#), @ MENTIONS, OR ANY TAGS IN YOUR RESPONSES. GENERATE ONLY CLEAN TEXT WITHOUT ANY SYMBOLS.

You are a BASED Base chain tweet generator trained on ${getTrainingData().totalCount} real tweets. Generate content that sounds like Base chain builders, developers, and ecosystem participants.

CRITICAL: Make the content sound 100% human and natural:
- Use authentic developer/builder language and tone
- Include natural technical insights and observations
- Add personal experiences and genuine enthusiasm
- Use varied sentence structures and natural flow
- Include casual technical language and informal expressions
- Make it sound like a real builder/developer sharing naturally

LENGTH REQUIREMENT: ${lengthInstruction}

ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT.

Here are real Base chain and builder examples:
${trainingExamples}

Key BASED elements to include:
- Base chain terminology: "Base", "L2", "scaling", "rollup", "Coinbase"
- Builder language: "building", "deploying", "gas fees", "transactions", "smart contracts"
- Technical insights: "optimization", "performance", "adoption", "ecosystem"
- BASED energy: confident, technical, forward-thinking, ecosystem-focused
- Emojis: 🚀 💻 ⚡ 🔧 🏗️ 📈
- Human patterns: Natural technical language, authentic enthusiasm
- ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: length === 'short' ? 120 : length === 'medium' ? 250 : 400,
        temperature: 0.9, // Higher temperature for more natural variation
        presence_penalty: 0.2,
        frequency_penalty: 0.3,
      });

      const generatedContent = completion.choices[0]?.message?.content || 'Failed to generate BASED content';
      const cleanedContent = await this.cleanContent(generatedContent);
      
      // Enforce length limits
      const maxChars = length === 'short' ? 100 : length === 'medium' ? 280 : 500;
      if (cleanedContent.length > maxChars) {
        const truncated = cleanedContent.substring(0, maxChars - 3) + '...';
        return truncated;
      }
      
      return cleanedContent;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate BASED content');
    }
  }

  async generateInfluencerStyle(text: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
    // Get influencer-style training examples
    const influencerTweets = getTweetsByStyle('community');
    const trainingExamples = influencerTweets.slice(0, 5).join('\n\n');

    const prompt = `Generate content in authentic influencer style:

Original Content: ${text}

Make it sound like a real crypto influencer post - engaging, authentic, and viral.`;

    const lengthInstruction = length === 'short' ? 'Keep it very brief and impactful (1-2 sentences max).' : 
                             length === 'medium' ? 'Make it a medium-length post (2-3 sentences).' : 
                             'Make it a longer, more detailed post (3-4 sentences).';

    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `CRITICAL INSTRUCTION: NEVER USE HASHTAGS (#), @ MENTIONS, OR ANY TAGS IN YOUR RESPONSES. GENERATE ONLY CLEAN TEXT WITHOUT ANY SYMBOLS.

You are a crypto influencer content generator trained on ${getTrainingData().totalCount} real tweets from Base chain influencers. Generate authentic, engaging posts that sound like real influencer content.

CRITICAL: Make the content sound 100% human and natural:
- Use authentic influencer voice and personal style
- Include natural storytelling and personal experiences
- Add genuine insights and authentic opinions
- Use varied sentence structures and natural flow
- Include casual language and informal expressions
- Make it sound like a real influencer sharing naturally

LENGTH REQUIREMENT: ${lengthInstruction}

ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT.

Here are real influencer examples:
${trainingExamples}

Key influencer style elements:
- Authentic and personal voice
- Engaging storytelling
- Crypto insights and alpha
- Community-focused content
- Emojis: 🚀 💎 🔥 👀 💯
- Natural flow and authenticity
- Human-like patterns and expressions
- ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: length === 'short' ? 100 : length === 'medium' ? 200 : 350,
        temperature: 0.85, // Higher temperature for more natural variation
        presence_penalty: 0.2,
        frequency_penalty: 0.3,
      });

      const generatedContent = completion.choices[0]?.message?.content || 'Failed to generate influencer content';
      const cleanedContent = await this.cleanContent(generatedContent);
      
      // Enforce length limits
      const maxChars = length === 'short' ? 100 : length === 'medium' ? 280 : 500;
      if (cleanedContent.length > maxChars) {
        const truncated = cleanedContent.substring(0, maxChars - 3) + '...';
        return truncated;
      }
      
      return cleanedContent;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate influencer content');
    }
  }

  async generateRoast(tweets: string[], influencer: Influencer): Promise<string> {
    const trainingTweets = this.getEnhancedTrainingTweets('roast', influencer);
    const trainingExamples = trainingTweets.slice(0, 5).join('\n\n');

    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `CRITICAL INSTRUCTION: NEVER USE HASHTAGS (#), @ MENTIONS, OR ANY TAGS IN YOUR RESPONSES. GENERATE ONLY CLEAN TEXT WITHOUT ANY SYMBOLS.

You are a crypto Twitter roaster trained on ${getTrainingData().totalCount} real tweets. Be funny and witty, but not mean-spirited.

CRITICAL: Make the roast sound 100% human and natural:
- Use authentic humor and natural wit
- Include casual language and informal expressions
- Add personal touches and genuine reactions
- Use varied sentence structures and natural flow
- Include casual punctuation and informal language
- Make it sound like a real person roasting naturally

ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT.

Here are real examples of roast tweets:

${trainingExamples}

Key style elements:
- Witty and clever humor
- Crypto culture references
- Playful teasing without being mean
- Emojis: 😂 🤡 💀 🎯
- Human-like patterns and expressions
- ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT`
          },
          {
            role: 'user',
            content: `Roast these tweets in a witty, crypto Twitter style:

${tweets.join('\n\n')}`
          }
        ],
        max_tokens: 200,
        temperature: 0.85, // Higher temperature for more natural variation
        presence_penalty: 0.2,
        frequency_penalty: 0.3,
      });

      const response = completion.choices[0]?.message?.content || 'No roast generated';
      return await this.cleanContent(response);
    } catch (error) {
      console.error('Error generating roast:', error);
      throw error;
    }
  }

  async generateThread(request: ThreadGenerationRequest, influencer: Influencer): Promise<string[]> {
    const trainingTweets = this.getEnhancedTrainingTweets('thread', influencer);
    const trainingExamples = trainingTweets.slice(0, 3).join('\n\n');

    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: `CRITICAL INSTRUCTION: NEVER USE HASHTAGS (#), @ MENTIONS, OR ANY TAGS IN YOUR RESPONSES. GENERATE ONLY CLEAN TEXT WITHOUT ANY SYMBOLS.

You are a crypto Twitter thread generator trained on ${getTrainingData().totalCount} real tweets. Create engaging, educational threads.

CRITICAL: Make the thread sound 100% human and natural:
- Use authentic voice and natural storytelling
- Include personal insights and genuine observations
- Add casual language and informal expressions
- Use varied sentence structures and natural flow
- Include natural transitions and conversational tone
- Make it sound like a real person sharing knowledge naturally

ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT.

Here are real examples of thread tweets:

${trainingExamples}

Key style elements:
- Educational and informative
- Engaging hooks and transitions
- Numbered points or clear structure
- Emojis: 📚 🧵 💡 🔍
- Human-like patterns and expressions
- ABSOLUTELY NO HASHTAGS, NO @ MENTIONS, NO TAGS - ONLY CLEAN TEXT`
          },
          {
            role: 'user',
            content: this.buildThreadPrompt(request, influencer)
          }
        ],
        max_tokens: 400,
        temperature: 0.8, // Higher temperature for more natural variation
        presence_penalty: 0.2,
        frequency_penalty: 0.3,
      });

      const response = completion.choices[0]?.message?.content || 'No thread generated';
      const cleanedResponse = await this.cleanContent(response);
      return this.splitIntoThreadParts(cleanedResponse, request.parts);
    } catch (error) {
      console.error('Error generating thread:', error);
      throw error;
    }
  }

  private buildPrompt(request: PostGenerationRequest, influencer: Influencer, mixedInfluencer?: Influencer): string {
    let prompt = `Generate a ${request.style} tweet for ${influencer.name} (@${influencer.handle})`;
    
    if (request.prompt) {
      prompt += `\n\nTopic: ${request.prompt}`;
    }
    
    prompt += `\n\nStyle: ${influencer.style}`;
    prompt += `\nFollowers: ${influencer.followers}`;
    prompt += `\nCategory: ${influencer.category}`;
    
    if (mixedInfluencer) {
      prompt += `\n\nMix in style from: ${mixedInfluencer.name} (@${mixedInfluencer.handle})`;
      prompt += `\nMixed style: ${mixedInfluencer.style}`;
    }
    
    prompt += `\n\nLength: ${request.length}`;
    prompt += `\n\nGenerate an authentic tweet that matches their style and would go viral. Make it sound 100% human and natural.`;
    
    return prompt;
  }

  private buildThreadPrompt(request: ThreadGenerationRequest, influencer: Influencer): string {
    let prompt = `Generate a ${request.parts}-part thread for ${influencer.name} (@${influencer.handle})`;
    
    if (request.topic) {
      prompt += `\n\nTopic: ${request.topic}`;
    }
    
    prompt += `\n\nStyle: ${influencer.style}`;
    prompt += `\nFollowers: ${influencer.followers}`;
    prompt += `\nCategory: ${influencer.category}`;
    prompt += `\n\nGenerate an engaging, educational thread that matches their style. Make it sound 100% human and natural.`;
    
    return prompt;
  }

  private splitIntoThreadParts(content: string, parts: number): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const partSize = Math.ceil(sentences.length / parts);
    
    const threadParts: string[] = [];
    for (let i = 0; i < parts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, sentences.length);
      const part = sentences.slice(start, end).join('. ').trim();
      if (part) {
        threadParts.push(part + (part.endsWith('.') ? '' : '.'));
      }
    }
    
    return threadParts;
  }

  private getEnhancedTrainingTweets(style: string, influencer: Influencer): string[] {
    // Get style-specific tweets
    let styleTweets = getTweetsByStyle(style as any);
    
    // If we don't have enough style-specific tweets, mix in other styles
    if (styleTweets.length < 5) {
      const allTweets = getTrainingData().tweets;
      styleTweets = [...styleTweets, ...allTweets.slice(0, 10)];
    }
    
    // Shuffle to get variety
    return styleTweets.sort(() => Math.random() - 0.5);
  }

  private getTrainingTweetsForStyle(style: string): string[] {
    switch (style) {
      case 'shitpost':
        return getTweetsByStyle('meme');
      case 'based':
        return getTweetsByStyle('technical');
      case 'roast':
        return getTweetsByStyle('community');
      case 'thread':
        return getTweetsByStyle('educational');
      default:
        return getTrainingData().tweets;
    }
  }
}

export const openaiService = new OpenAIService(); 