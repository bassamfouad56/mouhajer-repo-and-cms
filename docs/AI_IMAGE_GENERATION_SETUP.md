# AI Image Generation Setup Guide

This guide explains how to set up the AI-powered image generation feature that connects your website chatbot to Ollama and ComfyUI running on your Mac Mini.

## Architecture Overview

```
User Browser
    ↓
Next.js API (/api/ai/generate-image)
    ↓
    ├─→ Ollama (Mac Mini) - Text/Image Analysis
    │   ├─ LLaVA/Bakllava (Vision Models)
    │   └─ Llama 3 (Text Enhancement)
    ↓
    ├─→ ComfyUI (Mac Mini) - Image Generation
    │   └─ SDXL (Stable Diffusion XL)
    ↓
    ├─→ Sanity CMS - Lead Storage
    │   ├─ User details
    │   ├─ Generated images
    │   └─ Lead lifecycle tracking
    ↓
    ├─→ Mac Mini External Drive - Image Backup
    │   └─ /Volumes/LLM_DATA/ai-generated-images/
    ↓
    └─→ Resend - Email Delivery
        └─ Send generated design to user
```

## Prerequisites

### 1. Mac Mini Setup

#### Install Ollama
```bash
ssh bassamfouad@100.111.21.66
curl https://ollama.ai/install.sh | sh

# Pull required models
ollama pull llama3
ollama pull llava
ollama pull bakllava  # Optional, for better image analysis

# Start Ollama server (accessible from network)
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

#### Install ComfyUI
```bash
# Navigate to your external drive
cd /Volumes/LLM_DATA

# Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install torch torchvision torchaudio
pip install -r requirements.txt

# Download SDXL model
cd models/checkpoints
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors

# Start ComfyUI (accessible from network)
cd /Volumes/LLM_DATA/ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

#### Set Up Image Storage Directory
```bash
# Create directory structure
mkdir -p /Volumes/LLM_DATA/ai-generated-images

# Set proper permissions
chmod 755 /Volumes/LLM_DATA/ai-generated-images

# Create date-based subdirectories (automatic via API)
# Structure: /Volumes/LLM_DATA/ai-generated-images/YYYY-MM-DD/email_timestamp/
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and update:

```bash
# AI Services (Mac Mini)
OLLAMA_BASE_URL=http://100.111.21.66:11434
COMFYUI_BASE_URL=http://100.111.21.66:8188
MAC_MINI_SSH_HOST=bassamfouad@100.111.21.66
MAC_MINI_SSH_KEY_PATH=/path/to/your/ssh/key
EXTERNAL_DRIVE_PATH=/Volumes/LLM_DATA/ai-generated-images

# Resend Email
RESEND_API_KEY=re_your-actual-key-from-resend.com

# Sanity (already configured)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token
```

### 3. Install Dependencies

```bash
cd /d/wbsite/mouhajer-new-marketing-website

# Install Resend for email
pnpm add resend

# Install image processing (if needed)
pnpm add sharp

# Optional: SSH/SCP for file transfer
pnpm add node-ssh scp2
```

### 4. Deploy Sanity Schema

```bash
# Deploy the lead schema to Sanity
pnpm run deploy:sanity

# Or manually in Sanity Studio
npx sanity deploy
```

## Usage

### 1. Embed in Your Chatbot

```tsx
import { AIImageGenerator } from '@/components/ai-chatbot/ai-image-generator';

function ChatBot() {
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  return (
    <>
      <button onClick={() => setShowAIGenerator(true)}>
        Generate AI Design
      </button>

      {showAIGenerator && (
        <AIImageGenerator onClose={() => setShowAIGenerator(false)} />
      )}
    </>
  );
}
```

### 2. API Endpoint

The API is available at `/api/ai/generate-image`

**POST Request:**
```typescript
const formData = new FormData();
formData.append('email', 'client@example.com');
formData.append('prompt', 'Luxury hotel lobby with marble and gold accents');
formData.append('serviceCategory', 'hospitality');
formData.append('image', fileInput.files[0]); // Optional

