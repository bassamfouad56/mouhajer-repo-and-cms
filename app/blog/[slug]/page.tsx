import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPostBySlug, getPosts, Post } from '@/lib/wordpress';
import BlogPostContent from './blog-post-content';

// Placeholder posts for development
function getPlaceholderPosts(): Post[] {
  return [
    {
      id: '1',
      title: 'The Evolution of Modern Interior Design',
      slug: 'evolution-modern-interior-design',
      excerpt: '<p>Explore how interior design has transformed over the decades, from minimalism to maximalism and everything in between.</p>',
      content: `
        <p>Interior design has undergone a remarkable transformation over the past century, evolving from purely functional spaces to expressions of personal style, cultural movements, and technological advancement. This evolution reflects broader changes in society, technology, and our understanding of how spaces impact our wellbeing.</p>

        <h2>The Minimalist Movement</h2>
        <p>The mid-20th century saw the rise of minimalism, championed by designers like Ludwig Mies van der Rohe with his famous principle "less is more." This movement emphasized clean lines, open spaces, and a reduction of ornamental elements. Minimalism wasn't just an aesthetic choice—it represented a philosophical approach to living, prioritizing function and clarity.</p>

        <h2>The Return to Maximalism</h2>
        <p>In recent years, we've witnessed a resurgence of maximalism as a reaction to the ubiquity of minimalist design. Maximalism embraces bold colors, patterns, textures, and personal collections. It celebrates individuality and creates spaces that tell stories through curated objects and layered design elements.</p>

        <h2>Technology's Influence</h2>
        <p>Smart home technology has revolutionized how we approach interior design. From integrated lighting systems to voice-controlled environments, technology now seamlessly blends into our living spaces. Modern designers must consider not just aesthetics and function, but also technological integration.</p>

        <h2>Sustainable Design</h2>
        <p>Environmental consciousness has become central to contemporary interior design. Sustainable materials, energy-efficient systems, and biophilic design principles are no longer optional—they're expected. Designers are finding innovative ways to create beautiful spaces that also respect our planet.</p>

        <h2>Looking Forward</h2>
        <p>The future of interior design lies in personalization, sustainability, and the thoughtful integration of technology. As we move forward, the best designs will balance aesthetic beauty with environmental responsibility and human wellbeing.</p>
      `,
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      featuredImage: {
        node: {
          sourceUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
          altText: 'Modern Interior Design',
        },
      },
      categories: { nodes: [{ id: '1', name: 'Design Trends', slug: 'design-trends' }] },
      tags: { nodes: [
        { id: '1', name: 'Minimalism', slug: 'minimalism' },
        { id: '2', name: 'Maximalism', slug: 'maximalism' },
        { id: '3', name: 'Modern Design', slug: 'modern-design' },
      ]},
      author: { node: { name: 'Sarah Johnson', description: 'Senior Interior Designer with 15 years of experience in luxury residential and commercial projects.' } },
    },
    {
      id: '2',
      title: '5 Essential Tips for Small Space Living',
      slug: 'tips-small-space-living',
      excerpt: '<p>Maximize your small space with these expert design strategies that combine style and functionality.</p>',
      content: `
        <p>Living in a small space doesn't mean compromising on style or functionality. With thoughtful design strategies and creative solutions, even the most compact spaces can feel spacious, organized, and beautiful. Here are five essential tips to transform your small space.</p>

        <h2>1. Embrace Multifunctional Furniture</h2>
        <p>Every piece of furniture should earn its place in a small space. Look for items that serve multiple purposes: a sofa that converts into a bed, an ottoman with hidden storage, or a dining table that doubles as a workspace. These versatile pieces maximize functionality without cluttering your space.</p>

        <h2>2. Use Vertical Space Wisely</h2>
        <p>When floor space is limited, look up! Vertical storage solutions like tall bookshelves, wall-mounted cabinets, and hanging organizers draw the eye upward and create the illusion of height. This approach not only provides practical storage but also makes rooms feel larger and more open.</p>

        <h2>3. Choose a Light Color Palette</h2>
        <p>Light colors reflect more light and create a sense of openness. White, cream, soft grays, and pastels are excellent choices for walls and large furniture pieces. You can add personality and depth through colorful accessories, artwork, and textiles that can be easily changed.</p>

        <h2>4. Maximize Natural Light</h2>
        <p>Natural light is your best friend in a small space. Keep window treatments minimal or choose sheer fabrics that allow light to filter through. Use mirrors strategically to reflect light and create the illusion of more space. Position mirrors opposite windows for maximum effect.</p>

        <h2>5. Declutter Ruthlessly</h2>
        <p>In small spaces, clutter is magnified. Adopt a minimalist mindset and regularly assess your belongings. Keep only what you truly need and love. Use clever storage solutions to keep everyday items organized and out of sight, maintaining clean surfaces and open sightlines.</p>

        <h2>Bringing It All Together</h2>
        <p>Small space living is about making intentional choices. Every design decision should enhance both the functionality and aesthetic of your home. With these strategies, you can create a space that feels open, organized, and uniquely yours.</p>
      `,
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      modified: new Date(Date.now() - 86400000 * 3).toISOString(),
      featuredImage: {
        node: {
          sourceUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
          altText: 'Small Space Design',
        },
      },
      categories: { nodes: [{ id: '2', name: 'Tips & Guides', slug: 'tips-guides' }] },
      tags: { nodes: [
        { id: '4', name: 'Small Spaces', slug: 'small-spaces' },
        { id: '5', name: 'Storage Solutions', slug: 'storage-solutions' },
      ]},
      author: { node: { name: 'Michael Chen', description: 'Space planning specialist and author of "Living Large in Small Spaces".' } },
    },
    {
      id: '3',
      title: 'Sustainable Materials in Luxury Design',
      slug: 'sustainable-materials-luxury-design',
      excerpt: '<p>How eco-friendly materials are reshaping the luxury design landscape without compromising on elegance.</p>',
      content: `
        <p>The intersection of sustainability and luxury design represents one of the most exciting developments in contemporary interior design. Today's discerning clients demand both environmental responsibility and uncompromising quality—and innovative designers are meeting this challenge with creative material choices.</p>

        <h2>Reclaimed Wood: History Meets Modern Luxury</h2>
        <p>Reclaimed wood has evolved from a rustic novelty to a premium material choice. Salvaged from old barns, factories, and ships, each piece carries unique character and patina that new wood simply cannot replicate. Beyond its aesthetic appeal, using reclaimed wood prevents deforestation and reduces carbon footprint.</p>

        <h2>Natural Stone with Ethical Sourcing</h2>
        <p>Marble, granite, and other natural stones remain timeless luxury materials. The key is ethical sourcing—working with quarries that follow sustainable practices, treat workers fairly, and minimize environmental impact. Many designers now provide full transparency about material origins, giving clients peace of mind.</p>

        <h2>Innovative Bio-Based Materials</h2>
        <p>Modern technology has produced remarkable eco-friendly alternatives. Mushroom-based leather, algae-based foam, and plant-based composites offer sustainable options that rival traditional materials in both performance and aesthetics. These innovations are redefining what's possible in luxury design.</p>

        <h2>Recycled Metals and Glass</h2>
        <p>Recycled brass, copper, and aluminum fixtures maintain the luxurious aesthetic of new metals while dramatically reducing environmental impact. Similarly, recycled glass can be transformed into stunning tiles, countertops, and decorative elements that sparkle with both beauty and conscience.</p>

        <h2>Organic Textiles</h2>
        <p>Luxury fabrics no longer need to rely on synthetic materials or intensive industrial processes. Organic cotton, linen, hemp, and wool offer superior quality and comfort. High-end manufacturers are even developing fabrics from innovative sources like pineapple leaves and orange peels.</p>

        <h2>The Future is Sustainable</h2>
        <p>The marriage of sustainability and luxury is not a compromise—it's an elevation. As technology advances and awareness grows, sustainable materials will continue to improve in quality and availability. The most forward-thinking luxury designs already embrace this philosophy, proving that we can create beautiful spaces while honoring our responsibility to the planet.</p>
      `,
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      modified: new Date(Date.now() - 86400000 * 7).toISOString(),
      featuredImage: {
        node: {
          sourceUrl: 'https://images.unsplash.com/photo-1617104678098-de229db51175?w=1200&q=80',
          altText: 'Sustainable Luxury Materials',
        },
      },
      categories: { nodes: [{ id: '3', name: 'Sustainability', slug: 'sustainability' }] },
      tags: { nodes: [
        { id: '6', name: 'Sustainable Design', slug: 'sustainable-design' },
        { id: '7', name: 'Eco-Friendly', slug: 'eco-friendly' },
        { id: '8', name: 'Luxury Materials', slug: 'luxury-materials' },
      ]},
      author: { node: { name: 'Emma Williams', description: 'Sustainable design advocate and consultant for eco-luxury projects worldwide.' } },
    },
  ];
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Mouhajer Design Studio`,
    description: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
      images: post.featuredImage?.node?.sourceUrl
        ? [{ url: post.featuredImage.node.sourceUrl }]
        : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts();

    // If no posts from WordPress, return placeholder post slugs
    if (posts.length === 0) {
      return [
        { slug: 'evolution-modern-interior-design' },
        { slug: 'tips-small-space-living' },
        { slug: 'sustainable-materials-luxury-design' },
      ];
    }

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return placeholder slugs on error
    return [
      { slug: 'evolution-modern-interior-design' },
      { slug: 'tips-small-space-living' },
      { slug: 'sustainable-materials-luxury-design' },
    ];
  }
}

// Enable dynamic routes for posts not pre-rendered
export const dynamicParams = true;

export const revalidate = 3600;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post = await getPostBySlug(params.slug);

  // If no post from WordPress, try placeholder posts
  if (!post) {
    const placeholderPosts = getPlaceholderPosts();
    post = placeholderPosts.find(p => p.slug === params.slug) || null;
  }

  if (!post) {
    notFound();
  }

  // Get related posts (same category)
  let allPosts = await getPosts();

  // If no posts from WordPress, use placeholders
  if (allPosts.length === 0) {
    allPosts = getPlaceholderPosts();
  }

  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        p.categories.nodes.some((cat) =>
          post.categories.nodes.some((postCat) => postCat.id === cat.id)
        )
    )
    .slice(0, 3);

  return (
    <>
      <Header />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
      <Footer />
    </>
  );
}
