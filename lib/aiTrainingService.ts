import { neonService } from './neon';
import { ViralScoreCalculator } from './viralScore';
import { OpenAIService } from './openai';
import { Influencer } from '../types';

export interface TrainingExample {
  id: string;
  content: string;
  style: string;
  influencer: string;
  viralScore: number;
  engagement: number;
  createdAt: Date;
  performance: 'high' | 'medium' | 'low';
}

export interface TrainingMetrics {
  totalExamples: number;
  averageViralScore: number;
  topPerformingStyles: string[];
  stylePerformance: Record<string, { count: number; avgScore: number }>;
  recentImprovements: string[];
}

export class AITrainingService {
  private viralScoreCalculator = new ViralScoreCalculator();
  private openaiService = new OpenAIService();

  constructor() {
    // Initialize Indian English training examples
    this.initializeIndianEnglishTraining();
  }

  private async initializeIndianEnglishTraining(): Promise<void> {
    try {
      // Check if we already have Indian English examples
      const existingExamples = await this.getTrainingExamples('indian', 1);
      if (existingExamples.length === 0) {
        console.log('🚀 Initializing Indian English training examples...');
        await this.addIndianEnglishTrainingExamples();
      }
    } catch (error) {
      console.log('ℹ️ Indian English training already initialized or failed:', error);
    }
  }

  /**
   * Generate reply guy content - AI responds to other tweets like a real human
   */
  async generateReplyGuyContent(originalTweet: string, style: 'casual' | 'based' | 'influencer' | 'indian' = 'casual'): Promise<string> {
    try {
      // Build context-aware prompt for reply generation
      const replyPrompt = this.buildReplyGuyPrompt(originalTweet, style);
      
      // Generate reply using OpenAI with Indian English support
      const reply = await this.openaiService.generateShitpost({
        influencerId: 'reply_guy',
        prompt: replyPrompt,
        length: 'short',
        style: style === 'indian' ? 'indian' : 'reply',
      }, {
        id: 'reply_guy',
        name: 'Reply Guy',
        handle: '@replyguy',
        avatar: '',
        description: 'AI Reply Generator',
        style: 'reply',
        followers: 0,
        category: 'crypto',
        sampleTweets: []
      });

      return reply;
    } catch (error) {
      console.error('Error generating reply guy content:', error);
      throw error;
    }
  }

  /**
   * Store a new training example from user-generated content
   */
  async storeTrainingExample(
    content: string,
    style: string,
    influencer: string,
    engagement?: number
  ): Promise<void> {
    try {
      // Calculate viral score
      const viralScore = this.viralScoreCalculator.calculateViralScore(content);
      
      // Determine performance level
      const performance = this.categorizePerformance(viralScore.totalScore, engagement);
      
      // Store in database
      await neonService.saveGeneratedPost({
        content,
        influencer: { id: influencer, name: influencer, handle: `@${influencer}`, avatar: '', description: '', style, followers: 0, category: 'crypto', sampleTweets: [] },
        viralScore: viralScore.totalScore,
        userId: 'training_data',
        isPosted: false,
        createdAt: new Date(),
      });

      console.log(`✅ Training example stored: ${style} style, score: ${viralScore.totalScore}, performance: ${performance}`);
    } catch (error) {
      console.error('Error storing training example:', error);
    }
  }

