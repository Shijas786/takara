// Wallet Conflict Resolution Script
// This script helps resolve conflicts between multiple wallet extensions

(function() {
  'use strict';

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Function to detect wallet conflicts
  function detectWalletConflicts() {
    const conflicts = [];
    
    // Check for multiple wallet providers
    if (window.ethereum) {
      const providers = [];
      
      // Check for specific wallet types
      if (window.ethereum.isMetaMask) {
        providers.push('MetaMask');
      }
      if (window.ethereum.isCoinbaseWallet) {
        providers.push('Coinbase Wallet');
      }
      if (window.ethereum.isNightly) {
        providers.push('Nightly Wallet');
      }
      if (window.ethereum.isPhantom) {
        providers.push('Phantom');
      }
      if (window.ethereum.isBraveWallet) {
        providers.push('Brave Wallet');
      }
      
      if (providers.length > 1) {
        conflicts.push({
          type: 'multiple_providers',
          providers: providers,
          message: `Multiple wallet extensions detected: ${providers.join(', ')}`
        });
      }
    }

    return conflicts;
  }

  // Function to suggest solutions
  function suggestSolutions(conflicts) {
    const solutions = [];
    
    conflicts.forEach(conflict => {
      if (conflict.type === 'multiple_providers') {
        solutions.push({
          title: 'Multiple Wallet Extensions Detected',
          description: 'You have multiple wallet extensions installed which may cause conflicts.',
          steps: [
            'Disable all wallet extensions except the one you want to use',
            'Refresh the page after disabling extensions',
            'Re-enable only the wallet extension you prefer',
            'If issues persist, try using the wallet in a private/incognito window'
          ]
        });
      }
    });

    return solutions;
  }

  // Function to create a notification
  function showWalletConflictNotification() {
    const conflicts = detectWalletConflicts();
    
    if (conflicts.length === 0) {
      return;
    }

    const solutions = suggestSolutions(conflicts);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 16px;
      max-width: 400px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="color: #d97706; font-size: 20px;">⚠️</div>
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 16px; font-weight: 600;">
            Wallet Extension Conflict Detected
          </h3>
          <p style="margin: 0 0 12px 0; color: #78350f; font-size: 14px; line-height: 1.4;">
            ${conflicts[0].message}
          </p>
          <div style="margin-top: 12px;">
            <button id="wallet-conflict-help" style="
              background: #f59e0b;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
              margin-right: 8px;
            ">Get Help</button>
            <button id="wallet-conflict-dismiss" style="
              background: transparent;
              color: #92400e;
              border: 1px solid #f59e0b;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">Dismiss</button>
          </div>
        </div>
        <button id="wallet-conflict-close" style="
          background: none;
          border: none;
          color: #92400e;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        ">×</button>
      </div>
    `;

    // Add event listeners
    notification.querySelector('#wallet-conflict-help').addEventListener('click', () => {
      const helpText = solutions.map(solution => 
        `${solution.title}\n${solution.description}\n\nSteps:\n${solution.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`
      ).join('\n\n');
      
      alert(helpText);
    });

    notification.querySelector('#wallet-conflict-dismiss').addEventListener('click', () => {
      notification.remove();
    });

    notification.querySelector('#wallet-conflict-close').addEventListener('click', () => {
      notification.remove();
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 30000);
  }

  // Run detection after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showWalletConflictNotification);
  } else {
    showWalletConflictNotification();
  }

  // Also run when window.ethereum changes
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
      setTimeout(showWalletConflictNotification, 1000);
    });
  }

})(); 