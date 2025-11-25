# Post-Deployment Instructions

## ✅ What's Been Completed

All Sanity.io advanced features have been implemented and merged into the `main` branch:
- ✅ Internationalization (i18n) for English/Arabic content
- ✅ Portable Text rendering with custom styling
- ✅ Preview Mode for draft content viewing
- ✅ Webhook integration for automatic page revalidation
- ✅ All image loading errors fixed
- ✅ Code pushed and merged to main branch

---

## 🚀 Deployment Steps

### 1. Deploy to Production

Your code is ready in the `main` branch. Deploy to production:

```bash
# Automatic deployment (if connected to GitHub)
# Vercel will auto-deploy from main branch

# OR manual deployment:
vercel --prod
```

**Production Domain:** https://www.mahermouhajer.com

---

### 2. Add Environment Variables to Vercel

Go to your Vercel project settings and add these environment variables:

**URL:** https://vercel.com/your-team/mouhajer-new-marketing-website/settings/environment-variables

Add the following variables for **Production**, **Preview**, and **Development**:

```env
# Existing Sanity variables (should already be there)
NEXT_PUBLIC_SANITY_PROJECT_ID=b6q28exv
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-11-21
SANITY_API_TOKEN=sknLI9zeZYMWy8WFthsEaS6oC2xjQIpqnXMCDftesR41VXIAscgOEZLU2b7fzFxb6nJEp8p3LR6pqcDtY0UH4bAB6OguiCLuZHyuZVXlmUiDyu8waCgyS1nn6eeSDxDjWRNOkk7vaHhajaYwpgMYHTzy81ke8Amanrtq0k16Pvvh5ZStg32d

# NEW: Preview Mode Secret
SANITY_PREVIEW_SECRET=mpJk9Lx4Qw8RnZ3vB7yH2tNf6Dc5Gs1E

# NEW: Webhook Revalidation Secret
SANITY_REVALIDATE_SECRET=Yz8Pq3Wt7Xm2Vk9Lp4Hj6Fn1Rb5Cd0Sg
```

**Important:** Make sure to save and redeploy after adding environment variables.

---

### 3. Configure Sanity Webhook (After Deployment)

Once your site is deployed to https://www.mahermouhajer.com, set up the webhook:

#### Step 1: Go to Sanity Manage
**URL:** https://www.sanity.io/manage/personal/project/b6q28exv/api/webhooks

#### Step 2: Create New Webhook
Click **"Create webhook"** and configure:

**Basic Settings:**
```
Name: Production Revalidation
URL: https://www.mahermouhajer.com/api/revalidate
Dataset: production
Trigger on: Create, Update, Delete
HTTP method: POST
```

**HTTP Headers:**
Click "Add header" and add:
```
Header name: x-sanity-webhook-secret
Header value: Yz8Pq3Wt7Xm2Vk9Lp4Hj6Fn1Rb5Cd0Sg
```

**Filter (Optional but Recommended):**
```groq
_type in ["project", "service", "industry", "post"]
```

#### Step 3: Save and Test
1. Click **"Save"**
2. Click **"Trigger test"** to verify the webhook works
3. Check the webhook delivery logs to confirm success

---

### 4. Test Your New Features

#### Test Preview Mode
Visit this URL (replace `[slug]` with actual project slug):
```
https://www.mahermouhajer.com/api/preview?secret=mpJk9Lx4Qw8RnZ3vB7yH2tNf6Dc5Gs1E&slug=/en/projects/[slug]
```

You should see:
- Yellow banner at bottom: "🔍 Preview Mode Active"
- Draft content visible
- "Exit Preview" button

#### Test Webhook Revalidation
```bash
# Test with GET (easier)
curl "https://www.mahermouhajer.com/api/revalidate?secret=Yz8Pq3Wt7Xm2Vk9Lp4Hj6Fn1Rb5Cd0Sg&path=/en/projects"

# Expected response:
# {"revalidated":true,"now":1732521234567,"path":"/en/projects"}
```

#### Test Content Publishing
1. Go to Sanity Studio: https://www.sanity.io/studio or `npx sanity dev`
2. Create or edit a project
3. Click **"Publish"**
4. Wait 5-10 seconds
5. Visit your website - changes should appear automatically!

---

### 5. Using the i18n Features

#### In Sanity Studio:
1. Create a document (e.g., a Project)
2. You'll see a language selector in the top bar (should show "en")
3. After publishing the English version, click **"Create translation"**
4. Select **"Arabic (ar)"**
5. Edit the Arabic version
6. Publish

Both versions are now linked and will show on the appropriate language version of your site.

