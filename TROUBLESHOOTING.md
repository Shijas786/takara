# Troubleshooting Guide for Twitter Scraper

## SSL Certificate Issues on macOS

The Twitter scraper may encounter SSL certificate verification errors on macOS. This is a common issue with `snscrape` and web scraping libraries on macOS systems.

### Error Message
```
SSLError(MaxRetryError("HTTPSConnectionPool(host='twitter.com', port=443): Max retries exceeded with url: /search?f=live&lang=en&q=from%3Ausername&src=spelling_expansion_revert_click (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1016)')))"))
```

## Solutions

### Solution 1: Use the Robust Scraper (Recommended)

The `twitter_scraper_robust.py` script includes multiple fallback methods and better SSL handling:

```bash
python twitter_scraper_robust.py
```

### Solution 2: Install SSL Certificates

Run this command to install SSL certificates for Python on macOS:

```bash
/Applications/Python\ 3.x/Install\ Certificates.command
```

Or manually install certificates:

```bash
python -m pip install --upgrade certifi
```

### Solution 3: Use Alternative Scraper

Try the alternative scraper that uses different methods:

```bash
python twitter_scraper_alternative.py
```

### Solution 4: Environment Variables

Set these environment variables before running the script:

```bash
export SSL_CERT_FILE=$(python -c "import certifi; print(certifi.where())")
export REQUESTS_CA_BUNDLE=$(python -c "import certifi; print(certifi.where())")
python twitter_scraper.py
```

### Solution 5: Python Certificate Installation

If you're using Homebrew Python, try:

```bash
# Install certificates for Homebrew Python
/opt/homebrew/bin/python3 -m pip install --upgrade certifi
```

### Solution 6: Manual Certificate Installation

For persistent SSL issues, you can manually install certificates:

```bash
# Download and install certificates
curl -O https://curl.se/ca/cacert.pem
export SSL_CERT_FILE=$(pwd)/cacert.pem
export REQUESTS_CA_BUNDLE=$(pwd)/cacert.pem
```

## Alternative Approaches

### Using Different Python Versions

Try using a different Python version or virtual environment:

```bash
# Create virtual environment
python3 -m venv twitter_env
source twitter_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run scraper
python twitter_scraper_robust.py
```

### Using Conda Environment

```bash
# Create conda environment
conda create -n twitter_scraper python=3.9
conda activate twitter_scraper

# Install dependencies
pip install -r requirements.txt

# Run scraper
python twitter_scraper_robust.py
```

## Testing Different Scripts

1. **Basic Scraper**: `python twitter_scraper.py`
2. **SSL-Fixed Scraper**: `python twitter_scraper_ssl_fix.py`
3. **Alternative Scraper**: `python twitter_scraper_alternative.py`
4. **Robust Scraper**: `python twitter_scraper_robust.py` (Recommended)

## Test Scripts

Use these test scripts to verify functionality:

```bash
# Test with small sample
python test_small.py

# Test alternative approach
python test_alternative.py

# Test robust approach
python test_robust.py
```

## Common Issues and Solutions

### Issue: "No module named 'snscrape'"
**Solution**: Install dependencies
```bash
pip install -r requirements.txt
```

### Issue: "Permission denied"
**Solution**: Check file permissions
```bash
chmod +x twitter_scraper_robust.py
```

### Issue: "No tweets found"
**Solution**: This might be normal for some accounts. Try:
- Different usernames
- Check if accounts are private
- Verify usernames are correct

### Issue: Rate limiting
**Solution**: The scraper handles this automatically, but you can:
- Reduce the number of tweets per user
- Add delays between requests
- Use fewer usernames at once

## Recommended Workflow

1. **Start with robust scraper**: `python twitter_scraper_robust.py`
2. **If SSL issues persist**: Try certificate installation
3. **Test with small sample**: Use test scripts
4. **Scale up**: Run with full username list

## File Structure

```
twitter-scraper/
├── twitter_scraper.py              # Basic scraper
├── twitter_scraper_ssl_fix.py      # SSL-fixed version
├── twitter_scraper_alternative.py  # Alternative approach
├── twitter_scraper_robust.py       # Robust version (recommended)
├── config.py                       # Configuration
├── requirements.txt                # Dependencies
├── test_small.py                  # Small test
├── test_alternative.py            # Alternative test
├── test_robust.py                 # Robust test
├── README.md                      # Main documentation
└── TROUBLESHOOTING.md            # This file
```

## Getting Help

If you continue to experience issues:

1. Check the error messages carefully
2. Try different scraper versions
3. Test with a single username first
4. Verify your internet connection
5. Check if Twitter is accessible in your browser

## Notes

- The robust scraper (`twitter_scraper_robust.py`) is recommended for macOS users
- SSL issues are common on macOS but can be resolved
- Some accounts may not return tweets due to privacy settings
- The scraper respects Twitter's rate limits automatically 