  /**
   * Add Indian English training examples to improve reply quality
   */
  async addIndianEnglishTrainingExamples(): Promise<void> {
    const indianExamples = [
      {
        content: "Yaar, this is exactly what I was thinking yesterday when I was setting up my UPI for crypto! The Indian crypto scene is really evolving, bro. 🇮🇳🚀",
        style: 'indian',
        influencer: 'indian_crypto_expert'
      },
      {
        content: "Dude, I've been through this exact situation with SEBI regulations. It's like they want to protect us but also hold us back, ya know? Still bullish on Indian crypto though! 💎",
        style: 'indian',
        influencer: 'indian_crypto_expert'
      },
      {
        content: "Man, this reminds me of when I first got into crypto and had to deal with all the KYC stuff. Indian exchanges are getting better, but we still have a long way to go, bhai! 📈",
        style: 'indian',
        influencer: 'indian_crypto_expert'
      },
      {
        content: "Bro, I was just talking about this with my friends in Mumbai! The crypto adoption in India is crazy right now. Everyone from my college to my uncle is asking about it! 🔥",
        style: 'indian',
        influencer: 'indian_crypto_expert'
      },
      {
        content: "Yaar, this is the kind of content we need more of in the Indian crypto community. Real talk, not just hype. Keep it up, dude! 💯",
        style: 'indian',
        influencer: 'indian_crypto_expert'
      }
    ];

    try {
      for (const example of indianExamples) {
        await this.storeTrainingExample(
          example.content,
          example.style,
          example.influencer,
          85 // High engagement score
        );
      }
      console.log('✅ Added Indian English training examples');
    } catch (error) {
      console.error('Error adding Indian English training examples:', error);
    }
  }

  /**
   * Generate human-like, context-aware content that thinks like a real person
   */
  async generateHumanLikeContent(
    prompt: string,
    style: string,
    length: 'short' | 'medium' | 'long',
    context?: string
  ): Promise<string> {
    try {
      // Build context-aware prompt that encourages human-like thinking
      const humanPrompt = this.buildHumanLikePrompt(prompt, style, length, context);
      
      // Generate content using OpenAI with enhanced human-like instructions
      const content = await this.openaiService.generateShitpost({
        influencerId: 'human_like',
        prompt: humanPrompt,
        length,
        style: style as 'based' | 'influencer' | 'shitpost' | 'thread' | 'reply',
      }, {
        id: 'human_like',
        name: 'Human Like',
        handle: '@humanlike',
        avatar: '',
        description: 'Human-like content generator',
        style,
        followers: 0,
        category: 'crypto',
        sampleTweets: []
      });

      // Store this as a new training example
      await this.storeTrainingExample(content, style, 'human_like', 0);

      return content;
    } catch (error) {
      console.error('Error generating human-like content:', error);
      throw error;
    }
  }

  /**
   * Get training examples for a specific style
   */
  async getTrainingExamples(style: string, limit: number = 10): Promise<TrainingExample[]> {
    try {
      const posts = await neonService.getUserPosts('training_data');
      
      // Filter by style and sort by performance
      const stylePosts = posts
        .filter(post => post.influencer.style === style)
        .sort((a, b) => b.viralScore - a.viralScore)
        .slice(0, limit);

      return stylePosts.map(post => ({
        id: post.id,
        content: post.content,
        style: post.influencer.style,
        influencer: post.influencer.name,
        viralScore: post.viralScore,
        engagement: 0, // Placeholder for now
        createdAt: post.createdAt,
        performance: this.categorizePerformance(post.viralScore),
      }));
    } catch (error) {
      console.error('Error getting training examples:', error);
      return [];
    }
  }

