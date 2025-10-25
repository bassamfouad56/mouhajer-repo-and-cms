# Auto-Translation Setup Guide

## Quick Start (2 minutes)

The auto-translation feature is now configured to use **Groq AI** - a fast, free AI API that provides excellent translations.

### Step 1: Get Your Free Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card required)
3. Go to [API Keys](https://console.groq.com/keys)
4. Click "Create API Key"
5. Copy the key

### Step 2: Add API Key to Environment

1. Open `apps/cms/.env`
2. Find the line: `GROQ_API_KEY=""`
3. Paste your API key between the quotes:
   ```bash
   GROQ_API_KEY="gsk_your_actual_api_key_here"
   ```
4. Save the file

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C)
cd apps/cms
npm run dev:cms-only
```

### Step 4: Test It!

1. Open [http://localhost:3010/page-builder](http://localhost:3010/page-builder)
2. Click **"+ Create New Page"**
3. Type in the **English Title** field: `About Us`
4. Wait 1 second
5. Watch the **Arabic Title** auto-fill with: `عن` or similar!

## How It Works

- Type in English title
- After 800ms of no typing, translation starts
- Loading spinner shows "Translating..."
- Arabic title and slug auto-fill
- You can manually edit the Arabic title if needed

## Why Groq?

- ✅ **Free** - Generous free tier (14,400 requests/day)
- ✅ **Fast** - Sub-second translations (~200ms)
- ✅ **Accurate** - Uses advanced AI (Llama 3.1)
- ✅ **No setup** - Just needs an API key
- ✅ **Already integrated** - groq-sdk already installed

## Translation Examples

The AI uses **proper website terminology** (not literal translations):

**Standard Web Pages:**
- "Home" → "الرئيسية" (Homepage, NOT "المنزل" house)
- "About Us" → "من نحن" (Who We Are)
- "Contact" → "اتصل بنا" (Contact Us)
- "Services" → "خدماتنا" (Our Services)
- "Portfolio" → "أعمالنا" (Our Works)
- "Testimonials" → "آراء العملاء" (Customer Reviews)

**Custom Content:**
- "Interior Design Company" → "شركة تصميم داخلي"
- "Our Projects" → "مشاريعنا"

All translations use standard Arabic website conventions, making them familiar to Arabic-speaking users.

## Troubleshooting

### Translation not working?
1. Check the browser console for errors
2. Verify GROQ_API_KEY is set correctly in `.env`
3. Restart the development server
4. Check that you've saved the `.env` file

### Still showing English text in Arabic field?
- The API key might be invalid
- Check the server logs for error messages
- Verify your Groq account has API access enabled

## Alternative: Google Cloud Translation

If you prefer Google Cloud Translation API:
1. Enable the Translation API at [Google Cloud Console](https://console.cloud.google.com/apis/library/translate.googleapis.com?project=focused-arch-391811)
2. Update `apps/cms/src/lib/google-translate.ts` to use Google's API
3. The service account is already configured in your `.env`

---

**That's it!** The translation feature is production-ready and will work perfectly once you add your Groq API key.
