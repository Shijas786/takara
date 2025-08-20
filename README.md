# Takara – Web3's AI content engine

Turn raw ideas into viral-ready Web3 content. Takara gives creators AI-crafted posts that resonate.

**Everyone is a creator — Takara makes it effortless.**

**Post smarter. Stand louder.**

## 🚀 Features

- **AI Content Generation**: Generate engaging content using OpenAI
- **Farcaster Integration**: Connect and post directly to Farcaster
- **Content Scheduling**: Schedule posts for optimal timing
- **Safe Rendering**: Production-grade error handling and sanitization

## 🛡️ Production Safety Features

### API Response Sanitizer
All API responses are automatically sanitized to prevent React element objects from being returned, eliminating the "Objects are not valid as a React child" error.

### Error Boundaries
Comprehensive error boundaries catch and handle React rendering errors gracefully, preventing app crashes.

### Deprecated SDK Detection
Automated scanning prevents usage of deprecated Farcaster SDKs.

## 🧪 Testing

Run the automated tests to ensure everything is working correctly:

```bash
# Test the API response sanitizer
npm run test:sanitizer

# Check for deprecated SDK usage
npm run check:deprecated

# Run all pre-commit checks
npm run pre-commit
```

## 📦 Installation

```bash
npm install
npm run dev
```

## 🔧 Development

The project includes several safety mechanisms:

1. **API Middleware**: Automatically sanitizes all API responses
2. **Error Boundaries**: Catches React rendering errors
3. **Deprecated SDK Scanner**: Prevents usage of outdated packages
4. **Safe Rendering**: Robust frontend rendering with fallbacks

## 🚀 Deployment

The app is configured for deployment on Vercel with all safety features enabled.

## 📝 License

MIT 