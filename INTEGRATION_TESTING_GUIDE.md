# Blueprint System - Integration Testing Guide

## Overview

This guide walks you through testing the complete Blueprint-Based CMS system end-to-end, from creating blueprints to building pages with components.

**Estimated Time:** 20-30 minutes
**Prerequisites:** CMS development server running (`npm run dev`)

---

## Test Suite 1: Blueprint Management 🏗️

### Test 1.1: View System Blueprints

**Objective:** Verify system blueprints are seeded and accessible

**Steps:**
1. Navigate to sidebar → **Site Builder** → **Blueprints**
2. Or directly visit: `http://localhost:3000/blueprints`

**Expected Results:**
- ✅ Page loads successfully
- ✅ Shows "System Blueprints" section
- ✅ Shows 10 blueprints:
  - Asset (system)
  - Navigation (system)
  - Footer (system)
  - Hero Banner
  - Image Gallery
  - Video Embed
  - Rich Text
  - Testimonials
  - CTA Section
  - FAQ Section
- ✅ System blueprints show "SYSTEM" badge
- ✅ System blueprints have disabled delete button
- ✅ Each blueprint card shows:
  - Icon
  - Name
  - Description
  - Category badge
  - Field count

**Screenshot Checkpoints:**
- [ ] Blueprint listing page loads
- [ ] System blueprints section visible
- [ ] User blueprints section (empty initially)

---

### Test 1.2: Create Custom Blueprint

**Objective:** Create a new blueprint from scratch

**Steps:**
1. Click "New Blueprint" button
2. Fill in blueprint information:
   - **Display Name:** Team Member
   - **Name:** TeamMember (auto-generated)
   - **Description:** Display team member profile with photo and bio
   - **Blueprint Type:** COMPONENT
   - **Category:** content
   - **Icon:** Select "file-text" from dropdown
   - **Allow Multiple:** ✓ (checked)

3. Add fields from palette (right sidebar):

   **Field 1: Name**
   - Click "Text" from Basic category
   - Configure:
     - Field Name: `name`
     - Label (EN): Name
     - Label (AR): الاسم
     - Type: text
     - ✓ Required
     - ☐ Bilingual

   **Field 2: Role**
   - Click "Text" from Basic category
   - Configure:
     - Field Name: `role`
     - Label (EN): Role
     - Label (AR): الدور
     - Type: text
     - ☐ Required
     - ✓ Bilingual

   **Field 3: Bio**
   - Click "Text Area" from Basic category
   - Configure:
     - Field Name: `bio`
     - Label (EN): Biography
     - Label (AR): السيرة الذاتية
     - Type: textarea
     - ☐ Required
     - ✓ Bilingual

   **Field 4: Photo**
   - Click "Image" from Media category
   - Configure:
     - Field Name: `photo`
     - Label (EN): Photo
     - Label (AR): الصورة
     - Type: image
     - ☐ Required
     - ☐ Bilingual

   **Field 5: Email**
   - Click "Email" from Basic category
   - Configure:
     - Field Name: `email`
     - Label (EN): Email
     - Label (AR): البريد الإلكتروني
     - Type: email
     - ☐ Required
     - ☐ Bilingual

4. Test field reordering:
   - Click ↑ on "Bio" field (should move up)
   - Click ↓ to move it back down

5. Test field editing:
   - Click ⚙️ (settings) on "Role" field
   - Change label to "Job Title"
   - Click ⚙️ again to collapse

6. Click "Create Blueprint"

**Expected Results:**
- ✅ All fields appear in the list as added
- ✅ Field reordering works (up/down buttons)
- ✅ Inline field editor expands/collapses
- ✅ Blueprint saves successfully
- ✅ Redirects to `/blueprints`
- ✅ New "Team Member" blueprint appears in "User Blueprints" section
- ✅ Shows "5 fields" indicator
- ✅ Shows "content" category badge

**Screenshot Checkpoints:**
- [ ] New blueprint form with all fields
- [ ] Field palette on right side
- [ ] Inline field editor expanded
- [ ] Success redirect to listing page

---

### Test 1.3: Edit Blueprint

