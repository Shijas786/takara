import { supabaseService } from './supabase';

export interface AutoPostJob {
  id: string;
  userId: string;
  content: string;
  scheduledTime: Date;
  status: 'pending' | 'posted' | 'failed' | 'retrying';
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  postedAt?: Date;
  error?: string;
}

export interface AutoPostSettings {
  enabled: boolean;
  dailyLimit: number;
  scheduleTime: string; // HH:MM format
  timezone: string;
  autoEnhance: boolean;
  maxRetries: number;
  retryDelay: number; // minutes
}

class AutoPostService {
  private jobs: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  async schedulePost(
    userId: string,
    content: string,
    scheduledTime: Date,
    settings: AutoPostSettings
  ): Promise<AutoPostJob> {
    const job: AutoPostJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      content,
      scheduledTime,
      status: 'pending',
      retryCount: 0,
      maxRetries: settings.maxRetries || 3,
      createdAt: new Date(),
    };

    // Save to database
    await supabaseService.saveAutoPostJob(job);

    // Schedule the post
    this.scheduleJob(job, settings);

    return job;
  }

  private scheduleJob(job: AutoPostJob, settings: AutoPostSettings) {
    const now = new Date();
    const delay = job.scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // Post immediately if scheduled time has passed
      this.executePost(job, settings);
    } else {
      // Schedule for later
      const timeout = setTimeout(() => {
        this.executePost(job, settings);
      }, delay);

      this.jobs.set(job.id, timeout);
    }
  }

  private async executePost(job: AutoPostJob, settings: AutoPostSettings) {
    try {
      // Get user's Farcaster token
      const token = await this.getFarcasterToken(job.userId);
      if (!token) {
        throw new Error('No Farcaster token found');
      }

      // Post to Farcaster
      const response = await fetch('https://api.farcaster.xyz/v2/casts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: job.content,
        }),
      });

      if (response.ok) {
        // Success
        job.status = 'posted';
        job.postedAt = new Date();
        await supabaseService.updateAutoPostJob(job);
        
        console.log(`Auto-post successful: ${job.id}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error(`Auto-post failed: ${job.id}`, error);
      
      job.retryCount++;
      job.error = error.message;

      if (job.retryCount >= job.maxRetries) {
        job.status = 'failed';
        await supabaseService.updateAutoPostJob(job);
      } else {
        // Retry after delay
        job.status = 'retrying';
        await supabaseService.updateAutoPostJob(job);
        
        const retryDelay = (settings.retryDelay || 5) * 60 * 1000; // Convert to milliseconds
        setTimeout(() => {
          this.executePost(job, settings);
        }, retryDelay);
      }
    }
  }

  private async getFarcasterToken(userId: string): Promise<string | null> {
    // In a real implementation, you'd get this from your database
    // For now, we'll use localStorage (client-side only)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('farcaster_token');
    }
    return null;
  }

  async scheduleDailyPosts(
    userId: string,
    settings: AutoPostSettings,
    contentGenerator: () => Promise<string>
  ) {
    if (!settings.enabled) return;

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPosts = await supabaseService.getAutoPostJobsByDateRange(
      userId,
      today,
      tomorrow
    );

    if (todayPosts.length >= settings.dailyLimit) {
      console.log(`Daily limit reached for user ${userId}`);
      return;
    }

    // Generate content if auto-enhance is enabled
    let content: string;
    if (settings.autoEnhance) {
      content = await contentGenerator();
    } else {
      // Use a default template
      content = "Just posted from my Base Mini App! 🚀 #Base #Web3";
    }

    // Calculate next posting time
    const [hours, minutes] = settings.scheduleTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Schedule the post
    await this.schedulePost(userId, content, scheduledTime, settings);
  }

  async cancelJob(jobId: string) {
    const timeout = this.jobs.get(jobId);
    if (timeout) {
      clearTimeout(timeout);
      this.jobs.delete(jobId);
    }

    // Update database
    await supabaseService.cancelAutoPostJob(jobId);
  }

  async getUserJobs(userId: string): Promise<AutoPostJob[]> {
    return await supabaseService.getAutoPostJobsByUser(userId);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('Auto-post service started');
  }

  stop() {
    this.isRunning = false;
    
    // Clear all scheduled jobs
    Array.from(this.jobs.entries()).forEach(([jobId, timeout]) => {
      clearTimeout(timeout);
    });
    this.jobs.clear();
    
    console.log('Auto-post service stopped');
  }
}

export const autoPostService = new AutoPostService(); 