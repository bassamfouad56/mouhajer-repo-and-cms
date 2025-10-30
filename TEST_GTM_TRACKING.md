# GTM Tracking Test Guide

## How to Test Your Google Tag Manager Setup

This guide will help you verify that all tracking events are firing correctly.

---

## Prerequisites

1. **Browser:** Chrome or Firefox (recommended for testing)
2. **Extensions:**
   - [Google Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) - Chrome extension
   - Or use browser Developer Tools (F12)

---

## Method 1: Browser Console Testing (Quick Test)

### Step 1: Open Developer Tools

1. Open your website in Chrome/Firefox
2. Press `F12` or `Right Click → Inspect`
3. Go to the **Console** tab

### Step 2: Check if dataLayer Exists

Type in the console:
```javascript
window.dataLayer
```

**Expected Result:** Should return an array with GTM initialization data
```javascript
[{...}, {...}, ...]  // Array of objects
```

If you see `undefined`, GTM is not loaded properly.

### Step 3: Test Contact Form

1. Fill out the contact form on your website
2. Submit the form
3. Watch the console - you should see the event being pushed

Or manually check by typing:
```javascript
window.dataLayer
```

Look for an object with:
```javascript
{
  event: "contact_form_submit",
  formType: "contact",
  formName: "Contact Form",
  formId: "contact-form",
  formLocale: "en",
  value: 1000,
  currency: "AED"
}
```

### Step 4: Test Enquiry Form

1. Navigate to a page with an enquiry form
2. Submit the form
3. Check dataLayer:

```javascript
window.dataLayer
```

Look for:
```javascript
{
  event: "form_submit",
  formType: "dynamic",
  formName: "Enquiry Form",
  formId: "enquiry-form",
  formLocale: "en",
  value: 2000,
  currency: "AED"
}
```

### Step 5: Test WhatsApp Button

1. Click the WhatsApp floating button
2. Check dataLayer:

```javascript
window.dataLayer
```

Look for:
```javascript
{
  event: "whatsapp_click",
  button_location: "floating_button",
  phone_number: "971523041482",
  value: 500,
  currency: "AED"
}
```

---

## Method 2: GTM Preview Mode (Recommended)

### Step 1: Enter Preview Mode

