'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Truck,
  Shield,
  Ruler,
  Palette,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
} from 'lucide-react';
import { type FurnitureProduct } from '@/lib/furniture-data';
import { useCart } from '@/lib/cart-context';

export default function ProductDetailContent({
  product,
  relatedProducts,
}: {
  product: FurnitureProduct;
  relatedProducts: FurnitureProduct[];
}) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-neutral-950">
              Home
            </Link>
            <span>/</span>
            <Link href="/showroom" className="hover:text-neutral-950">
              Showroom
            </Link>
            <span>/</span>
            <Link href={`/showroom?category=${product.category}`} className="hover:text-neutral-950">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
            <span>/</span>
            <span className="text-neutral-950">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={product.images[selectedImage]}
                alt={`${product.name} - View ${selectedImage + 1}`}
                fill
                className="cursor-zoom-in object-cover"
                onClick={() => setShowImageModal(true)}
                priority
              />
              {product.isNew && (
                <span className="absolute left-4 top-4 rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white">
                  New Arrival
                </span>
              )}
              {hasDiscount && (
                <span className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white">
                  Save {discountPercent}%
                </span>
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg ${
                      selectedImage === index ? 'ring-2 ring-neutral-950' : 'ring-1 ring-neutral-200'
                    }`}
                  >
                    <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-neutral-600">
                {product.subcategory}
              </p>
              <h1 className="mb-4 font-cormorant text-4xl font-light text-neutral-950 md:text-5xl">
                {product.name}
              </h1>
              <p className="text-lg leading-relaxed text-neutral-700">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 border-y border-neutral-200 py-6">
              {hasDiscount && (
                <span className="text-2xl text-neutral-400 line-through">
                  {product.price.toLocaleString()} {product.currency}
                </span>
              )}
              <span className={`text-3xl font-medium ${hasDiscount ? 'text-red-600' : 'text-neutral-950'}`}>
                {(product.salePrice || product.price).toLocaleString()} {product.currency}
              </span>
              {hasDiscount && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-950">
                    Color: {selectedColor.name}
                  </span>
                  <Palette className="h-4 w-4 text-neutral-400" />
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative h-12 w-12 overflow-hidden rounded-full ${
                        selectedColor.name === color.name ? 'ring-2 ring-neutral-950 ring-offset-2' : ''
                      }`}
                      title={color.name}
                    >
                      <div
                        className="h-full w-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColor.name === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-neutral-950">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-neutral-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
                {product.inStock ? (
                  <span className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-8 py-4 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="rounded-lg border border-neutral-300 p-4 transition-colors hover:border-neutral-950"
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-950'}`}
                />
              </button>
              <button
                onClick={handleShare}
                className="rounded-lg border border-neutral-300 p-4 transition-colors hover:border-neutral-950"
              >
                <Share2 className="h-5 w-5 text-neutral-950" />
              </button>
            </div>

            {/* Lead Time */}
            {product.leadTime && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-100 p-4 text-sm text-neutral-700">
                <Clock className="h-5 w-5 text-neutral-600" />
                <span>
                  <strong>Lead Time:</strong> {product.leadTime}
                </span>
              </div>
            )}

            {/* Features */}
            <div className="space-y-4 border-t border-neutral-200 pt-6">
              <h3 className="font-cormorant text-xl font-medium">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-950" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customization */}
            {product.customizable && (
              <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-4">
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />
                  <div>
                    <h4 className="font-medium text-neutral-950">Customization Available</h4>
                    <p className="mt-1 text-sm text-neutral-600">
                      This piece can be customized to your specifications. Contact us to discuss custom
                      options including dimensions, materials, and finishes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6">
              <div className="text-center">
                <Truck className="mx-auto mb-2 h-6 w-6 text-neutral-950" />
                <p className="text-xs text-neutral-600">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-6 w-6 text-neutral-950" />
                <p className="text-xs text-neutral-600">1 Year Warranty</p>
              </div>
              <div className="text-center">
                <Ruler className="mx-auto mb-2 h-6 w-6 text-neutral-950" />
                <p className="text-xs text-neutral-600">Custom Sizing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-8 font-cormorant text-3xl font-light text-neutral-950">Specifications</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Dimensions */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-medium text-neutral-950">
                <Ruler className="h-5 w-5" />
                Dimensions
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <dt className="text-neutral-600">Width</dt>
                  <dd className="font-medium text-neutral-950">{product.dimensions.width}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <dt className="text-neutral-600">Height</dt>
                  <dd className="font-medium text-neutral-950">{product.dimensions.height}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <dt className="text-neutral-600">Depth</dt>
                  <dd className="font-medium text-neutral-950">{product.dimensions.depth}</dd>
                </div>
              </dl>
            </div>

            {/* Materials */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-medium text-neutral-950">
                <Palette className="h-5 w-5" />
                Materials
              </h3>
              <ul className="space-y-2 text-sm">
                {product.materials.map((material, index) => (
                  <li key={index} className="flex items-start gap-2 border-b border-neutral-200 pb-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-950" />
                    <span className="text-neutral-700">{material}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 font-cormorant text-3xl font-light text-neutral-950">You May Also Like</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}

function RelatedProductCard({ product }: { product: FurnitureProduct }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <Link href={`/showroom/${product.slug}`} className="group block">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <h3 className="mb-2 font-cormorant text-xl font-medium text-neutral-950 transition-colors group-hover:text-neutral-600">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="text-sm text-neutral-400 line-through">
              {product.price.toLocaleString()} {product.currency}
            </span>
          )}
          <span className={`font-medium ${hasDiscount ? 'text-red-600' : 'text-neutral-950'}`}>
            {(product.salePrice || product.price).toLocaleString()} {product.currency}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