#### On Your Website:
- English content: https://www.mahermouhajer.com/en/projects
- Arabic content: https://www.mahermouhajer.com/ar/projects

---

### 6. Using Portable Text (Rich Content)

When editing content in Sanity Studio:

1. The `content` field is a rich text editor
2. You can use:
   - **Headings** (H1-H4)
   - **Bold** and *Italic* text
   - Bulleted and numbered lists
   - Links (internal and external)
   - Images with captions
   - Blockquotes
   - Code snippets

The content will automatically render with your design system's styling on the frontend.

---

## 🔄 What Happens When You Publish Content

1. **You publish in Sanity Studio**
2. **Webhook fires automatically** → sends request to `/api/revalidate`
3. **Next.js revalidates affected pages**:
   - For projects: Homepage + Projects page + Specific project page
   - For services: Homepage + Services page + Specific service page
   - For industries: Homepage + Industries page + Specific industry page
   - For posts: Blog page + Specific post page
4. **Changes appear on website** (usually within 5-10 seconds)
5. **No manual deployment needed!**

---

## 📋 Post-Deployment Checklist

- [ ] Deployed to production (https://www.mahermouhajer.com)
- [ ] Added `SANITY_PREVIEW_SECRET` to Vercel
- [ ] Added `SANITY_REVALIDATE_SECRET` to Vercel
- [ ] Redeployed after adding environment variables
- [ ] Created webhook in Sanity Manage
- [ ] Webhook URL points to: `https://www.mahermouhajer.com/api/revalidate`
- [ ] Webhook header `x-sanity-webhook-secret` is set correctly
- [ ] Tested webhook with "Trigger test" button
- [ ] Tested preview mode URL
- [ ] Published test content and verified auto-revalidation works
- [ ] Created sample content in both English and Arabic

---

## 🐛 Troubleshooting

### Webhook Not Working
1. Go to Sanity Manage → Webhooks → Your webhook
2. Click on "Delivery logs"
3. Check for errors
4. Common issues:
   - Wrong URL (should be `/api/revalidate` not `/en/api/revalidate`)
   - Wrong secret in header
   - Vercel environment variable not set

### Preview Mode Not Working
1. Check that `SANITY_PREVIEW_SECRET` is set in Vercel
2. Make sure you redeployed after adding the variable
3. Try clearing browser cookies
4. Check that the secret in the URL matches the one in Vercel

### Changes Not Appearing
1. Wait 10 seconds after publishing (ISR takes a moment)
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Check webhook delivery logs in Sanity
4. Clear Vercel cache if needed

### i18n Not Showing in Studio
1. Restart Sanity Studio: Stop and run `npx sanity dev` again
2. Make sure you're logged in to Sanity
3. Check that the document type supports i18n (project, service, industry, post)

---

## 📚 Documentation References

For detailed information, see:
- **SANITY_FEATURES_SUMMARY.md** - Quick feature reference
- **SANITY_SETUP.md** - Complete setup guide with examples

---

## 🎯 Next Steps (Optional)

1. **Deploy Sanity Studio** (optional - makes it accessible to team):
   ```bash
   npx sanity deploy
   ```
   Choose a hostname like `mouhajer-design` → Studio will be at: https://mouhajer-design.sanity.studio

2. **Add more content** in Sanity Studio:
   - Create more projects with translations
   - Add services with rich text content
   - Create blog posts
   - Add industries

3. **Switch from WordPress to Sanity** (when ready):
   - Currently using WordPress for data
   - Sanity is fully configured and ready
   - See SANITY_SETUP.md for migration instructions

4. **Optional enhancements**:
   - Add Google Maps location picker
   - Add color picker for design customization
   - Create custom input components

---

## 🔐 Security Notes

**Important:** Keep these secrets secure:
- `SANITY_PREVIEW_SECRET`: mpJk9Lx4Qw8RnZ3vB7yH2tNf6Dc5Gs1E
- `SANITY_REVALIDATE_SECRET`: Yz8Pq3Wt7Xm2Vk9Lp4Hj6Fn1Rb5Cd0Sg

**Do NOT:**
- Share these secrets publicly
- Commit them to Git (they're in .env.local which is gitignored)
- Use them in client-side code

**They are safe in:**
- Vercel environment variables (encrypted)
- Your local .env.local file (not committed to Git)
- Sanity webhook configuration (secure)

---

## ✅ You're All Set!

Your Sanity.io integration is fully configured with advanced features:
- ✅ Internationalization
- ✅ Rich text rendering
- ✅ Preview mode
- ✅ Automatic revalidation

**Everything is production-ready!** 🚀

For questions or issues, refer to the troubleshooting sections in this document or in SANITY_SETUP.md.
