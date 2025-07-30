'use client';

import { useState, useEffect } from 'react';
import { Clock, Trash2, CheckCircle, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledTime: string;
  timeSlot: string;
  isPosted: boolean;
}

export default function ScheduledPage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedScheduled = localStorage.getItem('kai_scheduled_posts');
    const farcasterToken = localStorage.getItem('farcaster_token');

    if (savedScheduled) {
      setScheduledPosts(JSON.parse(savedScheduled));
    }
    if (farcasterToken) {
      setIsFarcasterConnected(true);
    }
  }, []);

  const deleteScheduledPost = (id: string) => {
    const updatedScheduled = scheduledPosts.filter(post => post.id !== id);
    setScheduledPosts(updatedScheduled);
    localStorage.setItem('kai_scheduled_posts', JSON.stringify(updatedScheduled));
    
    toast({
      title: "Post Deleted",
      description: "Scheduled post has been removed",
    });
  };

  const postNow = async (post: ScheduledPost) => {
    if (!isFarcasterConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your Farcaster account first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/farcaster/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: post.content,
        }),
      });

      if (response.ok) {
        const updatedScheduled = scheduledPosts.map(p => 
          p.id === post.id ? { ...p, isPosted: true } : p
        );
        setScheduledPosts(updatedScheduled);
        localStorage.setItem('kai_scheduled_posts', JSON.stringify(updatedScheduled));
        
        toast({
          title: "Posted Successfully!",
          description: "Your content is now live on Farcaster",
        });
      } else {
        throw new Error('Failed to post');
      }
    } catch (error) {
      toast({
        title: "Post Failed",
        description: "Failed to post to Farcaster",
        variant: "destructive",
      });
    }
  };

  const getTimeSlots = () => ['10:00 AM', '2:00 PM', '8:00 PM'];

  const getScheduledForSlot = (slot: string) => {
    return scheduledPosts.find(post => post.timeSlot === slot && !post.isPosted);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Scheduled Posts</h1>
        <p className="text-slate-300">Manage your scheduled content and posting times</p>
      </div>

      <Card className="p-4 bg-slate-800 border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-white">Farcaster Connection</span>
          </div>
          <Badge variant="secondary" className={isFarcasterConnected ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}>
            {isFarcasterConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
      </Card>

      <div className="grid gap-6">
        {getTimeSlots().map((slot) => {
          const scheduledPost = getScheduledForSlot(slot);
          
          return (
            <Card key={slot} className="p-6 bg-slate-800 border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">{slot}</h3>
                </div>
                <Badge variant="secondary" className={scheduledPost ? "bg-green-900 text-green-300" : "bg-slate-700 text-slate-300"}>
                  {scheduledPost ? 'Scheduled' : 'Available'}
                </Badge>
              </div>

              {scheduledPost ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                    <p className="text-white text-sm mb-2">{scheduledPost.content}</p>
                    <p className="text-xs text-slate-400">
                      Scheduled for: {new Date(scheduledPost.scheduledTime).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={() => postNow(scheduledPost)} disabled={!isFarcasterConnected} className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Post Now
                    </Button>
                    <Button onClick={() => deleteScheduledPost(scheduledPost.id)} variant="outline" size="sm" className="text-red-400 border-red-500 hover:bg-red-900">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-300 mb-4">No post scheduled for this time slot</p>
                  <Button onClick={() => window.location.href = '/'} variant="outline" size="sm" className="text-blue-400 border-blue-500 hover:bg-blue-900">
                    Generate & Schedule
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {scheduledPosts.length === 0 && (
        <Card className="p-12 bg-slate-800 border-slate-700">
          <div className="text-center">
            <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Scheduled Posts</h3>
            <p className="text-slate-300 mb-6">You haven't scheduled any posts yet. Generate some content and schedule it for automatic posting.</p>
            <Button onClick={() => window.location.href = '/'} className="bg-blue-500 hover:bg-blue-600 text-white">
              Generate Content
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
} 