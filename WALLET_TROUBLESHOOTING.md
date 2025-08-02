# Wallet Extension Troubleshooting Guide

## Common Issues and Solutions

### 1. Multiple Wallet Extensions Conflict

**Error Message:**
```
MetaMask encountered an error setting the global Ethereum provider - this is likely due to another Ethereum wallet extension also setting the global Ethereum provider
```

**Solution:**
1. **Disable conflicting extensions:**
   - Open your browser's extension manager
   - Disable all wallet extensions except the one you want to use
   - Refresh the page
   - Re-enable only your preferred wallet extension

2. **Use private/incognito mode:**
   - Open a private/incognito window
   - Enable only the wallet extension you want to use
   - Access the app in the private window

3. **Clear browser cache:**
   - Clear your browser's cache and cookies
   - Restart your browser
   - Try accessing the app again

### 2. Wallet Connection Issues

**If your wallet won't connect:**

1. **Check extension status:**
   - Ensure your wallet extension is enabled
   - Make sure you're logged into your wallet
   - Check if the extension needs to be unlocked

2. **Network issues:**
   - Ensure you're connected to the correct network (Base mainnet)
   - Switch networks in your wallet if needed

3. **Permission issues:**
   - Check if the site has permission to connect to your wallet
   - Try disconnecting and reconnecting

### 3. Transaction Failures

**If transactions are failing:**

1. **Check gas fees:**
   - Ensure you have enough ETH for gas fees
   - Try increasing the gas limit if needed

2. **Network congestion:**
   - Wait for network congestion to clear
   - Try again during off-peak hours

3. **Insufficient funds:**
   - Ensure you have enough tokens for the transaction
   - Check your wallet balance

### 4. Browser-Specific Issues

**Chrome/Edge:**
- Disable conflicting extensions
- Clear site data for the app
- Try disabling hardware acceleration

**Firefox:**
- Check privacy settings
- Disable tracking protection for the site
- Clear site data

**Safari:**
- Ensure JavaScript is enabled
- Check content blocker settings
- Try disabling content blockers for the site

### 5. Mobile Wallet Issues

**If using mobile wallets:**

1. **WalletConnect issues:**
   - Ensure your mobile wallet supports WalletConnect
   - Try refreshing the QR code
   - Check if your mobile wallet is up to date

2. **Browser wallet issues:**
   - Try using a different browser
   - Clear browser cache and data
   - Reinstall the wallet app if needed

## Getting Help

If you're still experiencing issues:

1. **Check the console:**
   - Open browser developer tools (F12)
   - Look for error messages in the Console tab
   - Note any specific error codes or messages

2. **Contact support:**
   - Include the error messages you see
   - Mention which wallet extension you're using
   - Describe the steps you've already tried

3. **Community help:**
   - Check our Discord or community forums
   - Search for similar issues
   - Ask for help with specific error messages

## Prevention Tips

1. **Use only one wallet extension at a time**
2. **Keep your wallet extensions updated**
3. **Use a dedicated browser profile for Web3 activities**
4. **Regularly clear browser cache and data**
5. **Have backup wallet options ready**

## Supported Wallets

Our app supports the following wallet types:
- MetaMask
- Coinbase Wallet
- Nightly Wallet
- Phantom
- Brave Wallet
- WalletConnect compatible wallets

For the best experience, we recommend using MetaMask or Coinbase Wallet. 