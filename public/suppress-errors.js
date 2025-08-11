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
  const originalInfo = console.info;
  const originalDebug = console.debug;
  const originalLog = console.log;

  // Helpers
  const isString = (v) => typeof v === 'string';
  const includesAny = (text, substrings) => substrings.some((s) => text.includes(s));
  const COINBASE_PATTERNS = [
    'cca-lite.coinbase.com/metrics',
    'coinbase',
    'net::ERR_ABORTED 401'
  ];
  const NIGHTLY_PATTERNS = ['Nightly Wallet Injected Successfully'];

  const shouldSuppressMessage = (args) => {
    try {
      const first = args && args[0];
      if (isString(first) && includesAny(first, COINBASE_PATTERNS)) return true;
      const combined = args.map((a) => (isString(a) ? a : JSON.stringify(a))).join(' ');
      if (includesAny(combined, COINBASE_PATTERNS)) return true;
      if (includesAny(combined, NIGHTLY_PATTERNS)) return true;
    } catch (_) {
      // no-op
    }
    return false;
  };

  // Suppress Coinbase analytics and Nightly noise in console.error
  const suppressConsoleError = (args) => {
    if (shouldSuppressMessage(args)) {
      return; // swallow
    }
    return originalError.apply(console, args);
  };

  // Suppress Farcaster SDK deprecation warnings
  const suppressFarcasterDeprecation = (args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('@farcaster/frame-sdk is deprecated')) {
      return; // Suppress this warning
    }
    if (shouldSuppressMessage(args)) {
      return; // Swallow Coinbase/Nightly noise as warn
    }
    return originalWarn.apply(console, args);
  };

  // Override console methods
  console.error = function(...args) {
    suppressConsoleError(args);
  };

  console.warn = function(...args) {
    suppressFarcasterDeprecation(args);
  };

  console.info = function(...args) {
    if (shouldSuppressMessage(args)) return;
    return originalInfo.apply(console, args);
  };

  console.debug = function(...args) {
    if (shouldSuppressMessage(args)) return;
    return originalDebug.apply(console, args);
  };

  console.log = function(...args) {
    if (shouldSuppressMessage(args)) return;
    return originalLog.apply(console, args);
  };

  // Add error boundary for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const { reason } = event;
    
    // Suppress Coinbase analytics errors
    if (reason && reason.message && includesAny(reason.message, COINBASE_PATTERNS)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      return;
    }
    
    // Suppress network errors that don't affect functionality
    if (reason && reason.message && reason.message.includes('net::ERR_ABORTED')) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      return;
    }
  }, true);

  // Add error boundary for general errors
  window.addEventListener('error', (event) => {
    const { message, filename } = event;
    
    // Suppress Coinbase analytics errors
    if ((message && includesAny(message, COINBASE_PATTERNS)) || (filename && includesAny(filename, COINBASE_PATTERNS))) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      return;
    }
    
    // Suppress network errors that don't affect functionality
    if (message && message.includes('net::ERR_ABORTED')) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      return;
    }
  }, true);

  // Only log once in development environments
  try {
    const isProd = ['production', 'prod'].includes(String(process?.env?.NODE_ENV || '').toLowerCase());
    if (!isProd) {
      originalLog('Error suppression script loaded - suppressing non-critical errors');
    }
  } catch (_) {
    // safest fallback
    originalLog('Error suppression script loaded - suppressing non-critical errors');
  }

})(); 