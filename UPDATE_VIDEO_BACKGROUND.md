# Update Projects Page with Video Background

## Quick Fix

Edit this file: `app/[locale]/projects/enhanced-projects-page-content.tsx`

### Step 1: Add import at the top (around line 10)

Add this line after the other imports:
```typescript
import { VideoBackground } from '@/components/projects/video-background';
```

### Step 2: Remove image slideshow state (lines 201-210)

**REMOVE these lines:**
```typescript
  // State for hero background slideshow
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Auto-rotate hero background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
```

### Step 3: Replace background slideshow with video (lines 250-268)

**FIND this section:**
```typescript
        {/* Background Image Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={heroImages[currentHeroImage]}
              alt="MIDC Portfolio"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
```

**REPLACE with:**
```typescript
        {/* YouTube Video Background */}
        <VideoBackground videoId="9JeB0zJtPuM" />
```

### Step 4: Remove or hide the image progress indicators (lines 376-392)

**FIND this section:**
```typescript
          {/* Image Progress Indicators */}
          <div className="absolute bottom-12 left-6 flex items-center gap-3 lg:left-24">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImage(index)}
                className="group relative h-1 overflow-hidden"
                aria-label={`Go to image ${index + 1}`}
              >
                <div
                  className={`h-full transition-all duration-500 ${
                    index === currentHeroImage ? 'w-12 bg-[#d4af37]' : 'w-6 bg-white/20 hover:bg-white/40'
                  }`}
                />
              </button>
            ))}
          </div>
```

**REMOVE or COMMENT OUT** this entire section (since we don't need slideshow controls anymore)

---

## Done!

Save the file and refresh your browser. You should now see:
- ✅ YouTube video playing as background
- ✅ All original text, stats, and design intact
- ✅ Same overlays and decorative elements

The video will play continuously in the background while keeping your original professional design!
