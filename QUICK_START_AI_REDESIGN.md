# 🚀 AI Room Redesign - Quick Start Guide

A concise guide to get the AI room redesign feature running quickly.

## ⚡ Prerequisites Checklist

- [ ] Mac mini M2/M3 with macOS 13.0+
- [ ] External drive connected (100GB+ free space)
- [ ] Node.js 18+ installed
- [ ] Python 3.10-3.12 installed
- [ ] PostgreSQL database running

---

## 📦 Step 1: Install Dependencies (5 minutes)

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd apps/cms
pip3 install -r python/requirements.txt
```

---

## 💾 Step 2: Download AI Model (30-60 minutes)

```bash
# Install Hugging Face CLI
pip3 install huggingface_hub

# Download Flux.1 Schnell (~23GB)
# Replace /Volumes/ExternalDrive with your drive path
huggingface-cli download black-forest-labs/FLUX.1-schnell \
  --local-dir /Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell \
  --local-dir-use-symlinks False
```

---

## ⚙️ Step 3: Configure Environment Variables (2 minutes)

**File: `apps/cms/.env.local`**

```bash
# Update these paths with YOUR actual paths
AI_MODELS_PATH="/Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell"
AI_OUTPUTS_PATH="/Volumes/ExternalDrive/ai-outputs"
PYTHON_PATH="/opt/homebrew/bin/python3"  # Run: which python3

# Email (use your Zoho app password)
EMAIL_HOST="smtp.zoho.com"
EMAIL_PORT="587"
EMAIL_USER="supply@mouhajerdesign.com"
EMAIL_PASSWORD="your_zoho_app_password"
EMAIL_FROM="Mouhajer Design <supply@mouhajerdesign.com>"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3010"
```

**File: `apps/frontend/.env.local`**

```bash
NEXT_PUBLIC_CMS_URL="http://localhost:3010"
NEXT_PUBLIC_APP_URL="http://localhost:3007"
```

---

## 🗄️ Step 4: Database Migration (1 minute)

```bash
cd apps/cms
npx prisma generate
npx prisma migrate dev --name add_room_redesign
```

---

## 🏃 Step 5: Run the Application (30 seconds)

**Terminal 1:**
```bash
cd apps/cms
npm run dev
```

**Terminal 2:**
```bash
cd apps/frontend
npm run dev
```

---

## ✨ Step 6: Test the Feature (2-5 minutes)

1. **Open:** http://localhost:3007/room-redesign
2. **Upload:** A room photo (JPEG/PNG, max 10MB)
3. **Select:** Design style (e.g., Modern) & room type (e.g., Living Room)
4. **Enter:** Your email address
5. **Click:** "Generate My Redesign"
6. **Wait:** 2-5 minutes
7. **Check:** Your email for the magic link
8. **View:** Interactive before/after slider!

---

## 📊 What to Expect

| Step | Expected Result | Time |
|------|----------------|------|
| Upload | "Processing Your Redesign!" message | Instant |
| AI Generation | Python process running in CMS terminal | 2-5 min |
| Email | Magic link received | <1 min |
| View | Before/after slider loads | Instant |

---

## 🐛 Quick Troubleshooting

### Model not found
```bash
# Check model exists
ls /Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell
# Should show: model_index.json, vae/, unet/, etc.
```

### Python errors
```bash
# Verify Python packages
python3 -c "import torch, diffusers; print('OK')"
```

### Email not sending
```bash
# Test SMTP connection
cd apps/cms
node -e "require('./src/lib/email-service').verifyEmailConfig()"
```

### Out of memory
1. Close other apps
2. Reduce inference steps to 1-2 in `ai-service.ts`
3. Restart Mac mini

---

## 📁 File Structure Overview

```
apps/
├── cms/
│   ├── prisma/
│   │   └── schema.prisma          # ✅ RoomRedesign model added
│   ├── python/
│   │   ├── flux_inference.py      # ✅ AI inference script
│   │   └── requirements.txt       # ✅ Python dependencies
│   ├── src/
│   │   ├── lib/
│   │   │   ├── ai-service.ts      # ✅ Node.js ↔ Python bridge
│   │   │   └── email-service.ts   # ✅ Magic link emails
│   │   └── app/api/room-redesign/
│   │       ├── upload/route.ts    # ✅ Upload endpoint
│   │       ├── verify/route.ts    # ✅ Token verification
│   │       └── image/[id]/[type]/ # ✅ Image serving
│   └── .env.local                 # ⚙️ Configuration
└── frontend/
    └── app/[locale]/room-redesign/
        ├── page.tsx               # ✅ Upload form
        └── view/page.tsx          # ✅ Before/after slider
```

---

## 🎯 Key Features

✅ **Open Source:** Flux.1 Schnell (Apache 2.0 license, free commercial use)
✅ **Local Processing:** All AI runs on your Mac mini external drive
✅ **Fast:** 2-5 minutes per redesign (Schnell = German for "fast")
✅ **Email Verification:** Secure magic links, 24-hour expiry
✅ **Interactive UI:** Drag slider to compare before/after
✅ **No User Accounts:** Email-only, privacy-focused
✅ **Downloadable:** Users can download both images
✅ **Analytics:** Track views, ratings, processing time
✅ **Feedback System:** Built-in rating (1-5 stars)

---

## 🔗 Helpful Commands

```bash
# Check disk space
df -h /Volumes/ExternalDrive

# View CMS logs
cd apps/cms && npm run dev

# View Prisma Studio
cd apps/cms && npx prisma studio

# Test Python script
cd apps/cms
python3 python/flux_inference.py test.jpg "modern" "modern" "living_room" "test123" 4

# Clear old outputs (be careful!)
rm /Volumes/ExternalDrive/ai-outputs/*_original.jpg
rm /Volumes/ExternalDrive/ai-outputs/*_generated.jpg

# Check Python path
which python3

# Monitor system resources
top -o cpu
```

---

## 📖 Full Documentation

For detailed setup, troubleshooting, and production deployment:
👉 See [AI_ROOM_REDESIGN_SETUP.md](./AI_ROOM_REDESIGN_SETUP.md)

---

## ✅ Success Indicators

You'll know it's working when you see:

**In CMS Terminal:**
```
[Upload API] Saved original image to: ...
[AI Service] Spawning Python process...
[AI Service - Python stdout]: Loading Flux.1 Schnell from...
[AI Service - Python stdout]: Generating with prompt: modern interior design...
[AI Service - Python stdout]: Generation completed in 145 seconds
[AI Generation] Completed successfully
[AI Generation] Success email sent to user@example.com
```

**In Your Email:**
```
Subject: 🎨 Your AI Room Redesign is Ready to View!
Click here to view your before-and-after comparison:
[Magic Link]
```

**In Browser:**
Interactive before/after slider with your transformed room!

---

**⏱️ Total Setup Time:** ~45-75 minutes (mostly model download)
**🎨 First Redesign:** 2-5 minutes after upload
**💰 Cost:** $0 (100% open source, runs locally)

Happy redesigning! ✨🏠

