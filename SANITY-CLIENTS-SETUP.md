# Sanity CMS Integration for Clients & Partners

## ✅ What Has Been Set Up

### 1. Sanity Schemas Created

#### **Client Schema** (`sanity/schemas/client.ts`)
Manages all client and partner information with the following fields:
- `name` - Client/company name (required)
- `slug` - URL-friendly identifier
- `logo` - Client logo image with alt text
- `category` - Type of client:
  - Hospitality
  - Corporate Office
  - Commercial Retail
  - Luxury Residential
  - Luxury Manufacturing
  - Government
  - Private VIP
- `projects` - Array of project names
- `projectsText` - Single-line summary of projects
- `description` - Brief description of the partnership
- `isFrameworkContract` - Boolean for repeat/framework clients
- `isConfidential` - Boolean for VIP/private clients
- `displayOrder` - Number for sorting (lower = first)
- `featured` - Boolean for featured sections
- `icon` - Lucide icon name for UI display
- `relatedProjects` - References to actual project documents

#### **Testimonial Schema** (`sanity/schemas/testimonial.ts`)
Manages client testimonials with:
- `author` - Person's name (required)
- `position` - Job title (required)
- `company` - Company name (required)
- `quote` - The testimonial text (required)
- `avatar` - Author photo
- `rating` - Star rating (1-5)
- `client` - Reference to client document
- `project` - Reference to project document
- `category` - Hospitality, Corporate, Residential, General
- `isConfidential` - Boolean for anonymous testimonials
- `displayOrder` - Sorting order
- `featured` - Boolean for main pages
- `publishedAt` - Publication date

### 2. GROQ Queries Added (`sanity/lib/queries.ts`)

**Client Queries:**
- `clientsQuery` - All clients ordered by displayOrder
- `clientsByCategoryQuery` - Filter by category (hospitality, corporate, etc.)
- `featuredClientsQuery` - Top 12 featured clients
- `hospitalityClientsQuery` - All hospitality clients
- `corporateClientsQuery` - Corporate, retail, and manufacturing clients
- `privateClientsQuery` - VIP/confidential clients

**Testimonial Queries:**
- `testimonialsQuery` - All testimonials ordered
- `featuredTestimonialsQuery` - Top 6 featured testimonials with client/project data
- `testimonialsByCategoryQuery` - Filter by category

### 3. Sample Data Migration Script

**File:** `scripts/seed-clients-testimonials.ts`

Contains all current client and testimonial data ready to seed into Sanity:

**Clients Included:**
1. Abu Dhabi National Hotels (ADNH) - Hospitality
2. Wasl Asset Management - Hospitality
3. Emaar Hospitality - Hospitality
4. Hyatt Hotels Corporation - Hospitality
5. The Ritz-Carlton - Hospitality
6. Dusit Thani - Hospitality
7. Osoul - Corporate
8. Dubai Golf - Residential
9. Emaar Malls - Retail
10. Louis Vuitton Manufactures - Manufacturing

**Testimonials Included:**
1. Ghaleb Al Najjar (ADNH) - 5 stars
2. Sayed Mohammed Al Sayed (Grand Hyatt) - 5 stars
3. Private Client (Confidential) - 5 stars

## 🚀 How to Use This Setup

### Step 1: Start Sanity Studio

```bash
npx sanity dev
```

This opens Sanity Studio at `http://localhost:3333`

### Step 2: Seed the Data

Before running the seed script, make sure you have a Sanity API token:

1. Go to https://sanity.io/manage
2. Select your project
3. Go to API → Tokens
4. Create a new token with "Editor" permissions
5. Add to `.env.local`:

```env
SANITY_API_TOKEN=your_token_here
```

Then run the seed script:

```bash
npm run seed:clients
```

This will populate Sanity with all 10 clients and 3 testimonials.

### Step 3: Manage Content in Sanity Studio

Once seeded, you can:
- ✅ Edit client information
- ✅ Upload logos
- ✅ Add new clients
- ✅ Reorder using displayOrder field
- ✅ Mark clients as featured or confidential
- ✅ Edit testimonials
- ✅ Upload author photos
- ✅ Link testimonials to specific clients/projects

### Step 4: Update Components to Fetch from Sanity

The current components use hardcoded data. To switch to Sanity:

1. Import the queries and client:
```typescript
import { client } from '@/sanity/lib/client'
import { hospitalityClientsQuery, featuredTestimonialsQuery } from '@/sanity/lib/queries'
```

