import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  language?: 'en' | 'ar';
  noindex?: boolean;
  nofollow?: boolean;
  alternates?: Array<{
    hrefLang: string;
    href: string;
  }>;
}

export default function MetaTags({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  language = 'en',
  noindex = false,
  nofollow = false,
  alternates = [],
}: MetaTagsProps) {
  const isArabic = language === 'ar';

  // Robots meta
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Alternate Language Links */}
      {alternates.map((alt, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={alt.hrefLang}
          href={alt.href}
        />
      ))}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content={isArabic ? 'ar_AE' : 'en_AE'} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={title} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Language and Direction */}
      <html lang={language} dir={isArabic ? 'rtl' : 'ltr'} />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* UAE Specific */}
      <meta name="geo.region" content="AE" />
      <meta name="geo.country" content="United Arab Emirates" />
    </Head>
  );
}
