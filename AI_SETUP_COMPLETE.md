# ✅ AI Image Generation Feature - Setup Complete!

## What's Been Configured

Your website now has a complete AI-powered image generation system that:

1. **Captures leads through your chatbot**
2. **Generates luxury design concepts using AI**
3. **Sends professional emails with the generated designs**
4. **Stores everything in Sanity CMS for lead management**
5. **Backs up images to your Mac Mini external drive**

---

## 🎉 Ready to Use!

All configuration files have been updated with your actual credentials:
- ✅ Resend API key configured
- ✅ Sanity credentials set up
- ✅ Mac Mini connection configured (100.111.21.66)
- ✅ Resend package installed
- ✅ All environment variables added to `.env.local`

---

## 🚀 Next Steps

### 1. Start Mac Mini AI Services

You need to have these running on your Mac Mini:

**Terminal 1 - Start Ollama:**
```bash
ssh bassamfouad@100.111.21.66
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

**Terminal 2 - Start ComfyUI:**
```bash
ssh bassamfouad@100.111.21.66
cd /Volumes/LLM_DATA/ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

**If models aren't downloaded yet:**
```bash
ssh bassamfouad@100.111.21.66
ollama pull llama3
ollama pull llava
```

### 2. Deploy Sanity Schema

Deploy the new lead schema to Sanity:

```bash
npx sanity deploy
```

Or if you have it configured:
```bash
pnpm run deploy:sanity
```

### 3. Test the Feature

Visit the test page I created:
```bash
pnpm run dev
```

Then open: **http://localhost:3000/test-ai**

This page has:
- Health check button to verify Mac Mini services
- AI generator launcher
- Complete testing checklist
- Documentation links

### 4. Test Workflow

1. Click "Check Health Status" - Should show both services online
2. Click "Open AI Design Studio"
3. Fill in:
   - **Email**: your-email@example.com
   - **Prompt**: "Luxury hotel lobby with marble floors and gold accents"
   - **Service**: Hospitality Design
