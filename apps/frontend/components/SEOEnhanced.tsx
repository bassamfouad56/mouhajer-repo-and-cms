"use client";

import Head from "next/head";
import Script from "next/script";

interface SEOEnhancedProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  locale?: "en" | "ar";
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  structuredData?: Record<string, any>;
}

export default function SEOEnhanced({
  title = "Mouhajer International Design - Luxury Interior Design in Dubai",
  description = "Award-winning interior design company in Dubai. We create luxury residential and commercial spaces with distinction. Best interior designers in UAE.",
  canonical,
  ogImage = "/og-default.jpg",
  locale = "en",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Mouhajer International Design",
  keywords = [
    "interior design Dubai",
    "luxury interior design UAE",
    "best interior designers Dubai",
    "residential interior design",
    "commercial interior design",
    "villa interior design Dubai",
    "office interior design UAE",
    "Mouhajer design"
  ],
  structuredData
}: SEOEnhancedProps) {
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || "https://www.mouhajerdesign.com";
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // Generate comprehensive structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mouhajer International Design and Contracting",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": description,
    "foundingDate": "2000",
    "founder": {
      "@type": "Person",
      "name": "Eng. Maher Mouhajer"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AE",
      "addressRegion": "Dubai"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Arabic"]
    },
    "sameAs": [
      "https://www.instagram.com/mouhajerdesign/",
      "https://www.linkedin.com/company/mouhajer-international-design/"
    ],
    "serviceArea": {
      "@type": "Place",
      "name": "Dubai, UAE, Middle East"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Interior Design Services",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Residential Interior Design",
          "description": "Luxury villa and apartment interior design services"
        },
        {
          "@type": "Service",
          "name": "Commercial Interior Design",
          "description": "Office, hotel, and retail space interior design"
        },
        {
          "@type": "Service",
          "name": "Turn-key Projects",
          "description": "Complete interior design and construction solutions"
        }
      ]
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(", ")} />
        <meta name="author" content={author} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Canonical URL */}
        <link rel="canonical" href={fullCanonical} />

        {/* Language alternates */}
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en`} />
        <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/en`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={fullCanonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Mouhajer International Design" />
        <meta property="og:locale" content={locale === "en" ? "en_US" : "ar_AE"} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={fullCanonical} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />

        {/* Article specific meta tags */}
        {type === "article" && publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {type === "article" && modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {type === "article" && author && (
          <meta property="article:author" content={author} />
        )}

        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/Satoshi-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SchnyderS-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>

      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData, null, 2)
        }}
      />

      {/* Google Analytics 4 */}
      {process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']}', {
                page_title: '${title}',
                page_location: '${fullCanonical}'
              });
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {process.env['NEXT_PUBLIC_FB_PIXEL_ID'] && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env['NEXT_PUBLIC_FB_PIXEL_ID']}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}