**Objective:** Modify an existing blueprint

**Steps:**
1. From blueprints listing page
2. Find "Team Member" blueprint
3. Click "Edit" button (pencil icon)
4. Verify page loads with existing data
5. Make changes:
   - Change description to: "Showcase team members with photos and bios"
   - Add new field:
     - Click "Text" from palette
     - Field Name: `phone`
     - Label (EN): Phone Number
     - Label (AR): رقم الهاتف
     - Type: text
6. Click "Save Changes"

**Expected Results:**
- ✅ Edit page loads with all existing fields
- ✅ Metadata pre-populated correctly
- ✅ Can add new fields
- ✅ Technical name field is disabled (read-only)
- ✅ Saves successfully
- ✅ Redirects to listing page
- ✅ Updated description visible
- ✅ Now shows "6 fields"

**Screenshot Checkpoints:**
- [ ] Edit page with pre-filled data
- [ ] New field added
- [ ] Updated blueprint in listing

---

### Test 1.4: Duplicate Blueprint

**Objective:** Create a copy of an existing blueprint

**Steps:**
1. From blueprints listing
2. Find "Team Member" blueprint
3. Click "Duplicate" button (copy icon)
4. Wait for duplication

**Expected Results:**
- ✅ Creates new blueprint named "Team Member (Copy)"
- ✅ New blueprint appears in listing
- ✅ Has all the same fields
- ✅ Has same configuration
- ✅ Is editable (not system)
- ✅ Has unique ID

**Screenshot Checkpoints:**
- [ ] Duplicate blueprint in listing

---

### Test 1.5: Delete Blueprint

**Objective:** Remove a user-created blueprint

**Steps:**
1. From blueprints listing
2. Find "Team Member (Copy)" blueprint
3. Click "Delete" button (trash icon)
4. Confirm deletion (browser confirm dialog)

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Blueprint removed from listing
- ✅ System blueprints cannot be deleted (button disabled)

**Screenshot Checkpoints:**
- [ ] Blueprint removed from list

---

### Test 1.6: Category Filtering

**Objective:** Filter blueprints by category

**Steps:**
1. From blueprints listing
2. Click each category filter:
   - All Categories
   - Layout
   - Media
   - Content
   - General

**Expected Results:**
- ✅ "All" shows all blueprints (11: 10 system + 1 custom)
- ✅ "Layout" shows Hero Banner
- ✅ "Media" shows Image Gallery, Video Embed
- ✅ "Content" shows Rich Text, Testimonials, CTA, FAQ, Team Member
- ✅ Active category highlighted in blue

**Screenshot Checkpoints:**
- [ ] Filtered by Content category

---

## Test Suite 2: GraphQL Schema Generation ⚡

### Test 2.1: Generate Schema

**Objective:** Generate GraphQL schema from blueprints

**Steps:**
1. Open terminal in `apps/cms` directory
2. Run: `npx tsx scripts/generate-graphql-from-blueprints.ts`
3. Observe output

**Expected Results:**
- ✅ Console shows:
  ```
  🔄 Generating GraphQL schema from blueprints...
  📋 Found 11 blueprints
  ✅ GraphQL schema generated successfully!
  📊 Generated:
     - 11 types
     - 20 queries
     - 41 mutations
     - 33 input types
  ```
- ✅ File created: `src/graphql/generated/blueprints.graphql`
- ✅ File contains TeamMember type
- ✅ File contains queries: `teammember`, `teammembers`
- ✅ File contains mutations: `createTeamMember`, `updateTeamMember`, etc.

**Verification:**
```bash
# Check file exists
ls -la src/graphql/generated/blueprints.graphql

# Check TeamMember type exists
grep "type TeamMember" src/graphql/generated/blueprints.graphql

# Check query exists
grep "teammembers" src/graphql/generated/blueprints.graphql
```

**Screenshot Checkpoints:**
- [ ] Terminal output showing success
- [ ] Generated GraphQL file

---

### Test 2.2: Test Resolvers

**Objective:** Verify GraphQL resolvers work correctly

**Steps:**
1. Run: `npx tsx scripts/test-blueprint-resolvers.ts`
2. Observe output

