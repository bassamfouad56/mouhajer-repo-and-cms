import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import localFont from 'next/font/local';
import Footer from '@/components/Footer';
import FloatingNavbar from '@/components/FloatingNavbar';
import NavbarMobile from '@/components/NavbarMobile';
import { getLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import AIRoomDesignComp from '@/components/AIRoomDesignComp';
import { Suspense } from 'react';
import Loading from '@/components/Loading';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/query-client';
import { fetchNavigation } from '@/lib/navigation-fetcher';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luxury Interior Design with Distinction | Mouhajer',
  description: 'Luxury Interior Design with Distinction | Mouhajer',
};

const MyArFont = localFont({
  src: '../../public/fonts/Satoshi-Regular.ttf',
  variable: '--font-Satoshi',
});

const MyHeadrFont = localFont({
  src: '../../public/fonts/SchnyderS-Ligh.otf',
  variable: '--font-SchnyderS',
});
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  params: { locale: string };

  children: React.ReactNode;
}>) {
  const nextLocale = await getLocale();
  try {
    if (locale !== nextLocale) {
      notFound();
    }

    // Fetch navigation items from CMS
    const navigationItems = await fetchNavigation();

    // Get messages for the current locale
    const messages = await getMessages();

    return (
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <body className="max-w-[100vw] overflow-x-hidden">
          <Providers locale={locale} messages={messages}>
            <QueryProvider>
              <main>
                <div className={`${MyArFont.variable} ${MyHeadrFont.variable}`}>
                  <div className="overflow-hidden hidden lg:block ">
                    <Navbar navigationItems={navigationItems} />
                    <FloatingNavbar />
                  </div>
                  <NavbarMobile navigationItems={navigationItems} />
                  <Suspense fallback={<Loading />}>{children}</Suspense>

                  <AIRoomDesignComp />
                  <Footer navigationItems={navigationItems} />
                  <Toaster position="bottom-right" />
                </div>
              </main>
            </QueryProvider>
          </Providers>
        </body>
      </html>
    );
  } catch (error) {}
}
