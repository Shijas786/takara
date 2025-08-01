'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ApiTestResult {
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function ApiTestPanel() {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([
    { name: 'OpenAI', status: 'idle' },
    { name: 'Farcaster', status: 'idle' },
    { name: 'Neynar', status: 'idle' },
    { name: 'Coinbase', status: 'idle' },
    { name: 'Supabase', status: 'idle' },
  ]);

  const updateTestResult = (name: string, status: ApiTestResult['status'], message?: string, data?: any) => {
    setTestResults(prev => 
      prev.map(result => 
        result.name === name 
          ? { ...result, status, message, data }
          : result
      )
    );
  };

  const testOpenAI = async () => {
    updateTestResult('OpenAI', 'loading');
    try {
      const response = await fetch('/api/openai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Hello, this is a test message.' }),
      });
      
      if (response.ok) {
        const data = await response.json();
        updateTestResult('OpenAI', 'success', 'API connection successful', data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'API connection failed';
        updateTestResult('OpenAI', 'error', errorMessage);
      }
    } catch (error) {
      updateTestResult('OpenAI', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testFarcaster = async () => {
    updateTestResult('Farcaster', 'loading');
    try {
      const response = await fetch('/api/farcaster/test');
      
      if (response.ok) {
        const data = await response.json();
        updateTestResult('Farcaster', 'success', 'API connection successful', data);
      } else {
        updateTestResult('Farcaster', 'error', 'API connection failed');
      }
    } catch (error) {
      updateTestResult('Farcaster', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testNeynar = async () => {
    updateTestResult('Neynar', 'loading');
    try {
      const response = await fetch('/api/neynar/feed?type=trending&limit=5');
      
      if (response.ok) {
        const data = await response.json();
        updateTestResult('Neynar', 'success', 'API connection successful', data);
      } else {
        updateTestResult('Neynar', 'error', 'API connection failed');
      }
    } catch (error) {
      updateTestResult('Neynar', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testCoinbase = async () => {
    updateTestResult('Coinbase', 'loading');
    try {
      const response = await fetch('/api/coinbase/accounts');
      
      if (response.ok) {
        const data = await response.json();
        updateTestResult('Coinbase', 'success', 'API connection successful', data);
      } else {
        updateTestResult('Coinbase', 'error', 'API connection failed');
      }
    } catch (error) {
      updateTestResult('Coinbase', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testSupabase = async () => {
    updateTestResult('Supabase', 'loading');
    try {
      const response = await fetch('/api/supabase/test');
      
      if (response.ok) {
        const data = await response.json();
        updateTestResult('Supabase', 'success', 'Database connection successful', data);
      } else {
        updateTestResult('Supabase', 'error', 'Database connection failed');
      }
    } catch (error) {
      updateTestResult('Supabase', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAllTests = async () => {
    await Promise.all([
      testOpenAI(),
      testFarcaster(),
      testNeynar(),
      testCoinbase(),
      testSupabase(),
    ]);
  };

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 API Integration Test Panel
        </CardTitle>
        <CardDescription>
          Test all API integrations to ensure they&apos;re properly configured
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Results */}
        <div className="space-y-3">
          {testResults.map((result) => (
            <div key={result.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <span className="font-medium">{result.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(result.status)}
                {result.message && (
                  <span className="text-sm text-gray-500">{result.message}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={runAllTests} className="flex-1">
            Test All APIs
          </Button>
          <Button onClick={testOpenAI} variant="outline">
            Test OpenAI
          </Button>
          <Button onClick={testFarcaster} variant="outline">
            Test Farcaster
          </Button>
          <Button onClick={testNeynar} variant="outline">
            Test Neynar
          </Button>
          <Button onClick={testCoinbase} variant="outline">
            Test Coinbase
          </Button>
          <Button onClick={testSupabase} variant="outline">
            Test Supabase
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Setup Instructions:
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Copy <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.example</code> to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code></li>
            <li>2. Add your API keys to the environment file</li>
            <li>3. Restart the development server</li>
            <li>4. Run the tests above to verify connections</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 