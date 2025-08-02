import React from 'react';

/**
 * Production-Ready Error Handler
 * Handles React rendering errors and provides fallbacks
 */

interface ErrorInfo {
  componentStack: string;
  error: Error;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCount = 0;
  private readonly MAX_ERRORS = 10;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handles React rendering errors
   */
  handleReactError(error: Error, errorInfo?: ErrorInfo): void {
    this.errorCount++;
    
    // Log the error with context
    console.error('React Error Handler:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      errorCount: this.errorCount,
      timestamp: new Date().toISOString()
    });

    // If too many errors, prevent infinite loops
    if (this.errorCount > this.MAX_ERRORS) {
      console.error('Too many React errors detected, preventing further error handling');
      return;
    }

    // Check if it's a React element object error
    if (error.message.includes('Objects are not valid as a React child')) {
      this.handleReactElementError(error, errorInfo);
    }
  }

  /**
   * Specifically handles React element object errors
   */
  private handleReactElementError(error: Error, errorInfo?: ErrorInfo): void {
    console.warn('React Element Object Error Detected:', {
      message: error.message,
      componentStack: errorInfo?.componentStack,
      suggestion: 'Check for React element objects being passed as children'
    });

    // Try to identify the problematic component
    if (errorInfo?.componentStack) {
      const componentMatch = errorInfo.componentStack.match(/at\s+(\w+)/);
      if (componentMatch) {
        console.warn('Problematic component likely:', componentMatch[1]);
      }
    }
  }

  /**
   * Creates a safe fallback component
   */
  createFallbackComponent(error?: Error): React.ReactElement {
    return React.createElement('div', {
      className: 'p-4 bg-red-50 border border-red-200 rounded-lg'
    }, [
      React.createElement('h2', {
        key: 'title',
        className: 'text-red-800 font-medium'
      }, 'Component Error'),
      React.createElement('p', {
        key: 'message',
        className: 'text-red-600 text-sm mt-1'
      }, error?.message || 'An unexpected error occurred')
    ]);
  }

  /**
   * Resets error count (useful for testing)
   */
  resetErrorCount(): void {
    this.errorCount = 0;
  }

  /**
   * Gets current error count
   */
  getErrorCount(): number {
    return this.errorCount;
  }
}

export default ErrorHandler.getInstance(); 