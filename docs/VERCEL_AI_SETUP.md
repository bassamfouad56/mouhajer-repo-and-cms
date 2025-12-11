# Vercel AI Setup with Groq (RECOMMENDED)

## Why Groq + Vercel AI SDK?

1. ✅ **FREE**: 14,000 requests/day (400+ conversations/day)
2. ✅ **ULTRA FAST**: < 1 second response time
3. ✅ **Serverless**: Works perfectly on Vercel
4. ✅ **Reliable**: 99.9% uptime
5. ✅ **Easy**: 15 minute setup

---

## Step 1: Get Groq API Key (5 minutes)

1. **Sign up**: https://console.groq.com/
2. **Verify email**
3. **Go to**: API Keys → Create API Key
4. **Copy the key**: `gsk_...`

---

## Step 2: Install Dependencies

```bash
cd "d:\wbsite\mouhajer-new-marketing-website"
pnpm add ai @ai-sdk/openai
```

---

## Step 3: Add Environment Variables

Add to `.env.local`:
```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

Add to Vercel (for production):
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add: `GROQ_API_KEY` = your key
3. Redeploy

---

## Step 4: Update Chat API

I'll modify `app/api/chat/route.ts` to use Groq with Mac Mini fallback.

---

## Architecture

```
User Message
    ↓
Try Groq (FREE, fast, reliable) ⚡
    ├─ Success → AI Response (< 1s)
    └─ Failure → Try Mac Mini Ollama
                  ├─ Success → AI Response
                  └─ Failure → Keyword Fallback
```

**Result**: Triple-layer safety net!

---

## Benefits

| Provider | Speed | Cost | Reliability |
|----------|-------|------|-------------|
| **Groq** | ⚡⚡⚡⚡⚡ < 1s | FREE | ✅ 99.9% |
| Mac Mini Ollama | ⚡⚡ 3-5s | FREE | ⚠️ When online |
| Keyword Fallback | ⚡⚡⚡⚡⚡ instant | FREE | ✅ 100% |

---

## Free Tier Limits

- **Requests**: 14,400/day (30 req/min)
- **Estimated**: 400-500 conversations/day
- **Overage**: Just falls back to Mac Mini or keywords

**More than enough for your website!**

---

## Ready to Set Up?

Just give me your Groq API key and I'll:
1. ✅ Install Vercel AI SDK
2. ✅ Update chat API to use Groq
3. ✅ Keep Mac Mini as backup
4. ✅ Test everything works

Say "here's my Groq key: gsk_..." and I'll set it up! 🚀
