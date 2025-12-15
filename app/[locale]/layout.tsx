import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/components/page-transition";
import { OrganizationStructuredData, LocalBusinessStructuredData } from "@/components/structured-data";
import WhatsAppButton from "@/components/whatsapp-button";
import AIChatbot from "@/components/ai-chatbot";
import { BackToTop } from "@/components/back-to-top";
import { CartProvider } from "@/lib/cart-context";
import { CartSidebar } from "@/components/cart-sidebar";
import { PreviewBanner } from "@/components/preview-banner";
import { locales, getDirection, type Locale } from '@/i18n/config';
import { Preloader } from "@/components/preloader";
import { ScrollProgress } from "@/components/scroll-progress";
import { NoiseTexture } from "@/components/noise-texture";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { MegaMenuImagesServerProvider } from "@/components/providers/mega-menu-images-server-provider";

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
  const { isEnabled: isDraftMode } = await draftMode();
  const direction = getDirection(locale as Locale);

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <LocaleProvider locale={locale as Locale} direction={direction}>
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

      {/* Premium UX: Preloader */}
      <Preloader />

      {/* Premium UX: Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Premium UX: Noise Texture Overlay */}
      <NoiseTexture />

      <MegaMenuImagesServerProvider>
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

            {/* Back to Top Button */}
            <BackToTop />

            {/* Shopping Cart Sidebar */}
            <CartSidebar />

            {/* Preview Mode Banner */}
            {isDraftMode && <PreviewBanner />}
          </CartProvider>
        </NextIntlClientProvider>
      </MegaMenuImagesServerProvider>
    </LocaleProvider>
  );
}
