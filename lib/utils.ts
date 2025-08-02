import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Type Guard to check if a value is a valid React element
 * This prevents "Objects are not valid as a React child" errors
 */
export function isValidReactElement(node: any): node is React.ReactElement {
  return (
    typeof node === 'object' && 
    node !== null && 
    '$$typeof' in node && 
    node.$$typeof === Symbol.for('react.element')
  );
}

/**
 * Safe render function that checks if a value is a valid React element
 * Returns the element if valid, or a fallback if not
 */
export function safeRender(
  element: any, 
  fallback: React.ReactNode = null
): React.ReactNode {
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
  
  // For any other case (objects, functions, arrays, etc.), return the fallback
  return fallback;
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
