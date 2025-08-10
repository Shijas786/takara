'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, LogOut, MessageCircle, Send, QrCode, Loader2 } from 'lucide-react';
import { useMiniApp } from '@neynar/react';
import { 
  getStoredAuth, 
  setStoredAuth, 
  clearStoredAuth, 
  isAuthenticated,
  getActiveSigner,
  StoredAuthState 
} from '../lib/neynar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { QRCodeCanvas } from 'qrcode.react';

interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  profile: {
    bio: { text: string };
    location?: any;
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
    primary: {
      eth_address: string;
      sol_address: string;
    };
  };
  power_badge: boolean;
  score: number;
}

export default function RealFarcasterAuth() {
  const miniApp = useMiniApp();
  const [storedAuth, setStoredAuthState] = useState<StoredAuthState | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [signerApprovalUrl, setSignerApprovalUrl] = useState('');
  const [currentSignerUuid, setCurrentSignerUuid] = useState('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Determine which flow to use
  const useBackendFlow = miniApp?.context === undefined;

  useEffect(() => {
    // Load stored authentication state
    const auth = getStoredAuth();
    setStoredAuthState(auth);
  }, []);

  useEffect(() => {
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const generateNonce = async () => {
    try {
      const response = await fetch('/api/auth/nonce');
      const data = await response.json();
      return data.nonce;
    } catch (error) {
      console.error('Error generating nonce:', error);
      throw error;
    }
  };

  const createSigner = async () => {
    try {
      const response = await fetch('/api/auth/signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating signer:', error);
      throw error;
    }
  };

  const checkSignerStatus = async (signerUuid: string) => {
    try {
      const response = await fetch(`/api/auth/signer?signerUuid=${signerUuid}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking signer status:', error);
      throw error;
    }
  };

  const fetchUserSigners = async (fid: number) => {
    try {
      const response = await fetch(`/api/auth/signers?fid=${fid}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user signers:', error);
      throw error;
    }
  };

  const handleSignerApproval = (approvalUrl: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile && miniApp?.context?.client) {
      // Mobile: Deep link to Farcaster app
      const farcasterUrl = approvalUrl.replace(
        'https://client.farcaster.xyz/deeplinks/signed-key-request',
        'https://farcaster.xyz/~/connect'
      );

      // Use SDK to open URL in Farcaster app
      miniApp.actions.openUrl(farcasterUrl);
    } else {
      // Desktop: Show QR code
      setSignerApprovalUrl(approvalUrl);
      setShowQR(true);
    }
  };

  const startPolling = (signerUuid: string) => {
    const interval = setInterval(async () => {
      try {
        const signerData = await checkSignerStatus(signerUuid);
        
        if (signerData.status === 'approved') {
          // Signer approved, fetch user data and signers
          const userSigners = await fetchUserSigners(signerData.fid);
          
          // Store authentication state
          const authState: StoredAuthState = {
            isAuthenticated: true,
            user: signerData.user,
            signers: userSigners.signers,
          };
          
          setStoredAuth(authState);
          setStoredAuthState(authState);
          setShowQR(false);
          clearInterval(interval);
          setPollingInterval(null);
        }
      } catch (error) {
        console.error('Error polling signer status:', error);
      }
    }, 2000);

    setPollingInterval(interval);
  };

  const handleLogin = async () => {
    setIsConnecting(true);
    
    try {
      if (useBackendFlow) {
        // Backend flow: Create signer and show approval
        const nonce = await generateNonce();
        const signerData = await createSigner();
        
        setCurrentSignerUuid(signerData.signer_uuid);
        handleSignerApproval(signerData.signer_approval_url);
        startPolling(signerData.signer_uuid);
      } else {
        // Mini App flow: Use existing context
        await miniApp.actions.ready();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (useBackendFlow) {
        clearStoredAuth();
        setStoredAuthState(null);
      } else {
        await miniApp.actions.close();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    
    setIsPosting(true);
    try {
      if (useBackendFlow) {
        // Use stored signer for backend flow
        const signer = getActiveSigner();
        if (!signer) {
          throw new Error('No active signer found');
        }

        // For now, we'll use the Mini App SDK for posting
        // In a full implementation, you would use the signer to post via Farcaster protocol
        console.log('Would post cast with signer:', signer.signer_uuid, 'text:', postText);
        // TODO: Implement actual cast posting using the signer
        
        setPostText('');
        // Success toast could be added here
      } else {
        // Mini App flow
        const result = await miniApp.actions.composeCast({
          text: postText,
          close: false,
        });

        if (result.cast) {
          setPostText('');
        }
      }
    } catch (error) {
      console.error('Error posting cast:', error);
    } finally {
      setIsPosting(false);
    }
  };

  // Get current user and authentication status
  const currentUser = useBackendFlow ? storedAuth?.user : miniApp?.context?.user;
  const isUserAuthenticated = useBackendFlow ? isAuthenticated() : !!miniApp?.context?.user;

  if (isUserAuthenticated && currentUser) {
    const cu: any = currentUser; // Narrow for union differences between contexts
    return (
      <>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Connected to Farcaster</span>
              <Badge variant="secondary" className="ml-auto">Connected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                {cu.pfp_url || cu.pfpUrl ? (
                  <img 
                    src={cu.pfp_url || cu.pfpUrl} 
                    alt={cu.display_name || cu.displayName || cu.username} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{cu.display_name || cu.displayName || cu.username}</p>
                <p className="text-sm text-gray-500">@{cu.username}</p>
                <p className="text-xs text-gray-400">FID: {cu.fid}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Disconnect
              </Button>
            </div>

            {/* Post Cast Section */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Post to Farcaster</h4>
              <div className="space-y-2">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  maxLength={320}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {postText.length}/320 characters
                  </span>
                  <Button 
                    onClick={handlePost} 
                    disabled={!postText.trim() || isPosting}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {isPosting ? 'Posting...' : 'Post Cast'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Dialog */}
        <Dialog open={showQR} onOpenChange={setShowQR}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Signer</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <QRCodeCanvas value={signerApprovalUrl} size={256} />
              <p className="text-sm text-gray-600 text-center">
                Scan this QR code with your Warpcast app to approve the signer
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowQR(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Connect to Farcaster</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Connect your Farcaster account using {useBackendFlow ? 'Neynar authentication' : 'Mini App authentication'} to generate and post content directly to your profile.
        </p>
        <Button 
          onClick={handleLogin} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4 mr-2" />
              Connect with {useBackendFlow ? 'Neynar' : 'Farcaster'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 