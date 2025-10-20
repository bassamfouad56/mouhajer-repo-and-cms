# Project Handoff System - User Guide

## Overview
The Project Handoff System enables engineers to deliver comprehensive project information to the marketing team through a structured, multi-step form. This ensures marketing has everything needed to create compelling campaigns.

## For Engineers: Submitting a Handoff

### Accessing the Handoff Form
1. Navigate to **Projects** in the sidebar
2. Find your completed project
3. Click the **📋 Handoff** button

### Form Structure (6 Steps)

#### Step 1: Project Details
**Technical specifications that help marketing understand scope:**
- Completion date
- Project duration (e.g., "3 months")
- Square footage
- Number of rooms
- Budget range (public: economical/mid-range/luxury/ultra-luxury)
- Actual budget amount (private, for internal use only)
- Design software used (AutoCAD, SketchUp, etc.)

#### Step 2: Client & Testimonial
**Client feedback and permission management:**
- Client name and company (optional)
- Testimonial in English and Arabic
- Satisfaction rating (1-5 stars)
- Permission checkboxes:
  - Allow using client name in marketing
  - Allow using project photos
  - Allow contacting client as reference

#### Step 3: Design Story
**The narrative that makes projects compelling:**
- Main design concept/theme (EN/AR)
- Challenges faced during the project (EN/AR)
- Innovative solutions implemented (EN/AR)
- Unique features that make it special (EN/AR)
- Design inspiration sources

#### Step 4: Team & Credits
**Recognition for everyone involved:**
- Lead designers
- Contractors/builders
- Key suppliers/vendors
- Specialized consultants
- Awards & certifications

#### Step 5: Marketing Assets
**Visual content for campaigns:**
- Before photos (upload from Media Library)
- Video walkthrough links (YouTube, Vimeo)
- 360° virtual tour links
- Floor plans & technical drawings
- Mood boards & concept art

#### Step 6: SEO & Distribution
**Marketing strategy guidance:**
- Target keywords (e.g., "luxury villa Dubai", "modern interior")
- Target audience (e.g., "High-net-worth individuals")
- Best platforms (Instagram, LinkedIn, Website, Print)
- Geographic focus (Dubai Marina, Palm Jumeirah, etc.)
- Key selling points (Sustainability, Smart home, etc.)
- Additional notes for marketing team

### Features
- **Auto-save**: Form saves automatically every 30 seconds
- **Draft mode**: Save progress and complete later
- **Multi-language**: All narrative fields support English & Arabic
- **Media integration**: Select images directly from Media Library
- **Submit to Marketing**: Final step sends to marketing team for review

## For Marketing Team: Reviewing Handoffs

### Accessing Handoffs
Navigate to **Marketing > Project Handoffs** in the sidebar

### Dashboard Features
- **Filter by status**: Draft / Submitted / Approved / Published
- **Search**: Find handoffs by project name, client name, keywords
- **Quick view**: See key details at a glance
- **Detailed view**: Click "View Details" for full information

### Handoff Statuses
1. **Draft** - Engineer is still working on it
2. **Submitted** - Ready for marketing review
3. **Approved** - Marketing approved, ready to use
4. **Published** - Marketing campaign is live

### Workflow
1. **Review submission**: Click "View Details" to see all information
2. **Approve**: Click "Approve" button if everything looks good
3. **Mark as published**: Once campaign is live, update status

## Database Schema

The `ProjectHandoff` model includes:
- Project technical details (size, budget, timeline)
- Client information & testimonials
- Design story & narrative
- Team credits
- Marketing assets (photos, videos, links)
- SEO keywords & targeting
- Workflow status & approval tracking

## API Endpoints

### For Engineers
- `POST /api/projects/{id}/handoff` - Create new handoff
- `GET /api/projects/{id}/handoff` - Get existing handoff
- `PATCH /api/projects/{id}/handoff` - Update handoff

### For Marketing
- `GET /api/marketing/handoffs` - List all handoffs
- `GET /api/marketing/handoffs?status=submitted` - Filter by status

## Benefits

### For Engineers
- ✅ Structured process for project delivery
- ✅ Auto-save prevents data loss
- ✅ Clear checklist of what marketing needs
- ✅ One-time submission, no back-and-forth

### For Marketing
- ✅ Complete project information in one place
- ✅ Client testimonials ready to use
- ✅ Media assets organized and accessible
- ✅ SEO guidance from engineers who know the project
- ✅ Approval workflow for quality control

## Tips for Success

### For Engineers
1. **Be detailed in design story** - This is what makes projects interesting
2. **Get client permission early** - Check boxes help marketing know what they can use
3. **Include multiple keywords** - Think about how people search for design services
4. **Add video tours** - Visual content performs better in marketing
5. **Save drafts frequently** - Though auto-save is enabled, manual saves are instant

### For Marketing
1. **Review within 48 hours** - Fast turnaround helps maintain momentum
2. **Provide feedback** - Use notes field to request additional information
3. **Track published campaigns** - Update status to "published" for reporting
4. **Use keywords strategically** - Engineers provide insider perspective on project highlights

## Next Steps

1. **Database Migration**: Run `npx prisma migrate dev` when database is accessible
2. **Prisma Generate**: Run `npx prisma generate` to update TypeScript types
3. **Test handoff flow**: Submit a test project to ensure everything works
4. **Train team**: Share this guide with engineers and marketing team

## Technical Notes

### Files Created
- `prisma/schema.prisma` - Added ProjectHandoff model
- `src/app/api/projects/[id]/handoff/route.ts` - Handoff API
- `src/app/api/marketing/handoffs/route.ts` - Marketing dashboard API
- `src/components/ProjectHandoffForm.tsx` - Multi-step form component
- `src/app/projects/[id]/handoff/page.tsx` - Handoff form page
- `src/app/marketing/handoffs/page.tsx` - Marketing dashboard
- Updated `src/app/projects/page.tsx` - Added handoff button
- Updated `src/components/Sidebar.tsx` - Added Marketing section

### Dependencies
All required packages are already installed:
- Next.js 14+ (App Router)
- Prisma (Database ORM)
- Tailwind CSS (Styling)
- Existing MediaPicker component

### Deployment Checklist
- [ ] Run database migration
- [ ] Generate Prisma client
- [ ] Test form submission
- [ ] Test marketing dashboard
- [ ] Verify media picker integration
- [ ] Test on mobile devices
- [ ] Train users on new workflow
