import { useTranslations } from 'next-intl';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  // Note: In Next.js 14 App Router, not-found.tsx doesn't receive params
  // We'll use a default locale or implement a client component for translation
  const locale = 'en'; // This would need to be handled differently in production

  const popularPages = [
    { href: `/${locale}/`, label: locale === 'en' ? 'Home' : 'الرئيسية' },
    { href: `/${locale}/projects`, label: locale === 'en' ? 'Projects' : 'المشاريع' },
    { href: `/${locale}/team`, label: locale === 'en' ? 'Our Team' : 'فريقنا' },
    { href: `/${locale}/pricing`, label: locale === 'en' ? 'Pricing' : 'الأسعار' },
    { href: `/${locale}/testimonials`, label: locale === 'en' ? 'Testimonials' : 'الشهادات' },
    { href: `/${locale}/contact`, label: locale === 'en' ? 'Contact' : 'اتصل بنا' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center">
            <FileQuestion className="w-32 h-32 text-primary/30" aria-hidden="true" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {locale === 'en' ? 'Page Not Found' : 'الصفحة غير موجودة'}
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          {locale === 'en'
            ? "Oops! The page you're looking for seems to have been redesigned out of existence. But don't worry, we have plenty of beautiful pages to explore!"
            : 'عذرًا! يبدو أن الصفحة التي تبحث عنها قد تمت إعادة تصميمها خارج الوجود. ولكن لا تقلق، لدينا الكثير من الصفحات الجميلة لاستكشافها!'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link
            href={`/${locale}/`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>{locale === 'en' ? 'Go Home' : 'الصفحة الرئيسية'}</span>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            <span>{locale === 'en' ? 'Contact Us' : 'اتصل بنا'}</span>
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">
            {locale === 'en' ? 'Popular Pages' : 'الصفحات الشائعة'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
              >
                <ArrowLeft
                  className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
                <span className="font-medium">{page.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-12 text-muted-foreground">
          {locale === 'en'
            ? 'If you believe this is an error, please '
            : 'إذا كنت تعتقد أن هذا خطأ، يرجى '}
          <Link href={`/${locale}/contact`} className="text-primary hover:underline font-semibold">
            {locale === 'en' ? 'contact our support team' : 'الاتصال بفريق الدعم'}
          </Link>
        </p>
      </div>
    </div>
  );
}
