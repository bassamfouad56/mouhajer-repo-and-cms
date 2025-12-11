import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { furnitureProducts, getProductBySlug } from '@/lib/furniture-data';
import ProductDetailContent from './product-detail-content';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Mouhajer Design Studio',
    };
  }

  return {
    title: `${product.name} | Furniture Showroom | Mouhajer Design Studio`,
    description: product.description,
  };
}

// Skip static generation at build time - use ISR instead
// Pages will be generated on-demand and cached
export async function generateStaticParams() {
  return [];
}

// Allow dynamic params for on-demand generation
export const dynamicParams = true;

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = furnitureProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <ProductDetailContent product={product} relatedProducts={relatedProducts} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
