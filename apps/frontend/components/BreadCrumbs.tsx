'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const toTitleCase = (str: string) =>
  str
    .split(' ')
    .map((w) => (w.length > 0 ? w[0]?.toUpperCase() + w.slice(1) : w))
    .join(' ');

const BreadCrumbs = () => {
  const pathname = usePathname();
  const locale = useLocale();

  const segments = pathname.split('/').filter(Boolean);

  // Remove locale segment from crumbs but keep it for links
  const [, ...rest] = segments[0] === locale ? segments : ['', ...segments];

  const crumbs = [
    {
      href: `/${locale}`,
      label: locale === 'en' ? 'Home' : 'الرئيسية',
    },
    ...rest.map((seg, i) => {
      const href = `/${[locale, ...rest.slice(0, i + 1)].join('/')}`;
      const decoded = decodeURIComponent(seg.replace(/-/g, ' ').trim());
      return {
        href,
        label: toTitleCase(decoded),
      };
    }),
  ];

  return (
    <nav aria-label="Breadcrumb" className="w-full flex justify-center">
      <ol
        className={`flex items-center justify-center gap-2 text-xs md:text-sm font-Satoshi uppercase ${
          locale === 'en' ? '' : 'flex-row-reverse'
        } text-[#202020]`}
      >
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="opacity-80">{c.label}</span>
              ) : (
                <Link
                  href={c.href}
                  className="opacity-70 hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
                >
                  {c.label}
                </Link>
              )}
              {!isLast && <span className="opacity-40">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
