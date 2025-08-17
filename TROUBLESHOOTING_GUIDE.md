# Troubleshooting Guide

## Console Errors and Warnings

### 1. Farcaster SDK Deprecation Warning

**Warning:**
```
Ensure you are using `@farcaster/miniapp-sdk`. Remove legacy `@farcaster/frame-sdk` and OnchainKit references.
```

**Cause:** This warning comes from dependencies (like `@coinbase/onchainkit`) that still use the deprecated Farcaster Frame SDK.

**Solution:** 
- This warning is automatically suppressed by the error suppression script
- The warning doesn't affect functionality
- The app uses the newer `@farcaster/miniapp-sdk` exclusively

### 2. Coinbase Analytics Error

**Error:**
```
POST https://cca-lite.coinbase.com/metrics net::ERR_ABORTED 401 (Unauthorized)
```

**Cause:** Coinbase Wallet extension tries to send analytics data but fails due to authentication issues.

**Solution:**
- This error is automatically suppressed by the error suppression script
- The error doesn't affect wallet functionality
- It's a known issue with Coinbase Wallet extension

### 3. Wallet Extension Conflicts

**Error:**
```
MetaMask encountered an error setting the global Ethereum provider
```

**Cause:** Multiple wallet extensions trying to set the `window.ethereum` property.

**Solution:**
- Use only one wallet extension at a time
- The wallet conflict resolution script will help detect and resolve conflicts
- See `WALLET_TROUBLESHOOTING.md` for detailed steps

## Build and Development Issues

### 1. React Rendering Errors

**Error:**
```
Objects are not valid as a React child (found: object with keys {$$typeof, type, key, ref, props})
```

**Status:** ✅ **FIXED**
- All React rendering errors have been resolved
- The `safeRender` function has been updated to handle React elements properly

### 2. Missing Dependencies

**Error:**
```
Module not found: Can't resolve '@radix-ui/react-label'
```

**Status:** ✅ **FIXED**
- All missing dependencies have been installed
- Build now completes successfully

### 3. TypeScript Errors

**Status:** ✅ **FIXED**
- All TypeScript errors have been resolved
- Window interface has been updated for wallet extensions
- Function declaration order issues have been fixed

## Performance Optimizations

### 1. Image Optimization Warning

**Warning:**
```
Using <img> could result in slower LCP and higher bandwidth. Consider using <Image /> from next/image
```

**Solution:**
- This is a performance optimization warning, not an error
- The app still functions correctly
- Consider using Next.js Image component for better performance

### 2. ESLint Warnings

**Status:** ✅ **MINIMIZED**
- Most ESLint warnings have been resolved
- Remaining warnings are non-critical

## API and Network Issues

### 1. Dynamic Server Usage Errors

**Error:**
```
Dynamic server usage: Route couldn't be rendered statically because it used `request.url`
```

**Cause:** API routes using dynamic features during static generation.

**Solution:**
- These are expected during build time
- API routes are marked as dynamic (ƒ) in the build output
- They work correctly at runtime

### 2. Supabase Connection Errors

**Error:**
```
getaddrinfo ENOTFOUND placeholder.supabase.co
```

**Cause:** Placeholder Supabase URL in environment variables.

**Solution:**
- Update environment variables with real Supabase credentials
- See `API_KEYS_SETUP.md` for configuration instructions

## Browser-Specific Issues

### 1. Chrome/Edge Extensions

- Disable conflicting wallet extensions
- Clear browser cache and site data
- Try incognito/private mode

### 2. Firefox Privacy Settings

- Check privacy settings
- Disable tracking protection for the site
- Clear site data

### 3. Safari Content Blockers

- Ensure JavaScript is enabled
- Check content blocker settings
- Try disabling content blockers temporarily

## Mobile Issues

### 1. Mobile Wallet Compatibility

- Ensure mobile wallet supports WalletConnect
- Try refreshing QR codes
- Check wallet app updates

### 2. Mobile Browser Issues

- Try different mobile browsers
- Clear browser cache and data
- Reinstall wallet apps if needed

## Getting Help

### 1. Check Console Logs

1. Open browser developer tools (F12)
2. Look at Console tab for specific errors
3. Note error messages and stack traces

### 2. Check Network Tab

1. Open browser developer tools (F12)
2. Look at Network tab for failed requests
3. Check request/response details

### 3. Contact Support

When reporting issues, include:
- Browser and version
- Wallet extension(s) being used
- Specific error messages
- Steps to reproduce
- Console logs

### 4. Community Resources

- Check Discord/community forums
- Search for similar issues
- Ask for help with specific error messages

## Prevention Tips

1. **Keep Extensions Updated:** Regularly update wallet extensions
2. **Use One Wallet at a Time:** Avoid multiple wallet extensions
3. **Clear Cache Regularly:** Clear browser cache and data
4. **Check Environment Variables:** Ensure all API keys are properly configured
5. **Monitor Console:** Check console for new errors regularly

## Status Summary

- ✅ React rendering errors: **FIXED**
- ✅ Build errors: **FIXED**
- ✅ TypeScript errors: **FIXED**
- ✅ Missing dependencies: **FIXED**
- ⚠️ Console warnings: **SUPPRESSED** (non-critical)
- ⚠️ Performance warnings: **ACKNOWLEDGED** (optimization opportunities)
- ✅ Wallet conflicts: **HANDLED** (with resolution script)

The app is now fully functional with all critical issues resolved. Remaining warnings are non-critical and don't affect functionality. 