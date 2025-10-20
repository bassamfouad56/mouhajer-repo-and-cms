# AI Room Redesign Feature - Setup Guide

This document provides complete setup instructions for the AI-powered room redesign feature.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Mac Mini Setup](#mac-mini-setup)
3. [External Drive Setup](#external-drive-setup)
4. [Python Environment Setup](#python-environment-setup)
5. [Node.js Environment Variables](#nodejs-environment-variables)
6. [Database Migration](#database-migration)
7. [Email Configuration](#email-configuration)
8. [Testing the Feature](#testing-the-feature)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Hardware Requirements
- **Mac mini M2/M3** (or higher) with macOS 13.0+
- **External Hard Drive** (SSD recommended, minimum 100GB free space)
- **Minimum 16GB RAM** (32GB recommended)
- **Internet connection** for initial model download

### Software Requirements
- **Node.js** 18.0.0 or higher
- **Python** 3.10, 3.11, or 3.12
- **PostgreSQL** database
- **Git** for version control

---

## 🖥️ Mac Mini Setup

### 1. Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Python 3.11
```bash
brew install python@3.11
```

Verify installation:
```bash
python3 --version  # Should show Python 3.11.x
```

### 3. Set Python Path Environment Variable
Add to your `~/.zshrc` or `~/.bash_profile`:
```bash
export PYTHON_PATH=$(which python3)
```

Reload your shell:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

---

## 💾 External Drive Setup

### 1. Connect External Drive
Connect your external SSD/HDD to the Mac mini via USB-C or Thunderbolt.

### 2. Format Drive (if new)
1. Open **Disk Utility**
2. Select your external drive
3. Click **Erase**
4. Format: **APFS** (recommended) or **Mac OS Extended (Journaled)**
5. Name: `ExternalDrive` (or your preferred name)

### 3. Create Directory Structure
```bash
# Replace /Volumes/ExternalDrive with your actual drive path
mkdir -p /Volumes/ExternalDrive/ai-models/flux
mkdir -p /Volumes/ExternalDrive/ai-outputs
```

### 4. Set Permissions
```bash
chmod -R 755 /Volumes/ExternalDrive/ai-models
chmod -R 755 /Volumes/ExternalDrive/ai-outputs
```

### 5. Download Flux.1 Schnell Model

**Option A: Using Hugging Face CLI (Recommended)**

Install Hugging Face CLI:
```bash
pip3 install huggingface_hub
```

Download the model:
```bash
huggingface-cli download black-forest-labs/FLUX.1-schnell \
  --local-dir /Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell \
  --local-dir-use-symlinks False
```

**Option B: Manual Download**

1. Visit: https://huggingface.co/black-forest-labs/FLUX.1-schnell
2. Download all files to `/Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell`

**Model Size:** ~23GB (download time depends on your internet speed)

### 6. Verify Model Files
```bash
ls -lh /Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell
```

You should see files like:
- `model_index.json`
- `vae/`
- `text_encoder/`
- `unet/`
- etc.

---

## 🐍 Python Environment Setup

### 1. Navigate to CMS Directory
```bash
cd apps/cms
```

### 2. Create Virtual Environment (Recommended)
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Python Dependencies
```bash
pip3 install torch torchvision torchaudio
pip3 install diffusers
pip3 install transformers
pip3 install accelerate
pip3 install pillow
pip3 install sentencepiece
pip3 install protobuf
```

**Alternative:** Create a requirements.txt file:
```bash
cat > python/requirements.txt << EOF
torch>=2.0.0
torchvision>=0.15.0
torchaudio>=2.0.0
diffusers>=0.27.0
transformers>=4.36.0
accelerate>=0.25.0
pillow>=10.0.0
sentencepiece>=0.1.99
protobuf>=4.25.0
EOF

pip3 install -r python/requirements.txt
```

### 4. Verify Installation
```bash
python3 -c "import torch; print('PyTorch:', torch.__version__)"
python3 -c "import diffusers; print('Diffusers:', diffusers.__version__)"
python3 -c "from PIL import Image; print('Pillow: OK')"
```

### 5. Test Python Script
```bash
# Make script executable
chmod +x python/flux_inference.py

# Test basic import (should not error)
python3 python/flux_inference.py
# Should show usage error, which is expected
```

---

## ⚙️ Node.js Environment Variables

### 1. CMS Environment Variables

Create or edit `apps/cms/.env.local`:

```bash
# ========================================
# EXISTING VARIABLES (keep these)
# ========================================
mouhajerCms_PRISMA_DATABASE_URL="your_postgres_url"
mouhajerCms_DATABASE_URL="your_direct_postgres_url"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3010"

# ========================================
# AI ROOM REDESIGN - NEW VARIABLES
# ========================================

# External Drive Paths (UPDATE THESE with your actual paths)
EXTERNAL_DRIVE_PATH="/Volumes/ExternalDrive"
AI_MODELS_PATH="/Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell"
AI_OUTPUTS_PATH="/Volumes/ExternalDrive/ai-outputs"

# Python Configuration
PYTHON_PATH="/opt/homebrew/bin/python3"  # Update with: which python3

# Email Configuration (Zoho SMTP - already configured in frontend)
EMAIL_HOST="smtp.zoho.com"
EMAIL_PORT="587"
EMAIL_USER="supply@mouhajerdesign.com"  # Or your email
EMAIL_PASSWORD="your_zoho_app_password"  # Create app password in Zoho
EMAIL_FROM="Mouhajer Design <supply@mouhajerdesign.com>"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3010"  # Update for production
```

### 2. Frontend Environment Variables

Create or edit `apps/frontend/.env.local`:

```bash
# ========================================
# EXISTING VARIABLES (keep these)
# ========================================
NEXT_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:3010/api/graphql"

# ========================================
# AI ROOM REDESIGN - NEW VARIABLES
# ========================================

# CMS API URL (for room redesign uploads)
NEXT_PUBLIC_CMS_URL="http://localhost:3010"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3007"  # Update for production
```

### 3. Production Environment Variables

For production deployment, update:

**CMS (.env.production):**
```bash
AI_MODELS_PATH="/path/to/production/external/drive/ai-models/flux/FLUX.1-schnell"
AI_OUTPUTS_PATH="/path/to/production/external/drive/ai-outputs"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
EMAIL_HOST="smtp.zoho.com"
EMAIL_FROM="Mouhajer Design <supply@mouhajerdesign.com>"
```

**Frontend (.env.production):**
```bash
NEXT_PUBLIC_CMS_URL="https://cms.yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

---

## 🗄️ Database Migration

### 1. Navigate to CMS Directory
```bash
cd apps/cms
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Migration
```bash
npx prisma migrate dev --name add_room_redesign_feature
```

This will create the `room_redesigns` table with all necessary fields.

### 4. Verify Migration
```bash
npx prisma studio
```

Open Prisma Studio and check that the `RoomRedesign` model appears in the left sidebar.

---

## 📧 Email Configuration

### 1. Using Zoho Mail (Already Configured)

The frontend already uses Zoho SMTP. You need to create an **App Password** for security:

1. Log in to Zoho Mail
2. Go to **Settings** → **Security** → **App Passwords**
3. Click **Generate New Password**
4. Name it: "Mouhajer AI Redesign"
5. Copy the generated password
6. Use this in your `.env.local` as `EMAIL_PASSWORD`

### 2. Test Email Configuration

```bash
cd apps/cms
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: 'supply@mouhajerdesign.com',
    pass: 'YOUR_APP_PASSWORD'
  }
});

transporter.verify().then(() => {
  console.log('✅ Email configuration is valid');
}).catch(err => {
  console.error('❌ Email configuration error:', err);
});
"
```

### 3. Alternative: Gmail SMTP

If you prefer Gmail:

```bash
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your@gmail.com"
EMAIL_PASSWORD="your_app_password"  # Generate from Google Account settings
```

---

## 🧪 Testing the Feature

### 1. Install Dependencies
```bash
# From root directory
npm install

# Or install individually
cd apps/frontend && npm install
cd apps/cms && npm install
```

### 2. Start Development Servers

**Terminal 1 - CMS:**
```bash
cd apps/cms
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

### 3. Access the Feature

1. Open browser to: http://localhost:3007/room-redesign
2. Upload a room photo (use a test image)
3. Select design style and room type
4. Enter your email address
5. Click "Generate My Redesign"

### 4. Monitor Logs

Watch the CMS terminal for:
```
[Upload API] Saved original image to: /Volumes/ExternalDrive/ai-outputs/...
[AI Generation] Starting for redesign xxx
[AI Service] Spawning Python process...
[AI Service - Python stdout]: Loading Flux.1 Schnell from...
[AI Service - Python stdout]: Generation completed in X seconds
[AI Generation] Completed successfully
[AI Generation] Success email sent to user@example.com
```

### 5. Check Email

You should receive an email with a magic link within 2-5 minutes.

### 6. View Results

Click the link in the email to see the before/after comparison with the interactive slider.

---

## 🐛 Troubleshooting

### Issue: Python script not found

**Error:** `Python script not found at .../flux_inference.py`

**Solution:**
```bash
# Check script exists
ls -l apps/cms/python/flux_inference.py

# Make executable
chmod +x apps/cms/python/flux_inference.py
```

### Issue: Model path not accessible

**Error:** `Model path not accessible: /Volumes/ExternalDrive/...`

**Solutions:**
1. Verify external drive is mounted: `ls /Volumes/`
2. Check permissions: `ls -ld /Volumes/ExternalDrive/ai-models`
3. Update `.env.local` with correct path
4. Try absolute path: `$(pwd)/path/to/models`

### Issue: Out of memory (MPS backend)

**Error:** `RuntimeError: MPS backend out of memory`

**Solutions:**
1. Close other applications
2. Reduce image size in upload (resize before AI processing)
3. Use fewer inference steps (change to 1-2 instead of 4)
4. Restart Mac mini

### Issue: Email not sending

**Error:** `Failed to send email`

**Solutions:**
1. Verify SMTP credentials in `.env.local`
2. Check Zoho app password is correct
3. Test with the email verification script above
4. Check firewall/network settings
5. Try alternative SMTP port: 465 (SSL)

### Issue: Database connection failed

**Error:** `Can't reach database server`

**Solutions:**
1. Verify PostgreSQL is running
2. Check `mouhajerCms_DATABASE_URL` in `.env.local`
3. Run `npx prisma studio` to test connection
4. Restart PostgreSQL service

### Issue: Slow AI generation

**Observation:** Taking >10 minutes

**Solutions:**
1. Check Mac mini isn't thermal throttling (Activity Monitor)
2. Ensure using Metal (MPS) not CPU
3. Verify model loaded correctly (check logs)
4. Use Flux Schnell (not Dev) for speed
5. Reduce inference steps to 1-2

### Issue: Token expired errors

**Error:** `This link has expired`

**Solution:**
Tokens expire after 24 hours. This is intentional for security. User needs to generate a new redesign.

---

## 📊 Performance Benchmarks

Expected performance on Mac mini M2/M3:

| Configuration | Processing Time | Quality |
|---------------|----------------|---------|
| Flux Schnell (1 step) | 30-60 seconds | Good |
| Flux Schnell (4 steps) | 2-4 minutes | Excellent |
| Flux Dev (20 steps) | 10-15 minutes | Best |

**Recommendation:** Use Flux Schnell with 4 steps for production (best speed/quality balance).

---

## 🚀 Next Steps

1. **Test with Real Images:** Upload actual room photos to validate quality
2. **Monitor Disk Space:** AI outputs accumulate - implement cleanup job
3. **Add Rate Limiting:** Prevent abuse (e.g., 5 uploads per email per day)
4. **Setup Monitoring:** Track generation failures and email delivery
5. **Optimize Costs:** Consider CDN for serving images if traffic scales
6. **User Feedback:** Collect ratings to improve prompts and styles

---

## 📚 Additional Resources

- **Flux.1 Documentation:** https://huggingface.co/black-forest-labs/FLUX.1-schnell
- **Diffusers Library:** https://huggingface.co/docs/diffusers
- **React Compare Slider:** https://react-compare-slider.vercel.app
- **Nodemailer Docs:** https://nodemailer.com
- **Prisma Documentation:** https://www.prisma.io/docs

---

## 🆘 Support

If you encounter issues not covered in this guide:

1. Check CMS terminal logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test Python script independently
4. Check external drive permissions and available space
5. Review Prisma migration status: `npx prisma migrate status`

---

**Last Updated:** January 2025
**Feature Version:** 1.0.0
**Compatible with:** Next.js 14, Prisma 6, Flux.1 Schnell
