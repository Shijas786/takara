import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export interface User {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  followers: number
  following: number
  bio: string
  verified: boolean
}

export interface Cast {
  id: string
  author: User
  text: string
  timestamp: string
  likes: number
  recasts: number
  replies: number
  embeds?: string[]
  parentCast?: Cast
}

export const mockUser: User = {
  fid: 12345,
  username: 'demo_user',
  displayName: 'Demo User',
  pfpUrl: '',
  followers: 2847,
  following: 892,
  bio: 'Building the future of content creation on Farcaster 🚀',
  verified: true
}

export const mockCasts: Cast[] = [
  {
    id: "1",
    author: mockUser,
    text: "Just launched our new AI-powered content generator! 🎉 The future of Farcaster content creation is here. What do you think?",
    timestamp: "2024-01-15T10:30:00Z",
    likes: 156,
    recasts: 23,
    replies: 12,
    embeds: ["https://example.com/image1.jpg"]
  },
  {
    id: "2",
    author: {
      ...mockUser,
      username: 'crypto_enthusiast',
      displayName: 'Crypto Enthusiast',
      followers: 15420
    },
    text: "Base chain is absolutely crushing it right now! 🚀 The ecosystem is growing faster than ever. Who else is bullish on Base?",
    timestamp: "2024-01-15T09:15:00Z",
    likes: 342,
    recasts: 67,
    replies: 28
  },
  {
    id: "3",
    author: {
      ...mockUser,
      username: 'web3_builder',
      displayName: 'Web3 Builder',
      followers: 8921
    },
    text: "Building in public is the best way to learn and grow. Sharing my journey building on Farcaster and the amazing community here! 💪",
    timestamp: "2024-01-15T08:45:00Z",
    likes: 89,
    recasts: 15,
    replies: 7
  },
  {
    id: "4",
    author: {
      ...mockUser,
      username: 'defi_explorer',
      displayName: 'DeFi Explorer',
      followers: 12345
    },
    text: "The DeFi landscape is evolving rapidly. What protocols are you most excited about right now? Let's discuss! 🤔",
    timestamp: "2024-01-15T07:30:00Z",
    likes: 234,
    recasts: 45,
    replies: 31
  },
  {
    id: "5",
    author: {
      ...mockUser,
      username: 'nft_collector',
      displayName: 'NFT Collector',
      followers: 5678
    },
    text: "Just discovered some incredible art on Farcaster! The creativity in this community is unmatched. What's your favorite piece? 🎨",
    timestamp: "2024-01-15T06:20:00Z",
    likes: 178,
    recasts: 34,
    replies: 19
  }
]

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'now'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d`
  
  return date.toLocaleDateString()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Type Guard to check if a value is a valid React element
 * This prevents "Objects are not valid as a React child" errors
 */
export function isValidReactElement(node: any): node is React.ReactElement {
  try {
    return (
      typeof node === 'object' && 
      node !== null && 
      '$$typeof' in node && 
      node.$$typeof === Symbol.for('react.element') &&
      'type' in node &&
      'props' in node
    );
  } catch (error) {
    console.error('Error in isValidReactElement:', error);
    return false;
  }
}

/**
 * Safe render function that checks if a value is a valid React element
 * Returns the element if valid, or a fallback if not
 */
export function safeRender(
  element: any, 
  fallback: React.ReactNode = null
): React.ReactNode {
  try {
    // Handle null and undefined
    if (element === null || element === undefined) {
      return fallback;
    }
    
    // If it's already a valid React element, return it directly
    if (isValidReactElement(element)) {
      return element;
    }
    
    // If it's a string, number, or other primitive, return it
    if (typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean') {
      return element;
    }
    
    // If it's an object with React element properties, it might be a React element object
    // that wasn't properly created - return fallback
    if (typeof element === 'object' && element !== null) {
      if (element.$$typeof || element.type || element.props) {
        console.warn('Detected React element object, returning fallback:', element);
        return fallback;
      }
    }
    
    // For any other case (objects, functions, arrays, etc.), return the fallback
    return fallback;
  } catch (error) {
    console.error('Error in safeRender:', error);
    return fallback;
  }
}

/**
 * Wallet conflict resolution utility
 * Helps prevent conflicts between multiple wallet extensions
 */
export function getWalletProvider() {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check for Coinbase Wallet first
  if (window.ethereum?.isCoinbaseWallet) {
    return window.ethereum;
  }

  // Check for MetaMask
  if (window.ethereum?.isMetaMask) {
    return window.ethereum;
  }

  // Check for Nightly Wallet
  if (window.ethereum?.isNightly) {
    return window.ethereum;
  }

  // Return the first available ethereum provider
  return window.ethereum || null;
}
