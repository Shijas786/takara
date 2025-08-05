'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { useMiniApp } from '@neynar/react';

interface MiniAppUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export default function WarpcastMiniAppReal() {
  const miniApp = useMiniApp();
  const [user, setUser] = useState<MiniAppUser | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  useEffect(() => {
    // Mini App context is automatically available when running in Warpcast
    if (miniApp?.context?.user) {
      setUser({
        fid: miniApp.context.user.fid,
        username: miniApp.context.user.username,
        displayName: miniApp.context.user.displayName || miniApp.context.user.username,
        pfpUrl: miniApp.context.user.pfpUrl || '',
      });
    }
  }, [miniApp?.context?.user]);

  const generateContent = async () => {
    if (!postText.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/openai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: postText,
          type: 'farcaster_post',
          maxLength: 280,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.content);
      } else {
        console.error('Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const postToFarcaster = async (text: string) => {
    if (!text.trim() || !miniApp?.actions) return;
    
    setIsPosting(true);
    try {
      const result = await miniApp.actions.composeCast({
        text: text,
        close: false, // Keep the app open after posting
      });

      if (result.cast) {
        console.log('✅ Cast posted successfully:', result.cast);
        setPostText('');
        setGeneratedContent('');
        // You could add a success toast here
      } else {
        console.error('Failed to post cast');
      }
    } catch (error) {
      console.error('Error posting cast:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const enhanceAndPost = async () => {
    if (!postText.trim()) return;
    
    setIsGenerating(true);
    try {
      // Generate enhanced content
      const response = await fetch('/api/openai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Enhance this Farcaster post to be more engaging and viral: "${postText}"`,
          type: 'farcaster_post',
          maxLength: 280,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const enhancedText = data.content;
        
        // Post the enhanced content directly
        await postToFarcaster(enhancedText);
      } else {
        // If generation fails, post the original text
        await postToFarcaster(postText);
      }
    } catch (error) {
      console.error('Error in enhance and post:', error);
      // Fallback to posting original text
      await postToFarcaster(postText);
    } finally {
      setIsGenerating(false);
    }
  };

  // Show loading state while Mini App context loads
  if (!miniApp?.context) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Takara Content Evolution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Loading Warpcast context...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      {user && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Welcome to Takara</span>
              <Badge variant="secondary" className="ml-auto">Mini App</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                {user.pfpUrl ? (
                  <img 
                    src={user.pfpUrl} 
                    alt={user.displayName} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-xs text-gray-400">FID: {user.fid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Generation */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Content Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              What would you like to post about?
            </label>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share your thoughts, ideas, or ask AI to help you create engaging content..."
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {postText.length}/280 characters
              </span>
              <Button 
                onClick={generateContent}
                disabled={!postText.trim() || isGenerating}
                size="sm"
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Enhance
                  </>
                )}
              </Button>
            </div>
          </div>

          {generatedContent && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Enhanced Content:</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">{generatedContent}</p>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button 
                  onClick={() => postToFarcaster(generatedContent)}
                  disabled={isPosting}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isPosting ? 'Posting...' : 'Post Enhanced'}
                </Button>
                <Button 
                  onClick={() => setGeneratedContent('')}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Quick Actions:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => setPostText("Just had an amazing idea! 🤔")}
                variant="outline"
                size="sm"
              >
                💡 Idea
              </Button>
              <Button 
                onClick={() => setPostText("Feeling grateful today... 🙏")}
                variant="outline"
                size="sm"
              >
                🙏 Gratitude
              </Button>
              <Button 
                onClick={() => setPostText("Hot take: ")}
                variant="outline"
                size="sm"
              >
                🔥 Hot Take
              </Button>
              <Button 
                onClick={() => setPostText("Question for the community: ")}
                variant="outline"
                size="sm"
              >
                ❓ Question
              </Button>
            </div>
          </div>

          {/* Direct Post */}
          <div className="border-t pt-4">
            <Button 
              onClick={enhanceAndPost}
              disabled={!postText.trim() || isPosting || isGenerating}
              className="w-full"
            >
              {isPosting || isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isGenerating ? 'Enhancing...' : 'Posting...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enhance & Post
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 