'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, QrCode, Smartphone, LogOut, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { SafeImg } from './ui/image';
import ClientOnlyWrapper from './ClientOnlyWrapper';
import { farcasterAPI, neynarAPI, type FarcasterUser, type FarcasterSigner } from '../lib/farcaster';

interface FarcasterAuthProps {
  onUserChange: (user: FarcasterUser | null) => void;
}

export default function FarcasterAuth({ onUserChange }: FarcasterAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const [signer, setSigner] = useState<FarcasterSigner | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [signerName, setSignerName] = useState('Takara Content Evolution');
  const { toast } = useToast();

  const refreshUserInfo = useCallback(async () => {
    if (!farcasterUser?.fid) return;

    try {
      const updatedUser = await neynarAPI.getUserByFid(farcasterUser.fid);
      setFarcasterUser(updatedUser);
      onUserChange(updatedUser);
      localStorage.setItem('takara_farcaster_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Refresh user info error:', error);
    }
  }, [farcasterUser?.fid, onUserChange]);

  const checkSignerStatus = useCallback(async () => {
    if (!signer) return;

    setIsCheckingStatus(true);
    try {
      const updatedSigner = await farcasterAPI.getSignerStatus(signer.signerUuid);
      setSigner(updatedSigner);
      localStorage.setItem('takara_farcaster_signer', JSON.stringify(updatedSigner));

      if (updatedSigner.status === 'approved') {
        toast({
          title: "Signer Approved!",
          description: "Your Farcaster signer has been approved successfully",
        });
        
        // Try to get user info if we have a FID
        if (farcasterUser?.fid) {
          await refreshUserInfo();
        }
      }
    } catch (error) {
      console.error('Check signer status error:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [signer, farcasterUser?.fid, toast, refreshUserInfo]);

  // Load user and signer from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('takara_farcaster_user');
    const savedSigner = localStorage.getItem('takara_farcaster_signer');

    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFarcasterUser(user);
      onUserChange(user);
    }

    if (savedSigner) {
      const signerData = JSON.parse(savedSigner);
      setSigner(signerData);
    }
  }, [onUserChange]);

  // Check signer status periodically
  useEffect(() => {
    if (signer && signer.status === 'pending_approval') {
      const interval = setInterval(() => {
        checkSignerStatus();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [signer, checkSignerStatus]);

  const createSigner = async () => {
    setIsConnecting(true);
    try {
      const newSigner = await farcasterAPI.createSigner(signerName, 'Takara Content Evolution Signer');
      setSigner(newSigner);
      localStorage.setItem('takara_farcaster_signer', JSON.stringify(newSigner));

      // Get QR code for approval
      const qrData = await farcasterAPI.getSignerQR(newSigner.signerUuid);
      setQrCode(qrData.qrCode);
      setQrUrl(qrData.url);

      toast({
        title: "Signer Created",
        description: "Scan the QR code with your Farcaster app to approve the signer",
      });
    } catch (error) {
      console.error('Create signer error:', error);
      toast({
        title: "Signer Creation Failed",
        description: "Failed to create Farcaster signer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setFarcasterUser(null);
      setSigner(null);
      setQrCode('');
      setQrUrl('');
      localStorage.removeItem('takara_farcaster_user');
      localStorage.removeItem('takara_farcaster_signer');
      onUserChange(null);

      toast({
        title: "Signed Out",
        description: "You have been disconnected from Farcaster.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending_approval':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending_removal':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_removal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ClientOnlyWrapper
      fallback={
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Loading Farcaster...</h3>
          </div>
        </Card>
      }
    >
      {!farcasterUser ? (
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Connect to Farcaster</h3>
            <p className="text-slate-300 mb-4">
              Sign in with your Farcaster account to post content directly
            </p>
          </div>

          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="mt-4">
              {!signer ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signer-name" className="text-slate-300">Signer Name</Label>
                    <Input
                      id="signer-name"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="Enter signer name"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button
                    onClick={createSigner}
                    disabled={isConnecting || !signerName.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating Signer...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 mr-2" />
                        Create Signer & Show QR
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      {getStatusIcon(signer.status)}
                      <Badge className={`ml-2 ${getStatusColor(signer.status)}`}>
                        {signer.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {qrCode && signer.status === 'pending_approval' && (
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                        </div>
                        <p className="text-slate-300 text-sm">
                          Scan this QR code with your Farcaster app to approve the signer
                        </p>
                        <Button
                          onClick={checkSignerStatus}
                          disabled={isCheckingStatus}
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          {isCheckingStatus ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Check Status
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {signer.status === 'approved' && (
                      <div className="space-y-4">
                        <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
                          <p className="text-green-400 text-sm">
                            ✅ Signer approved! You can now post to Farcaster.
                          </p>
                        </div>
                        <p className="text-slate-300 text-sm">
                          Your signer is ready. You can now use Takara to post content to Farcaster.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 text-sm">
                    For manual setup, you&apos;ll need to create a signer through the Farcaster API directly.
                  </p>
                </div>
                <p className="text-slate-300 text-sm">
                  This feature is coming soon. For now, please use the QR code method above.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600 flex items-center justify-center">
                <SafeImg 
                  src={farcasterUser.pfp || 'https://placehold.co/150x150'} 
                  alt={farcasterUser.displayName}
                  className="w-full h-full"
                  width={40}
                  height={40}
                  fallbackSrc="https://placehold.co/150x150"
                />
              </div>
              <div>
                <p className="text-white font-medium">@{farcasterUser.username}</p>
                <p className="text-slate-400 text-sm">{farcasterUser.displayName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                  <span className="text-slate-400 text-xs">
                    FID: {farcasterUser.fid}
                  </span>
                  {signer && (
                    <Badge className={getStatusColor(signer.status)}>
                      {getStatusIcon(signer.status)}
                      <span className="ml-1">{signer.status.replace('_', ' ')}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={refreshUserInfo}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </ClientOnlyWrapper>
  );
} 