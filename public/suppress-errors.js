// Error Suppression Script
// This script suppresses common console errors that don't affect functionality

(function() {
  'use strict';

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // Suppress Coinbase analytics errors
  const suppressCoinbaseAnalytics = (args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('cca-lite.coinbase.com/metrics')) {
      return; // Suppress this error
    }
    return originalError.apply(console, args);
  };

  // Suppress Farcaster SDK deprecation warnings
  const suppressFarcasterDeprecation = (args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('@farcaster/frame-sdk is deprecated')) {
      return; // Suppress this warning
    }
    return originalWarn.apply(console, args);
  };

  // Override console methods
  console.error = function(...args) {
    suppressCoinbaseAnalytics(args);
  };

  console.warn = function(...args) {
    suppressFarcasterDeprecation(args);
  };

  // Add error boundary for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const { reason } = event;
    
    // Suppress Coinbase analytics errors
    if (reason && reason.message && reason.message.includes('cca-lite.coinbase.com/metrics')) {
      event.preventDefault();
      return;
    }
    
    // Suppress network errors that don't affect functionality
    if (reason && reason.message && reason.message.includes('net::ERR_ABORTED')) {
      event.preventDefault();
      return;
    }
  });

  // Add error boundary for general errors
  window.addEventListener('error', (event) => {
    const { message, filename } = event;
    
    // Suppress Coinbase analytics errors
    if (message && message.includes('cca-lite.coinbase.com/metrics')) {
      event.preventDefault();
      return;
    }
    
    // Suppress network errors that don't affect functionality
    if (message && message.includes('net::ERR_ABORTED')) {
      event.preventDefault();
      return;
    }
  });

  console.log('Error suppression script loaded - suppressing non-critical errors');

})(); 