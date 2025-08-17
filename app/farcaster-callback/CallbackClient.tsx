'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function FarcasterCallbackClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          return;
        }

        const response = await fetch('/api/farcaster/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('takara_farcaster_token', data.access_token);
          setStatus('success');
          setMessage('Successfully connected to Farcaster!');
        } else {
          setStatus('error');
          setMessage('Failed to authenticate with Farcaster');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Authentication error occurred');
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Farcaster Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Connecting to Farcaster...</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span>{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <XCircle className="h-6 w-6" />
              <span>{message}</span>
            </div>
          )}

          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
         >
            Return to Takara
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

