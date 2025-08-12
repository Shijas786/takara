'use client';

import React from 'react';
import NeynarMiniAppAuth from '@/components/NeynarMiniAppAuth';

export default function TestMiniKit() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MiniKit Test Page</h1>
      <p>Testing Base MiniKit (OnchainKit) integration...</p>
      <div style={{ margin: '20px 0' }}>
        <NeynarMiniAppAuth />
      </div>
      
      <div style={{ margin: '20px 0', padding: '10px', background: '#f0f0f0' }}>
        <h3>Integration Checklist:</h3>
        <ul>
          <li>✅ Package installed: @coinbase/onchainkit</li>
          <li>✅ Wrapped with MiniKitProvider</li>
          <li>✅ useMiniKit/useAddFrame/useOpenUrl wired on main page</li>
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