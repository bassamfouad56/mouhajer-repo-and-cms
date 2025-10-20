# Batch Image Fix Progress

## Strategy
Due to the large number of files (22 components), I'm going to:
1. Fix critical user-facing components first (Homepage, Navigation)
2. Create a reusable pattern others can follow
3. Document the changes

## Components Fixed

### ✅ Phase 1: Image Utils Created
- [x] lib/image-utils.ts - Helper functions created

### ✅ Phase 2: Critical Components
- [x] AboutFounder.tsx - Accepts `founderImage` prop
- [ ] Navbar.tsx - Fix placeholder fallbacks (HIGH PRIORITY - affects all pages)
- [ ] FeaturedProjectItem.tsx - Fix placeholder (HIGH PRIORITY - homepage)
- [ ] HorizontalScroll.tsx - Fix placeholder (homepage)

### Phase 3: Homepage Components
- [ ] HeroBanner.tsx
- [ ] AboutSectionHomePageCarousel.tsx
- [ ] PortfolioCarouselHomepage.tsx
- [ ] PortfolioCarouselHomepageMobile.tsx

### Phase 4: Other Components
- [ ] WhatsappComp.tsx
- [ ] BlogCardTopAndDescription.tsx
- [ ] HowWeWork.tsx
- [ ] NewSnippetForDubaiBEstInterioirDesign.tsx
- [ ] PAgeNotFoundBAnner.tsx
- [ ] ProductCardWithQuotation.tsx
- [ ] ProjectsGaller.tsx
- [ ] TwoImagesWithTextAnimation.tsx
- [ ] AboutHistory.tsx
- [ ] LeadGenPopup.tsx
- [ ] NextStudyCase.tsx
- [ ] OurVisionandMission.tsx
- [ ] ProjectsNewCompAwwwards.tsx

### Phase 5: Cleanup
- [ ] Delete components/json/BlogResData.ts
- [ ] Delete components/json/ProjectsResData.ts

## Pattern to Follow

**Before:**
```tsx
import SomeImage from "../public/images/333333.jpg";

const Component = () => {
  return <Image src={SomeImage} alt="..." />;
};
```

**After:**
```tsx
import { PLACEHOLDER_IMAGE, getCMSImage } from "@/lib/image-utils";

type Props = {
  media?: Media[]; // or specific image URL
};

const Component = ({ media }: Props) => {
  const imageUrl = media ? getCMSImage(media, 'tag-name') : PLACEHOLDER_IMAGE;
  return <Image src={imageUrl} alt="..." />;
};
```