const response = await fetch('/api/ai/generate-image', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "success": true,
  "message": "Image generated successfully!",
  "data": {
    "leadId": "abc123",
    "imageUrl": "https://cdn.sanity.io/images/...",
    "generationTime": 45,
    "enhancedPrompt": "..."
  }
}
```

### 3. Health Check

Check if AI services are running:

```bash
curl http://localhost:3000/api/ai/generate-image
```

Response:
```json
{
  "status": "healthy",
  "services": {
    "ollama": "online",
    "comfyUI": "online"
  }
}
```

## Lead Management in Sanity

### Lead Lifecycle

1. **New** - Lead created, image generation queued
2. **Processing** - AI generating image
3. **Completed** - Image generated
4. **Sent** - Email delivered to user
5. **Follow-up Required** - Manual follow-up needed
6. **Converted** - Lead became a client
7. **Lost** - Lead did not convert

### Access Leads in Sanity Studio

1. Open Sanity Studio: `http://localhost:3333`
2. Navigate to "AI Image Generation Leads"
3. View lead details:
   - User email & prompt
   - Uploaded reference image
   - Generated AI image
   - Service category
   - Generation time
   - Status & notes

### Lead Export

```bash
# Export all leads to JSON
npx sanity dataset export production leads-export.json --types lead

# Import leads
npx sanity dataset import leads-export.json production
```

## File Organization on Mac Mini

```
/Volumes/LLM_DATA/ai-generated-images/
├── 2025-01-15/
│   ├── client_example_com_1705334400000/
│   │   ├── generated.png
│   │   ├── uploaded.jpg
│   │   └── metadata.json
│   └── another_email_1705334500000/
├── 2025-01-16/
└── 2025-01-17/
```

## Troubleshooting

### Ollama Not Accessible

```bash
# Check if Ollama is running
curl http://100.111.21.66:11434/api/tags

# Restart Ollama
ssh bassamfouad@100.111.21.66
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

### ComfyUI Not Accessible

```bash
# Check if ComfyUI is running
curl http://100.111.21.66:8188/system_stats

# Restart ComfyUI
ssh bassamfouad@100.111.21.66
cd /Volumes/LLM_DATA/ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

### Image Generation Timeout

- Default timeout: 120 seconds
- Increase in `lib/ai/comfyui-client.ts`:
  ```typescript
  export const comfyUIConfig = {
    maxWaitTime: 180000, // 3 minutes
  };
  ```

### Email Not Sending

1. Check Resend API key
2. Verify email domain setup
3. Check logs: `pnpm run dev` and look for email errors

## Performance Optimization

### 1. Cache Ollama Models

Models are loaded into RAM on first use. Keep Ollama running to avoid cold starts.

### 2. Batch Image Generation

For multiple requests, consider queuing:

```typescript
// Future enhancement: job queue with BullMQ or similar
```

### 3. CDN for Generated Images

Sanity CDN automatically handles image delivery with global caching.

## Security Considerations

1. **API Rate Limiting** - Add rate limiting to prevent abuse
2. **Email Validation** - Already implemented
3. **Prompt Filtering** - Already validates service relevance
4. **File Size Limits** - Max 10MB for uploads
5. **CORS** - Configure for production domains

## Monitoring

### Set Up Alerts

Monitor these metrics:
- AI service uptime (Ollama, ComfyUI)
- Image generation success rate
- Average generation time
- Lead conversion rate

### Logs

```bash
# View API logs
pnpm run dev

# Check Mac Mini services
ssh bassamfouad@100.111.21.66
tail -f /var/log/ollama.log
tail -f /var/log/comfyui.log
```

## Future Enhancements

- [ ] Add image-to-image generation (upload reference → generate variation)
- [ ] Implement style presets (Modern, Classic, Arabic, European)
- [ ] Add real-time generation progress with WebSockets
- [ ] Create admin dashboard for lead management
- [ ] Add A/B testing for different prompts
- [ ] Implement automatic follow-up email sequences
- [ ] Add analytics (conversion tracking, popular services)

## Support

For issues or questions:
1. Check logs: `pnpm run dev`
2. Test AI services health: `curl http://localhost:3000/api/ai/generate-image`
3. Verify Mac Mini connectivity: `ping 100.111.21.66`
4. Review Sanity data in Studio

## Cost Considerations

- **Ollama**: Free (runs locally)
- **ComfyUI**: Free (runs locally)
- **Sanity**: Free tier includes 10GB storage, 100k documents
- **Resend**: Free tier includes 3,000 emails/month
- **Mac Mini**: One-time hardware cost, no recurring fees

Total recurring cost: ~$0-50/month depending on volume.