4. Click "Generate Design Concept"
5. Wait ~60 seconds
6. Check your email!
7. Open Sanity Studio (http://localhost:3333) and find your lead under "AI Image Generation Leads"

---

## 📁 What Was Created

### Core Files
```
✅ lib/ai/ollama-client.ts              # Ollama integration
✅ lib/ai/comfyui-client.ts             # ComfyUI integration
✅ app/api/ai/generate-image/route.ts   # API endpoint
✅ sanity/schemas/lead.ts               # Lead schema
✅ components/ai-chatbot/ai-image-generator.tsx
✅ components/ai-chatbot/chatbot-with-ai.tsx
✅ app/test-ai/page.tsx                 # Test page
```

### Documentation
```
✅ docs/AI_QUICK_START.md               # 15-minute setup guide
✅ docs/AI_IMAGE_GENERATION_SETUP.md    # Complete setup guide
✅ docs/AI_FEATURE_SUMMARY.md           # Feature overview
✅ scripts/setup-ai-feature.sh          # Automated setup script
```

---

## 🔧 Integration Examples

### Add to Any Page

```tsx
import { ChatbotWithAI } from '@/components/ai-chatbot/chatbot-with-ai';

export default function Page() {
  return <ChatbotWithAI />;
}
```

### Just the AI Generator Modal

```tsx
'use client';
import { useState } from 'react';
import { AIImageGenerator } from '@/components/ai-chatbot/ai-image-generator';

export default function Page() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(true)}>
        Generate AI Design
      </button>
      {show && <AIImageGenerator onClose={() => setShow(false)} />}
    </>
  );
}
```

---

## 🎯 How It Works

```
User fills form
    ↓
API validates prompt (Ollama)
    ↓
Enhances prompt with MIDC branding (Llama3)
    ↓
Analyzes reference image if uploaded (LLaVA)
    ↓
Generates design concept (ComfyUI + SDXL)
    ↓
Uploads to Sanity CDN
    ↓
Creates lead in Sanity
    ↓
Sends email with design (Resend)
    ↓
Backs up to Mac Mini external drive
    ↓
Returns success to user
```

---

## 📊 Lead Management

All leads are automatically captured in Sanity with:

- User email & contact info
- Design prompt
- Service category
- Reference image (if uploaded)
- Generated AI image
- Generation time & model used
- Email delivery status
- Lead lifecycle stage (New → Processing → Sent → Follow-up → Converted)

**Access Sanity Studio:**
```bash
# Start Sanity Studio
npx sanity dev

# Or if configured
pnpm run sanity
```

Then visit: **http://localhost:3333**

Navigate to **"AI Image Generation Leads"** to see all captured leads.

---

## 🔍 Troubleshooting

### Health Check Returns "offline"

**Check Ollama:**
```bash
curl http://100.111.21.66:11434/api/tags
```

**Check ComfyUI:**
```bash
curl http://100.111.21.66:8188/system_stats
```

**Restart services if needed** (see Step 1 above)

### Email Not Sending

1. Verify Resend API key in `.env.local`
2. Check Resend dashboard: https://resend.com/emails
3. Test email directly:
   ```bash
   curl -X POST http://localhost:3000/api/ai/generate-image \
     -F "email=test@example.com" \
     -F "prompt=luxury hotel lobby"
   ```

### Generation Timeout

- Default timeout: 120 seconds (2 minutes)
- Check ComfyUI terminal for errors
- Ensure SDXL model is downloaded
- Verify external drive has space

---

## 💰 Cost Breakdown

| Service | Your Plan | Cost |
|---------|-----------|------|
| Ollama | Local (Mac Mini) | $0 |
| ComfyUI | Local (Mac Mini) | $0 |
| Sanity | Free tier | $0 (10GB, 100k docs) |
| Resend | Free tier | $0 (3k emails/month) |
| **Total** | | **$0/month** |

You can process **3,000 AI design requests per month for free**!

---

## 📈 What to Monitor

1. **Lead conversion rate** (leads → clients)
2. **Generation success rate** (should be >95%)
3. **Average generation time** (~60 seconds)
4. **Email delivery rate** (should be >99%)
5. **Mac Mini service uptime**

---

## 🎨 Customization

### Change Prompt Enhancement Style
Edit: `lib/ai/ollama-client.ts` → `enhancePromptForMIDC()`

### Customize Email Template
Edit: `app/api/ai/generate-image/route.ts` → Resend HTML email section

### Adjust Image Quality
Edit: `lib/ai/comfyui-client.ts` → `comfyUIConfig`

### Modify Lead Stages
Edit: `sanity/schemas/lead.ts` → status field options

---

## 🚨 Important Notes

1. **Keep Mac Mini services running** - They need to be online for AI generation to work
2. **Monitor Resend quota** - Free tier = 3k emails/month
3. **Backup Sanity regularly** - Export leads monthly
4. **Check external drive space** - Each lead uses ~5-10MB

---

## 📚 Documentation

- **Quick Start**: `docs/AI_QUICK_START.md` (15 min setup)
- **Full Setup**: `docs/AI_IMAGE_GENERATION_SETUP.md` (detailed guide)
- **Feature Summary**: `docs/AI_FEATURE_SUMMARY.md` (overview)
- **Test Page**: http://localhost:3000/test-ai

---

## ✨ You're All Set!

Your AI image generation feature is ready to use!

**Test it now:**
1. Start Mac Mini services
2. Run `pnpm run dev`
3. Visit http://localhost:3000/test-ai
4. Generate your first AI design!

**Questions?** Check the documentation in the `docs/` folder.

---

**Built with:**
- Next.js 15
- Ollama (Llama3, LLaVA)
- ComfyUI (SDXL)
- Sanity CMS
- Resend
- Framer Motion

**Ready to capture leads with AI! 🚀**
