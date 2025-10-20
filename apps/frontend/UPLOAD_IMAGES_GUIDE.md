# Upload Images to CMS - Guide

## Overview

This guide explains how to upload all images from `public/images/` to the live Mouhajer CMS using the bulk upload script.

## What Will Be Uploaded

- **Source**: `public/images/` folder (excluding `optimized/` subfolder)
- **Destination**: Live Mouhajer CMS at `https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app`
- **Total Files**: ~865 images
- **Total Size**: ~1.6 GB

## Prerequisites

✅ Already installed:
- Node.js
- `form-data` package
- `node-fetch` package

## Step 1: Get Your Session Cookie

The CMS requires authentication to upload files. You need to get your session cookie:

### Method 1: Chrome DevTools

1. **Login to CMS**
   - Open: https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app
   - Login with your credentials

2. **Open DevTools**
   - Press `F12` or `Right-click > Inspect`
   - Go to **Application** tab (or **Storage** in Firefox)

3. **Find Cookies**
   - In the left sidebar, expand **Cookies**
   - Click on `https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app`

4. **Copy Session Cookie**
   - Look for a cookie named like:
     - `next-auth.session-token` or
     - `__Secure-next-auth.session-token` or
     - `authjs.session-token`
   - Click on it and copy the entire **Value**

5. **Save for Later**
   - Copy the value to a text file temporarily

### Method 2: Network Tab (Alternative)

1. **Login to CMS** (as above)

2. **Open DevTools > Network**
   - Press `F12` > Network tab
   - Make sure "Preserve log" is checked

3. **Navigate in CMS**
   - Click any link in the CMS (e.g., go to Media page)

4. **Find Cookie**
   - Click any request to the CMS
   - Look in **Request Headers**
   - Find the `Cookie` header
   - Copy the entire cookie string

## Step 2: Run the Upload Script

### Option A: With Session Cookie (Recommended)

```bash
SESSION_COOKIE="your-session-cookie-value-here" node upload-images-to-cms.js
```

**Full example**:
```bash
SESSION_COOKIE="next-auth.session-token=eyJhbGc..." node upload-images-to-cms.js
```

### Option B: Without Authentication (May Fail)

```bash
node upload-images-to-cms.js
```

**Note**: This will only work if the CMS doesn't require authentication for uploads.

## Step 3: Monitor Progress

The script will:

1. ✅ Scan all images (excluding `optimized/` folder)
2. ✅ Filter out files > 50MB
3. ✅ Show summary and wait 5 seconds
4. ✅ Upload in batches of 5 files
5. ✅ Wait 2 seconds between batches
6. ✅ Show progress for each file
7. ✅ Generate final report

### Expected Output

```
🚀 Mouhajer CMS Image Upload Tool

📡 CMS URL: https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app
📁 Images Directory: D:\Desktop\wbsite\mouhajer-repo\public\images

🔍 Scanning for images...
📊 Found 865 total images
✅ 865 images ready to upload

📦 Total upload size: 1.6 GB

⚠️  This will upload all images to the live CMS!
   Press Ctrl+C to cancel, or wait 5 seconds to continue...

🚀 Starting upload...

📤 Batch 1/173 (5 files):
   ✅ image1.jpg (1/865)
   ✅ image2.png (2/865)
   ✅ image3.webp (3/865)
   ✅ image4.jpg (4/865)
   ✅ image5.png (5/865)
   ⏳ Waiting 2000ms before next batch...

...

═══════════════════════════════════════════════════════
                  UPLOAD COMPLETE
═══════════════════════════════════════════════════════

✅ Successfully uploaded: 865/865 files
❌ Failed uploads: 0/865 files

📄 Detailed results saved to: upload-results.json

📊 Success Rate: 100%

🎉 All images uploaded successfully!
```

## Step 4: Verify Upload

1. **Check CMS Media Library**
   - Go to: https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app/media
   - Verify images appear in the library

2. **Check Upload Results**
   - Open `upload-results.json` for detailed results
   - Contains URLs for all uploaded files

## Configuration Options

You can modify these in `upload-images-to-cms.js`:

| Setting | Default | Description |
|---------|---------|-------------|
| `BATCH_SIZE` | 5 | Files per batch |
| `DELAY_BETWEEN_BATCHES` | 2000ms | Wait between batches |
| `MAX_FILE_SIZE` | 50MB | Skip files larger than this |
| `SKIP_FOLDERS` | `['optimized']` | Folders to skip |

## Troubleshooting

### Issue: "No SESSION_COOKIE environment variable set"

**Solution**: Follow Step 1 to get your session cookie, then run:
```bash
SESSION_COOKIE="your-cookie" node upload-images-to-cms.js
```

### Issue: All uploads fail with "401 Unauthorized"

**Solutions**:
1. Your session cookie expired - get a new one
2. Cookie format is wrong - make sure you copied the full value
3. Cookie name is different - try copying the entire Cookie header

### Issue: Some files fail with "File too large"

**Solution**: These files exceed the 50MB limit. Options:
1. Compress/optimize them first
2. Increase `MAX_FILE_SIZE` in the script
3. Upload them manually via CMS UI

### Issue: Upload is very slow

**Solutions**:
1. Reduce `DELAY_BETWEEN_BATCHES` (but risk rate limiting)
2. Increase `BATCH_SIZE` (but risk overwhelming server)
3. Upload in smaller chunks (modify the script)

### Issue: Network timeout errors

**Solutions**:
1. Check your internet connection
2. Increase timeout in the script
3. Reduce batch size
4. Try again during off-peak hours

## Files Generated

After running the script:

- `upload-results.json` - Detailed results with URLs
- Console output - Real-time progress

## Safety Notes

⚠️ **Important**:
- This uploads to the **LIVE production CMS**
- Files will be stored in **Vercel Blob Storage** (costs money)
- The script waits 5 seconds before starting (time to cancel)
- You can press `Ctrl+C` at any time to stop

## Estimated Time

Based on:
- **865 files** at ~1.6 GB
- **Batch size**: 5 files
- **Delay**: 2 seconds between batches
- **Upload speed**: ~2 seconds per file

**Total estimated time**: ~30-60 minutes

## After Upload

Once all images are uploaded:

1. **Update Frontend Code**
   - Replace local image paths with CMS URLs
   - Use the URLs from `upload-results.json`

2. **Clean Up** (Optional)
   - Delete `public/images/` folder
   - Keep only `optimized/` versions
   - Reduce repository size

3. **Verify**
   - Test website with CMS images
   - Check all pages load correctly

## Example Session Cookie Formats

Valid formats (use the Value only):

```
# NextAuth v5
next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Secure cookie
__Secure-next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Auth.js
authjs.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Full cookie header (use this if single cookie doesn't work)
next-auth.session-token=abc123; next-auth.csrf-token=xyz789
```

## Need Help?

If you encounter issues:

1. Check the error messages in the console
2. Review `upload-results.json` for failed files
3. Verify your session cookie is still valid
4. Check CMS logs for server-side errors

## Quick Start

**TL;DR** - Run this:

```bash
# 1. Login to CMS and get session cookie
# 2. Run upload
SESSION_COOKIE="paste-your-cookie-here" node upload-images-to-cms.js

# 3. Wait ~30-60 minutes
# 4. Check upload-results.json
```

Done! 🎉