1. Go to [https://tagmanager.google.com](https://tagmanager.google.com)
2. Select your container: **GTM-WT8DXZZ7**
3. Click **Preview** button (top right)
4. Enter your website URL
5. Click **Connect**

### Step 2: Debug Window Opens

A new tab opens showing your website with a GTM debug panel at the bottom.

### Step 3: Test Each Event

#### Test 1: Contact Form
1. Fill out contact form
2. Submit
3. In debug panel, you should see:
   - Event appears in timeline: `contact_form_submit`
   - Click on the event to see details
   - Check **Data Layer** tab to see all variables
   - Check **Tags** tab to see which tags fired

**Success Indicators:**
- ✅ Event appears in timeline
- ✅ All variables are populated correctly
- ✅ Tags fire successfully (green checkmarks)

#### Test 2: Enquiry Form
1. Navigate to enquiry form
2. Submit form
3. Check debug panel for `form_submit` event
4. Verify all data is correct

#### Test 3: WhatsApp Click
1. Click WhatsApp button
2. Check debug panel for `whatsapp_click` event
3. Verify data is captured

### Step 4: Check Tags Fired

For each event, verify that your tags fired:
- Google Ads Conversion Tag: Should show "Tag Fired Successfully"
- GA4 Event Tag: Should show "Tag Fired Successfully"
- Any other tags you configured

---

## Method 3: Google Tag Assistant (Chrome Extension)

### Step 1: Install Extension

1. Install [Google Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Pin it to your toolbar

### Step 2: Enable Recording

1. Go to your website
2. Click the Tag Assistant icon
3. Click **Enable** button
4. Refresh the page

### Step 3: Perform Actions

1. Navigate around your site
2. Submit forms
3. Click WhatsApp button

### Step 4: Review Results

1. Click Tag Assistant icon again
2. Click **Show Full Report**
3. Review all tags that fired
4. Check for any errors or warnings

---

## Method 4: Network Tab Monitoring

### Step 1: Open Network Tab

1. Press `F12`
2. Go to **Network** tab
3. Filter by: `gtm` or `google-analytics` or `googleadservices`

### Step 2: Perform Actions

1. Submit forms
2. Click buttons

### Step 3: Check Requests

You should see network requests to:
- `https://www.googletagmanager.com/gtm.js`
- `https://www.google-analytics.com/collect` (GA4)
- `https://googleads.g.doubleclick.net/pagead/viewthroughconversion/` (Google Ads)

Click on these requests to see the data being sent.

---

## Verification Checklist

### Basic Setup
- [ ] GTM container loads on all pages
- [ ] No JavaScript errors in console
- [ ] dataLayer is defined and accessible
- [ ] GTM container ID (GTM-WT8DXZZ7) is correct

### Contact Form Tracking
- [ ] Form submission triggers event
- [ ] Event name is `contact_form_submit`
- [ ] All variables are captured (formName, formId, value, etc.)
- [ ] Tags fire successfully
- [ ] No errors in console

### Enquiry Form Tracking
- [ ] Form submission triggers event
- [ ] Event name is `form_submit`
- [ ] FormId identifies enquiry forms correctly
- [ ] Value is 2000 AED for enquiry forms
- [ ] Tags fire successfully

### WhatsApp Tracking
- [ ] Button click triggers event
- [ ] Event name is `whatsapp_click`
- [ ] Button location is tracked
- [ ] Value is 500 AED
- [ ] Tags fire successfully

### Google Ads Integration
- [ ] Conversion tags fire on form submission
- [ ] Conversion value is passed correctly
- [ ] Currency code is AED
- [ ] Conversions appear in Google Ads (within 24-48 hours)

### Google Analytics 4
- [ ] Events appear in GA4 DebugView
- [ ] Event parameters are captured correctly
- [ ] Events appear in real-time reports

---

## Common Issues & Solutions

### Issue 1: dataLayer is undefined
**Solution:**
- Check if GTM script is loaded in `<head>`
- Look for the GTM script in [layout.tsx](apps/frontend/app/[locale]/layout.tsx)
- Verify container ID is correct (GTM-WT8DXZZ7)
- Clear browser cache and reload

### Issue 2: Events not showing in dataLayer
**Solution:**
- Check browser console for JavaScript errors
- Verify form submission is successful
- Check that the event push code is being executed
- Add `console.log()` before dataLayer.push to debug

### Issue 3: Tags not firing in GTM
**Solution:**
- Check trigger configuration in GTM
- Verify event name matches exactly
- Check if tag is paused or has errors
- Ensure variables are configured correctly

### Issue 4: Conversions not in Google Ads
**Solution:**
- Wait 24-48 hours for initial data
- Verify Conversion ID and Label are correct
- Check conversion action is not paused
- Ensure Google Ads account is linked to GTM

### Issue 5: Multiple events firing
**Solution:**
- Check if form submission handler is called multiple times
- Remove duplicate event listeners
- Use `event.preventDefault()` properly

---

## Testing Script

You can use this script in the browser console for quick testing:

```javascript
// Test if GTM is loaded
console.log('GTM Loaded:', typeof google_tag_manager !== 'undefined');

// Test dataLayer
console.log('dataLayer exists:', typeof window.dataLayer !== 'undefined');
console.log('dataLayer contents:', window.dataLayer);

// Manually trigger a test event
window.dataLayer.push({
  event: 'test_event',
  test_data: 'This is a test'
});

console.log('Test event pushed. Check GTM Preview mode.');

// Listen for all dataLayer pushes
var originalPush = window.dataLayer.push;
window.dataLayer.push = function() {
  console.log('dataLayer push:', arguments);
  return originalPush.apply(this, arguments);
};
console.log('Now monitoring all dataLayer pushes in console.');
```

---

## Real-World Test Scenarios

### Scenario 1: New Visitor Flow

1. Open site in incognito mode (simulates new visitor)
2. Browse to services page
3. View portfolio
4. Fill out enquiry form
5. Submit form
6. Check all events fired correctly

**Expected Events:**
1. Page views tracked
2. Portfolio views tracked (if implemented)
3. Form submission tracked
4. Conversion recorded

### Scenario 2: Return Visitor

1. Visit site normally (with cookies)
2. Click WhatsApp button
3. Check event tracking

**Expected:**
- WhatsApp click tracked
- User recognized (if using GA4 User-ID)

### Scenario 3: Mobile User

1. Open site on mobile device
2. Submit contact form
3. Check if tracking works on mobile

**Expected:**
- Same events fire as desktop
- Touch interactions tracked

---

## Monitoring After Launch

### Week 1: Daily Checks

**Monday-Friday:**
1. Check Google Ads for conversions
2. Review GTM debug console
3. Check for any JavaScript errors
4. Verify conversion rates are reasonable

**What to look for:**
- Are conversions being recorded?
- Do conversion numbers match form submissions?
- Any unusual patterns?

### Week 2-4: Weekly Reviews

**Weekly:**
1. Review conversion trends
2. Check for any drop in tracking
3. Verify no new bugs introduced
4. Review Google Ads performance

### Monthly: Deep Dive

**Monthly:**
1. Full audit of all tracking
2. Review conversion paths
3. Check for tracking gaps
4. Update conversion values if needed
5. Review and optimize ad campaigns

---

## Advanced Testing

### Test Enhanced Conversions

If you've set up enhanced conversions:

```javascript
// Check if user data is being hashed and sent
// Should see SHA-256 hashed email in network requests
```

### Test Server-Side Tracking

If using GTM Server-Side:

1. Check if events are sent to your server endpoint
2. Verify server-side GTM processes events
3. Confirm data forwarded to Google Ads/Analytics

### Test Cross-Domain Tracking

If using multiple domains:

1. Navigate from main site to subdomain
2. Check if _ga parameter is passed in URL
3. Verify same user session continues

---

## Reporting & Documentation

### Create Testing Log

Document your tests:

| Date | Test | Result | Issues Found | Resolution |
|------|------|--------|--------------|------------|
| 2025-10-30 | Contact Form | ✅ Pass | None | - |
| 2025-10-30 | Enquiry Form | ✅ Pass | None | - |
| 2025-10-30 | WhatsApp Click | ✅ Pass | None | - |

### Share with Team

After testing, share results:
- Screenshot of successful GTM debug session
- Screenshot of first conversion in Google Ads
- Summary of what's being tracked
- Known limitations

---

## Final Checklist Before Going Live

- [ ] All forms tested and tracking correctly
- [ ] WhatsApp button tracks clicks
- [ ] GTM Preview mode shows all events
- [ ] Google Ads conversion actions created
- [ ] Conversion values are reasonable
- [ ] No JavaScript errors in production
- [ ] Privacy policy updated (if needed)
- [ ] Cookie consent implemented (if needed)
- [ ] Team trained on how to check conversions
- [ ] Documentation shared with stakeholders
- [ ] Backup plan in case of issues

---

## Emergency Rollback Plan

If tracking breaks in production:

1. **Immediate:**
   - Use GTM Version History
   - Revert to previous version
   - Click "Version" → Select last working version → Publish

2. **Investigate:**
   - Check what changed
   - Review recent deployments
   - Check for conflicts

3. **Fix:**
   - Identify the issue
   - Test fix in GTM Preview
   - Re-publish fixed version

4. **Prevent:**
   - Always test in Preview before publishing
   - Use GTM version descriptions
   - Keep changelog

---

## Success Criteria

Your tracking is successful when:

✅ All forms send conversion events
✅ GTM Preview mode shows all events correctly
✅ Google Ads receives conversion data within 48 hours
✅ GA4 shows events in real-time reports
✅ Conversion rates are reasonable (2-10% for luxury services)
✅ No JavaScript errors in console
✅ Tracking works on desktop, mobile, and tablet
✅ Tracking works in all major browsers (Chrome, Safari, Firefox)

---

## Getting Help

If you encounter issues:

1. **Check GTM Community:**
   - [GTM Community Forum](https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager)

2. **Hire an Expert:**
   - Google Partners Directory
   - Upwork/Fiverr for GTM specialists

3. **Google Support:**
   - Google Ads support (if conversion tracking issues)
   - Google Analytics support (if GA4 issues)

4. **Documentation:**
   - Re-read GTM_CONVERSION_TRACKING_SETUP.md
   - Check Google's official documentation

---

## Conclusion

You now have:
- ✅ Tracking code implemented in all forms
- ✅ WhatsApp button tracking
- ✅ Comprehensive testing guide
- ✅ Troubleshooting steps
- ✅ Monitoring plan

**Next Step:** Follow this guide to test everything before launching your Google Ads campaigns!

---

**Last Updated:** October 30, 2025
**Document Version:** 1.0