  /**
   * Generate enhanced content using learned patterns
   */
  async generateEnhancedContent(
    prompt: string,
    style: string,
    length: 'short' | 'medium' | 'long'
  ): Promise<string> {
    try {
      // Get top-performing examples for this style
      const examples = await this.getTrainingExamples(style, 5);
      
      // Build enhanced prompt with examples
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, style, length, examples);
      
      // Generate content using OpenAI
      const content = await this.openaiService.generateShitpost({
        influencerId: 'ai_generated',
        prompt: enhancedPrompt,
        length,
        style: style as 'based' | 'influencer' | 'shitpost' | 'thread' | 'reply',
      }, {
        id: 'ai_generated',
        name: 'AI Generated',
        handle: '@aigenerated',
        avatar: '',
        description: 'AI Content Generator',
        style,
        followers: 0,
        category: 'crypto',
        sampleTweets: []
      });

      // Store this as a new training example
      await this.storeTrainingExample(content, style, 'ai_generated', 0);

      return content;
    } catch (error) {
      console.error('Error generating enhanced content:', error);
      throw error;
    }
  }

  /**
   * Analyze training data and provide insights
   */
  async getTrainingMetrics(): Promise<TrainingMetrics> {
    try {
      const posts = await neonService.getUserPosts('training_data');
      
      if (posts.length === 0) {
        return {
          totalExamples: 0,
          averageViralScore: 0,
          topPerformingStyles: [],
          stylePerformance: {},
          recentImprovements: [],
        };
      }

      // Calculate metrics
      const totalScore = posts.reduce((sum, post) => sum + post.viralScore, 0);
      const averageScore = totalScore / posts.length;

      // Group by style
      const styleGroups = posts.reduce((acc, post) => {
        const style = post.influencer.style;
        if (!acc[style]) {
          acc[style] = { count: 0, totalScore: 0 };
        }
        acc[style].count++;
        acc[style].totalScore += post.viralScore;
        return acc;
      }, {} as Record<string, { count: number; totalScore: number }>);

      // Calculate style performance
      const stylePerformance = Object.entries(styleGroups).reduce((acc, [style, data]) => {
        acc[style] = {
          count: data.count,
          avgScore: data.totalScore / data.count,
        };
        return acc;
      }, {} as Record<string, { count: number; avgScore: number }>);

      // Get top performing styles
      const topStyles = Object.entries(stylePerformance)
        .sort(([, a], [, b]) => b.avgScore - a.avgScore)
        .slice(0, 3)
        .map(([style]) => style);

      // Get recent improvements (posts with increasing scores)
      const recentImprovements = this.analyzeRecentImprovements(posts);

      return {
        totalExamples: posts.length,
        averageViralScore: Math.round(averageScore * 100) / 100,
        topPerformingStyles: topStyles,
        stylePerformance,
        recentImprovements,
      };
    } catch (error) {
      console.error('Error getting training metrics:', error);
      throw error;
    }
  }

  /**
   * Fine-tune the AI model based on performance data
   */
  async fineTuneModel(style: string): Promise<void> {
    try {
      console.log(`🔄 Fine-tuning AI model for ${style} style...`);
      
      // Get high-performing examples
      const examples = await this.getTrainingExamples(style, 20);
      const highPerforming = examples.filter(ex => ex.performance === 'high');
      
      if (highPerforming.length < 5) {
        console.log(`⚠️ Not enough high-performing examples for ${style} style (need 5, have ${highPerforming.length})`);
        return;
      }

      // Create fine-tuning dataset
      const trainingData = highPerforming.map(ex => ({
        content: ex.content,
        viralScore: ex.viralScore,
        style: ex.style,
      }));

      // Store fine-tuning data for future use
      await this.storeFineTuningData(style, trainingData);
      
      console.log(`✅ Fine-tuning data prepared for ${style} style with ${trainingData.length} examples`);
    } catch (error) {
      console.error('Error fine-tuning model:', error);
    }
  }

  /**
   * Get personalized content recommendations
   */
  async getContentRecommendations(userId: string): Promise<string[]> {
    try {
      const userPosts = await neonService.getUserPosts(userId);
      
      if (userPosts.length === 0) {
        return ['Start with a simple "gm" post to get familiar with the platform'];
      }

      // Analyze user's posting patterns
      const userStyles = userPosts.map(post => post.influencer.style);
      const mostUsedStyle = this.getMostFrequent(userStyles);
      
      // Get recommendations based on style
      const recommendations = await this.getStyleRecommendations(mostUsedStyle);
      
      return recommendations;
    } catch (error) {
      console.error('Error getting content recommendations:', error);
      return ['Try posting about what excites you most in crypto'];
    }
  }

  // Private helper methods
  private categorizePerformance(viralScore: number, engagement?: number): 'high' | 'medium' | 'low' {
    if (viralScore >= 80 || (engagement && engagement > 100)) return 'high';
    if (viralScore >= 50 || (engagement && engagement > 50)) return 'medium';
    return 'low';
  }

  private buildEnhancedPrompt(
    prompt: string,
    style: string,
    length: string,
    examples: TrainingExample[]
  ): string {
    const exampleText = examples
      .map(ex => `Example (Score: ${ex.viralScore}): "${ex.content}"`)
      .join('\n');

    return `Generate a ${length} ${style}-style post about: "${prompt}"

Use these high-performing examples as reference:
${exampleText}

CRITICAL REQUIREMENTS:
- Match the ${style} style exactly
- Use natural, human-like language that sounds authentic
- Include relevant emojis and crypto slang naturally
- Make it engaging and shareable
- Target length: ${length === 'short' ? '1-2 sentences' : length === 'medium' ? '2-3 sentences' : '3-4 sentences'}

IMPORTANT: Make this sound like a real human, not AI:
- Think about real-life scenarios and experiences
- Use varied sentence structures and natural flow
- Avoid repetitive phrases like "af", "lol", "fr", "this", "ngl"
- Include personal touches and authentic voice
- Make it conversational and relatable
- Consider the context and emotion of the topic

Generate the post:`;
  }

  private analyzeRecentImprovements(posts: any[]): string[] {
    const improvements: string[] = [];
    
    // Sort by date and analyze trends
    const sortedPosts = posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    if (sortedPosts.length >= 10) {
      const recent10 = sortedPosts.slice(-10);
      const first5 = recent10.slice(0, 5);
      const last5 = recent10.slice(-5);
      
      const firstAvg = first5.reduce((sum, post) => sum + post.viralScore, 0) / 5;
      const lastAvg = last5.reduce((sum, post) => sum + post.viralScore, 0) / 5;
      
      if (lastAvg > firstAvg + 10) {
        improvements.push(`Viral score improved by ${Math.round(lastAvg - firstAvg)} points in recent posts`);
      }
    }
    
    return improvements;
  }

  private getMostFrequent<T>(array: T[]): T {
    const counts = array.reduce((acc, item) => {
      acc[item as string] = (acc[item as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0] as T;
  }

  private async getStyleRecommendations(style: string): Promise<string[]> {
    const recommendations: Record<string, string[]> = {
      'based': [
        'Share your thoughts on Base ecosystem developments',
        'Post about your favorite Base projects',
        'Discuss the future of L2 scaling',
      ],
      'influencer': [
        'Create educational content about crypto concepts',
        'Share your journey and lessons learned',
        'Provide actionable tips for newcomers',
      ],
      'casual': [
        'Share your daily crypto experiences',
        'Post memes and fun content',
        'Engage with the community casually',
      ],
      'indian': [
        'Share your crypto journey with Indian cultural context',
        'Discuss crypto adoption in India',
        'Post about Indian crypto projects and developments',
        'Share experiences with Indian crypto exchanges and regulations',
      ],
      'reply guy': [
        'Respond to trending discussions',
        'Add your perspective to hot topics',
        'Engage with other creators\' content',
      ],
    };

    return recommendations[style] || ['Keep posting consistently to find your voice'];
  }

  /**
   * Build context-aware prompt for reply generation
   */
  private buildReplyGuyPrompt(originalTweet: string, style: 'casual' | 'based' | 'influencer' | 'indian'): string {
    const styleInstructions = {
      casual: 'Respond like a casual crypto enthusiast - use emojis, casual language, and show genuine interest',
      based: 'Respond like a Base chain supporter - mention Base ecosystem, show enthusiasm for L2 scaling',
      influencer: 'Respond like a crypto influencer - add value, share insights, and engage thoughtfully',
      indian: 'Respond like an Indian crypto enthusiast - use natural Indian English expressions like "yaar", "bro", "dude", "man", "bhai" naturally. Include Indian cultural references, crypto terms like UPI/RBI/SEBI, and sound like a real Indian person having a genuine conversation. Think about real-life scenarios and respond naturally.'
    };

    return `You are a real human responding to this tweet:

"${originalTweet}"

${styleInstructions[style]}

IMPORTANT: Think like a real person in a real conversation. Don't just give generic responses like "af", "lol", "fr". Instead:

- Put yourself in the shoes of someone actually reading this tweet
- Think about what you would genuinely say in response
- Consider the context and emotion of the original post
- Share your real thoughts, experiences, or reactions
- Use natural language patterns, not forced engagement

${style === 'indian' ? `
SPECIAL INDIAN ENGLISH INSTRUCTIONS:
- Use Indian English expressions naturally: "yaar", "bro", "dude", "man", "bhai"
- Think about real Indian crypto community conversations
- Include Indian cultural context when relevant
- Use Indian crypto terms naturally: UPI, RBI, SEBI, GST
- Sound like a real Indian person typing naturally
- Make it conversational and relatable to Indian audience` : ''}

Generate a natural, human-like reply that:
- Sounds like a real person, not AI
- Relates to the original tweet content with genuine insight
- Uses appropriate tone for the ${style} style
- Includes relevant emojis and crypto slang naturally
- Is engaging and conversational
- Maximum 2-3 sentences
- Avoids repetitive phrases like "af", "lol", "fr", "this", "ngl"

Your reply:`;
  }

  private async storeFineTuningData(style: string, data: any[]): Promise<void> {
    // Store fine-tuning data for future model updates
    // This could be used for actual OpenAI fine-tuning in the future
    console.log(`📊 Storing fine-tuning data for ${style} style:`, data.length, 'examples');
  }

  /**
   * Build prompts that encourage human-like, context-aware thinking
   */
  private buildHumanLikePrompt(
    prompt: string,
    style: string,
    length: string,
    context?: string
  ): string {
    const contextInfo = context ? `\n\nContext: ${context}` : '';
    
    // Add Indian English specific instructions
    const indianInstructions = style === 'indian' ? `

INDIAN ENGLISH STYLE REQUIREMENTS:
- Use Indian English expressions naturally: "yaar", "bro", "dude", "man"
- Include Indian cultural references when relevant
- Use Indian crypto terminology: "UPI", "RBI", "SEBI", "GST"
- Reference Indian cities, states, or cultural elements
- Use Indian English sentence structure and flow
- Include Indian crypto community slang and expressions` : '';
    
    return `Generate a ${length} ${style}-style post about: "${prompt}"

${contextInfo}

CRITICAL: Think like a real human in a real situation:

1. REAL-LIFE SCENARIO: Imagine you're actually experiencing this or talking to someone about it
2. PERSONAL PERSPECTIVE: What would you genuinely think or say about this topic?
3. NATURAL LANGUAGE: Use varied sentence structures, not repetitive phrases
4. AUTHENTIC VOICE: Include personal touches, emotions, and genuine reactions
5. CONTEXT AWARENESS: Consider the real-world implications and situations

AVOID these generic, repetitive responses:
- "af", "lol", "fr", "this", "ngl", "ngl this", "fr tho"
- Overused phrases that sound like AI
- Forced engagement or fake enthusiasm

INSTEAD, think about:
- What would you actually say to a friend about this?
- How would you react in real life to this situation?
- What personal experiences or thoughts does this bring up?
- How would you naturally express your opinion?${indianInstructions}

Style: ${style}
Length: ${length === 'short' ? '1-2 sentences' : length === 'medium' ? '2-3 sentences' : '3-4 sentences'}

Generate authentic, human-like content:`;
  }
}

// Export singleton instance
export const aiTrainingService = new AITrainingService(); 