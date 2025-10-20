# Mouhajer CRM System - Complete Guide

## Overview

Custom-built CRM system integrated into Mouhajer CMS, specifically designed for interior design and contracting business in Dubai. Built with Next.js 15, GraphQL, PostgreSQL, and Prisma.

## 🎯 Phase 1 Features (Current)

### Core Modules

1. **Leads Management**
   - Capture leads from website, referrals, social media
   - Lead scoring system (0-100)
   - Lead qualification workflow
   - Auto-assignment to team members
   - Follow-up tracking

2. **Contacts Management**
   - Individual & company contact profiles
   - Interior design preferences
   - Communication history
   - VIP client marking
   - Bilingual support (EN/AR)

3. **Companies**
   - B2B client management
   - Multiple contacts per company
   - Industry classification
   - Company-level notes and documents

4. **Sales Pipeline**
   - Visual kanban board
   - 9 pipeline stages
   - Deal value tracking (AED)
   - Probability percentages
   - Win/loss analysis

5. **Tasks & Activities**
   - Follow-up reminders
   - Task assignment
   - Activity timeline
   - Automatic logging

---

## 📊 Database Schema

### Entity Relationships

```
Company (1) ──── (Many) Contact
                          │
                          ├──── (Many) Deal
                          └──── (Many) Task

Lead (1) ──── (Many) Task
         └──── (Many) Activity

Deal (1) ──── (Many) Task
         └──── (Many) Activity
```

### Key Models

#### **Lead**
```typescript
{
  id, name, email, phone
  source: website | referral | social_media | walk_in | phone
  status: new | contacted | qualified | proposal | won | lost
  score: 0-100
  projectType: villa | apartment | office | restaurant | retail
  budgetRange: economical | mid_range | luxury | ultra_luxury
  timeline: immediate | 1_month | 3_months | 6_months | flexible
  interestedIn: [full_design, consultation, turnkey, renovation]
  stylePreference: [modern, classic, minimalist, luxury]
  qualified: boolean
  convertedToContact: boolean
  convertedToDeal: boolean
  assignedTo: userId
}
```

#### **Contact**
```typescript
{
  id, firstName, lastName, fullNameAr
  email, phone, whatsapp
  companyId (optional)
  type: individual | business
  status: active | inactive | blocked
  source, vip, tags
  preferredStyle: [modern, classic, minimalist, luxury]
  budgetRange, projectType, propertySize, timeline
  preferredLanguage: en | ar
  notesEn, notesAr
  assignedTo: userId
  lastContactedAt
}
```

#### **Company**
```typescript
{
  id, nameEn, nameAr
  industry, size: small | medium | large | enterprise
  email, phone, whatsapp, website, logo
  addressEn, addressAr, city, area
  type: client | partner | vendor | competitor
  vip, tags
  linkedin, instagram, facebook
  notesEn, notesAr
  assignedTo: userId
}
```

#### **Deal**
```typescript
{
  id, titleEn, titleAr
  contactId, companyId
  value: AED amount
  stage: initial_consultation | site_visit | quotation_sent |
         quotation_review | proposal | negotiation |
         contract_sent | won | lost
  probability: 0-100%
  projectType, propertySize, location, city
  expectedCloseDate, actualCloseDate
  wonReason, lostReason, competitors
  quotationIds, proposalIds, contractIds
  assignedTo: userId
  tags
}
```

#### **Task**
```typescript
{
  id, title, description
  type: call | email | meeting | site_visit | follow_up | proposal | quotation
  relatedTo: lead | contact | deal | project
  relatedId
  assignedTo: userId
  dueDate, dueTime, completedAt
  priority: low | medium | high | urgent
  status: pending | in_progress | completed | cancelled
  reminder: boolean
  notes, completionNotes
}
```

#### **CrmActivity**
```typescript
{
  id, type, title, description
  relatedTo: lead | contact | deal | project
  relatedId, userId
  duration: minutes (for calls/meetings)
  outcome: positive | neutral | negative
  activityDate
}
```

---

## 🚀 Setup Instructions

### 1. Database Migration

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name add-crm-models

