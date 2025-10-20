# Vercel Environment Variables Setup

## ✅ Google Analytics 4 - READY TO DEPLOY

Your GA4 Measurement ID: **G-J64X79BD59**

---

## 🚀 Add to Vercel (Choose Method)

### Method 1: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **mouhajer-repo** (or whatever your project is named)
3. Click **Settings** → **Environment Variables**
4. Add these three variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-J64X79BD59` | Production, Preview, Development |
| `NEXT_PUBLIC_FB_PIXEL_ID` | *(leave empty for now)* | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://mahermouhajer.com` | Production, Preview, Development |

5. Click **Save**
6. **Redeploy** your application for changes to take effect

---

### Method 2: Vercel CLI

```bash
# Link your project first (run from mouhajer-repo directory)
vercel link

# Then add environment variables
echo "G-J64X79BD59" | vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
echo "https://mahermouhajer.com" | vercel env add NEXT_PUBLIC_SITE_URL production

# Trigger a new deployment
vercel --prod
```

---

## 📊 Verify Google Analytics is Working

### After deployment, test:

1. **Visit your website**: https://mahermouhajer.com
2. **Open browser console** (F12)
3. **Check for GA4 script**:
   ```javascript
   // In console, type:
   window.dataLayer
   // Should show array with events
   ```

4. **Check Google Analytics**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Open your property
   - Click **Reports** → **Realtime**
   - Visit your website in another tab
   - Should see active users within 30 seconds

---

## 🔍 Troubleshooting

### GA4 not tracking?

**Check 1: Environment variable set?**
```bash
# In Vercel, go to Settings → Environment Variables
# Verify NEXT_PUBLIC_GA_MEASUREMENT_ID = G-J64X79BD59
```

**Check 2: Deployment triggered?**
- After adding env variables, you MUST redeploy
- Vercel → Deployments → Click "..." → Redeploy

**Check 3: Browser console**
```javascript
// Should see gtag script loaded
console.log(window.gtag)

// Should see dataLayer
console.log(window.dataLayer)
```

**Check 4: Network tab**
- Open DevTools → Network tab
- Filter by "collect"
- Should see requests to `google-analytics.com/g/collect`

---

## 📱 Facebook Pixel Setup (Optional)

If you want to add Facebook Pixel later:

1. Go to [Facebook Business Manager](https://business.facebook.com)
2. Navigate to **Events Manager**
3. Create Pixel for mahermouhajer.com
4. Copy Pixel ID (15-16 digits)
5. Add to Vercel:
   - Variable: `NEXT_PUBLIC_FB_PIXEL_ID`
   - Value: Your pixel ID
6. Redeploy

---

## ✅ Current Status

- [x] GA4 configured in code
- [x] Measurement ID: G-J64X79BD59
- [x] Local environment ready (.env.local)
- [ ] **Next step: Add to Vercel production environment**
- [ ] Redeploy to activate tracking

---

## 🎯 Expected Results After Deployment

Within **5-10 minutes** of deployment:
- ✅ Google Analytics Real-Time shows visitors
- ✅ Page views tracked
- ✅ User engagement events tracked
- ✅ Conversion events from lead gen form tracked

Within **24-48 hours**:
- ✅ Full traffic reports populate
- ✅ User demographics available
- ✅ Acquisition channels visible
- ✅ Behavior flow shows user journeys

---

## 📞 Need Help?

If you see "No data received" after 24 hours:
1. Check Vercel environment variables are set
2. Verify deployment completed successfully
3. Test with browser DevTools console
4. Check Google Analytics Debug mode

**Quick Test Command:**
```javascript
// Run in browser console on your site:
gtag('event', 'test_event', { 'test_param': 'test_value' });
// Then check GA4 Real-Time → Events to see if it appears
```
