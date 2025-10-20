# Contact Forms Audit Report

**Date**: October 11, 2025
**Audited By**: Claude Code
**Project**: Mouhajer International Design

---

## Executive Summary

This audit evaluated all contact forms on the Mouhajer website to verify:
1. ✅ Email delivery to info@mouhajerdesign.com
2. ❌ **CMS lead storage (NOT IMPLEMENTED)**
3. ✅ Data validation and sanitization
4. ✅ Error handling
5. ✅ User experience (auto-response emails)

### Critical Finding
**⚠️ Lead data is NOT being saved to the CMS database.** Both API routes only log leads to console and send emails. No database storage is implemented.

---

## Forms Inventory

### 1. Lead Generation Popup
- **Component**: [components/LeadGenPopup.tsx:166-219](components/LeadGenPopup.tsx#L166)
- **API Endpoint**: `/api/lead-generation`
- **Status**: ✅ Emails working | ❌ Database storage missing

### 2. Main Contact Form (Enquiry)
- **Component**: [components/ContactFormForm.tsx:46-93](components/ContactFormForm.tsx#L46)
- **API Endpoint**: `/api/sendEnquiryEmail`
- **Status**: ⚠️ Wrong email recipient (inquiry@mouhajerdesign.com instead of info@)

### 3. Supplier Contact Form
- **Component**: [components/ContactForm.tsx](components/ContactForm.tsx)
- **API Endpoint**: Routes to either SupplierForm or EnquiryForm
- **Status**: ✅ Working (conditional routing)

---

## Detailed Analysis

### Lead Generation Popup Form

**File**: [app/[locale]/api/lead-generation/route.ts](app/[locale]/api/lead-generation/route.ts)

#### ✅ What's Working:
1. **Rate limiting** (5 requests per 15 minutes per IP)
2. **Email validation** with regex
3. **Field validation** (name, email, phone, projectType required)
4. **Dual email system**:
   - Admin email to `info@mouhajerdesign.com` (line 181)
   - Auto-response to customer in EN/AR
5. **Professional HTML email templates**
6. **Google Analytics tracking** in frontend
7. **Locale-aware responses** (EN/AR)
8. **IP tracking** for security

#### ❌ Critical Issues:
1. **NO DATABASE STORAGE** - Line 194-204 only logs to console:
   ```typescript
   // Log lead data (in production, save to database)
   console.log('New lead generated:', {
     name, email, phone, projectType, budget, locale,
     timestamp: new Date().toISOString(), ip, source: 'lead_popup'
   });
   ```

2. **SMTP Configuration** uses generic env variables instead of Zoho:
   ```typescript
   host: process.env['SMTP_HOST'] || "smtp.gmail.com",
   port: parseInt(process.env['SMTP_PORT'] || "587"),
   ```

#### Email Flow:
```
User submits lead popup
    ↓
POST /api/lead-generation
    ↓
Rate limit check (5/15min)
    ↓
Validate: name, email, phone, projectType
    ↓
Send 2 emails:
    ├─ Admin: info@mouhajerdesign.com ✅
    └─ Customer: auto-response (EN/AR) ✅
    ↓
Log to console (NO DB SAVE) ❌
    ↓
Return 200 OK
```

---

### Main Contact Form (Enquiry)

**File**: [app/[locale]/api/sendEnquiryEmail/route.ts](app/[locale]/api/sendEnquiryEmail/route.ts)

#### ✅ What's Working:
1. **Zoho SMTP integration** (proper configuration)
2. **Professional email template** with all form fields
3. **Error handling** with try-catch

#### ❌ Critical Issues:
1. **WRONG EMAIL RECIPIENT** - Line 30 sends to `inquiry@mouhajerdesign.com` instead of `info@mouhajerdesign.com`:
   ```typescript
   to: "inquiry@mouhajerdesign.com", // SHOULD BE: info@mouhajerdesign.com
   ```

2. **NO DATABASE STORAGE** - Does not save leads to CMS

3. **NO RATE LIMITING** - Vulnerable to spam/abuse

4. **NO AUTO-RESPONSE** - Customer doesn't get confirmation email

5. **MISSING EMAIL FIELD** - Form collects email but doesn't include it in the email template (line 32-48)

6. **NO VALIDATION** - Missing input sanitization and validation

#### Email Flow:
```
User submits contact form
    ↓
POST /api/sendEnquiryEmail
    ↓
NO VALIDATION ❌
    ↓
Send email to: inquiry@mouhajerdesign.com ⚠️
    ↓
NO CUSTOMER RESPONSE ❌
    ↓
NO DB SAVE ❌
    ↓
Return 200 OK
```

---

## CMS Integration Analysis

### Database Schema Available
The CMS has a comprehensive **Lead model** ([prisma/schema.prisma:534-605](../mouhajer-cms/prisma/schema.prisma#L534)):

```prisma
model Lead {
  id                 String    @id @default(uuid())
  name               String
  email              String?
  phone              String
  companyId          String?
  companyName        String?
  source             String    // website, referral, social_media, etc.
  status             String    @default("new")
  score              Int       @default(0)
  projectType        String
  budgetRange        String?
  propertySize       String?
  timeline           String?
  city               String?
  area               String?
  interestedIn       String[]
  stylePreference    String[]
  message            String?   @db.Text
  qualified          Boolean   @default(false)
  nextFollowUpDate   DateTime?
  convertedToContact Boolean   @default(false)
  convertedToDeal    Boolean   @default(false)
  assignedTo         String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  // ... more fields
}
```

### What's Missing
❌ No API route to save leads to CMS database
❌ No Prisma client integration in mouhajer-repo
❌ No error handling for failed DB writes
❌ No duplicate lead detection

---

## Security Analysis

### ✅ Good Security Practices:
1. Rate limiting (lead-generation only)
2. Email validation with regex
3. IP address logging for forensics
4. CORS protection via Next.js
5. Environment variables for credentials
6. TypeScript bracket notation for env access

### ⚠️ Security Gaps:
1. **No CAPTCHA** - Vulnerable to bots
2. **No CSRF protection** - Should use Next.js CSRF tokens
3. **No input sanitization** - XSS risk in email templates
4. **Inconsistent rate limiting** - sendEnquiryEmail has none
5. **Phone number not validated** - Can accept invalid formats
6. **No max length validation** - Potential DoS via large payloads

---

## Email Configuration

### Lead Generation Form
- **SMTP**: Generic (smtp.gmail.com default)
- **From**: `process.env.SMTP_FROM` or "Mouhajer Design <noreply@mouhajerdesign.com>"
- **To Admin**: `process.env.ADMIN_EMAIL` or "info@mouhajerdesign.com" ✅
- **Auto-response**: Yes (bilingual EN/AR) ✅

### Enquiry Form
- **SMTP**: Zoho (smtp.zoho.com) ✅
- **From**: inquiry@mouhajerdesign.com ✅
- **To**: inquiry@mouhajerdesign.com ⚠️ **WRONG - should be info@**
- **Auto-response**: No ❌

---

## Recommendations

### 🔴 Critical (Fix Immediately)

1. **Fix Email Recipient in Enquiry Form**
   - File: [app/[locale]/api/sendEnquiryEmail/route.ts:30](app/[locale]/api/sendEnquiryEmail/route.ts#L30)
   - Change: `to: "info@mouhajerdesign.com"`

2. **Implement CMS Database Storage**
   - Add Prisma client to mouhajer-repo
   - Save leads to CMS database after email success
   - Handle duplicate detection (same email within 24h)

3. **Add Missing Email Field**
   - File: [app/[locale]/api/sendEnquiryEmail/route.ts:32-48](app/[locale]/api/sendEnquiryEmail/route.ts#L32)
   - Include customer email in template

### 🟡 High Priority

4. **Add Rate Limiting to Enquiry Form**
   - Copy rate limiting logic from lead-generation route
   - Implement same 5 requests per 15 minutes

5. **Add Auto-Response to Enquiry Form**
   - Send confirmation email to customer
   - Include bilingual templates like lead-generation

6. **Add Input Validation & Sanitization**
   - Validate phone numbers (international format)
   - Sanitize HTML in all text fields
   - Add max length limits

7. **Consolidate SMTP Configuration**
   - Both forms should use same Zoho SMTP
   - Update lead-generation to use Zoho credentials

### 🟢 Medium Priority

8. **Add CAPTCHA Protection**
   - Implement reCAPTCHA v3 or hCaptcha
   - Prevents bot submissions

9. **Implement Lead Scoring**
   - Assign scores based on project type, budget, timeline
   - Auto-assign to sales team based on score

10. **Add Webhook to CMS**
    - Real-time lead notifications to CMS admin panel
    - Trigger follow-up workflows

### 🔵 Low Priority

11. **Analytics Enhancement**
    - Track conversion rates
    - A/B test form fields
    - Add Facebook Pixel conversion events

12. **Email Template Improvements**
    - Add company logo to emails
    - Include social media links
    - Add unsubscribe link for marketing compliance

---

## Testing Checklist

- [ ] Test lead-generation form submits email to info@mouhajerdesign.com
- [ ] Test enquiry form submits email to info@ (after fix)
- [ ] Test customer receives auto-response (lead-generation)
- [ ] Test customer receives auto-response (enquiry - after implementation)
- [ ] Test rate limiting blocks 6th request in 15min
- [ ] Test invalid email shows error message
- [ ] Test missing required fields shows validation errors
- [ ] Test leads are saved to CMS database (after implementation)
- [ ] Test duplicate lead detection (after implementation)
- [ ] Test Arabic locale shows Arabic auto-response
- [ ] Test form works on mobile devices
- [ ] Test SMTP credentials are loaded from production .env

---

## Code Changes Required

### 1. Fix Enquiry Form Email (app/[locale]/api/sendEnquiryEmail/route.ts)

```typescript
// Line 6: Add email to request body
const {
  firstName,
  email, // ADD THIS
  phoneNumber,
  company,
  service,
  projectLocation,
  projectBudget,
  startDate,
  projectDescription,
} = await request.json();

// Line 30: Fix recipient email
to: "info@mouhajerdesign.com", // CHANGED FROM inquiry@

// Line 36: Add email to template
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone Number:</strong> ${phoneNumber}</p>
```

### 2. Add CMS Database Storage (both API routes)

```typescript
// Add Prisma import
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// After email success, before return
try {
  await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      projectType,
      budgetRange: budget,
      message,
      source: 'website',
      status: 'new',
      city,
      area,
      timeline,
      score: 50, // Default score
    },
  });
} catch (dbError) {
  console.error('Failed to save lead to database:', dbError);
  // Don't fail the request if DB save fails
}
```

### 3. Add Rate Limiting to Enquiry Form (app/[locale]/api/sendEnquiryEmail/route.ts)

```typescript
// Copy rate limiting logic from lead-generation route (lines 5-21)
const rateLimitMap = new Map();

function rateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
  // ... same implementation
}

// Add at start of POST handler
const ip = request.headers.get("x-forwarded-for") || "unknown";
if (!rateLimit(ip)) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
```

---

## Environment Variables Required

### Production .env (mouhajer-repo)
```bash
# Zoho SMTP (should match enquiry form)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=inquiry@mouhajerdesign.com
SMTP_PASSWORD=[redacted]
SMTP_FROM="Mouhajer International Design <noreply@mouhajerdesign.com>"

# Admin emails
ADMIN_EMAIL=info@mouhajerdesign.com

# CMS Database (for lead storage)
DATABASE_URL=[Prisma connection string]
```

---

## Summary of Findings

| Aspect | Lead Popup | Enquiry Form | Status |
|--------|-----------|--------------|--------|
| Sends to info@mouhajerdesign.com | ✅ Yes | ❌ No (sends to inquiry@) | **Fix Required** |
| Customer auto-response | ✅ Yes | ❌ No | **Add Feature** |
| Saves to CMS database | ❌ No | ❌ No | **Implement** |
| Rate limiting | ✅ Yes | ❌ No | **Add Feature** |
| Email validation | ✅ Yes | ❌ No | **Add Feature** |
| Input sanitization | ⚠️ Partial | ❌ No | **Improve** |
| CAPTCHA | ❌ No | ❌ No | **Add Feature** |
| Error handling | ✅ Yes | ✅ Yes | ✅ Good |
| Bilingual support | ✅ Yes | ❌ No | **Add Feature** |
| Google Analytics | ✅ Yes | ❌ No | **Add Feature** |

---

## Next Steps

1. **Immediate**: Fix enquiry form email recipient
2. **Today**: Implement CMS database storage for both forms
3. **This Week**: Add missing features (rate limiting, auto-response, validation)
4. **This Month**: Add CAPTCHA and analytics enhancements

---

## Contact Information Verification

**Confirmed Email**: info@mouhajerdesign.com ✅
**Current Enquiry Form**: inquiry@mouhajerdesign.com ⚠️ (needs correction)
**Phone**: +971 52 304 1482 ✅
**WhatsApp Link**: https://api.whatsapp.com/send/?phone=971523041482 ✅

---

*Report generated by Claude Code - October 11, 2025*
