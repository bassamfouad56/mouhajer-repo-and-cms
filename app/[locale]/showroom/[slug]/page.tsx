import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const paths = [];

  for (const locale of locales) {
    for (const product of furnitureProducts) {
      paths.push({
        locale,
        slug: product.slug,
      });
    }
  }

  return paths;
}

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
      <Footer />
    </>
  );
}
