# 🚀 Image Upload to CMS - Ready!

## Status: ✅ Ready to Upload

Everything is set up to upload all images to the live Mouhajer CMS.

## Quick Summary

- **📁 Source**: `public/images/` (865 files, ~1.6 GB)
- **🎯 Destination**: Live CMS (Vercel)
- **⏱️ Estimated Time**: 30-60 minutes
- **🔧 Script**: `upload-images-to-cms.js`
- **📖 Guide**: [UPLOAD_IMAGES_GUIDE.md](UPLOAD_IMAGES_GUIDE.md)

## What's Ready

✅ Upload script created
✅ Dependencies installed (`form-data`, `node-fetch`)
✅ Batch upload configured (5 files at a time)
✅ Error handling implemented
✅ Progress tracking included
✅ Detailed guide created

## Next Step: Get Your Session Cookie

### Quick Instructions

1. **Login to CMS**
   ```
   https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app
   ```

2. **Get Session Cookie**
   - Press `F12` (DevTools)
   - Go to **Application** > **Cookies**
   - Find cookie: `next-auth.session-token` or similar
   - Copy the **Value**

3. **Run Upload**
   ```bash
   SESSION_COOKIE="paste-your-cookie-here" node upload-images-to-cms.js
   ```

## What the Script Does

1. ✅ Scans `public/images/` folder
2. ✅ Skips `optimized/` subfolder (already optimized)
3. ✅ Filters files > 50MB
4. ✅ Shows summary and waits 5 seconds
5. ✅ Uploads in batches of 5
6. ✅ Waits 2 seconds between batches
7. ✅ Saves results to `upload-results.json`

## Expected Output

```
🚀 Mouhajer CMS Image Upload Tool
📊 Found 865 total images
✅ 865 images ready to upload
📦 Total upload size: 1.6 GB

🚀 Starting upload...
📤 Batch 1/173 (5 files):
   ✅ image1.jpg (1/865)
   ...

✅ Successfully uploaded: 865/865 files
🎉 All images uploaded successfully!
```

## After Upload

Once complete:
1. ✅ All images will be in CMS Media Library
2. ✅ `upload-results.json` will contain all image URLs
3. ✅ You can update frontend to use CMS URLs
4. ✅ Optionally delete local images to reduce repo size

## Files Created

| File | Purpose |
|------|---------|
| `upload-images-to-cms.js` | Upload script |
| `UPLOAD_IMAGES_GUIDE.md` | Detailed guide |
| `UPLOAD_READY.md` | This file |

## Configuration

Default settings (can be changed in script):
- **Batch Size**: 5 files
- **Delay**: 2 seconds between batches
- **Max File Size**: 50 MB
- **Skip Folders**: `['optimized']`

## Safety

⚠️ **Important Notes**:
- Uploads to **LIVE production CMS**
- Uses **Vercel Blob Storage** (costs apply)
- 5-second countdown before starting
- Press `Ctrl+C` to cancel anytime

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No SESSION_COOKIE" | Get cookie from CMS login |
| "401 Unauthorized" | Cookie expired - get new one |
| "File too large" | Files > 50MB are skipped |
| Slow upload | Reduce delay or increase batch size |

## Ready?

Read the full guide: **[UPLOAD_IMAGES_GUIDE.md](UPLOAD_IMAGES_GUIDE.md)**

Then run:
```bash
SESSION_COOKIE="your-cookie" node upload-images-to-cms.js
```

Good luck! 🎉
