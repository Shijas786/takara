'use client';

import React, { useState } from 'react';

export default function SimpleTest() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>🧪 React Test Page</h1>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        margin: '20px auto',
        maxWidth: '500px'
      }}>
        <h2>React is working! 🎉</h2>
        
        <p>If you can see this, React is loading correctly.</p>
        
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              background: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Click me! Count: {count}
          </button>
        </div>
        
        <p>If the button works, React is fully functional.</p>
        
        <div style={{ marginTop: '20px' }}>
          <a 
            href="/" 
            style={{ 
              color: '#ffd700', 
              textDecoration: 'none',
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '5px'
            }}
          >
            ← Back to Main App
          </a>
        </div>
      </div>
    </div>
  );
} 