# Or push directly (development only)
npx prisma db push
```

### 2. Environment Variables

No additional environment variables needed - uses existing database connection.

### 3. Seed Sample Data (Optional)

Create `prisma/seed-crm.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample company
  const company = await prisma.company.create({
    data: {
      nameEn: 'ABC Real Estate',
      nameAr: 'إيه بي سي العقارية',
      industry: 'Real Estate',
      size: 'medium',
      email: 'info@abc-realestate.ae',
      phone: '+971501234567',
      city: 'Dubai',
      area: 'Business Bay',
      type: 'client',
    },
  });

  // Create sample contact
  const contact = await prisma.contact.create({
    data: {
      firstName: 'Ahmed',
      lastName: 'Al-Mansoori',
      fullNameAr: 'أحمد المنصوري',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      companyId: company.id,
      city: 'Dubai',
      area: 'Downtown',
      preferredStyle: ['modern', 'luxury'],
      budgetRange: 'luxury',
      projectType: ['villa'],
      properredLanguage: 'ar',
    },
  });

  // Create sample lead
  const lead = await prisma.lead.create({
    data: {
      name: 'Sara Al-Zaabi',
      email: 'sara@example.com',
      phone: '+971509876543',
      source: 'website',
      status: 'new',
      projectType: 'apartment',
      budgetRange: 'mid_range',
      city: 'Dubai',
      area: 'Marina',
      stylePreference: ['minimalist'],
      timeline: '3_months',
      score: 75,
    },
  });

  // Create sample deal
  const deal = await prisma.deal.create({
    data: {
      titleEn: 'Marina Bay Apartment Renovation',
      titleAr: 'تجديد شقة مارينا باي',
      contactId: contact.id,
      companyId: company.id,
      value: 150000,
      stage: 'quotation_sent',
      probability: 70,
      projectType: 'apartment',
      propertySize: '180 sqm',
      city: 'Dubai',
      area: 'Marina',
      expectedCloseDate: new Date('2025-03-01'),
    },
  });

  // Create sample task
  await prisma.task.create({
    data: {
      title: 'Follow-up call with Ahmed',
      type: 'call',
      relatedTo: 'contact',
      relatedId: contact.id,
      contactId: contact.id,
      assignedTo: 'user-id-here', // Replace with actual user ID
      dueDate: new Date('2025-01-15'),
      priority: 'high',
      status: 'pending',
    },
  });

  console.log('✅ CRM sample data seeded successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run: `tsx prisma/seed-crm.ts`

---

## 📋 Pipeline Stages

### Complete Sales Pipeline

1. **Initial Consultation** (10% probability)
   - First contact with client
   - Understanding requirements
   - Free consultation call

2. **Site Visit Scheduled** (20% probability)
   - Site measurement appointment
   - Property assessment
   - Initial discussion

3. **Quotation Sent** (30% probability)
   - Detailed quote provided
   - Breakdown of costs
   - Waiting for client review

4. **Quotation Review** (40% probability)
   - Client reviewing quote
   - Questions/clarifications
   - Potential revisions

5. **Proposal/Design Concept** (50% probability)
   - Design concept presented
   - 3D visualizations shown
   - Style finalization

6. **Negotiation** (60% probability)
   - Price negotiations
   - Scope adjustments
   - Timeline discussions

7. **Contract Sent** (80% probability)
   - Contract drafted and sent
   - Terms agreed upon
   - Waiting for signature

8. **Won** (100% probability)
   - Contract signed
   - Project starts
   - Convert to active project

9. **Lost** (0% probability)
   - Deal didn't close
   - Reason documented
   - Follow-up for future

---

## 🎨 Interior Design Specific Features

### Style Preferences
- **Modern**: Clean lines, minimal decor
- **Classic**: Traditional, timeless elegance
- **Minimalist**: Simple, functional, uncluttered
- **Luxury**: High-end finishes, premium materials

### Property Types
- **Villa**: Standalone houses, large properties
- **Apartment**: Flats, condos, penthouses
- **Office**: Commercial workspaces
- **Restaurant**: F&B establishments
- **Retail**: Shops, boutiques, showrooms

### Budget Ranges (AED)
- **Economical**: < 50,000
- **Mid-range**: 50,000 - 200,000
- **Luxury**: 200,000 - 500,000
- **Ultra-luxury**: > 500,000

### Service Types
- **Full Design**: Complete design + execution
- **Consultation**: Design advice only
- **Turnkey**: Complete project management
- **Renovation**: Updating existing spaces

---

## 🔄 Lead Lifecycle

```
Website Form → Lead Created → Auto-Assigned
                    ↓
              Lead Scoring (0-100)
                    ↓
         Status: New → Contacted
                    ↓
              Qualification Check
                    ↓
          Qualified? Yes → Convert to Contact + Create Deal
                    ↓ No
              Mark as Disqualified
                    ↓
              Follow-up later
```

### Lead Scoring Criteria

- **Budget Range**:
  - Ultra-luxury: +30 points
  - Luxury: +20 points
  - Mid-range: +10 points
  - Economical: +5 points

- **Timeline**:
  - Immediate: +25 points
  - 1 month: +20 points
  - 3 months: +15 points
  - 6 months: +10 points
  - Flexible: +5 points

- **Property Size**:
  - > 500 sqm: +20 points
  - 200-500 sqm: +15 points
  - 100-200 sqm: +10 points
  - < 100 sqm: +5 points

- **Source**:
  - Referral: +20 points
  - Website: +10 points
  - Social media: +5 points
  - Walk-in: +15 points

- **Contact Quality**:
  - Email + Phone: +10 points
  - Phone only: +5 points

---

## 📱 Dubai Market Features

### Cities Supported
- Dubai
- Abu Dhabi
- Sharjah
- Ajman
- Ras Al Khaimah
- Fujairah
- Umm Al Quwain

### Popular Dubai Areas
- Downtown Dubai
- Dubai Marina
- Palm Jumeirah
- Business Bay
- Arabian Ranches
- Emirates Hills
- Jumeirah
- JBR (Jumeirah Beach Residence)
- Al Barsha
- Mirdif

### Communication Preferences
- **Primary**: WhatsApp Business
- **Secondary**: Email
- **Traditional**: Phone calls
- **Meeting**: In-office or site visits

---

## 🚦 Status Workflows

### Lead Status Flow
```
New → Contacted → Qualified → Proposal → Won/Lost
  ↓       ↓          ↓
Unqualified (with reason)
```

### Deal Stage Flow
```
Initial Consultation → Site Visit → Quotation Sent →
Quotation Review → Proposal → Negotiation →
Contract Sent → Won/Lost
```

### Task Status Flow
```
Pending → In Progress → Completed
              ↓
          Cancelled (optional)
```

---

## 📊 Reporting Metrics (Phase 2)

### Key Performance Indicators (KPIs)

1. **Lead Metrics**
   - Lead conversion rate
   - Average lead score
   - Lead source ROI
   - Time to conversion

2. **Pipeline Metrics**
   - Deal pipeline value
   - Average deal size
   - Win rate by stage
   - Sales cycle length

3. **Activity Metrics**
   - Calls per day
   - Meetings per week
   - Response time
   - Follow-up completion rate

4. **Team Metrics**
   - Deals per team member
   - Revenue per team member
   - Task completion rate
   - Activity volume

---

## 🔐 Access Control

### Role-Based Permissions

**Admin:**
- Full access to all CRM data
- Create/edit/delete any record
- View all team activities
- Manage CRM settings

**Sales Manager:**
- View all leads, contacts, deals
- Assign leads to team
- View team performance
- Edit own and team records

**Sales Rep:**
- View own leads, contacts, deals
- Create/edit own records
- View assigned tasks
- Add activities

**Viewer:**
- Read-only access
- View reports
- No edit permissions

---

## 🛠️ API Usage (GraphQL)

### Query Examples

```graphql
# Get all leads
query GetLeads {
  leads(
    where: { status: "new" }
    orderBy: { score: desc }
    take: 20
  ) {
    id
    name
    email
    phone
    score
    projectType
    budgetRange
    assignedTo
    createdAt
  }
}

# Get contact with deals
query GetContact($id: ID!) {
  contact(id: $id) {
    id
    firstName
    lastName
    email
    phone
    company {
      nameEn
    }
    deals {
      titleEn
      value
      stage
      probability
    }
    tasks {
      title
      dueDate
      status
    }
  }
}

# Get pipeline overview
query GetPipeline {
  deals(orderBy: { createdAt: desc }) {
    id
    titleEn
    value
    stage
    probability
    contact {
      firstName
      lastName
    }
    expectedCloseDate
  }
}
```

### Mutation Examples

```graphql
# Create lead
mutation CreateLead($input: CreateLeadInput!) {
  createLead(input: $input) {
    id
    name
    status
    score
  }
}

# Convert lead to contact and deal
mutation ConvertLead($leadId: ID!) {
  convertLead(leadId: $leadId) {
    contact {
      id
      firstName
      lastName
    }
    deal {
      id
      titleEn
      stage
    }
  }
}

# Update deal stage
mutation UpdateDealStage($id: ID!, $stage: String!) {
  updateDeal(id: $id, input: { stage: $stage }) {
    id
    stage
    probability
  }
}

# Create task
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    dueDate
    status
  }
}
```

---

## 📈 Future Enhancements (Roadmap)

### Phase 2: Quotations & Proposals
- [ ] Quotation builder with templates
- [ ] PDF generation (bilingual)
- [ ] E-signature integration
- [ ] Version control
- [ ] Approval workflow

### Phase 3: Client Portal
- [ ] Client login system
- [ ] View project status
- [ ] Approve designs
- [ ] View invoices
- [ ] Upload documents
- [ ] Message designer

### Phase 4: Advanced Features
- [ ] Email automation
- [ ] WhatsApp Business API integration
- [ ] Advanced analytics dashboard
- [ ] Revenue forecasting
- [ ] Team performance tracking
- [ ] Mobile app (React Native)

### Phase 5: Integrations
- [ ] Calendar sync (Google/Outlook)
- [ ] Email sync (Gmail/Outlook)
- [ ] Accounting software integration
- [ ] Payment gateway integration
- [ ] SMS notifications

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Prisma Client not generated
```bash
Solution: Run `npx prisma generate`
```

**Issue:** Migration fails
```bash
Solution: Check database connection in .env
Run: npx prisma migrate reset (⚠️ deletes data)
```

**Issue:** Foreign key constraints
```bash
Solution: Ensure referenced records exist before creating relationships
```

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review Prisma schema comments
3. Check GraphQL schema definitions
4. Review activity logs for debugging

---

**Last Updated:** January 2025
**Version:** 1.0.0 (Phase 1)
**Database:** PostgreSQL with Prisma ORM
**Tech Stack:** Next.js 15, GraphQL, TypeScript