2. Fetch data in the page component:
```typescript
export default async function ClientsPage() {
  const hospitalityClients = await client.fetch(hospitalityClientsQuery)
  const testimonials = await client.fetch(featuredTestimonialsQuery)

  return (
    <>
      <Header />
      <main>
        <ClientsHero />
        <HospitalityPartners clients={hospitalityClients} />
        <ClientTestimonials testimonials={testimonials} />
      </main>
      <Footer />
    </>
  )
}
```

3. Update components to accept props instead of using hardcoded data.

## 📊 Schema Structure

### Client Schema Fields

| Field | Type | Purpose |
|-------|------|---------|
| name | string | Client name (e.g., "Abu Dhabi National Hotels") |
| slug | slug | URL identifier (e.g., "adnh") |
| logo | image | Client logo for display |
| category | select | Hospitality, Corporate, Retail, etc. |
| projects | array | List of project names |
| projectsText | string | "Sheraton, Radisson Blu" |
| description | text | Partnership description |
| isFrameworkContract | boolean | Repeat client indicator |
| isConfidential | boolean | VIP/private flag |
| displayOrder | number | Sort order (10, 20, 30...) |
| featured | boolean | Show in featured sections |
| icon | string | Lucide icon name ("Hotel", "Building2") |
| relatedProjects | reference[] | Links to project documents |

### Testimonial Schema Fields

| Field | Type | Purpose |
|-------|------|---------|
| author | string | "Ghaleb Al Najjar" |
| position | string | "Consultant – Projects" |
| company | string | "Abu Dhabi National Hotels" |
| quote | text | The testimonial content |
| avatar | image | Author photo |
| rating | number | 1-5 stars |
| client | reference | Link to client document |
| project | reference | Link to project document |
| category | select | Hospitality, Corporate, etc. |
| isConfidential | boolean | Anonymous testimonial |
| displayOrder | number | Sort order |
| featured | boolean | Show on main pages |
| publishedAt | datetime | Publication date |

## 🎯 Benefits of This Setup

1. **Content Control** - Easily add/edit/remove clients without touching code
2. **Image Management** - Sanity handles image optimization and CDN
3. **Multilingual** - Can extend schemas for i18n support
4. **Relationships** - Link testimonials to clients and projects
5. **Flexible Ordering** - Drag-and-drop or number-based ordering
6. **Privacy Controls** - Mark confidential clients
7. **Featured Content** - Toggle featured status for any client/testimonial
8. **Search & Filter** - Sanity Studio has built-in search
9. **Versioning** - Built-in content history
10. **API-First** - Can use same data across multiple platforms

## 🔄 Migration from Hardcoded to Sanity

### Current State
✅ All component files created with hardcoded data
✅ Fully functional clients & partners page
✅ All animations and styling complete

### With Sanity Integration
🎯 Same UI, but content managed in Sanity
🎯 Easy updates without developer intervention
🎯 Image optimization and CDN delivery
🎯 Content versioning and rollback

### Recommended Next Steps

1. **Test the seed script** to verify data loads correctly
2. **Review content in Studio** and make any edits
3. **Update one component** (e.g., HospitalityPartners) to fetch from Sanity
4. **Test the integration** and verify it works
5. **Roll out to all components** once proven

## 📝 Example: Converting a Component to Use Sanity

### Before (Hardcoded):
```typescript
const partners = [
  {
    name: 'Abu Dhabi National Hotels',
    projects: 'Sheraton, Radisson Blu',
    icon: Hotel,
  },
  // ...more hardcoded data
]
```

### After (Sanity):
```typescript
// In page.tsx
const partners = await client.fetch(hospitalityClientsQuery)

// Pass to component
<HospitalityPartners clients={partners} />

// In component
export function HospitalityPartners({ clients }) {
  return (
    <>
      {clients.map((partner) => (
        <div key={partner._id}>
          <h3>{partner.name}</h3>
          <p>{partner.projectsText}</p>
        </div>
      ))}
    </>
  )
}
```

## 🛠️ Troubleshooting

### Seed Script Errors
- Make sure `SANITY_API_TOKEN` is set in `.env.local`
- Token must have "Editor" or "Administrator" permissions
- Check project ID matches in `.env.local`

### Schema Not Appearing in Studio
- Run `npx sanity dev` to restart Studio
- Check `sanity/schemas/index.ts` includes new schemas
- Clear browser cache

### Data Not Fetching
- Verify Sanity client configuration in `sanity/lib/client.ts`
- Check GROQ query syntax in Vision tool (Sanity Studio)
- Ensure data exists in Sanity (use Studio to verify)

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs)
- [Image Optimization](https://www.sanity.io/docs/image-urls)

---

**Ready to use!** The schemas, queries, and seed data are all set up. Just run the seed script and start managing clients in Sanity Studio.
