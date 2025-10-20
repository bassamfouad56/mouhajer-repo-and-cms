# SEO Implementation Examples

## Example 1: Dynamic Page with Full SEO

```typescript
// app/[locale]/[slug]/page.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import StructuredData from '@/components/StructuredData';
import { getOrganizationSchema, getBreadcrumbSchema } from '@/lib/seo/structured-data';

interface PageProps {
  params: {
    locale: 'en' | 'ar';
    slug: string;
  };
}

// Fetch page data
async function getPageData(slug: string) {
  // Your GraphQL query or data fetching logic
  const response = await fetch(`/api/pages?slug=${slug}`);
  return response.json();
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageData(params.slug);

  return generatePageMetadata({
    title: page.title,
    description: page.description,
    slug: page.slug,
    seo: page.seo,
    image: page.featuredImage,
    locale: params.locale,
  });
}

// Generate static params for SSG
export async function generateStaticParams() {
  const pages = await fetch('/api/pages').then((res) => res.json());

  return pages.flatMap((page: any) => [
    { locale: 'en', slug: page.slug.en },
    { locale: 'ar', slug: page.slug.ar },
  ]);
}

export default async function Page({ params }: PageProps) {
  const page = await getPageData(params.slug);

  // Structured data schemas
  const schemas = [
    getOrganizationSchema(params.locale),
    getBreadcrumbSchema([
      { name: 'Home', url: `/${params.locale}` },
      { name: page.title[params.locale], url: `/${params.locale}/${params.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={schemas} />

      <article>
        <h1>{page.title[params.locale]}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content[params.locale] }} />
      </article>
    </>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
```

## Example 2: Blog Post with Article Schema

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { generateBlogMetadata } from '@/lib/seo/metadata';
import StructuredData from '@/components/StructuredData';
import { getArticleSchema, getBreadcrumbSchema } from '@/lib/seo/structured-data';

interface BlogPostProps {
  params: {
    locale: 'en' | 'ar';
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  // GraphQL query to fetch blog post
  const query = `
    query GetBlogPost($slug: String!) {
      blogPost(slugEn: $slug) {
        id
        titleEn
        titleAr
        excerptEn
        excerptAr
        contentEn
        contentAr
        slugEn
        slugAr
        featuredImage
        author
        publishedAt
        updatedAt
        tags
      }
    }
  `;

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
  });

  const { data } = await response.json();
  return data.blogPost;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  return generateBlogMetadata({
    title: { en: post.titleEn, ar: post.titleAr },
    excerpt: { en: post.excerptEn, ar: post.excerptAr },
    slug: { en: post.slugEn, ar: post.slugAr },
    featuredImage: post.featuredImage,
    author: post.author,
    publishedAt: post.publishedAt,
    tags: post.tags,
    locale: params.locale,
  });
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getBlogPost(params.slug);
  const content = params.locale === 'en' ? post.contentEn : post.contentAr;
  const title = params.locale === 'en' ? post.titleEn : post.titleAr;

  const schemas = [
    getArticleSchema({
      title: { en: post.titleEn, ar: post.titleAr },
      description: { en: post.excerptEn, ar: post.excerptAr },
      slug: { en: post.slugEn, ar: post.slugAr },
      featuredImage: post.featuredImage,
      author: post.author,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      tags: post.tags,
      locale: params.locale,
    }),
    getBreadcrumbSchema([
      { name: 'Home', url: `/${params.locale}` },
      { name: 'Blog', url: `/${params.locale}/blog` },
      { name: title, url: `/${params.locale}/blog/${params.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={schemas} />

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>{post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(params.locale)}
            </time>
          </div>

          {post.featuredImage && (
            <Image
              src={post.featuredImage}
              alt={title}
              width={1200}
              height={630}
              priority
              className="rounded-lg"
            />
          )}
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <footer className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </>
  );
}

export const revalidate = 1800; // Revalidate every 30 minutes
```

## Example 3: Project Portfolio with Image Schema

```typescript
// app/[locale]/projects/[id]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { generateProjectMetadata } from '@/lib/seo/metadata';
import StructuredData from '@/components/StructuredData';
import { getProjectSchema, getImageObjectSchema } from '@/lib/seo/structured-data';

interface ProjectProps {
  params: {
    locale: 'en' | 'ar';
    id: string;
  };
}

async function getProject(id: string) {
  const response = await fetch(`/api/projects/${id}`);
  return response.json();
}

export async function generateMetadata({ params }: ProjectProps): Promise<Metadata> {
  const project = await getProject(params.id);

  return generateProjectMetadata({
    title: project.title,
    description: project.description,
    images: project.images,
    category: project.category,
    locale: params.locale,
  });
}

