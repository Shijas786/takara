'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Wallet, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Key
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
}

interface NeynarFarcasterConnectProps {
  onConnect?: (user: FarcasterUser, signerUuid: string) => void;
  onDisconnect?: () => void;
  generatedContent?: string;
  onPostSuccess?: (castHash: string) => void;
}

export default function NeynarFarcasterConnect({ 
  onConnect, 
  onDisconnect, 
  generatedContent,
  onPostSuccess 
}: NeynarFarcasterConnectProps) {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [signerUuid, setSignerUuid] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState<'idle' | 'posting' | 'success' | 'error'>('idle');
  const [fid, setFid] = useState<string>('');
  const [showFidInput, setShowFidInput] = useState(false);

  // Check if user is already connected on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const storedSignerUuid = localStorage.getItem('neynar_signer_uuid');
      const storedFid = localStorage.getItem('neynar_fid');
      
      if (!storedSignerUuid || !storedFid) {
        setConnectionState('disconnected');
        return;
      }

      // Validate the signer
      const response = await fetch(`/api/neynar/validate-signer?signer_uuid=${storedSignerUuid}`);
      
      if (response.ok) {
        const signerData = await response.json();
        if (signerData.signer && signerData.signer.status === 'approved') {
          // Get user info
          const userResponse = await fetch(`/api/neynar/user?fid=${storedFid}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData.user);
            setSignerUuid(storedSignerUuid);
            setFid(storedFid);
            setConnectionState('connected');
            onConnect?.(userData.user, storedSignerUuid);
          }
        } else {
          // Signer not approved, clear storage
          localStorage.removeItem('neynar_signer_uuid');
          localStorage.removeItem('neynar_fid');
          setConnectionState('disconnected');
        }
      } else {
        // Invalid signer, clear storage
        localStorage.removeItem('neynar_signer_uuid');
        localStorage.removeItem('neynar_fid');
        setConnectionState('disconnected');
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setConnectionState('disconnected');
    }
  };

  const initiateConnection = async () => {
    if (!fid.trim()) {
      setShowFidInput(true);
      return;
    }

    try {
      setConnectionState('connecting');

      // Create a new signer for the FID
      const response = await fetch('/api/neynar/create-signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid: parseInt(fid) }),
      });

      if (!response.ok) {
        throw new Error('Failed to create signer');
      }

      const { signer_uuid, sign_in_url } = await response.json();
      setSignerUuid(signer_uuid);
      setQrCodeUrl(sign_in_url);

      // Start polling for signer approval
      startPolling(signer_uuid);

    } catch (error) {
      console.error('Error initiating connection:', error);
      setConnectionState('error');
    }
  };

  const startPolling = (uuid: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/neynar/validate-signer?signer_uuid=${uuid}`);
        
        if (response.ok) {
          const signerData = await response.json();
          
          if (signerData.signer && signerData.signer.status === 'approved') {
            clearInterval(interval);
            setPollingInterval(null);
            
            // Store the signer UUID and FID
            localStorage.setItem('neynar_signer_uuid', uuid);
            localStorage.setItem('neynar_fid', fid);
            
            // Get user info and complete connection
            await completeConnection(uuid);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    setPollingInterval(interval);

    // Stop polling after 5 minutes
    setTimeout(() => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
        setConnectionState('error');
      }
    }, 300000);
  };

  const completeConnection = async (uuid: string) => {
    try {
      const userResponse = await fetch(`/api/neynar/user?fid=${fid}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
        setConnectionState('connected');
        onConnect?.(userData.user, uuid);
      }
    } catch (error) {
      console.error('Error completing connection:', error);
      setConnectionState('error');
    }
  };

  const disconnect = () => {
    localStorage.removeItem('neynar_signer_uuid');
    localStorage.removeItem('neynar_fid');
    setUser(null);
    setSignerUuid('');
    setFid('');
    setConnectionState('disconnected');
    onDisconnect?.();
  };

  const postToFarcaster = async () => {
    if (!generatedContent || !user || !signerUuid) return;

    try {
      setIsPosting(true);
      setPostStatus('posting');

      const response = await fetch('/api/neynar/post-cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: signerUuid,
          text: generatedContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post to Farcaster');
      }

      const { cast } = await response.json();
      setPostStatus('success');
      onPostSuccess?.(cast.hash);

      // Reset status after 3 seconds
      setTimeout(() => {
        setPostStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Error posting to Farcaster:', error);
      setPostStatus('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setPostStatus('idle');
      }, 5000);
    } finally {
      setIsPosting(false);
    }
  };

  const openSignerUrl = () => {
    if (qrCodeUrl) {
      window.open(qrCodeUrl, '_blank');
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center space-x-3 mb-4">
        <MessageCircle className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Farcaster Connection (Neynar)</h3>
        {connectionState === 'connected' && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Connected
          </Badge>
        )}
      </div>

      {connectionState === 'disconnected' && (
        <div className="text-center space-y-4">
          <div className="p-4 bg-white rounded-lg border-2 border-dashed border-purple-300">
            <Key className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              Connect your Farcaster wallet using Neynar to post your evolved content directly to Farcaster
            </p>
            
            {showFidInput ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your Farcaster ID (FID)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 12345"
                    value={fid}
                    onChange={(e) => setFid(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can find your FID on <a href="https://warpcast.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Warpcast</a>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={initiateConnection}
                    disabled={!fid.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button 
                    onClick={() => setShowFidInput(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowFidInput(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Connect Farcaster
              </Button>
            )}
          </div>
        </div>
      )}

      {connectionState === 'connecting' && (
        <div className="text-center space-y-4">
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Sign with Your Wallet</h4>
            <p className="text-sm text-gray-600 mb-4">
              Scan the QR code with your wallet to approve the connection
            </p>
            
            {qrCodeUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <QRCodeSVG 
                    value={qrCodeUrl} 
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <Button 
                  onClick={openSignerUrl}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Wallet
                </Button>
                <p className="text-xs text-gray-500">
                  Waiting for wallet signature... This may take a few moments
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {connectionState === 'connected' && user && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-green-200">
            <img 
              src={user.pfp} 
              alt={user.displayName}
              className="w-12 h-12 rounded-full border-2 border-green-300"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{user.displayName}</h4>
              <p className="text-sm text-gray-600">@{user.username} (FID: {user.fid})</p>
              <div className="flex space-x-4 mt-1">
                <span className="text-xs text-gray-500">
                  {user.followerCount} followers
                </span>
                <span className="text-xs text-gray-500">
                  {user.followingCount} following
                </span>
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>

          {generatedContent && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-700 mb-2">Generated Content:</p>
                <p className="text-sm text-gray-900">{generatedContent}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={postToFarcaster}
                  disabled={isPosting || postStatus === 'posting'}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Post to Farcaster
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={disconnect}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Disconnect
                </Button>
              </div>

              {postStatus === 'success' && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Successfully posted to Farcaster!</span>
                </div>
              )}

              {postStatus === 'error' && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-800">Failed to post to Farcaster. Please try again.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {connectionState === 'error' && (
        <div className="text-center space-y-4">
          <div className="p-4 bg-white rounded-lg border border-red-200">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Connection Failed</h4>
            <p className="text-sm text-gray-600 mb-4">
              Failed to connect to Farcaster. Please try again.
            </p>
            <div className="flex space-x-2 justify-center">
              <Button 
                onClick={() => setConnectionState('disconnected')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 