**Expected Results:**
- ✅ All 11 tests pass:
  - Blueprint metadata queries ✅
  - Create operations ✅
  - Read operations (single & list) ✅
  - Update operations ✅
  - Delete operations ✅
  - Duplicate operations ✅
  - Filtering operations ✅
  - Bilingual content (EN/AR) ✅
- ✅ No errors
- ✅ Test data cleaned up

**Screenshot Checkpoints:**
- [ ] Terminal showing all tests passed

---

## Test Suite 3: Visual Block Composer 🎨

### Test 3.1: Access Page Builder

**Objective:** Navigate to page builder with Visual Block Composer

**Steps:**
1. From sidebar → **Site Builder** → **Page Builder**
2. Or visit: `http://localhost:3000/page-builder`
3. Select any page from the sidebar (or create a new test page first)
4. Click "Content" tab

**Expected Results:**
- ✅ Page Builder loads
- ✅ Shows page list in sidebar
- ✅ Content tab displays:
  - "Page Components" header
  - Locale selector (English/العربية)
  - Visual Block Composer
  - Blueprint palette on right
  - Empty canvas with guidance message

**Screenshot Checkpoints:**
- [ ] Page Builder with Content tab active
- [ ] Locale selector visible
- [ ] Blueprint palette visible

---

### Test 3.2: Add Components to Page

**Objective:** Build a page using the Visual Block Composer

**Steps:**

**Step 1: Add Hero Banner**
1. From Blueprint Palette (right sidebar)
2. Find "Hero Banner" component
3. Click the card (or + icon)
4. Component card appears on canvas
5. Click ⚙️ (Edit) button to expand
6. Fill in form:
   - Heading (EN): Welcome to Our Interior Design Studio
   - Heading (AR): مرحباً بكم في استوديو التصميم الداخلي
   - Subheading (EN): Creating beautiful spaces since 2020
   - Subheading (AR): إنشاء مساحات جميلة منذ 2020
   - Alignment: center
7. Click ⚙️ again to collapse editor

**Step 2: Add Team Member**
1. Ensure locale is set to "English"
2. From palette, find "Team Member"
3. Click to add
4. Click ⚙️ to edit
5. Fill in form:
   - Name: Sarah Johnson
   - Job Title (EN): Lead Interior Designer
   - Job Title (AR): مصممة داخلية رئيسية
   - Biography (EN): Expert in modern minimalist design with 15 years of experience
   - Biography (AR): خبيرة في التصميم البسيط الحديث مع 15 عاماً من الخبرة
   - Email: sarah@example.com
   - Phone: +971 50 123 4567
6. Collapse editor

**Step 3: Add Rich Text**
1. From palette, find "Rich Text"
2. Click to add
3. Edit component
4. Fill content (EN): "We specialize in residential and commercial interior design..."
5. Fill content (AR): "نحن متخصصون في التصميم الداخلي السكني والتجاري..."

**Step 4: Test Reordering**
1. Click ↓ on Hero Banner (should move down)
2. Click ↑ to move it back to top

**Step 5: Save**
1. Click "Save All" button
2. Wait for success message

**Expected Results:**
- ✅ Each component adds successfully
- ✅ Components appear as cards on canvas
- ✅ Inline editor expands/collapses smoothly
- ✅ Forms render correctly with all field types
- ✅ Bilingual fields show side-by-side inputs
- ✅ Arabic inputs have RTL direction
- ✅ Reordering works (up/down buttons)
- ✅ Save succeeds with alert: "✅ Components saved successfully!"
- ✅ Component counter shows "3 components"

**Screenshot Checkpoints:**
- [ ] Canvas with 3 components
- [ ] Hero Banner expanded editor
- [ ] Team Member form (bilingual fields)
- [ ] Reordered components
- [ ] Success save message

---

### Test 3.3: Edit Existing Components

**Objective:** Modify components after saving

**Steps:**
1. Stay on same page
2. Refresh page (to test persistence)
3. Verify all 3 components still present
4. Click ⚙️ on Team Member
5. Change name to "Sarah Johnson-Smith"
6. Change email to "sarahjohnson@example.com"
7. Click "Save All"

