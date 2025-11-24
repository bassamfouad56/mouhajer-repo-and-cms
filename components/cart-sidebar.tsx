'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, isCartOpen, closeCart } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-neutral-950" />
                <h2 className="font-cormorant text-2xl font-medium text-neutral-950">
                  Shopping Cart
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 transition-colors hover:bg-neutral-100"
              >
                <X className="h-6 w-6 text-neutral-950" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-16 w-16 text-neutral-300" />
                  <p className="mb-2 font-cormorant text-xl text-neutral-600">Your cart is empty</p>
                  <p className="mb-6 text-sm text-neutral-500">Add items to get started</p>
                  <Link
                    href="/showroom"
                    onClick={closeCart}
                    className="rounded-full bg-neutral-950 px-6 py-3 text-sm text-white transition-colors hover:bg-neutral-800"
                  >
                    Browse Furniture
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = item.product.salePrice || item.product.price;
                    const subtotal = price * item.quantity;

                    return (
                      <div
                        key={`${item.product.id}-${item.selectedColor.name}`}
                        className="group flex gap-4 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-300"
                      >
                        {/* Product Image */}
                        <Link
                          href={`/showroom/${item.product.slug}`}
                          onClick={closeCart}
                          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                        >
                          <Image
                            src={item.selectedColor.image || item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col">
                          <Link
                            href={`/showroom/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-cormorant text-lg font-medium text-neutral-950 transition-colors hover:text-neutral-600"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-neutral-600">{item.selectedColor.name}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="font-medium text-neutral-950">
                              {subtotal.toLocaleString()} {item.product.currency}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center rounded-lg border border-neutral-300">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.selectedColor.name,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-2 hover:bg-neutral-100"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.selectedColor.name,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-2 hover:bg-neutral-100"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              {/* Remove Button */}
                              <button
                                onClick={() =>
                                  removeFromCart(item.product.id, item.selectedColor.name)
                                }
                                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium text-neutral-950">
                      {totalPrice.toLocaleString()} AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                    <span className="font-cormorant text-xl font-medium text-neutral-950">Total</span>
                    <span className="font-cormorant text-2xl font-medium text-neutral-950">
                      {totalPrice.toLocaleString()} AED
                    </span>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-neutral-950 py-4 text-center font-medium text-white transition-colors hover:bg-neutral-800">
                  Proceed to Checkout
                </button>
                <button
                  onClick={closeCart}
                  className="mt-3 w-full rounded-lg border border-neutral-300 py-4 text-center font-medium text-neutral-950 transition-colors hover:bg-neutral-100"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
