# Google Tag Manager Conversion Tracking Setup Guide

## Overview
This guide will help you set up conversion tracking in Google Tag Manager (GTM) for your Mouhajer Interior Design website to track form submissions and other important user interactions.

**GTM Container ID:** GTM-WT8DXZZ7
**Status:** Already installed in [layout.tsx](apps/frontend/app/[locale]/layout.tsx)

---

## Events Being Tracked

Your website now sends the following events to GTM's dataLayer:

### 1. Contact Form Submission
**Event Name:** `contact_form_submit`

**Data Sent:**
```javascript
{
  event: 'contact_form_submit',
  formType: 'contact',
  formName: 'Contact Form',
  formId: 'contact-form',
  formLocale: 'en' or 'ar',
  value: 1000,        // Lead value in AED
  currency: 'AED'
}
```

**Location:** Triggered from [ContactForm.tsx](apps/frontend/components/ContactForm.tsx)

### 2. Dynamic Form Submission (Enquiry & Other Forms)
**Event Name:** `form_submit`

**Data Sent:**
```javascript
{
  event: 'form_submit',
  formType: 'dynamic',
  formName: 'Enquiry Form' (or other form name),
  formId: 'enquiry-form' (or other form ID),
  formLocale: 'en' or 'ar',
  value: 2000,        // 2000 for enquiry, 1000 for others (AED)
  currency: 'AED'
}
```

**Location:** Triggered from [DynamicForm.tsx](apps/frontend/components/DynamicForm.tsx)

---

## GTM Setup Instructions

### Step 1: Access Google Tag Manager

