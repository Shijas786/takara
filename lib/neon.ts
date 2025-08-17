import { neon } from 'neon';
import { GeneratedPost, User, AutoPostSchedule } from '../types';

// Database connection
const sql = neon(process.env.DATABASE_URL!);

export class NeonService {
  // User management
  async createUser(farcasterFid: string): Promise<User> {
    try {
      const [data] = await sql`
        INSERT INTO users (farcaster_fid, created_at, last_active)
        VALUES (${farcasterFid}, NOW(), NOW())
        RETURNING *
      `;
      
      return this.mapUserFromDB(data);
    } catch (error) {
      console.error('Error creating user:', error);
      // Return mock user as fallback
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
  }

  async getUser(farcasterFid: string): Promise<User | null> {
    try {
      const [data] = await sql`
        SELECT * FROM users 
        WHERE farcaster_fid = ${farcasterFid}
      `;
      
      if (!data) return null;
      return this.mapUserFromDB(data);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateUserAutoPostSettings(farcasterFid: string, settings: any): Promise<void> {
    try {
      await sql`
        UPDATE users 
        SET auto_post_settings = ${JSON.stringify(settings)}, 
            last_active = NOW()
        WHERE farcaster_fid = ${farcasterFid}
      `;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  // Generated posts management
  async saveGeneratedPost(post: Omit<GeneratedPost, 'id'>): Promise<GeneratedPost> {
    try {
      const [data] = await sql`
        INSERT INTO generated_posts (
          content, influencer_id, mixed_influencer_id, viral_score, 
          user_id, is_posted, farcaster_hash, scheduled_for, created_at
        )
        VALUES (
          ${post.content}, 
          ${post.influencer.id}, 
          ${post.mixedInfluencer?.id || null}, 
          ${post.viralScore}, 
          ${post.userId}, 
          ${post.isPosted}, 
          ${post.farcasterHash || null}, 
          ${post.scheduledFor?.toISOString() || null}, 
          NOW()
        )
        RETURNING *
      `;
      
      return this.mapGeneratedPostFromDB(data);
    } catch (error) {
      console.error('Error saving post:', error);
      // Return mock post as fallback
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
  }

  async getUserPosts(farcasterFid: string): Promise<GeneratedPost[]> {
    try {
      const data = await sql`
        SELECT 
          gp.*,
          i.id as influencer_id,
          i.name as influencer_name,
          i.handle as influencer_handle,
          i.avatar as influencer_avatar,
          i.description as influencer_description,
          i.style as influencer_style,
          i.followers as influencer_followers,
          i.category as influencer_category,
          mi.id as mixed_influencer_id,
          mi.name as mixed_influencer_name,
          mi.handle as mixed_influencer_handle,
          mi.avatar as mixed_influencer_avatar,
          mi.description as mixed_influencer_description,
          mi.style as mixed_influencer_style,
          mi.followers as mixed_influencer_followers,
          mi.category as mixed_influencer_category
        FROM generated_posts gp
        LEFT JOIN influencers i ON gp.influencer_id = i.id
        LEFT JOIN influencers mi ON gp.mixed_influencer_id = mi.id
        WHERE gp.user_id = ${farcasterFid}
        ORDER BY gp.created_at DESC
      `;
      
      return data.map(this.mapGeneratedPostFromDB);
    } catch (error) {
      console.error('Error getting user posts:', error);
      return [];
    }
  }

  async updatePostStatus(postId: string, isPosted: boolean, farcasterHash?: string): Promise<void> {
    try {
      await sql`
        UPDATE generated_posts 
        SET is_posted = ${isPosted}, 
            farcaster_hash = ${farcasterHash || null}
        WHERE id = ${postId}
      `;
    } catch (error) {
      console.error('Error updating post status:', error);
      throw error;
    }
  }

  // Auto-post scheduling
  async createAutoPostSchedule(schedule: Omit<AutoPostSchedule, 'id'>): Promise<AutoPostSchedule> {
    try {
      const [data] = await sql`
        INSERT INTO auto_post_schedules (
          user_id, frequency, time_of_day, days_of_week, is_active, created_at
        )
        VALUES (
          ${schedule.userId}, 
          ${schedule.frequency}, 
          ${schedule.timeOfDay}, 
          ${schedule.daysOfWeek || null}, 
          ${schedule.isActive}, 
          NOW()
        )
        RETURNING *
      `;
      
      return this.mapAutoPostScheduleFromDB(data);
    } catch (error) {
      console.error('Error creating schedule:', error);
      // Return mock schedule as fallback
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
  }

  async getUserSchedules(farcasterFid: string): Promise<AutoPostSchedule[]> {
    try {
      const data = await sql`
        SELECT * FROM auto_post_schedules 
        WHERE user_id = ${farcasterFid}
        ORDER BY created_at DESC
      `;
      
      return data.map(this.mapAutoPostScheduleFromDB);
    } catch (error) {
      console.error('Error getting user schedules:', error);
      return [];
    }
  }

  async updateScheduleStatus(scheduleId: string, isActive: boolean): Promise<void> {
    try {
      await sql`
        UPDATE auto_post_schedules 
        SET is_active = ${isActive}
        WHERE id = ${scheduleId}
      `;
    } catch (error) {
      console.error('Error updating schedule status:', error);
      throw error;
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      await sql`
        DELETE FROM auto_post_schedules 
        WHERE id = ${scheduleId}
      `;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }

  // Influencer data
  async getInfluencers(): Promise<any[]> {
    try {
      const data = await sql`
        SELECT * FROM influencers 
        ORDER BY followers DESC
      `;
      
      return data;
    } catch (error) {
      console.error('Error getting influencers:', error);
      return [];
    }
  }

  async getInfluencerById(id: string): Promise<any | null> {
    try {
      const [data] = await sql`
        SELECT * FROM influencers 
        WHERE id = ${id}
      `;
      
      return data || null;
    } catch (error) {
      console.error('Error getting influencer:', error);
      return null;
    }
  }

  // Auto-post job methods (for compatibility)
  async saveAutoPostJob(job: any): Promise<void> {
    // Implementation for auto-post jobs
    console.log('Saving auto-post job:', job);
  }

  async updateAutoPostJob(job: any): Promise<void> {
    // Implementation for updating auto-post jobs
    console.log('Updating auto-post job:', job);
  }

  async getAutoPostJobsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
    // Implementation for getting auto-post jobs by date range
    return [];
  }

  async getAutoPostJobsByUser(userId: string): Promise<any[]> {
    // Implementation for getting auto-post jobs by user
    return [];
  }

  async cancelAutoPostJob(jobId: string): Promise<void> {
    // Implementation for canceling auto-post jobs
    console.log('Canceling auto-post job:', jobId);
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
      influencer: {
        id: data.influencer_id,
        name: data.influencer_name,
        handle: data.influencer_handle,
        avatar: data.influencer_avatar,
        description: data.influencer_description,
        style: data.influencer_style,
        followers: data.influencer_followers,
        category: data.influencer_category,
        sampleTweets: []
      },
      mixedInfluencer: data.mixed_influencer_id ? {
        id: data.mixed_influencer_id,
        name: data.mixed_influencer_name,
        handle: data.mixed_influencer_handle,
        avatar: data.mixed_influencer_avatar,
        description: data.mixed_influencer_description,
        style: data.mixed_influencer_style,
        followers: data.mixed_influencer_followers,
        category: data.mixed_influencer_category,
        sampleTweets: []
      } : undefined,
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
}

// Export singleton instance
export const neonService = new NeonService(); 