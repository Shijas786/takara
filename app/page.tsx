'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, TrendingUp, Settings, Edit3, Copy, Share2, RefreshCw, MessageCircle, Clock, BarChart3 } from 'lucide-react';
import { useMiniKit, useAddFrame, useOpenUrl, useClose, usePrimaryButton, useViewProfile, useNotification } from '@coinbase/onchainkit/minikit';
import ContentEnhancer from '../components/ContentEnhancer';
import AutoPostManager from '../components/AutoPostManager';

interface AutoPostSettings {
  enabled: boolean;
  dailyLimit: number;
  scheduleTime: string;
  timezone: string;
  autoEnhance: boolean;
  maxRetries: number;
  retryDelay: number;
}

interface ParticleData {
  id: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  z: string;
  size: string;
}

interface OrbData {
  id: number;
  width: string;
  height: string;
  left: string;
  top: string;
  delay: string;
  duration: string;
  z: string;
  opacity: string;
}

export default function Home() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const close = useClose();
  const viewProfile = useViewProfile();
  const sendNotification = useNotification();
  
  const [farcasterFid, setFarcasterFid] = useState<string | null>(null);
  const [autoPostSettings, setAutoPostSettings] = useState<AutoPostSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'enhance' | 'history' | 'settings' | 'auto-post'>('enhance');
  const [notificationSent, setNotificationSent] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [orbs, setOrbs] = useState<OrbData[]>([]);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate random particles and orbs on client side only
  useEffect(() => {
    if (!isClient) return;

    // Generate particles
    const particleData: ParticleData[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${i * 0.5}s`,
      duration: `${3 + Math.random() * 2}s`,
      z: `${Math.random() * 200 - 100}px`,
      size: `${1 + Math.random()}px`
    }));

    // Generate orbs
    const orbData: OrbData[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      width: `${60 + Math.random() * 80}px`,
      height: `${60 + Math.random() * 80}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${i * 0.8}s`,
      duration: `${4 + Math.random() * 3}s`,
      z: `${Math.random() * 300 - 150}px`,
      opacity: `${0.1 + Math.random() * 0.2}`
    }));

    setParticles(particleData);
    setOrbs(orbData);
  }, [isClient]);

  // Set frame ready when component mounts
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Set up primary button for content enhancement
  usePrimaryButton(
    { text: 'KAI YOUR CONTENT' },
    () => {
      // Trigger content enhancement
      const enhanceButton = document.querySelector('[data-enhance-button]') as HTMLButtonElement;
      if (enhanceButton) {
        enhanceButton.click();
      }
    }
  );

  const handleFarcasterConnect = (fid: string, settings: AutoPostSettings) => {
    setFarcasterFid(fid);
    setAutoPostSettings(settings);
  };

  const handlePostGenerated = (post: any) => {
    console.log('Post generated:', post);
    
    // Send notification if user has added the frame
    if (context?.client.added && !notificationSent) {
      sendNotification({
        title: 'Content Kai Complete! 🦋',
        body: 'Your content has evolved to viral potential!'
      });
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 30000);
    }
  };

  const handleAddFrame = async () => {
    const result = await addFrame();
    if (result) {
      console.log('Frame added:', result.url, result.token);
      // In production, save these to your database
    }
  };

  const handleViewProfile = () => {
    viewProfile();
  };

  const handleSendNotification = async () => {
    try {
      await sendNotification({
        title: 'Kai Evolution Complete! 🦋',
        body: 'Your content has reached its final form!'
      });
      setTimeout(() => setNotificationSent(false), 30000);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 3D Floating Particles */}
        {isClient && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-float-3d"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              transform: `translateZ(${particle.z})`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
          />
        ))}

        {/* 3D Gradient Orbs */}
        {isClient && orbs.map((orb) => (
          <div
            key={`orb-${orb.id}`}
            className="absolute rounded-full animate-orb-3d"
            style={{
              width: orb.width,
              height: orb.height,
              left: orb.left,
              top: orb.top,
              background: `radial-gradient(circle, rgba(59, 130, 246, ${orb.opacity}) 0%, rgba(99, 102, 241, ${parseFloat(orb.opacity) * 0.5}) 100%)`,
              animationDelay: orb.delay,
              animationDuration: orb.duration,
              transform: `translateZ(${orb.z})`,
              filter: 'blur(20px)'
            }}
          />
        ))}

        {/* 3D Grid */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`grid-${i}`}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-grid-line"
              style={{
                top: `${i * 10}%`,
                animationDelay: `${i * 0.1}s`,
                transform: `translateZ(${i * 10 - 50}px)`
              }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`grid-v-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-grid-line"
              style={{
                left: `${i * 10}%`,
                animationDelay: `${i * 0.1}s`,
                transform: `translateZ(${i * 10 - 50}px)`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/90 via-blue-800/90 to-indigo-800/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-blue-400/20 animate-float-3d">
          {/* 3D Header */}
          <div className="relative overflow-hidden">
            {/* 3D Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 animate-gradient-3d"></div>
            
            {/* 3D Sparkles */}
            {isClient && Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-blue-200 rounded-full animate-sparkle-3d"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  transform: `translateZ(${Math.random() * 50}px)`,
                  boxShadow: '0 0 10px rgba(147, 197, 253, 0.8)'
                }}
              />
            ))}

            {/* Header Content */}
            <div className="relative p-6 text-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* 3D Kai Logo */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-300/50 animate-logo-3d">
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* 3D Butterfly wings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-3 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full transform rotate-12 animate-butterfly-3d-left shadow-lg" />
                          <div className="w-6 h-3 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full transform -rotate-12 animate-butterfly-3d-right shadow-lg" />
                        </div>
                        {/* 3D Center sparkle */}
                        <div className="relative z-10">
                          <Sparkles className="w-5 h-5 text-blue-200 animate-sparkle-3d drop-shadow-lg" />
                        </div>
                      </div>
                    </div>
                    {/* 3D Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-xl blur-lg animate-glow-3d"></div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-blue-100">Kai</h1>
                    <p className="text-sm opacity-90 font-medium text-blue-200">Content Evolution</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {context?.client.added && (
                    <button
                      type="button"
                      onClick={handleSendNotification}
                      className="cursor-pointer bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-lg font-semibold text-sm hover:bg-blue-500/30 transition-all border border-blue-400/30 hover:scale-105 text-blue-100 animate-button-3d"
                    >
                      NOTIFY
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleViewProfile}
                    className="cursor-pointer bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-lg font-semibold text-sm hover:bg-blue-500/30 transition-all border border-blue-400/30 hover:scale-105 text-blue-100 animate-button-3d"
                  >
                    PROFILE
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-lg font-semibold text-sm hover:bg-blue-500/30 transition-all border border-blue-400/30 hover:scale-105 text-blue-100 animate-button-3d"
                    onClick={close}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-blue-400/30 bg-gradient-to-r from-blue-700/50 to-indigo-700/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('enhance')}
              className={`flex-1 py-4 px-4 text-sm font-medium transition-all duration-300 animate-tab-3d ${
                activeTab === 'enhance'
                  ? 'text-blue-200 border-b-2 border-blue-300 bg-blue-600/30 shadow-sm'
                  : 'text-blue-300 hover:text-blue-100 hover:bg-blue-600/20'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className={`w-4 h-4 ${activeTab === 'enhance' ? 'animate-pulse' : ''}`} />
                <span>Kai</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('auto-post')}
              className={`flex-1 py-4 px-4 text-sm font-medium transition-all duration-300 animate-tab-3d ${
                activeTab === 'auto-post'
                  ? 'text-blue-200 border-b-2 border-blue-300 bg-blue-600/30 shadow-sm'
                  : 'text-blue-300 hover:text-blue-100 hover:bg-blue-600/20'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className={`w-4 h-4 ${activeTab === 'auto-post' ? 'animate-pulse' : ''}`} />
                <span>Auto-Post</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 bg-gradient-to-br from-blue-800/80 to-indigo-800/80 backdrop-blur-sm">
            {activeTab === 'enhance' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-blue-100 mb-2">Content Kai Evolution</h2>
                  <p className="text-sm text-blue-200 mb-4">
                    Paste your idea, thought, or reply — and let Kai rework it using real styles from top crypto influencers. Whether it's a sharp quote, spicy reply, or a viral CTA, Kai evolves your words for maximum impact.
                  </p>
                  <p className="text-sm text-blue-300 font-medium">
                    🦋 Link your Farcaster to save and post instantly.
                  </p>
                </div>

                <ContentEnhancer
                  farcasterFid={farcasterFid}
                  onPostGenerated={handlePostGenerated}
                />

                {/* Add Frame Button */}
                {!context?.client.added && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handleAddFrame}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-blue-100 px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 animate-button-3d border border-blue-400/30"
                    >
                      Add to Mini Apps
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'auto-post' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-blue-100 mb-2">Auto-Posting Evolution</h2>
                  <p className="text-sm text-blue-200">
                    Automatically evolve and post content to Base Wallet
                  </p>
                </div>

                {!farcasterFid ? (
                  <div className="bg-gradient-to-r from-blue-700/50 to-indigo-700/50 border border-blue-400/30 rounded-xl p-4 text-center backdrop-blur-sm animate-pulse">
                    <MessageCircle className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-200 mb-1">Connect Farcaster First</h3>
                    <p className="text-sm text-blue-300">
                      Connect your Farcaster account to enable auto-posting evolution
                    </p>
                  </div>
                ) : (
                  <AutoPostManager
                    farcasterFid={farcasterFid}
                    settings={autoPostSettings || {
                      enabled: false,
                      dailyLimit: 5,
                      scheduleTime: '09:00',
                      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      autoEnhance: true,
                      maxRetries: 3,
                      retryDelay: 5
                    }}
                    onSettingsChange={(newSettings) => {
                      setAutoPostSettings(newSettings);
                      // Save to database
                      if (farcasterFid) {
                        // You can save settings here
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 flex items-center w-screen max-w-[520px] justify-center">
          <button
            type="button"
            className="mt-4 px-3 py-2 flex justify-start rounded-2xl font-semibold opacity-60 border border-blue-400/30 text-xs bg-blue-800/80 backdrop-blur-sm hover:opacity-80 transition-opacity text-blue-200 animate-footer-3d"
            onClick={() => openUrl('https://base.org/builders/minikit')}
          >
            BUILT WITH MINIKIT
          </button>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float-3d {
          0%, 100% {
            transform: translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: translateY(-20px) translateZ(20px) rotateX(5deg) rotateY(5deg);
          }
          50% {
            transform: translateY(-10px) translateZ(40px) rotateX(-5deg) rotateY(-5deg);
          }
          75% {
            transform: translateY(-30px) translateZ(20px) rotateX(10deg) rotateY(-10deg);
          }
        }

        @keyframes orb-3d {
          0%, 100% {
            transform: translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1);
          }
          33% {
            transform: translateZ(50px) rotateX(120deg) rotateY(120deg) scale(1.1);
          }
          66% {
            transform: translateZ(-30px) rotateX(240deg) rotateY(240deg) scale(0.9);
          }
        }

        @keyframes sparkle-3d {
          0%, 100% {
            transform: translateZ(0px) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateZ(30px) scale(1.5) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes grid-line {
          0%, 100% {
            opacity: 0.2;
            transform: translateZ(0px);
          }
          50% {
            opacity: 0.8;
            transform: translateZ(20px);
          }
        }

        @keyframes gradient-3d {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
            transform: translateZ(0px);
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
            transform: translateZ(10px);
          }
        }

        @keyframes logo-3d {
          0%, 100% {
            transform: translateZ(0px) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateZ(20px) rotateX(5deg) rotateY(5deg);
          }
        }

        @keyframes butterfly-3d-left {
          0%, 100% {
            transform: rotateZ(12deg) translateZ(0px);
          }
          50% {
            transform: rotateZ(15deg) translateZ(10px);
          }
        }

        @keyframes butterfly-3d-right {
          0%, 100% {
            transform: rotateZ(-12deg) translateZ(0px);
          }
          50% {
            transform: rotateZ(-15deg) translateZ(10px);
          }
        }

        @keyframes glow-3d {
          0%, 100% {
            transform: translateZ(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateZ(30px) scale(1.2);
            opacity: 0.6;
          }
        }

        @keyframes button-3d {
          0%, 100% {
            transform: translateZ(0px);
          }
          50% {
            transform: translateZ(5px);
          }
        }

        @keyframes tab-3d {
          0%, 100% {
            transform: translateZ(0px);
          }
          50% {
            transform: translateZ(3px);
          }
        }

        @keyframes footer-3d {
          0%, 100% {
            transform: translateZ(0px);
          }
          50% {
            transform: translateZ(2px);
          }
        }

        .animate-float-3d {
          animation: float-3d 6s ease-in-out infinite;
        }

        .animate-orb-3d {
          animation: orb-3d 8s ease-in-out infinite;
        }

        .animate-sparkle-3d {
          animation: sparkle-3d 3s ease-in-out infinite;
        }

        .animate-grid-line {
          animation: grid-line 4s ease-in-out infinite;
        }

        .animate-gradient-3d {
          animation: gradient-3d 4s ease-in-out infinite;
        }

        .animate-logo-3d {
          animation: logo-3d 4s ease-in-out infinite;
        }

        .animate-butterfly-3d-left {
          animation: butterfly-3d-left 2s ease-in-out infinite;
        }

        .animate-butterfly-3d-right {
          animation: butterfly-3d-right 2s ease-in-out infinite;
        }

        .animate-glow-3d {
          animation: glow-3d 3s ease-in-out infinite;
        }

        .animate-button-3d {
          animation: button-3d 2s ease-in-out infinite;
        }

        .animate-tab-3d {
          animation: tab-3d 3s ease-in-out infinite;
        }

        .animate-footer-3d {
          animation: footer-3d 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 