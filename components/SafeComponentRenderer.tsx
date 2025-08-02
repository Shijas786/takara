'use client';

import React from 'react';
import { isValidReactElement, safeRender } from '../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, AlertTriangle } from 'lucide-react';

interface SafeComponentRendererProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  showDebug?: boolean;
}

/**
 * SafeComponentRenderer - A component that safely renders React elements
 * using Type Guards to prevent "Objects are not valid as a React child" errors
 */
export default function SafeComponentRenderer({ 
  children, 
  fallback = <div className="text-gray-500">Invalid element</div>,
  showDebug = false 
}: SafeComponentRendererProps) {
  // Example of using the Type Guard directly
  const renderWithTypeGuard = (element: any) => {
    if (isValidReactElement(element)) {
      return element;
    }
    return fallback;
  };

  // Example of using the safeRender utility
  const renderWithSafeRender = (element: any) => {
    return safeRender(element, fallback);
  };

  // Example of potentially problematic data
  const potentiallyInvalidElements = [
    <Sparkles key="valid" className="w-4 h-4" />, // Valid React element
    { type: 'div', props: { children: 'Invalid object' } }, // Invalid object
    null, // null
    undefined, // undefined
    'string', // string
    42, // number
    [1, 2, 3], // array
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          Safe Component Renderer
        </CardTitle>
        <CardDescription>
          Demonstrates Type Guard usage to prevent React rendering errors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Render children safely */}
        <div>
          <h3 className="font-medium mb-2">Safely Rendered Children:</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            {children || <span className="text-gray-500">No children provided</span>}
          </div>
        </div>

        {/* Example with Type Guard */}
        <div>
          <h3 className="font-medium mb-2">Type Guard Example:</h3>
          <div className="p-4 bg-blue-50 rounded-lg">
            {renderWithTypeGuard(<Button>Valid Button</Button>)}
          </div>
        </div>

        {/* Example with safeRender utility */}
        <div>
          <h3 className="font-medium mb-2">Safe Render Utility Example:</h3>
          <div className="p-4 bg-green-50 rounded-lg">
            {renderWithSafeRender(<Button variant="outline">Safe Button</Button>)}
          </div>
        </div>

        {/* Debug section showing different types of elements */}
        {showDebug && (
          <div>
            <h3 className="font-medium mb-2">Debug: Testing Different Element Types:</h3>
            <div className="space-y-2">
              {potentiallyInvalidElements.map((element, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                  <span className="text-xs font-mono bg-gray-200 px-1 rounded">
                    {typeof element}
                  </span>
                  <span className="text-xs">
                    {isValidReactElement(element) ? '✅ Valid' : '❌ Invalid'}
                  </span>
                  <div className="flex-1">
                    {isValidReactElement(element) ? element : <span className="text-red-500">Invalid element</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage instructions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Usage Instructions:</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>• Use <code className="bg-yellow-100 px-1 rounded">isValidReactElement()</code> to check if a value is a valid React element</p>
            <p>• Use <code className="bg-yellow-100 px-1 rounded">safeRender()</code> to safely render elements with fallbacks</p>
            <p>• Always wrap potentially invalid elements before rendering</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 