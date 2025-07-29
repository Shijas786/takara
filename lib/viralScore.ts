import { ViralScoreBreakdown } from '../types';
import { emojiScoreMap, hookPhrases, slangScoreMap, viralScoreWeights } from './config';

export class ViralScoreCalculator {
  calculateViralScore(content: string): ViralScoreBreakdown {
    const emojiScore = this.calculateEmojiScore(content);
    const hookScore = this.calculateHookScore(content);
    const slangScore = this.calculateSlangScore(content);

    const totalScore = Math.round(
      emojiScore * viralScoreWeights.emoji +
      hookScore * viralScoreWeights.hook +
      slangScore * viralScoreWeights.slang
    );

    return {
      emojiScore,
      hookScore,
      slangScore,
      totalScore: Math.min(totalScore, 100), // Cap at 100
    };
  }

  private calculateEmojiScore(content: string): number {
    let score = 0;
    let emojiCount = 0;

    // Count emojis and calculate score
    for (const [emoji, points] of Object.entries(emojiScoreMap)) {
      const count = (content.match(new RegExp(emoji, 'g')) || []).length;
      score += count * points;
      emojiCount += count;
    }

    // Bonus for emoji density
    if (emojiCount > 0) {
      const density = emojiCount / content.length;
      if (density > 0.1) score += 10; // High emoji density
      else if (density > 0.05) score += 5; // Medium emoji density
    }

    return Math.min(score, 30); // Cap emoji score at 30
  }

  private calculateHookScore(content: string): number {
    let score = 0;
    const lowerContent = content.toLowerCase();

    // Check for hook phrases
    for (const phrase of hookPhrases) {
      if (lowerContent.includes(phrase.toLowerCase())) {
        score += 5;
      }
    }

    // Check for question marks (engagement hooks)
    const questionCount = (content.match(/\?/g) || []).length;
    score += questionCount * 3;

    // Check for exclamation marks (excitement)
    const exclamationCount = (content.match(/!/g) || []).length;
    score += exclamationCount * 2;

    // Check for numbers (specificity)
    const numberCount = (content.match(/\d+/g) || []).length;
    score += numberCount * 2;

    // Check for mentions (@username)
    const mentionCount = (content.match(/@\w+/g) || []).length;
    score += mentionCount * 3;

    // Check for hashtags
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    score += hashtagCount * 2;

    return Math.min(score, 40); // Cap hook score at 40
  }

  private calculateSlangScore(content: string): number {
    let score = 0;
    const lowerContent = content.toLowerCase();

    // Check for crypto slang
    for (const [slang, points] of Object.entries(slangScoreMap)) {
      if (lowerContent.includes(slang.toLowerCase())) {
        score += points;
      }
    }

    // Check for common crypto terms
    const cryptoTerms = [
      'alpha', 'beta', 'gamma', 'delta', 'sigma',
      'chad', 'virgin', 'based', 'cringe',
      'ser', 'anon', 'fren', 'wagmi', 'ngmi',
      'wen', 'soon', 'ser', 'anon',
      'base', 'l2', 'scaling', 'rollup', 'coinbase',
      'builder', 'developer', 'ecosystem', 'deploy',
      'gas', 'transaction', 'smart contract', 'optimization'
    ];

    for (const term of cryptoTerms) {
      if (lowerContent.includes(term)) {
        score += 3;
      }
    }

    // Check for all caps (shouting)
    const capsCount = (content.match(/[A-Z]{3,}/g) || []).length;
    score += capsCount * 2;

    // Check for repeated letters (emphasis)
    const repeatedLetters = (content.match(/(.)\1{2,}/g) || []).length;
    score += repeatedLetters * 1;

    return Math.min(score, 30); // Cap slang score at 30
  }

  getViralScoreDescription(score: number): string {
    if (score >= 90) return '🔥 VIRAL AF - This will blow up!';
    if (score >= 80) return '🚀 High viral potential - Strong engagement expected';
    if (score >= 70) return '📈 Good viral potential - Should perform well';
    if (score >= 60) return '👍 Decent viral potential - Might get traction';
    if (score >= 50) return '😐 Average viral potential - Could go either way';
    if (score >= 40) return '😕 Low viral potential - Might need work';
    if (score >= 30) return '😴 Very low viral potential - Consider revising';
    return '💀 No viral potential - Start over';
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  }

  getScoreEmoji(score: number): string {
    if (score >= 90) return '🔥';
    if (score >= 80) return '🚀';
    if (score >= 70) return '📈';
    if (score >= 60) return '👍';
    if (score >= 50) return '😐';
    if (score >= 40) return '😕';
    if (score >= 30) return '😴';
    return '💀';
  }
}

export const viralScoreCalculator = new ViralScoreCalculator(); 