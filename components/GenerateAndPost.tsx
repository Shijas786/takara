'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

interface GenerateAndPostProps {
  isLoggedIn: boolean;
  signerUuid: string;
}

export default function GenerateAndPost({ isLoggedIn, signerUuid }: GenerateAndPostProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const handleGenerateAndPost = async () => {
    if (!isLoggedIn || !signerUuid) {
      toast({
        title: "Not Connected",
        description: "Please login to Farcaster first",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setIsPosting(true);

    try {
      // Step 1: Generate content with OpenAI
      const generateResponse = await fetch('/api/post-cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          signer_uuid: signerUuid,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate and post content');
      }

      const { generated_text, cast_hash, cast_url } = await generateResponse.json();
      
      setGeneratedContent(generated_text);
      
      toast({
        title: "Success!",
        description: (
          <div>
            <p>Content generated and posted to Farcaster!</p>
            <a 
              href={cast_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Warpcast →
            </a>
          </div>
        ),
      });

      // Clear the prompt after successful generation
      setPrompt('');

    } catch (error) {
      console.error('Error generating and posting:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate and post content',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setIsPosting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-600">
            Please login to Farcaster to generate and post content
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <Sparkles className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Generate & Post</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your prompt
          </label>
          <Textarea
            placeholder="e.g., Generate a funny crypto shitpost in CT slang about Bitcoin going to the moon..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 resize-none"
            disabled={isGenerating || isPosting}
          />
        </div>

        <Button 
          onClick={handleGenerateAndPost}
          disabled={isGenerating || isPosting || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          {isGenerating || isPosting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isGenerating ? 'Generating...' : 'Posting...'}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate & Post to Farcaster
            </>
          )}
        </Button>

        {generatedContent && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Generated Content:</span>
            </div>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{generatedContent}</p>
          </div>
        )}
      </div>
    </Card>
  );
} 