**Expected Results:**
- ✅ Page refresh loads components correctly
- ✅ All data persists
- ✅ Can edit and save changes
- ✅ Changes persist after save

**Screenshot Checkpoints:**
- [ ] Components after page refresh
- [ ] Edited component with changes

---

### Test 3.4: Locale Switching

**Objective:** Test bilingual editing

**Steps:**
1. Set locale to "English"
2. Note Hero Banner heading (English version)
3. Switch locale to "العربية" (Arabic)
4. Click ⚙️ on Hero Banner
5. Verify Arabic content displays
6. Change Arabic heading
7. Save
8. Switch back to English
9. Verify English content unchanged

**Expected Results:**
- ✅ Locale switch updates form language
- ✅ English locale shows EN fields
- ✅ Arabic locale shows AR fields
- ✅ Changes in one locale don't affect the other
- ✅ Both locales persist independently

**Screenshot Checkpoints:**
- [ ] Form in English locale
- [ ] Form in Arabic locale
- [ ] Locale selector switched

---

### Test 3.5: Component Actions

**Objective:** Test duplicate and delete actions

**Steps:**

**Test Duplicate:**
1. Click 📋 (Duplicate) on Team Member component
2. New component card appears below
3. Edit new component
4. Change name to "Ahmed Al-Mansoori"
5. Fill other fields differently
6. Save

**Test Delete:**
1. Click 🗑️ (Delete) on the duplicated component
2. Component removed from canvas
3. Save
4. Verify only original Team Member remains

