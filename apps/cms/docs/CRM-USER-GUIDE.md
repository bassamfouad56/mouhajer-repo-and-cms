# Mouhajer CMS - CRM & Leads User Guide

## Table of Contents
1. [Overview](#overview)
2. [The Complete Sales Journey](#the-complete-sales-journey)
3. [Leads Management](#leads-management)
4. [Contacts Management](#contacts-management)
5. [Deals Pipeline](#deals-pipeline)
6. [Lead Scoring System](#lead-scoring-system)
7. [Best Practices](#best-practices)
8. [FAQ](#faq)

---

## Overview

The Mouhajer CMS CRM system helps you manage your entire sales process from initial inquiry to project completion. It's designed specifically for interior design businesses operating in the UAE market.

### Core Concepts

**Lead** → A potential client who has expressed interest but hasn't been fully vetted
**Contact** → A qualified client with whom you have an established relationship
**Deal** → An active sales opportunity with a specific project and value
**Company** → A business entity (for B2B clients)

---

## The Complete Sales Journey

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────┐
│   LEAD      │─────>│   QUALIFY    │─────>│   CONTACT   │─────>│   DEAL   │
│  Captured   │      │  Assessment  │      │  Converted  │      │  Created │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────┘
       │                     │                      │                   │
       v                     v                      v                   v
   New Lead            Contacted &             Active Client        Project
  (Unvetted)            Evaluated              Relationship         Pipeline


                                                                 ┌──────────┐
                                                                 │   WON    │
                                                                 │ Project  │
                                                                 │ Started  │
                                                                 └──────────┘
                                                                       │
                                                                       v
                                                                  ┌──────────┐
                                                                  │   LOST   │
                                                                  │ Document │
                                                                  │  Reason  │
                                                                  └──────────┘
```

---

## Leads Management

### What is a Lead?

A **Lead** is someone who has shown interest in your interior design services but hasn't been fully qualified yet. Leads come from various sources:

- Website contact forms
- Social media inquiries
- Referrals from existing clients
- Walk-ins to your office
- Phone inquiries
- Events and exhibitions

### Lead Statuses

| Status | Description | What to Do |
|--------|-------------|------------|
| **New** | Just received, no contact made yet | Review details, check if it's spam, prepare for outreach |
| **Contacted** | Initial contact made (call/email) | Waiting for response or scheduling follow-up |
| **Qualified** | Verified as serious, budget-appropriate client | Ready to convert to Contact and create Deal |
| **Proposal** | Sent initial proposal or quotation | Follow up, answer questions, schedule site visit |
| **Won** | Lead accepted and became a client | Convert to Contact + Deal immediately |
| **Lost** | Not interested or disqualified | Document reason, mark lost, archive |

### Lead Fields Explained

#### Basic Information
- **Name**: Full name of the person
- **Email**: Primary email (optional but recommended)
- **Phone**: Required - primary contact method in UAE
- **Source**: Where this lead came from (helps track marketing ROI)

#### Project Details
- **Project Type**: Villa, Apartment, Office, Restaurant, etc.
- **Budget Range**:
  - Economical: < 100K AED
  - Mid Range: 100K - 500K AED
  - Luxury: 500K - 1M AED
  - Ultra Luxury: > 1M AED
- **Property Size**: In square meters or feet
- **Timeline**: How soon they want to start
  - Immediate (< 1 month)
  - 1 Month
  - 3 Months
  - 6 Months
  - Flexible

#### Location
- **City**: Which emirate (Dubai, Abu Dhabi, etc.)
- **Area**: Specific neighborhood (Downtown, Marina, Emirates Hills, etc.)

#### Preferences
- **Style Preference**: Modern, Classic, Minimalist, Arabic, Luxury, etc.
- **Interested In**: Full Package, Design Only, Consultation, Furniture, etc.

#### Qualification
- **Score**: Auto-calculated 0-100 score (see Lead Scoring section)
- **Qualified**: Boolean - has this lead been vetted and qualified?
- **Assigned To**: Which team member is responsible

### How to Qualify a Lead

A lead should be **qualified** when:

1. ✅ **Budget matches your services** - They can afford your pricing
2. ✅ **Timeline is realistic** - Project can start within reasonable timeframe
3. ✅ **Serious intent verified** - They're committed, not just browsing
4. ✅ **Contact information confirmed** - Phone/email work and belong to them
5. ✅ **Decision maker identified** - You're talking to the person who decides

**How to Qualify:**
1. Navigate to Leads page
2. Find the lead (use filters if needed)
3. Click the lead card or row
4. Review all details carefully
5. Click **"Qualify"** button
6. Lead status becomes "Qualified" with a green checkmark

### How to Disqualify a Lead

Disqualify when:

- ❌ Budget doesn't match your minimum project size
- ❌ Outside your service area
- ❌ Unrealistic expectations or timeline
- ❌ Spam or fake inquiry
- ❌ Competitor research

**How to Disqualify:**
1. Select "Lost" from status dropdown OR
2. Use "Disqualify" action if available
3. **IMPORTANT**: Always document why (helps improve lead quality)
4. Common reasons: "Budget mismatch", "Outside service area", "Not serious", "Timeline too far"

### Converting a Lead to Contact

Once a lead is **Qualified**, you should convert it to a Contact:

**Step 1: Preparation**
- Ensure all lead information is complete and accurate
- Verify contact details work
- Update any missing fields (email, company, preferences)

**Step 2: Conversion**
1. Click **"Convert"** button on the lead
2. Conversion wizard appears:
   - **Confirm Contact Details**: Review name, email, phone
   - **Create Deal?**: Choose Yes (recommended) or No
   - **Deal Details** (if creating):
     - Project title (e.g., "Villa Renovation - Emirates Hills")
     - Estimated value in AED
     - Initial stage (usually "Initial Consultation")
     - Expected close date

**Step 3: Confirmation**
- Review summary of what will be created
- Click "Convert Lead"
- System creates:
  - ✅ New Contact record
  - ✅ New Deal (if selected)
  - ✅ Activity log of conversion
  - ✅ Automatic task for follow-up

**Step 4: After Conversion**
- Lead is marked as "converted"
- You're redirected to the new Contact page
- Original lead remains in system for records
- All notes and history are transferred

---

## Contacts Management

### What is a Contact?

A **Contact** is a qualified individual client with whom you have an established relationship. They've been vetted and are serious prospects or existing clients.

### Contact Types

- **Individual**: Personal client (villa owner, apartment owner)
- **Corporate**: Business contact (facility manager, developer)
- **VIP**: High-value client requiring special attention

### Contact Statuses

| Status | Meaning |
|--------|---------|
| **Active** | Current or potential client, actively engaged |
| **Inactive** | Past client, no active projects, low engagement |
| **Blocked** | Do not contact (requested or problematic) |

### Key Contact Features

#### Relationship Management
- Link to Company (for corporate clients)
- Job position/title
- Preferred language (English/Arabic)
- VIP flag for priority clients

#### Project Preferences
- **Preferred Style**: Design aesthetics they like
- **Budget Range**: Their typical project budget
- **Project Types**: What they usually need (residential, commercial, etc.)

#### Communication
- Email, Phone, WhatsApp
- Social media links (LinkedIn, Instagram, Facebook)
- Preferred contact method

#### History & Tracking
- All Deals associated with this contact
- Activity timeline (calls, meetings, emails)
- Tasks related to this contact
- Last contacted date

### Best Practices for Contacts

1. **Keep Information Updated**: Update contact details regularly
2. **Log All Interactions**: Use Activity logging for every touch point
3. **Set Reminders**: Schedule follow-up tasks
4. **Tag Appropriately**: Use tags for segmentation (e.g., "past-client", "referrer", "high-budget")
5. **Note Preferences**: Document style preferences, dislikes, special requirements

---

## Deals Pipeline

### What is a Deal?

A **Deal** represents a specific sales opportunity with:
- Defined project scope
- Estimated value in AED
- Clear timeline
- Progress through stages

### Deal Stages (Pipeline)

Your deals move through these stages:

```
1. Initial Consultation
   ↓
2. Site Visit Scheduled
   ↓
3. Site Visit Completed
   ↓
4. Quotation Sent
   ↓
5. Quotation Review
   ↓
6. Proposal Presented
   ↓
7. Negotiation
   ↓
8. Contract Sent
   ↓
9. Contract Signed
   ↓
10. WON (Project Starts) OR LOST
```

### Stage Descriptions

| Stage | What It Means | Typical Actions |
|-------|---------------|-----------------|
| **Initial Consultation** | First meeting scheduled or completed | Understand requirements, discuss vision |
| **Site Visit Scheduled** | Appointment booked to see property | Prepare measurement tools, checklist |
| **Site Visit Completed** | Visited property, gathered details | Take photos, measurements, notes |
| **Quotation Sent** | Formal pricing sent to client | Wait for response, schedule follow-up |
| **Quotation Review** | Client reviewing your quote | Answer questions, justify pricing |
| **Proposal Presented** | Full design proposal shown | Present mood boards, 3D renders, timeline |
| **Negotiation** | Discussing terms, pricing, scope | Find middle ground, adjust proposal |
| **Contract Sent** | Legal contract sent for signing | Chase signature, answer legal questions |
| **Contract Signed** | Deal closed successfully | Create project in system, assign team |
| **Won** | Client signed, project starts | Celebrate, begin design work |
| **Lost** | Client went elsewhere or cancelled | Document reason, learn for future |

### Probability Percentage

Each stage has a typical probability of closing:

- Initial Consultation: 10-20%
- Site Visit: 30-40%
- Quotation Sent: 40-50%
- Quotation Review: 50-60%
- Proposal Presented: 60-70%
- Negotiation: 70-80%
- Contract Sent: 80-90%
- Contract Signed: 100%

**How to Use:**
- Update probability as you progress
- Be realistic - helps forecast revenue
- If probability drops, note why

### Deal Fields Explained

#### Basic Info
- **Title**: Descriptive name (e.g., "Palm Jumeirah Villa Fitout")
- **Contact**: Who is the client
- **Company**: If B2B project
- **Value**: Total project value in AED
- **Stage**: Current position in pipeline

#### Project Details
- **Project Type**: Villa, Office, Restaurant, etc.
- **Property Size**: Square meters
- **Location**: Full address or area
- **City/Area**: For reporting and assignments

#### Timeline
- **Expected Close Date**: When you expect to sign contract
- **Actual Close Date**: When contract was actually signed

#### Outcome Tracking
- **Won Reason**: Why did we win? (Quality, Price, Referral, Timeline, etc.)
- **Lost Reason**: Why did we lose? (Price too high, Competitor, Timeline, etc.)
- **Competitors**: Who else was bidding?

#### Documents
- **Quotation IDs**: Link to quotation documents
- **Proposal IDs**: Link to design proposals
- **Contract IDs**: Link to signed contracts

---

## Lead Scoring System

### How Scoring Works

Every lead gets an automatic score from 0-100 based on multiple factors:

```
Lead Score = Budget Points + Source Points + Timeline Points +
             Project Type Points + Contact Info Points + Engagement Points
```

### Score Breakdown

#### Budget Range Points (0-30)
- Ultra Luxury (> 1M AED): **30 points**
- Luxury (500K-1M AED): **25 points**
- Mid Range (100K-500K AED): **20 points**
- Economical (< 100K AED): **10 points**
- Not specified: **0 points**

#### Source Points (0-25)
- Referral from past client: **25 points**
- Website form: **20 points**
- Social Media DM: **15 points**
- Walk-in: **20 points**
- Phone call: **18 points**
- Email inquiry: **15 points**
- Advertisement response: **10 points**

#### Timeline Points (0-20)
- Immediate (< 1 month): **20 points**
- 1 month: **18 points**
- 3 months: **15 points**
- 6 months: **10 points**
- Flexible/Not sure: **5 points**

#### Project Type Points (0-15)
- Villa: **15 points** (high-value projects)
- Penthouse: **15 points**
- Hotel/Restaurant: **12 points**
- Office: **10 points**
- Apartment: **8 points**
- Retail: **8 points**
- Other: **5 points**

#### Contact Information Completeness (0-10)
- Has Email + Phone + WhatsApp: **10 points**
- Has Email + Phone: **7 points**
- Has Phone only: **5 points**
- Missing contact info: **0 points**

#### Engagement Level (0-10)
- Filled out detailed form with message: **10 points**
- Filled out form, no message: **7 points**
- Minimal information: **3 points**

### Score Interpretation

| Score Range | Quality | Action |
|-------------|---------|--------|
| **80-100** | 🔥 Hot Lead | Priority - contact within 1 hour |
| **60-79** | ⭐ Warm Lead | Contact within 24 hours |
| **40-59** | 🆗 Medium Lead | Contact within 2-3 days |
| **20-39** | ❄️ Cold Lead | Review carefully before contacting |
| **0-19** | ⚠️ Very Cold | Likely spam or poor fit |

### Improving Lead Scores

If leads consistently score low:
1. Improve lead source quality (better targeting ads)
2. Add qualifying questions to contact forms
3. Offer content that attracts serious buyers
4. Require phone number to reduce spam

---

## Best Practices

### Daily Lead Management Routine

**Morning (9:00 AM - 10:00 AM)**
1. Check new leads from last 24 hours
2. Sort by score (highest first)
3. Call/email high-scoring leads immediately
4. Update statuses as you contact

**Midday (2:00 PM - 3:00 PM)**
1. Follow up on "Contacted" leads waiting for response
2. Update deals in pipeline
3. Log all activities from morning calls

**End of Day (5:00 PM - 6:00 PM)**
1. Review tasks for tomorrow
2. Schedule follow-ups
3. Update any deal stages that progressed
4. Set reminders for next-day calls

### Weekly Pipeline Review

**Every Monday Morning:**
- Review all deals by stage
- Identify stuck deals (no movement in 7+ days)
- Update probabilities based on last week's interactions
- Forecast expected closures for the week
- Assign or reassign deals as needed

### Monthly Performance Analysis

**First Day of Month:**
- Lead conversion rate: Leads → Contacts
- Deal win rate: Deals → Won
- Average deal size in AED
- Most effective lead sources
- Lost deal reasons analysis
- Adjust strategy based on data

### Communication Best Practices

#### First Contact (Within 1 Hour for Hot Leads)
- **Call** if phone provided - most effective in UAE
- **WhatsApp** is second best - very common in UAE
- **Email** as third option or backup

#### Follow-up Cadence
- Day 1: Initial contact
- Day 3: First follow-up if no response
- Day 7: Second follow-up
- Day 14: Final follow-up before marking lost

#### Language Preference
- Default to English unless Arabic preference indicated
- Use bilingual team members for Arabic speakers
- Document language preference in contact record

### Data Hygiene

1. **No Duplicates**: Always search before creating new lead/contact
2. **Complete Profiles**: Fill in all known fields
3. **Update Regularly**: Keep contact info current
4. **Rich Notes**: Document conversations, preferences, objections
5. **Tag Consistently**: Use standard tags across team

---

## FAQ

### Q: When should I convert a lead to a contact?
**A:** Convert when the lead is **qualified** - meaning you've verified they're a serious prospect with appropriate budget, timeline, and intent. Typically after at least one meaningful conversation.

### Q: Can I convert a lead without creating a deal?
**A:** Yes, but it's not recommended. If you're converting a qualified lead, they usually have a specific project in mind. Create the deal to track it properly.

### Q: What if a lead wants multiple projects?
**A:** Convert the lead to a contact once, then create multiple deals under that same contact - one for each project.

### Q: How do I handle leads that go cold?
**A:** 1) Update status to "Lost", 2) Document reason (e.g., "Not responding", "Timeline too far"), 3) Set a reminder to follow up in 3-6 months. Don't delete - they might come back.

### Q: What's the difference between "Contacted" and "Qualified"?
**A:** "Contacted" means you reached out but haven't fully assessed them yet. "Qualified" means you've had a conversation and confirmed they're a good fit for your services.

### Q: Should I track every single inquiry as a lead?
**A:** No. Filter out obvious spam, but do track legitimate inquiries even if they seem unlikely. You might be surprised. Use lead scoring to prioritize.

### Q: How often should I update deal stages?
**A:** Immediately when something changes. If you sent a quotation, move to "Quotation Sent" right away. Real-time updates help team coordination.

### Q: What if a deal bounces between stages?
**A:** It happens! If they want revisions to the quotation, it might go back from "Proposal" to "Quotation Review". That's normal. Update the stage to reflect reality.

### Q: How long should deals stay in each stage?
**A:** Typical timelines:
- Initial Consultation: 1-7 days
- Site Visit: 3-14 days
- Quotation: 7-21 days
- Proposal: 14-30 days
- Negotiation: 7-21 days
- Contract: 3-14 days

If a deal sits longer, it's getting cold - take action!

### Q: Can I reassign leads/deals to other team members?
**A:** Yes, use the "Assigned To" field. Best practice: notify the person you're assigning to and explain why.

### Q: What reports can I generate?
**A:** Current system provides:
- Lead statistics by status
- Deal pipeline value by stage
- Conversion rates
- Won/Lost analysis
- Lead sources performance

---

## Need Help?

- **In-app tooltips**: Look for (i) icons next to fields
- **Status guide**: Click the "?" icon near status badges
- **Admin support**: Contact your CMS administrator
- **Feature requests**: Submit via the feedback form in settings

---

**Last Updated:** January 2025
**Version:** 1.0
