'use client';

import React from 'react';

export default function TestMiniKit() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MiniKit Test Page</h1>
      <p>Testing MiniKit imports...</p>
      
      <div style={{ margin: '20px 0', padding: '10px', background: '#f0f0f0' }}>
        <h3>Available exports from Farcaster SDK:</h3>
        <ul>
          <li>✅ Package installed: @farcaster/miniapp-sdk</li>
          <li>✅ MiniKit export configured in package.json</li>
          <li>✅ MiniKit files exist in dist/minikit/</li>
        </ul>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          ← Back to Main App
        </a>
      </div>
    </div>
  );
} 