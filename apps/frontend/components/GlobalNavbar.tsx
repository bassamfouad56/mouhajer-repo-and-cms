import React from 'react';
import Link from 'next/link';
import { fetchGlobalComponentByType } from '@/lib/fetchers/global-components';

interface NavbarData {
  logo?: {
    text?: string;
    image?: string;
  };
  menuItems?: Array<{
    label: string;
    href: string;
    target?: string;
  }>;
  ctaButton?: {
    text: string;
    href: string;
    style?: string;
  };
}

interface GlobalNavbarProps {
  lang?: string;
}

export default async function GlobalNavbar({ lang = 'en' }: GlobalNavbarProps) {
  const navbarComponent = await fetchGlobalComponentByType('navbar', lang);

  if (!navbarComponent || !navbarComponent.enabled) {
    // Return default navbar if no global component is found
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold">
              Mouhajer
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-gray-900">
                Services
              </Link>
              <Link href="/portfolio" className="text-gray-700 hover:text-gray-900">
                Portfolio
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const data = navbarComponent.data as NavbarData;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {data.logo?.image ? (
              <img
                src={data.logo.image}
                alt={data.logo.text || 'Logo'}
                className="h-10 w-auto"
              />
            ) : (
              <span className="text-xl font-bold">
                {data.logo?.text || 'Mouhajer'}
              </span>
            )}
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            {data.menuItems?.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                target={item.target}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* CTA Button */}
            {data.ctaButton && (
              <Link
                href={data.ctaButton.href}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  data.ctaButton.style === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : data.ctaButton.style === 'secondary'
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {data.ctaButton.text}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}