1. Go to [https://tagmanager.google.com](https://tagmanager.google.com)
2. Log in with your Google account
3. Select your container: **GTM-WT8DXZZ7**

---

### Step 2: Create Variables

#### 2.1 Create Event-Related Variables

Navigate to **Variables** → **User-Defined Variables** → **New**

Create the following variables:

**Variable 1: Form Name**
- Variable Type: Data Layer Variable
- Data Layer Variable Name: `formName`
- Variable Name: `DLV - Form Name`

**Variable 2: Form ID**
- Variable Type: Data Layer Variable
- Data Layer Variable Name: `formId`
- Variable Name: `DLV - Form ID`

**Variable 3: Form Type**
- Variable Type: Data Layer Variable
- Data Layer Variable Name: `formType`
- Variable Name: `DLV - Form Type`

**Variable 4: Form Locale**
- Variable Type: Data Layer Variable
- Data Layer Variable Name: `formLocale`
- Variable Name: `DLV - Form Locale`

**Variable 5: Form Value**
- Variable Type: Data Layer Variable
- Data Layer Variable Name: `value`
- Variable Name: `DLV - Form Value`

---

### Step 3: Create Triggers

#### 3.1 Contact Form Submission Trigger

Navigate to **Triggers** → **New**

- **Trigger Name:** Contact Form Submit
- **Trigger Type:** Custom Event
- **Event name:** `contact_form_submit`
- **This trigger fires on:** All Custom Events

Click **Save**

#### 3.2 Dynamic Form Submission Trigger

Navigate to **Triggers** → **New**

- **Trigger Name:** Dynamic Form Submit
- **Trigger Type:** Custom Event
- **Event name:** `form_submit`
- **This trigger fires on:** All Custom Events

Click **Save**

#### 3.3 All Form Submissions Trigger (Combined)

Navigate to **Triggers** → **New**

- **Trigger Name:** All Form Submissions
- **Trigger Type:** Custom Event
- **Event name:** Use regex: `(contact_form_submit|form_submit)`
- **Use regex matching:** ✅ Checked
- **This trigger fires on:** All Custom Events

Click **Save**

---

### Step 4: Create Tags

#### 4.1 Google Ads Conversion Tag (Contact Form)

**Prerequisites:** You need your Google Ads Conversion ID and Label

Navigate to **Tags** → **New**

- **Tag Name:** Google Ads - Contact Form Conversion
- **Tag Type:** Google Ads Conversion Tracking
- **Conversion ID:** `AW-XXXXXXXXXX` (Get from your Google Ads account)
- **Conversion Label:** `XXXXXXXXXXX` (Get from your Google Ads account)
- **Conversion Value:** `{{DLV - Form Value}}`
- **Currency Code:** AED
- **Transaction ID:** (leave empty or use a unique ID if you have one)
- **Triggering:** Select **Contact Form Submit** trigger

Click **Save**

#### 4.2 Google Ads Conversion Tag (All Forms)

Navigate to **Tags** → **New**

- **Tag Name:** Google Ads - All Form Conversions
- **Tag Type:** Google Ads Conversion Tracking
- **Conversion ID:** `AW-XXXXXXXXXX`
- **Conversion Label:** `XXXXXXXXXXX`
- **Conversion Value:** `{{DLV - Form Value}}`
- **Currency Code:** AED
- **Triggering:** Select **All Form Submissions** trigger

Click **Save**

#### 4.3 Google Analytics 4 Event (Form Submission)

Navigate to **Tags** → **New**

- **Tag Name:** GA4 - Form Submission Event
- **Tag Type:** Google Analytics: GA4 Event
- **Measurement ID:** `G-XXXXXXXXXX` (Your GA4 Measurement ID)
- **Event Name:** `form_submission`
- **Event Parameters:**
  - `form_name`: `{{DLV - Form Name}}`
  - `form_id`: `{{DLV - Form ID}}`
  - `form_type`: `{{DLV - Form Type}}`
  - `form_locale`: `{{DLV - Form Locale}}`
  - `value`: `{{DLV - Form Value}}`
  - `currency`: `AED`
- **Triggering:** Select **All Form Submissions** trigger

Click **Save**

#### 4.4 Facebook Pixel Event (Optional)

If you're using Facebook Ads:

Navigate to **Tags** → **New**

- **Tag Name:** Facebook Pixel - Lead Event
- **Tag Type:** Custom HTML
- **HTML:**
```html
<script>
  fbq('track', 'Lead', {
    content_name: {{DLV - Form Name}},
    value: {{DLV - Form Value}},
    currency: 'AED'
  });
</script>
```
- **Triggering:** Select **All Form Submissions** trigger

Click **Save**

---

### Step 5: Additional Tracking (Recommended)

#### 5.1 Phone Click Tracking

Add click tracking to phone numbers:

**Update your phone links to:**
```html
<a href="tel:+971XXXXXXXX" onclick="dataLayer.push({'event': 'phone_click', 'phone_number': '+971XXXXXXXX', 'value': 500, 'currency': 'AED'})">
```

Then create:
- **Trigger:** Custom Event `phone_click`
- **Tag:** Google Ads Conversion with value 500 AED

#### 5.2 WhatsApp Click Tracking

If your WhatsApp component doesn't already have tracking, update it:

```javascript
// Add to WhatsApp click handler
if (typeof window !== 'undefined' && window.dataLayer) {
  window.dataLayer.push({
    event: 'whatsapp_click',
    button_location: 'floating_button',
    value: 500,
    currency: 'AED'
  });
}
```

Then create:
- **Trigger:** Custom Event `whatsapp_click`
- **Tag:** Google Ads Conversion with value 500 AED

#### 5.3 Portfolio View Tracking

Track when users view portfolio items:

```javascript
// Add to portfolio page
dataLayer.push({
  event: 'portfolio_view',
  project_name: 'Project Name',
  project_category: 'Residential/Commercial'
});
```

#### 5.4 Video Engagement Tracking

If you have video content:

```javascript
// Track video 50% completion
dataLayer.push({
  event: 'video_progress',
  video_title: 'Hero Video',
  video_percent: 50
});
```

---

### Step 6: Get Your Google Ads Conversion IDs

1. Go to [https://ads.google.com](https://ads.google.com)
2. Click on **Goals** → **Conversions** in the menu
3. Click **+ New conversion action**
4. Select **Website**
5. Choose **Contact forms, email, or phone calls**
6. Set up conversion details:
   - **Category:** Submit lead form
   - **Value:** Use different values for different conversions
   - **Count:** One (recommended for lead gen)
7. Click **Create and Continue**
8. Copy your **Conversion ID** (AW-XXXXXXXXXX)
9. Copy your **Conversion Label** (XXXXXXXXXXX)
10. Use these in your GTM tags (Step 4)

**Recommended Conversion Actions to Create:**

1. **High-Value Lead** (Enquiry Form)
   - Value: 2000 AED
   - Category: Submit lead form

2. **Standard Lead** (Contact Form)
   - Value: 1000 AED
   - Category: Submit lead form

3. **Phone Call Click**
   - Value: 500 AED
   - Category: Phone calls

4. **WhatsApp Message**
   - Value: 500 AED
   - Category: Chat

---

### Step 7: Test Your Setup

#### 7.1 Enable Preview Mode

1. In GTM, click **Preview** button (top right)
2. Enter your website URL: `https://yourdomain.com`
3. This will open your site with GTM Debug Console

#### 7.2 Test Form Submissions

1. Fill out and submit the contact form
2. Check the GTM Debug Console for:
   - Event: `contact_form_submit`
   - Variables populated correctly
   - Tags fired successfully

3. Check the **dataLayer** tab to see the event data

#### 7.3 Verify in Google Ads

1. Go to Google Ads → **Goals** → **Conversions**
2. Look for recent conversions
3. Status should show as "Recording conversions"
4. Note: Test conversions may take a few hours to appear

#### 7.4 Use Google Tag Assistant

1. Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website
3. Click the extension icon
4. Submit a form and check if tags fire correctly

---

### Step 8: Submit and Publish

1. In GTM, click **Submit** (top right)
2. Add version name: "Added Form Conversion Tracking"
3. Add version description: "Tracking contact form, enquiry form, and other conversions"
4. Click **Publish**

---

## Testing Checklist

- [ ] GTM container loads on all pages
- [ ] Contact form submission triggers `contact_form_submit` event
- [ ] Enquiry form submission triggers `form_submit` event
- [ ] All variables capture data correctly
- [ ] Google Ads conversion tags fire
- [ ] GA4 events appear in DebugView
- [ ] Test conversions appear in Google Ads (within 24 hours)
- [ ] No console errors related to GTM or dataLayer

---

## Monitoring & Optimization

### Daily Monitoring (First Week)

1. **Check Google Ads Conversions:**
   - Go to Google Ads → Reports → Predefined Reports → Conversions
   - Verify conversions are being recorded
   - Check conversion rates align with form submissions

2. **Check GTM Debug:**
   - Use Preview mode periodically
   - Verify events fire correctly
   - Check for any errors

### Weekly Monitoring

1. **Analyze Conversion Data:**
   - Which forms convert best?
   - Which traffic sources drive conversions?
   - What is the cost per conversion?

2. **Optimize Based on Data:**
   - Adjust bids for high-converting keywords
   - Pause low-performing keywords
   - Test ad copy variations

### Monthly Review

1. **Review all conversion paths**
2. **Check for conversion attribution issues**
3. **Update conversion values if needed**
4. **Add new conversion actions as needed**

---

## Conversion Value Guidelines

Based on your business model, here are recommended conversion values:

| Conversion Type | Value (AED) | Rationale |
|----------------|-------------|-----------|
| Enquiry Form | 2,000 | High intent, project-specific inquiry |
| Contact Form | 1,000 | General inquiry, medium intent |
| Phone Click | 500 | Direct contact, good intent |
| WhatsApp Click | 500 | Immediate communication |
| Portfolio View | 100 | Interest indicator |
| Brochure Download | 200 | High interest |
| Video 50% View | 50 | Engagement indicator |

**Note:** Adjust these values based on your actual lead-to-customer conversion rates and average project values.

---

## Advanced Setup (Optional)

### Enhanced E-commerce Tracking

If you want to track the full customer journey:

```javascript
// When project consultation is booked
dataLayer.push({
  event: 'consultation_booked',
  consultation_type: 'residential_villa',
  estimated_project_value: 500000, // AED
  currency: 'AED'
});

// When project proposal is sent
dataLayer.push({
  event: 'proposal_sent',
  project_type: 'villa_renovation',
  proposal_value: 750000,
  currency: 'AED'
});

// When project is won
dataLayer.push({
  event: 'purchase',
  transaction_id: 'PROJECT-001',
  value: 750000,
  currency: 'AED',
  items: [{
    item_name: 'Villa Interior Design',
    item_category: 'Residential',
    price: 750000,
    quantity: 1
  }]
});
```

### Cross-Domain Tracking

If you have multiple domains (e.g., separate blog):

1. In GTM, configure Auto-Link Domains
2. Add all your domains
3. Enable Link Decoration

### Server-Side Tracking

For better data privacy and reliability:

1. Set up Google Tag Manager Server-Side
2. Route all tags through your server
3. Improve data accuracy and ad blockers bypass

---

## Troubleshooting

### Forms not tracking?

1. **Check browser console for errors**
   ```
   Press F12 → Console tab → Submit form → Check for errors
   ```

2. **Verify dataLayer is available**
   ```javascript
   // In console, type:
   window.dataLayer
   // Should return an array
   ```

3. **Check if GTM is loaded**
   ```javascript
   // In console, type:
   google_tag_manager
   // Should return an object
   ```

### Tags not firing?

1. Use GTM Preview mode
2. Check trigger conditions
3. Verify variable values
4. Check tag firing priority

### Conversions not appearing in Google Ads?

1. **Wait 24-48 hours** (initial delay is normal)
2. Check conversion tracking status
3. Verify Conversion ID and Label are correct
4. Ensure your Google Ads account is linked to GTM
5. Check if Enhanced Conversions is enabled (may cause conflicts)

### Testing Shows Conversions But Not in Reports?

1. Check if conversions are filtered out
2. Verify date ranges in reports
3. Check account-level vs campaign-level reporting
4. Ensure proper attribution windows

---

## Data Privacy & Compliance

### GDPR/Cookie Consent

If targeting EU users, implement cookie consent:

```javascript
// Only push events after consent
if (userConsentGiven) {
  dataLayer.push({
    event: 'form_submit',
    // ... rest of data
  });
}
```

### Recommended Setup:

1. Use a cookie consent banner (e.g., OneTrust, Cookiebot)
2. Block GTM tags until consent is given
3. Use Google Consent Mode v2
4. Update privacy policy

---

## Support & Resources

### Official Documentation:
- [Google Tag Manager Help](https://support.google.com/tagmanager)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722054)
- [GA4 Event Tracking](https://support.google.com/analytics/answer/9267735)

### Video Tutorials:
- [GTM for Beginners - YouTube](https://www.youtube.com/results?search_query=google+tag+manager+tutorial)
- [Google Ads Conversion Tracking Setup](https://www.youtube.com/results?search_query=google+ads+conversion+tracking)

### Community:
- [GTM Community](https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager)
- [r/GoogleTagManager on Reddit](https://www.reddit.com/r/GoogleTagManager/)

---

## Summary

You now have:

✅ **GTM installed** (GTM-WT8DXZZ7) in your website
✅ **Form tracking** implemented in ContactForm and DynamicForm
✅ **Event data** being sent to dataLayer with conversion values
✅ **Comprehensive keyword strategy** (see GOOGLE_ADS_KEYWORD_STRATEGY.md)

### Next Steps:

1. ⏭️ Complete GTM setup (Steps 1-8 above)
2. ⏭️ Create Google Ads conversion actions
3. ⏭️ Test conversion tracking thoroughly
4. ⏭️ Launch your Google Ads campaigns
5. ⏭️ Monitor and optimize based on conversion data

---

**Need Help?**
If you need assistance with the GTM setup, consider:
- Hiring a Google Ads consultant
- Using Google's support resources
- Reaching out to a GTM-certified professional

---

**Document Version:** 1.0
**Last Updated:** October 30, 2025
**Status:** Ready for Implementation