**Expected Results:**
- ✅ Duplicate creates exact copy
- ✅ Duplicate is independent (edits don't affect original)
- ✅ Delete removes component immediately
- ✅ Deletions persist after save
- ✅ Component counter updates correctly

**Screenshot Checkpoints:**
- [ ] Duplicated component
- [ ] After delete operation

---

### Test 3.6: Blueprint Palette Filtering

**Objective:** Filter components by category

**Steps:**
1. In Blueprint Palette
2. Click each category button:
   - All
   - Layout
   - Media
   - Content
   - General
3. Observe filtered results

**Expected Results:**
- ✅ "All" shows all 11 blueprints
- ✅ "Layout" shows Hero Banner only
- ✅ "Media" shows Image Gallery, Video Embed
- ✅ "Content" shows Rich Text, Testimonials, CTA, FAQ, Team Member
- ✅ Active category highlighted
- ✅ Only COMPONENT blueprints shown (not DOCUMENT)

**Screenshot Checkpoints:**
- [ ] Palette filtered by Content

---

### Test 3.7: Hide/Show Palette

**Objective:** Toggle palette visibility

**Steps:**
1. Click "Hide Palette" button (eye icon)
2. Observe palette disappears
3. Canvas expands to full width
4. Click "Show Palette" button
5. Palette reappears

**Expected Results:**
- ✅ Palette hides smoothly
- ✅ Canvas uses full width when hidden
- ✅ Palette shows again when toggled
- ✅ Button text/icon changes

**Screenshot Checkpoints:**
- [ ] Palette hidden (full-width canvas)

---

## Test Suite 4: Field Type Validation 🔍

### Test 4.1: Required Fields

**Objective:** Test required field validation

**Steps:**
1. Add Hero Banner component
2. Click Edit
3. Leave "Heading (EN)" empty
4. Try to save

**Expected Results:**
- ✅ Error message appears: "Heading (EN) is required"
- ✅ Error displayed in red below field
- ✅ Form validation prevents save (or warns user)

**Screenshot Checkpoints:**
- [ ] Required field error message

---

### Test 4.2: Field Type Rendering

**Objective:** Verify all field types render correctly

Create a test blueprint with one of each field type and verify rendering:

| Field Type | Test | Expected |
|------------|------|----------|
| text | Single line input | ✅ Input field |
| textarea | Multi-line input | ✅ Textarea (4 rows) |
| rich_text | Formatted content | ✅ BlockEditor component |
| number | Numeric input | ✅ Number input with up/down |
| boolean | Toggle | ✅ Checkbox |
| select | Dropdown | ✅ Select with options |
| date | Date picker | ✅ Date input with calendar icon |
| datetime | Date+time | ✅ Datetime-local input |
| color | Color picker | ✅ Color picker + hex input |
| url | URL input | ✅ Input with link icon |
| email | Email input | ✅ Input with @ icon |
| image | Image upload | ✅ Upload area with preview |
| gallery | Multiple images | ✅ Grid of images + add button |
| file | File upload | ✅ File upload button |
| video | Video upload | ✅ Video upload interface |

**Screenshot Checkpoints:**
- [ ] Each field type renders correctly

---

## Test Suite 5: SEO Integration ⚡

### Test 5.1: SEO Tab Still Works

**Objective:** Ensure SEO features weren't broken

**Steps:**
1. In Page Builder, select a page
2. Switch to "SEO Settings" tab
3. Fill in:
   - Meta Title (EN)
   - Meta Description (EN)
   - Keywords
4. Click "Save SEO Settings"

**Expected Results:**
- ✅ SEO tab loads correctly
- ✅ Can edit SEO fields
- ✅ Save works
- ✅ No interference with Content tab

**Screenshot Checkpoints:**
- [ ] SEO tab working

---

## Test Suite 6: Error Handling 🐛

### Test 6.1: Invalid Blueprint Name

**Objective:** Test validation on blueprint creation

**Steps:**
1. Create new blueprint
2. Leave "Display Name" empty
3. Try to save

**Expected Results:**
- ✅ Error message: "Name and Display Name are required"
- ✅ Form doesn't submit

---

### Test 6.2: No Fields Added

**Objective:** Prevent blueprints with no fields

**Steps:**
1. Create new blueprint
2. Fill metadata
3. Don't add any fields
4. Try to save

**Expected Results:**
- ✅ Error: "Add at least one field to the blueprint"

---

### Test 6.3: Duplicate Blueprint Name

**Objective:** Prevent name conflicts

**Steps:**
1. Try to create blueprint named "TeamMember" (already exists)
2. Try to save

**Expected Results:**
- ✅ Error: "Blueprint with this name already exists"
- ✅ HTTP 409 Conflict

---

### Test 6.4: System Blueprint Protection

**Objective:** Ensure system blueprints can't be deleted

**Steps:**
1. Try to delete "Asset" blueprint
2. Observe delete button

**Expected Results:**
- ✅ Delete button is disabled (grayed out)
- ✅ Hover shows cursor: not-allowed
- ✅ System badge visible

---

## Test Suite 7: Performance ⚡

### Test 7.1: Large Component Count

**Objective:** Test with many components

**Steps:**
1. Add 20 components to a page
2. Test scrolling
3. Test save operation

**Expected Results:**
- ✅ Page handles 20+ components
- ✅ Smooth scrolling
- ✅ Save completes in <3 seconds
- ✅ No UI lag

---

### Test 7.2: Large Form

**Objective:** Test blueprint with many fields

**Steps:**
1. Create blueprint with 30+ fields
2. Add instance to page
3. Edit instance

**Expected Results:**
- ✅ Form renders all fields
- ✅ Responsive grid layout
- ✅ No performance issues
- ✅ Validation works on all fields

---

## Test Suite 8: Data Persistence 💾

### Test 8.1: Page Refresh

**Objective:** Verify data persists after refresh

**Steps:**
1. Add components to page
2. Save
3. Refresh browser (Cmd+R / Ctrl+R)
4. Verify components still present

**Expected Results:**
- ✅ All components load
- ✅ All data intact
- ✅ Order preserved

---

### Test 8.2: Navigation Away

**Objective:** Verify data persists after navigation

**Steps:**
1. Add components to page
2. Save
3. Navigate to another page
4. Navigate back

**Expected Results:**
- ✅ Components reload correctly
- ✅ No data loss

---

## Test Suite 9: Bilingual Content 🌍

### Test 9.1: Mixed Content

**Objective:** Test bilingual fields work correctly

**Steps:**
1. Create component with bilingual field
2. Fill English content only
3. Save
4. Switch to Arabic locale
5. Fill Arabic content
6. Save
7. Switch locales and verify

**Expected Results:**
- ✅ Can save partial bilingual content
- ✅ EN and AR independent
- ✅ Both persist correctly
- ✅ Locale switch updates UI

---

### Test 9.2: RTL Display

**Objective:** Verify Arabic displays with RTL

**Steps:**
1. Switch to Arabic locale
2. Edit component with Arabic text
3. Observe input direction

**Expected Results:**
- ✅ Arabic inputs have `dir="rtl"`
- ✅ Text aligns right
- ✅ Cursor starts on right

---

## Test Summary Checklist

### Core Features
- [ ] All 10 system blueprints seeded
- [ ] Can create custom blueprint
- [ ] Can edit blueprint
- [ ] Can duplicate blueprint
- [ ] Can delete blueprint (user only)
- [ ] Category filtering works
- [ ] GraphQL schema generates
- [ ] All resolver tests pass
- [ ] Visual Block Composer loads
- [ ] Can add components to page
- [ ] Can edit components inline
- [ ] Can reorder components
- [ ] Can duplicate components
- [ ] Can delete components
- [ ] Can save all changes
- [ ] Locale switching works
- [ ] Bilingual fields work
- [ ] All 20+ field types render
- [ ] Validation works
- [ ] Data persists

### Integration Points
- [ ] Sidebar navigation includes Blueprints
- [ ] Page Builder integrates Visual Block Composer
- [ ] SEO tab still functional
- [ ] No conflicts between features

### Error Handling
- [ ] Required field validation
- [ ] Duplicate name prevention
- [ ] System blueprint protection
- [ ] No fields error
- [ ] API error handling

### Performance
- [ ] Handles 20+ components
- [ ] Handles 30+ fields
- [ ] Save completes quickly
- [ ] No UI lag

### Data Integrity
- [ ] Page refresh preserves data
- [ ] Navigation preserves data
- [ ] Bilingual content independent
- [ ] Order preserved

---

## Troubleshooting Test Failures

### Components Not Loading
**Issue:** Visual Block Composer shows empty
**Check:**
1. API endpoint accessible: `GET /api/pages/[id]/components`
2. Browser console for errors
3. Page ID is valid

### Schema Not Generated
**Issue:** GraphQL queries fail
**Check:**
1. Run: `npx tsx scripts/generate-graphql-from-blueprints.ts`
2. Restart dev server
3. Check `src/graphql/generated/blueprints.graphql` exists

### Save Fails
**Issue:** "Save All" returns error
**Check:**
1. Required fields filled
2. Blueprint ID exists
3. Page ID valid
4. API endpoint responding

### Bilingual Not Working
**Issue:** Arabic content not saving
**Check:**
1. Field has `bilingual: true`
2. Both EN/AR labels defined
3. Correct locale passed to form

---

## Test Report Template

After testing, document results:

```
# Blueprint System Test Report

Date: [DATE]
Tester: [NAME]
Environment: [development/staging/production]

## Test Results

### Test Suite 1: Blueprint Management
- Test 1.1: [PASS/FAIL]
- Test 1.2: [PASS/FAIL]
- Test 1.3: [PASS/FAIL]
...

### Issues Found
1. [Description]
   - Severity: [Low/Medium/High/Critical]
   - Steps to reproduce: ...
   - Expected: ...
   - Actual: ...

### Overall Status: [PASS/FAIL]

### Notes:
...
```

---

## Automated Testing (Future)

### Playwright E2E Tests
```typescript
// Example test structure for future implementation

test('Create blueprint end-to-end', async ({ page }) => {
  await page.goto('/blueprints/new');
  await page.fill('[name="displayName"]', 'Team Member');
  await page.click('text=Text'); // Add field
  await page.fill('[name="fieldName"]', 'name');
  await page.click('text=Create Blueprint');
  await expect(page).toHaveURL('/blueprints');
  await expect(page.locator('text=Team Member')).toBeVisible();
});
```

---

**Testing Complete! ✅**

All tests passing means the Blueprint System is production-ready and fully integrated.

---

**Version:** 1.0.0
**Last Updated:** October 25, 2025
**Status:** Ready for Testing
