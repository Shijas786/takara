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

// Remove mock demo user to avoid demo labels in UI
export const mockUser: User = {
  fid: 0,
  username: '',
  displayName: '',
  pfpUrl: '',
  followers: 0,
  following: 0,
  bio: '',
  verified: false
}

export const mockCasts: Cast[] = []

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
      (node as any).$$typeof === Symbol.for('react.element') &&
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
      if ((element as any).$$typeof || (element as any).type || (element as any).props) {
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
  if ((window as any).ethereum?.isCoinbaseWallet) {
    return (window as any).ethereum;
  }

  // Check for MetaMask
  if ((window as any).ethereum?.isMetaMask) {
    return (window as any).ethereum;
  }

  // Check for Nightly Wallet
  if ((window as any).ethereum?.isNightly) {
    return (window as any).ethereum;
  }

  // Return the first available ethereum provider
  return (window as any).ethereum || null;
}
