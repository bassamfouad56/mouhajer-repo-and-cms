# Sanity Projects Import Guide

## Overview
This guide will help you import all 19 projects from the Z: drive into Sanity CMS. Images will be hosted on Sanity's CDN for optimal performance.

## Prerequisites
1. Sanity Studio is already set up in this project
2. You have access to the Z: drive with project images
3. You have Sanity API credentials

## Step 1: Generate Project Data

Run the import script to generate a JSON file with all project information:

```bash
tsx scripts/import-projects-from-z-drive.ts
```

This will create `projects-import-data.json` with structured data for all 19 projects.

## Step 2: Start Sanity Studio

Open Sanity Studio in your browser:

```bash
npx sanity dev
```

This will open Sanity Studio at http://localhost:3333

## Step 3: Import Projects Manually

For each project in `projects-import-data.json`:

### Method A: Manual Entry (Recommended for Quality Control)

1. Click **"Create"** → **"Project"**
2. Fill in the fields from the JSON data:
   - **Title**: Copy from JSON
   - **Slug**: Click "Generate" from title
   - **Excerpt**: Copy from JSON
   - **Category**: Select from dropdown
   - **Location**: Copy from JSON
   - **Year**: Enter year
   - **Client**: Copy from JSON
   - **Featured**: Check if true in JSON

3. **Upload Images**:
   - Navigate to the folder path shown in `_imageInfo.sourcePath`
   - **Main Image**: Upload the first image (e.g., `sofiteljbr01.jpg`)
   - **Gallery**: Drag and drop ALL remaining images
     - Sanity Studio allows bulk upload
     - Just select all images and drag into the gallery field

4. **SEO Fields** (Optional but recommended):
   - Meta Title: Copy from JSON
   - Meta Description: Copy from JSON
   - Keywords: Add from JSON array

5. Click **"Publish"**

### Method B: Using Sanity CLI (Advanced - Requires API Token)

If you want to automate the upload, you'll need to:

1. Create a Sanity API token with write permissions
2. Add it to `.env.local`:
   ```
   SANITY_API_TOKEN=your_token_here
   ```
3. Use the Sanity client API to programmatically upload images

## Project List (19 Total)

| # | Project Name | Category | Images | Featured |
|---|-------------|----------|---------|----------|
| 1 | Sofitel Hotel Dubai JBR | Hospitality | 95 | No |
| 2 | Sheraton Abu Dhabi Hotel & Resort | Hospitality | 57 | **Yes** |
| 3 | The Restaurant - Hotel Address Marina Mall | Hospitality | ? | No |
| 4 | Boulevard Penthouse 70-71 | Residential | 81 | **Yes** |
| 5 | District One Meydan Villa 79X | Residential | ? | No |
| 6 | Jumeirah Bay Villa | Residential | ? | No |
| 7 | Hotel Park Hyatt Villa | Hospitality | ? | No |
| 8 | Club Lounge - Address Boulevard | Hospitality | ? | No |
| 9 | Address Boulevard VIP Suite | Hospitality | 27 | **Yes** |
| 10 | Palm Jumeirah Villa | Residential | ? | No |
| 11 | Grand Hyatt Prince Suite | Hospitality | ? | No |
| 12 | Askim Restaurant | Hospitality | ? | No |
| 13 | Hotel Grand Hyatt Prince Suite | Hospitality | ? | No |
| 14 | Terraza Restaurant - Radisson Blu | Hospitality | ? | No |
| 15 | District 1 Meydan Villa 11X | Residential | ? | No |
| 16 | District 1 Meydan Villa 12X | Residential | ? | No |
| 17 | Jumeirah Islands Villa | Residential | ? | No |
| 18 | Park Hyatt VIP Room | Hospitality | ? | No |
| 19 | Ritz Carlton Villas | Hospitality | ? | No |
| 20 | C1 Offices Abu Dhabi | Commercial | ? | No |

## Step 4: Verify Import

After importing all projects:

1. Go to Sanity Studio → Projects
2. Check that all 19 projects are listed
3. Verify each project has:
   - ✅ Main image
   - ✅ Gallery images
   - ✅ All metadata (title, location, client, etc.)
   - ✅ Category assigned
   - ✅ Featured flag set correctly

## Step 5: Update Frontend to Use Sanity Data

The project pages are already configured to fetch from Sanity. Just ensure the queries are working:

1. Check `sanity/lib/queries.ts` for project queries
2. Test the projects page: http://localhost:3000/projects
3. Test individual project pages: http://localhost:3000/projects/[slug]

## Tips for Efficient Upload

### Bulk Image Upload
- Sanity Studio supports drag-and-drop for multiple images
- You can select 50+ images at once and drag them into the gallery field
- Images will upload in parallel

### Image Optimization
- Sanity automatically optimizes images
- No need to resize or compress beforehand
- Original quality is preserved
- CDN serves optimized versions based on device

### Naming Convention
- Keep image filenames as they are (e.g., `sofiteljbr01.jpg`)
- Sanity will handle everything internally
- You can add captions in the gallery field for important images

## Benefits of Using Sanity

✅ **Performance**: Images served via global CDN
✅ **Optimization**: Automatic WebP conversion, responsive images
✅ **Management**: Easy to update/add/remove projects
✅ **Scalability**: No server load, unlimited bandwidth
✅ **SEO**: Proper meta tags and structured data
✅ **Version Control**: Track all changes

## Troubleshooting

### Issue: Can't find Sanity Studio
**Solution**: Run `npx sanity dev` - it opens at http://localhost:3333

### Issue: Images won't upload
**Solution**:
- Check file size (Sanity has limits)
- Ensure files are valid image formats (JPG, PNG, WebP)
- Check your internet connection

### Issue: Projects not showing on frontend
**Solution**:
- Clear Next.js cache: Delete `.next` folder
- Restart dev server: `npm run dev`
- Check Sanity client configuration in `sanity/lib/client.ts`

## Need Help?

- Sanity Documentation: https://www.sanity.io/docs
- Sanity Community: https://www.sanity.io/community

## Next Steps After Import

Once all projects are in Sanity:

1. ✅ Update project filtering/sorting
2. ✅ Add award badges to winning projects
3. ✅ Create featured projects carousel on homepage
4. ✅ Add related projects functionality
5. ✅ Implement project search

---

**Estimated Time**: ~2-3 hours for all 19 projects (including image uploads)

Good luck! 🚀
