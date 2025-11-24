import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo } from "next/font/google";
import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/components/page-transition";
import { OrganizationStructuredData, LocalBusinessStructuredData } from "@/components/structured-data";
import WhatsAppButton from "@/components/whatsapp-button";
import AIChatbot from "@/components/ai-chatbot";
import { CartProvider } from "@/lib/cart-context";
import { CartSidebar } from "@/components/cart-sidebar";
import { locales, getDirection } from '@/i18n/config';
import "../globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com'),
  title: {
    default: "Mouhajer International Design | Luxury Interior Design Dubai",
    template: "%s | Mouhajer International Design",
  },
  description:
    "Award-winning interior design studio in Dubai, specializing in luxury residential and commercial spaces. Creating timeless, elegant interiors since 2009.",
  keywords: [
    "interior design",
    "luxury interior design",
    "Dubai interior designer",
    "residential design",
    "commercial design",
    "Mouhajer Design",
    "interior architecture",
    "custom furniture",
    "space planning",
  ],
  authors: [{ name: "Mouhajer International Design" }],
  creator: "Mouhajer International Design",
  publisher: "Mouhajer International Design",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Mouhajer International Design",
    title: "Mouhajer International Design | Luxury Interior Design Dubai",
    description:
      "Award-winning interior design studio in Dubai, specializing in luxury residential and commercial spaces.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mouhajer International Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mouhajer International Design | Luxury Interior Design Dubai",
    description:
      "Award-winning interior design studio in Dubai, specializing in luxury residential and commercial spaces.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  const messages = await getMessages();
  const direction = getDirection(locale as typeof locales[number]);

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  // Use Cairo font for Arabic, Inter/Playfair for English
  const fontVariables = locale === 'ar'
    ? `${cairo.variable} ${playfair.variable}`
    : `${inter.variable} ${playfair.variable}`;

  return (
    <html lang={locale} dir={direction} className="scroll-smooth">
      <head>
        {/* Structured Data */}
        <OrganizationStructuredData />
        <LocalBusinessStructuredData />

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {GTM_ID && (
          <>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${fontVariables} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Page Transition Loader - Top Progress Bar */}
        <NextTopLoader
          color="#ffffff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ffffff,0 0 5px #ffffff"
        />

        {/* Page Transition Animation */}
        <PageTransition />

        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>

            {/* Always-visible WhatsApp Button */}
            <WhatsAppButton
              phoneNumber="971523041482"
              message="Hello! I'm interested in learning more about your design services."
            />

            {/* AI Chatbot */}
            <AIChatbot />

            {/* Shopping Cart Sidebar */}
            <CartSidebar />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
