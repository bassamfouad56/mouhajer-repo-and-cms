# Unified Content System - Visual Workflow

## 🎯 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         1. CONTENT HUB                                  │
│                    http://localhost:3010/content                        │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  📊 Stats Grid                                                 │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │    │
│  │  │ 📄  │  │ 📘  │  │ 💼  │  │ 📦  │  │ ⚡  │          │    │
│  │  │ PAGE │  │ BLOG │  │ PROJ │  │ SERV │  │ LAND │          │    │
│  │  │  5   │  │  12  │  │  8   │  │  6   │  │  3   │          │    │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘          │    │
│  │                                                                 │    │
│  │  🔍 Search: [________________]  🔻 Status: [All]             │    │
│  │                                                                 │    │
│  │  📋 Content List:                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐     │    │
│  │  │ 📄 About Us              PUBLISHED  [Edit] [Preview]│     │    │
│  │  │    من نحن                /about-us                   │     │    │
│  │  │    3 sections           Jan 15, 2025                │     │    │
│  │  └─────────────────────────────────────────────────────┘     │    │
│  │  ┌─────────────────────────────────────────────────────┐     │    │
│  │  │ 📘 Blog Post            DRAFT       [Edit] [Preview]│     │    │
│  │  │    مقالة المدونة        /blog-post                  │     │    │
│  │  │    5 sections           Jan 14, 2025                │     │    │
│  │  └─────────────────────────────────────────────────────┘     │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│                     [➕ New Content] ←── USER CLICKS                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      2. TEMPLATE SELECTOR                               │
│                          (Modal Opens)                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  Choose a Template:                                            │    │
│  │                                                                 │    │
│  │  [All Templates] [Pages] [Blog] [Projects] [Services] [Landing]│    │
│  │                                                                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │    │
│  │  │ 📄 BLANK │  │ 👥 ABOUT │  │ 📧 CONTACT│                    │    │
│  │  │   PAGE   │  │    US    │  │   PAGE   │                    │    │
│  │  │ 0 sections│  │ 3 sections│  │ 2 sections│                    │    │
│  │  └──────────┘  └─✓────────┘  └──────────┘  ← USER SELECTS    │    │
│  │                                                                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │    │
│  │  │ 📘 BLOG  │  │ 📝 LONG  │  │ 💼 SHOWCASE│                    │    │
│  │  │  POST    │  │   FORM   │  │  PROJECT │                    │    │
│  │  │ 4 sections│  │ 6 sections│  │ 5 sections│                    │    │
│  │  └──────────┘  └──────────┘  └──────────┘                    │    │
│  │                                                                 │    │
│  │                          [Cancel] [Continue] ←── USER CLICKS   │    │
│  └───────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      3. CONTENT DETAILS FORM                            │
│                          (Step 2 of Modal)                              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  Creating: About Us                              [← Back] [×] │    │
│  │                                                                 │    │
│  │  Title (English) *                                             │    │
│  │  [About Us]  ← USER TYPES                                     │    │
│  │                                                                 │    │
│  │  URL Slug (English)                                            │    │
│  │  [about-us] ← AUTO-GENERATED                                  │    │
│  │                                                                 │    │
│  │  Title (Arabic) * ⏳ Translating...                           │    │
│  │  [من نحن] ← AUTO-TRANSLATED!                                  │    │
│  │                                                                 │    │
│  │  URL Slug (Arabic)                                             │    │
│  │  [من-نحن] ← AUTO-GENERATED                                    │    │
│  │                                                                 │    │
│  │  Description (English)                                         │    │
│  │  [Learn more about our company...]                            │    │
│  │                                                                 │    │
│  │  Description (Arabic) ⏳ Translating...                       │    │
│  │  [تعرف على شركتنا...] ← AUTO-TRANSLATED!                      │    │
│  │                                                                 │    │
│  │  ℹ️ Template Sections                                          │    │
│  │  This template includes 3 pre-built sections:                  │    │
│  │  • hero-simple                                                 │    │
│  │  • text-image-split                                            │    │
│  │  • team-grid                                                   │    │
│  │                                                                 │    │
│  │                          [Cancel] [Create & Edit] ← USER CLICKS│    │
│  └───────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    🔄 API: POST /api/content
                    ├─ Create Content record
                    ├─ Auto-translate missing AR fields
                    ├─ Create 3 ContentSections from template
                    ├─ Map blueprint names → IDs
                    └─ Return content with sections
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      4. CONTENT EDITOR                                  │
│              http://localhost:3010/content/[id]/edit                    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │ ← About Us                DRAFT              [EN|AR]          │    │
│  │   /about-us              Not published       [Preview]        │    │
│  │                                               [Publish] [Save] │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │ ☰ ▼ Hero - Simple                    👁️ ↑ ↓ 🗑️  ← CONTROLS   │    │
│  │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄        │    │
│  │ Title *                                                        │    │
│  │ [About Us] ← EDITABLE                                         │    │
│  │                                                                 │    │
│  │ Subtitle                                                       │    │
│  │ [Learn more about our company]                                │    │
│  │                                                                 │    │
│  │ Image URL                                                      │    │
│  │ [https://example.com/hero.jpg]                                │    │
│  │ 🖼️ [Image Preview]                                             │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │ ☰ ▼ Text + Image Split               👁️ ↑ ↓ 🗑️               │    │
│  │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄        │    │
│  │ Heading                                                        │    │
│  │ [Our Mission]                                                  │    │
│  │                                                                 │    │
│  │ Content                                                        │    │
│  │ [We strive to deliver...]                                     │    │
│  │                                                                 │    │
│  │ Image                                                          │    │
│  │ [https://example.com/mission.jpg]                             │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │ ☰ ▶ Team Grid                        👁️ ↑ ↓ 🗑️  ← COLLAPSED  │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│                            USER CLICKS SAVE                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    🔄 API: PUT /api/content/[id]
                    ├─ Update content fields
                    ├─ Update all section data (EN + AR)
                    ├─ Update section order
                    ├─ Update section visibility
                    └─ Return updated content
                                    │
                                    ▼
                          ✅ "Content saved successfully!"
                                    │
                            USER CLICKS PUBLISH
                                    │
                                    ▼
                    🔄 Status: DRAFT → PUBLISHED
                    🔄 publishedAt: null → NOW
                    🔄 Auto-save triggered
                                    │
                                    ▼
                          🎉 CONTENT IS LIVE!
```

---

## 🔄 Data Flow Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │  Next.js    │ ◄─────► │ PostgreSQL  │
│   (React)   │   API   │   Server    │  Prisma │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
      ▼                        ▼                        ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Components: │         │ API Routes: │         │   Tables:   │
│             │         │             │         │             │
│ • Content   │         │ GET  /api/  │         │ • contents  │
│   Hub       │         │      content│         │             │
│             │         │             │         │ • content_  │
│ • Template  │         │ POST /api/  │         │   sections  │
│   Selector  │         │      content│         │             │
│             │         │             │         │ • content_  │
│ • Content   │         │ GET  /api/  │         │   blueprints│
│   Editor    │         │      content│         │             │
│             │         │      /[id]  │         │             │
│             │         │             │         │             │
│             │         │ PUT  /api/  │         │             │
│             │         │      content│         │             │
│             │         │      /[id]  │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

---

## 🧩 Component Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│                        App Layout                             │
│                                                               │
│  ┌────────────┐  ┌────────────────────────────────────────┐ │
│  │            │  │                                         │ │
│  │  Sidebar   │  │         Page Content                    │ │
│  │            │  │                                         │ │
│  │  • Home    │  │  ┌──────────────────────────────────┐ │ │
│  │  • Content │◄─┼─►│  /content/page.tsx               │ │ │
│  │    ▼ All   │  │  │                                  │ │ │
│  │    • Blog  │  │  │  Components:                     │ │ │
│  │    • Pages │  │  │  • Stats Grid                    │ │ │
│  │  • Media   │  │  │  • Search & Filters              │ │ │
│  │  • Settings│  │  │  • Content List                  │ │ │
│  │            │  │  │  • Create Modal                  │ │ │
│  │            │  │  │    └─ TemplateSelector           │ │ │
│  │            │  │  │    └─ Details Form               │ │ │
│  │            │  │  └──────────────────────────────────┘ │ │
│  │            │  │                                         │ │
│  │            │  │  ┌──────────────────────────────────┐ │ │
│  │            │  │  │  /content/[id]/edit/page.tsx     │ │ │
│  │            │◄─┼─►│                                  │ │ │
│  │            │  │  │  Components:                     │ │ │
│  │            │  │  │  • Header (controls)             │ │ │
│  │            │  │  │  • Language Toggle               │ │ │
│  │            │  │  │  • Section List                  │ │ │
│  │            │  │  │    └─ Section Card               │ │ │
│  │            │  │  │       └─ Field Inputs            │ │ │
│  │            │  │  └──────────────────────────────────┘ │ │
│  │            │  │                                         │ │
│  └────────────┘  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 State Management Flow

```
CREATE FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Component State                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  const [showCreateModal, setShowCreateModal] = useState(false);
│  const [createStep, setCreateStep] = useState('template');  │
│  const [selectedTemplate, setSelectedTemplate] = useState(null);
│  const [newContent, setNewContent] = useState({              │
│    titleEn: '',                                              │
│    titleAr: '',                                              │
│    slugEn: '',                                               │
│    slugAr: '',                                               │
│    descriptionEn: '',                                        │
│    descriptionAr: ''                                         │
│  });                                                         │
│                                                              │
│  1. User types titleEn → handleTitleChange()                │
│     └─ Generate slugEn                                      │
│     └─ Trigger useEffect (800ms debounce)                   │
│         └─ translateToArabic(titleEn)                       │
│             └─ Set titleAr + slugAr                         │
│                                                              │
│  2. User types descriptionEn                                │
│     └─ Trigger useEffect (800ms debounce)                   │
│         └─ translateToArabic(descriptionEn)                 │
│             └─ Set descriptionAr                            │
│                                                              │
│  3. User clicks "Create & Edit"                             │
│     └─ POST /api/content                                    │
│         └─ Server creates content + sections                │
│             └─ router.push(/content/[id]/edit)              │
└─────────────────────────────────────────────────────────────┘

EDIT FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Component State                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  const [content, setContent] = useState<Content | null>(null);
│  const [currentLanguage, setCurrentLanguage] = useState('en');
│  const [expandedSections, setExpandedSections] = useState(new Set());
│                                                              │
│  1. Page loads → fetchContent()                             │
│     └─ GET /api/content/[id]                                │
│         └─ setContent(data.content)                         │
│         └─ setExpandedSections(all section IDs)             │
│                                                              │
│  2. User edits field → updateSectionData()                  │
│     └─ Update dataEn or dataAr in local state               │
│     └─ NO API call yet                                      │
│                                                              │
│  3. User reorders sections → moveSectionUp/Down()           │
│     └─ Swap sections in array                               │
│     └─ Update order field (0, 1, 2...)                      │
│     └─ setContent({ ...content, sections: newSections })    │
│                                                              │
│  4. User clicks "Save" → handleSave()                       │
│     └─ PUT /api/content/[id]                                │
│         └─ Server updates content + all sections            │
│             └─ fetchContent() to refresh                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API Request/Response Examples

### Create Content

**Request:**
```bash
POST /api/content
Content-Type: application/json

{
  "type": "PAGE",
  "template": "page-about",
  "titleEn": "About Us",
  "titleAr": "من نحن",
  "slugEn": "about-us",
  "slugAr": "من-نحن",
  "descriptionEn": "Learn about our company",
  "descriptionAr": "تعرف على شركتنا",
  "defaultSections": [
    {
      "blueprintName": "hero-simple",
      "order": 0,
      "defaultData": {
        "en": { "title": "About Us", "subtitle": "..." },
        "ar": { "title": "من نحن", "subtitle": "..." }
      }
    }
  ]
}
```

**Response:**
```json
{
  "message": "Content created successfully",
  "content": {
    "id": "uuid-123",
    "type": "PAGE",
    "template": "page-about",
    "titleEn": "About Us",
    "titleAr": "من نحن",
    "status": "DRAFT",
    "sections": [
      {
        "id": "section-uuid-1",
        "blueprintId": "blueprint-uuid",
        "order": 0,
        "dataEn": { "title": "About Us", "subtitle": "..." },
        "dataAr": { "title": "من نحن", "subtitle": "..." },
        "visible": true,
        "blueprint": {
          "name": "hero-simple",
          "displayName": "Hero - Simple",
          "fields": [...]
        }
      }
    ]
  }
}
```

### Update Content

**Request:**
```bash
PUT /api/content/uuid-123
Content-Type: application/json

{
  "titleEn": "About Us - Updated",
  "titleAr": "من نحن - محدث",
  "slugEn": "about-us",
  "slugAr": "من-نحن",
  "status": "PUBLISHED",
  "sections": [
    {
      "id": "section-uuid-1",
      "order": 0,
      "dataEn": { "title": "About Us", "subtitle": "New subtitle" },
      "dataAr": { "title": "من نحن", "subtitle": "عنوان فرعي جديد" },
      "visible": true
    }
  ]
}
```

**Response:**
```json
{
  "message": "Content updated successfully",
  "content": { /* updated content with sections */ }
}
```

---

## 🎯 Key Features Visualized

### Auto-Translation Flow

```
User Types:                 System Response:
┌─────────────┐            ┌─────────────┐
│ "About Us"  │───800ms───►│ Groq API    │
│  (English)  │  debounce  │ Translation │
└─────────────┘            └─────────────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │  "من نحن"   │
                           │  (Arabic)   │
                           └─────────────┘
```

### Section Reordering

```
Before:                    After Move Up:
┌─────────────┐           ┌─────────────┐
│ Hero        │ order: 0  │ Text+Image  │ order: 0
├─────────────┤           ├─────────────┤
│ Text+Image  │ order: 1  │ Hero ↑      │ order: 1
├─────────────┤           ├─────────────┤
│ Team Grid   │ order: 2  │ Team Grid   │ order: 2
└─────────────┘           └─────────────┘
```

### Language Toggle

```
English Mode:              Arabic Mode:
┌─────────────┐           ┌─────────────┐
│ [EN] | AR  │           │  EN | [AR]  │
├─────────────┤           ├─────────────┤
│ Title:      │           │      :العنوان│
│ About Us    │           │      من نحن  │
├─────────────┤           ├─────────────┤
│ Subtitle:   │           │ :العنوان الفرعي│
│ Learn more  │           │   تعرف أكثر  │
└─────────────┘           └─────────────┘
```

---

**Ready to build content!** 🚀

Start at: [http://localhost:3010/content](http://localhost:3010/content)
