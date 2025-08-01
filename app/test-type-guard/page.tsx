'use client';

import SafeComponentRenderer from '../../components/SafeComponentRenderer';
import { Button } from '../../components/ui/button';
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TestTypeGuardPage() {
  // Example of potentially problematic data that could cause React errors
  const problematicData = [
    // Valid React elements
    <Button key="valid-button">Valid Button</Button>,
    <Sparkles key="valid-icon" className="w-4 h-4" />,
    
    // Invalid objects that could cause "Objects are not valid as a React child" errors
    { type: 'div', props: { children: 'Invalid object' } },
    { $$typeof: 'fake', type: 'div' },
    null,
    undefined,
    'string',
    42,
    [1, 2, 3],
    () => <div>Function component</div>, // Function (not called)
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Type Guard Test Page</h1>
          <p className="text-slate-300">
            Testing Type Guard functionality to prevent React rendering errors
          </p>
        </div>

        {/* Safe Component Renderer with debug mode */}
        <SafeComponentRenderer showDebug={true}>
          <div className="p-4 bg-blue-600 text-white rounded-lg">
            This is a valid React element passed as children
          </div>
        </SafeComponentRenderer>

        {/* Test different types of data */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Testing Different Data Types
          </h2>
          
          <div className="grid gap-4">
            {problematicData.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg">
                <div className="flex-shrink-0">
                  <span className="text-xs font-mono bg-slate-600 px-2 py-1 rounded">
                    {typeof item}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-1">
                    Raw value: {JSON.stringify(item).substring(0, 50)}...
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Rendered:</span>
                    <SafeComponentRenderer fallback={<span className="text-red-400">❌ Invalid</span>}>
                      {item}
                    </SafeComponentRenderer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage examples */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Usage Examples
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <h3 className="font-medium text-green-400 mb-2">✅ Good Practice:</h3>
              <pre className="text-sm text-green-300 bg-green-900/30 p-2 rounded">
{`// Always use safeRender for potentially invalid elements
const element = someFunctionThatMightReturnInvalidElement();
return <div>{safeRender(element, <span>Fallback</span>)}</div>`}
              </pre>
            </div>
            
            <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <h3 className="font-medium text-red-400 mb-2">❌ Bad Practice:</h3>
              <pre className="text-sm text-red-300 bg-red-900/30 p-2 rounded">
{`// This can cause "Objects are not valid as a React child" errors
const element = someFunctionThatMightReturnInvalidElement();
return <div>{element}</div>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 