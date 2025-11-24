'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, SlidersHorizontal, X, ShoppingCart, Eye, Heart, Tag } from 'lucide-react';
import { furnitureProducts, categories, sortOptions, type FurnitureProduct } from '@/lib/furniture-data';
import { useCart } from '@/lib/cart-context';

export default function ShowroomContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...furnitureProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price range filter
    products = products.filter(p => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting
    switch (sortBy) {
      case 'featured':
        products.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
        break;
      case 'newest':
        products.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      case 'price-low':
        products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-az':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [selectedCategory, sortBy, searchQuery, priceRange]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden bg-neutral-950">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070"
            alt="Luxury furniture showroom"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 font-cormorant text-5xl font-light text-white md:text-7xl"
            >
              Furniture Showroom
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/80 md:text-xl"
            >
              Discover our curated collection of luxury furniture designed to transform your space
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="sticky top-20 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-neutral-300 py-3 pl-12 pr-4 text-sm focus:border-neutral-950 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-950"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sort and Filter */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-neutral-300 px-6 py-3 text-sm focus:border-neutral-950 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm hover:border-neutral-950"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-neutral-600">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} w-64 shrink-0 md:block`}>
            <div className="sticky top-40 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="mb-4 font-cormorant text-xl font-medium">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-neutral-950 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      <span>{category.label}</span>
                      <span className="text-xs opacity-70">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-4 font-cormorant text-xl font-medium">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>{priceRange[0].toLocaleString()} AED</span>
                    <span>{priceRange[1].toLocaleString()} AED</span>
                  </div>
                </div>
              </div>

              {/* Filter Tags */}
              <div>
                <h3 className="mb-4 font-cormorant text-xl font-medium">Quick Filters</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-950">
                    On Sale
                  </button>
                  <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-950">
                    New Arrivals
                  </button>
                  <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-950">
                    In Stock
                  </button>
                  <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-950">
                    Customizable
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <p className="mb-2 font-cormorant text-2xl text-neutral-600">No products found</p>
                <p className="text-sm text-neutral-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductCard({
  product,
  index,
  isWishlisted,
  onToggleWishlist,
}: {
  product: FurnitureProduct;
  index: number;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}) {
  const { addToCart } = useCart();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors[0]);
  };

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-neutral-100">
        <Link href={`/showroom/${product.slug}`}>
          <Image
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
              -{discountPercent}%
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-neutral-500 px-3 py-1 text-xs font-medium text-white">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-950'
            }`}
          />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/showroom/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-100"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/showroom/${product.slug}`}>
            <h3 className="font-cormorant text-xl font-medium text-neutral-950 transition-colors hover:text-neutral-600">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-neutral-600">{product.subcategory}</p>

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

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.customizable && (
            <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
              <Tag className="h-3 w-3" />
              Customizable
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