export default async function Project({ params }: ProjectProps) {
  const project = await getProject(params.id);

  const schemas = [
    getProjectSchema({
      title: project.title,
      description: project.description,
      images: project.images,
      category: project.category,
      locale: params.locale,
    }),
    // Add image schema for each image
    ...project.images.slice(0, 5).map((url: string) =>
      getImageObjectSchema({
        url,
        caption: project.title[params.locale],
        width: 1200,
        height: 900,
      })
    ),
  ];

  return (
    <>
      <StructuredData data={schemas} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">
          {project.title[params.locale]}
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          {project.description[params.locale]}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.images.map((image: string, index: number) => (
            <div key={index} className="relative aspect-[4/3]">
              <Image
                src={image}
                alt={`${project.title[params.locale]} - Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const revalidate = 86400; // Revalidate daily
```

## Example 4: Service Page with Service Schema

```typescript
// app/[locale]/services/[id]/page.tsx
import { Metadata } from 'next';
import { generateServiceMetadata } from '@/lib/seo/metadata';
import StructuredData from '@/components/StructuredData';
import { getServiceSchema, getOrganizationSchema } from '@/lib/seo/structured-data';

interface ServiceProps {
  params: {
    locale: 'en' | 'ar';
    id: string;
  };
}

async function getService(id: string) {
  const response = await fetch(`/api/services/${id}`);
  return response.json();
}

export async function generateMetadata({ params }: ServiceProps): Promise<Metadata> {
  const service = await getService(params.id);

  return generateServiceMetadata({
    title: service.title,
    shortDescription: service.shortDescription,
    price: service.price,
    duration: service.duration,
    locale: params.locale,
  });
}

export default async function Service({ params }: ServiceProps) {
  const service = await getService(params.id);

  const schemas = [
    getServiceSchema({
      title: service.title,
      description: service.description,
      price: service.price,
      duration: service.duration,
      features: service.features,
      locale: params.locale,
    }),
    getOrganizationSchema(params.locale),
  ];

  return (
    <>
      <StructuredData data={schemas} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">
          {service.title[params.locale]}
        </h1>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-3xl font-bold text-blue-600">{service.price} AED</p>
            </div>
            {service.duration && (
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-semibold">{service.duration}</p>
              </div>
            )}
          </div>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: service.description[params.locale],
          }}
        />

        {service.features[params.locale] && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="space-y-2">
              {service.features[params.locale].map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export const revalidate = 86400; // Revalidate daily
```

## Example 5: Homepage with Organization Schema

```typescript
// app/[locale]/page.tsx
import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebsiteSchema,
} from '@/lib/seo/structured-data';

interface HomeProps {
  params: {
    locale: 'en' | 'ar';
  };
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  return {
    title: params.locale === 'en' ? 'Dubai\'s Premier Interior Design Studio' : 'استوديو التصميم الداخلي الرائد في دبي',
    description:
      params.locale === 'en'
        ? 'Mouhajer International Design and Contracting - Leading provider of architecture, interior design, and fit-out services in Dubai and Abu Dhabi.'
        : 'مهاجر الدولية للتصميم والتعاقد - مزود رائد لخدمات الهندسة المعمارية والتصميم الداخلي في دبي وأبو ظبي',
    alternates: {
      canonical: `${baseUrl}/${params.locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
  };
}

export default function Home({ params }: HomeProps) {
  const schemas = [
    getOrganizationSchema(params.locale),
    getLocalBusinessSchema(params.locale),
    getWebsiteSchema(),
  ];

  return (
    <>
      <StructuredData data={schemas} />

      <main>
        <h1>
          {params.locale === 'en'
            ? "Dubai's Premier Interior Design Studio"
            : 'استوديو التصميم الداخلي الرائد في دبي'}
        </h1>
        {/* Rest of your homepage content */}
      </main>
    </>
  );
}
```

## Example 6: Using Draft Mode

```typescript
// In your CMS, create a preview button that links to:
const previewUrl = `/api/draft?secret=${DRAFT_SECRET}&slug=${page.slug.en}&locale=en`;

// In your page component, check for draft mode:
import { draftMode } from 'next/headers';

export default async function Page({ params }) {
  const { isEnabled } = await draftMode();

  // Fetch draft content if in draft mode
  const page = await getPageData(params.slug, { draft: isEnabled });

  return (
    <>
      {isEnabled && (
        <div className="bg-yellow-100 border-b border-yellow-300 p-2 text-center">
          <p className="text-sm">
            Preview Mode - <a href="/api/draft" className="underline">Exit</a>
          </p>
        </div>
      )}

      <article>{/* Your content */}</article>
    </>
  );
}
```

---

These examples demonstrate how to implement comprehensive SEO features using the utilities and components we've created. Each example follows Next.js 15 App Router best practices and includes proper metadata generation, structured data, and image optimization.
