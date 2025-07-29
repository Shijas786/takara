import { createClient } from '@supabase/supabase-js';
import { config } from './config';
import { GeneratedPost, User, AutoPostSchedule } from '../types';

// Only create Supabase client if we have valid credentials
const supabase = config.supabase.url && config.supabase.url.trim() !== '' 
  ? createClient(config.supabase.url, config.supabase.anonKey)
  : null;

export class SupabaseService {
  // User management
  async createUser(farcasterFid: string): Promise<User> {
    if (!supabase) {
      // Return mock user for now
      return {
        id: `fid_${farcasterFid}`,
        farcasterFid,
        autoPostSettings: {
          enabled: false,
          dailyLimit: 5,
          scheduleTime: '09:00',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          autoEnhance: true
        },
        createdAt: new Date(),
        lastActive: new Date(),
      };
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        farcaster_fid: farcasterFid,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapUserFromDB(data);
  }

  async getUser(farcasterFid: string): Promise<User | null> {
    if (!supabase) {
      // Return mock user for now
      return {
        id: `fid_${farcasterFid}`,
        farcasterFid,
        autoPostSettings: {
          enabled: false,
          dailyLimit: 5,
          scheduleTime: '09:00',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          autoEnhance: true
        },
        createdAt: new Date(),
        lastActive: new Date(),
      };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_fid', farcasterFid)
      .single();

    if (error) return null;
    return this.mapUserFromDB(data);
  }

  async updateUserAutoPostSettings(farcasterFid: string, settings: any): Promise<void> {
    if (!supabase) {
      // Mock update - just return success
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({
        auto_post_settings: settings,
        last_active: new Date().toISOString(),
      })
      .eq('farcaster_fid', farcasterFid);

    if (error) throw error;
  }

  // Generated posts management
  async saveGeneratedPost(post: Omit<GeneratedPost, 'id'>): Promise<GeneratedPost> {
    if (!supabase) {
      // Return mock post for now
      return {
        id: `post_${Date.now()}`,
        content: post.content,
        influencer: post.influencer,
        mixedInfluencer: post.mixedInfluencer,
        viralScore: post.viralScore,
        createdAt: post.createdAt,
        userId: post.userId,
        isPosted: post.isPosted,
        farcasterHash: post.farcasterHash,
        scheduledFor: post.scheduledFor,
      };
    }

    const { data, error } = await supabase
      .from('generated_posts')
      .insert({
        content: post.content,
        influencer_id: post.influencer.id,
        mixed_influencer_id: post.mixedInfluencer?.id,
        viral_score: post.viralScore,
        user_id: post.userId,
        is_posted: post.isPosted,
        farcaster_hash: post.farcasterHash,
        scheduled_for: post.scheduledFor?.toISOString(),
        created_at: post.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapGeneratedPostFromDB(data);
  }

  async getUserPosts(farcasterFid: string): Promise<GeneratedPost[]> {
    if (!supabase) {
      // Return empty array for now
      return [];
    }

    const { data, error } = await supabase
      .from('generated_posts')
      .select(`
        *,
        influencer:influencers(*),
        mixed_influencer:influencers(*)
      `)
      .eq('user_id', farcasterFid)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapGeneratedPostFromDB);
  }

  async updatePostStatus(postId: string, isPosted: boolean, farcasterHash?: string): Promise<void> {
    if (!supabase) {
      // Mock update - just return success
      return;
    }

    const { error } = await supabase
      .from('generated_posts')
      .update({
        is_posted: isPosted,
        farcaster_hash: farcasterHash,
      })
      .eq('id', postId);

    if (error) throw error;
  }

  // Auto-post scheduling
  async createAutoPostSchedule(schedule: Omit<AutoPostSchedule, 'id'>): Promise<AutoPostSchedule> {
    if (!supabase) {
      // Return mock schedule for now
      return {
        id: `schedule_${Date.now()}`,
        userId: schedule.userId,
        frequency: schedule.frequency,
        timeOfDay: schedule.timeOfDay,
        daysOfWeek: schedule.daysOfWeek,
        isActive: schedule.isActive,
        createdAt: schedule.createdAt,
      };
    }

    const { data, error } = await supabase
      .from('auto_post_schedules')
      .insert({
        user_id: schedule.userId,
        frequency: schedule.frequency,
        time_of_day: schedule.timeOfDay,
        days_of_week: schedule.daysOfWeek,
        is_active: schedule.isActive,
        created_at: schedule.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapAutoPostScheduleFromDB(data);
  }

  async getUserSchedules(farcasterFid: string): Promise<AutoPostSchedule[]> {
    if (!supabase) {
      // Return empty array for now
      return [];
    }

    const { data, error } = await supabase
      .from('auto_post_schedules')
      .select('*')
      .eq('user_id', farcasterFid)
      .eq('is_active', true);

    if (error) throw error;
    return data.map(this.mapAutoPostScheduleFromDB);
  }

  async updateScheduleStatus(scheduleId: string, isActive: boolean): Promise<void> {
    if (!supabase) {
      // Mock update - just return success
      return;
    }

    const { error } = await supabase
      .from('auto_post_schedules')
      .update({ is_active: isActive })
      .eq('id', scheduleId);

    if (error) throw error;
  }

  // Analytics
  async getPostStats(farcasterFid: string): Promise<{
    totalPosts: number;
    postedPosts: number;
    averageViralScore: number;
    topScore: number;
  }> {
    if (!supabase) {
      // Return mock stats for now
      return {
        totalPosts: 0,
        postedPosts: 0,
        averageViralScore: 0,
        topScore: 0,
      };
    }

    const { data: posts, error } = await supabase
      .from('generated_posts')
      .select('*')
      .eq('user_id', farcasterFid);

    if (error) throw error;

    const totalPosts = posts.length;
    const postedPosts = posts.filter(p => p.is_posted).length;
    const scores = posts.map(p => p.viral_score).filter(s => s !== null);
    const averageViralScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const topScore = scores.length > 0 ? Math.max(...scores) : 0;

    return {
      totalPosts,
      postedPosts,
      averageViralScore,
      topScore,
    };
  }

  // Auto-post job management
  async saveAutoPostJob(job: any): Promise<any> {
    if (!supabase) {
      // Return mock job for now
      return {
        id: job.id,
        userId: job.userId,
        content: job.content,
        scheduledTime: job.scheduledTime,
        status: job.status,
        retryCount: job.retryCount,
        maxRetries: job.maxRetries,
        createdAt: job.createdAt,
        postedAt: job.postedAt,
        error: job.error,
      };
    }

    const { data, error } = await supabase
      .from('auto_post_jobs')
      .insert({
        id: job.id,
        user_id: job.userId,
        content: job.content,
        scheduled_time: job.scheduledTime.toISOString(),
        status: job.status,
        retry_count: job.retryCount,
        max_retries: job.maxRetries,
        created_at: job.createdAt.toISOString(),
        posted_at: job.postedAt?.toISOString(),
        error: job.error,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapAutoPostJobFromDB(data);
  }

  async updateAutoPostJob(job: any): Promise<void> {
    if (!supabase) {
      // Mock update - just return success
      return;
    }

    const { error } = await supabase
      .from('auto_post_jobs')
      .update({
        status: job.status,
        retry_count: job.retryCount,
        posted_at: job.postedAt?.toISOString(),
        error: job.error,
      })
      .eq('id', job.id);

    if (error) throw error;
  }

  async getAutoPostJobsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
    if (!supabase) {
      // Return mock jobs for now
      return [];
    }

    const { data, error } = await supabase
      .from('auto_post_jobs')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_time', startDate.toISOString())
      .lt('scheduled_time', endDate.toISOString());

    if (error) throw error;
    return data.map(this.mapAutoPostJobFromDB);
  }

  async cancelAutoPostJob(jobId: string): Promise<void> {
    if (!supabase) {
      // Mock cancel - just return success
      return;
    }

    const { error } = await supabase
      .from('auto_post_jobs')
      .update({ status: 'cancelled' })
      .eq('id', jobId);

    if (error) throw error;
  }

  async getAutoPostJobsByUser(userId: string): Promise<any[]> {
    if (!supabase) {
      // Return mock jobs for now
      return [];
    }

    const { data, error } = await supabase
      .from('auto_post_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_time', { ascending: true });

    if (error) throw error;
    return data.map(this.mapAutoPostJobFromDB);
  }

  // Helper methods for data mapping
  private mapUserFromDB(data: any): User {
    return {
      id: data.id,
      farcasterFid: data.farcaster_fid,
      autoPostSettings: data.auto_post_settings || {
        enabled: false,
        dailyLimit: 5,
        scheduleTime: '09:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        autoEnhance: true
      },
      createdAt: new Date(data.created_at),
      lastActive: new Date(data.last_active),
    };
  }

  private mapGeneratedPostFromDB(data: any): GeneratedPost {
    return {
      id: data.id,
      content: data.content,
      influencer: data.influencer,
      mixedInfluencer: data.mixed_influencer,
      viralScore: data.viral_score,
      createdAt: new Date(data.created_at),
      userId: data.user_id,
      isPosted: data.is_posted,
      farcasterHash: data.farcaster_hash,
      scheduledFor: data.scheduled_for ? new Date(data.scheduled_for) : undefined,
    };
  }

  private mapAutoPostScheduleFromDB(data: any): AutoPostSchedule {
    return {
      id: data.id,
      userId: data.user_id,
      frequency: data.frequency,
      timeOfDay: data.time_of_day,
      daysOfWeek: data.days_of_week,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
    };
  }

  private mapAutoPostJobFromDB(data: any): any {
    return {
      id: data.id,
      userId: data.user_id,
      content: data.content,
      scheduledTime: new Date(data.scheduled_time),
      status: data.status,
      retryCount: data.retry_count,
      maxRetries: data.max_retries,
      createdAt: new Date(data.created_at),
      postedAt: data.posted_at ? new Date(data.posted_at) : undefined,
      error: data.error,
    };
  }
}

export const supabaseService = new SupabaseService(); 