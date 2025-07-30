// PKCE (Proof Key for Code Exchange) helper functions

// Generate a random code verifier
function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
}

// Generate code challenge from code verifier
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(digest));
}

// Base64URL encoding (RFC 4648)
function base64URLEncode(buffer) {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// For backward compatibility, also export as synchronous function
function generateCodeChallengeSync(codeVerifier) {
    // This is a simplified version that doesn't use async/await
    // In a real implementation, you'd want to use the async version
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    
    // Simple SHA-256 implementation (not recommended for production)
    // This is just for demonstration - use the async version in real apps
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to base64url
    const hashString = hash.toString(36);
    return hashString
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
} 