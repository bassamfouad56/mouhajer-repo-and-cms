# Remaining Image Updates - Status

## ✅ Completed (3/14)
1. ✅ NewSnippetForDubaiBEstInterioirDesign - Uses SERVICE_IMAGES.structuralEn
2. ✅ AboutHistory - Uses PROJECT_IMAGES.reception1-5 for timeline
3. ✅ OurVisionandMission - Accepts visionImage/missionImage props, uses SERVICE_IMAGES fallback

## 🔄 In Progress - Critical Path
4. ⏳ app/[locale]/page.tsx - MOST IMPORTANT - Pass images to all components
5. ⏳ LeadGenPopup - Add backgroundImage prop
6. ⏳ AboutSectionHomePageCarousel - Add carouselImages prop
7. ⏳ BlogCardTopAndDescription - Use MISC_IMAGES.quotes

## ✅ Already Dynamic (No Changes Needed)
- HorizontalScroll - Uses project.images from API
- Navbar - Uses service/project/blog images from API
- FeaturedProjectItem - Uses project.images from API
- NextStudyCase - Uses project.images from API
- ProductCardWithQuotation - Uses props from project data
- HeroBanner - Already accepts heroImage/videoSrc props

## 📝 Minor Updates Needed
- AboutFounder - Already accepts founderImage prop, just ensure it's passed
- HowWeWork - May need processImages prop (check if used)

## 🎯 Priority Actions

### HIGHEST PRIORITY: Update Homepage
**File**: app/[locale]/page.tsx

Need to:
1. Pass `image` prop to NewSnippetForDubaiBEstInterioirDesign
2. Pass `visionImage`/`missionImage` to OurVisionandMission
3. Ensure HeroBanner gets heroImage
4. Pass any carousel images to AboutSectionHomePageCarousel

### MEDIUM PRIORITY: Quick Component Fixes
- LeadGenPopup - Simple prop addition
- BlogCardTopAndDescription - Import MISC_IMAGES.quotes
