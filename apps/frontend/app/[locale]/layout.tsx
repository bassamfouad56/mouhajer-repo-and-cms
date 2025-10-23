import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dataFetcher } from '@/lib/data-fetcher';
import { fetchNavigation } from '@/lib/navigation-fetcher';

const schnyder = localFont({
  src: '../../public/fonts/SchnyderS-Ligh.otf',
  variable: '--font-schnyder',
  display: 'swap',
});

const satoshi = localFont({
  src: '../../public/fonts/Satoshi-Regular.ttf',
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mouhajer Interior Design',
  description: 'Luxury Interior Design Dubai',
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Fetch data needed for Navbar and Footer
  const [services, blogs, projects, headerNav, footerNav] = await Promise.allSettled([
    dataFetcher.getServices(),
    dataFetcher.getBlogPosts(),
    dataFetcher.getProjects(),
    fetchNavigation('header'),
    fetchNavigation('footer'),
  ]);

  const servicesData = services.status === 'fulfilled' ? services.value : [];
  const blogsData = blogs.status === 'fulfilled' ? blogs.value : [];
  const projectsData = projects.status === 'fulfilled' ? projects.value : [];
  const headerNavigationItems = headerNav.status === 'fulfilled' ? headerNav.value : [];
  const footerNavigationItems = footerNav.status === 'fulfilled' ? footerNav.value : [];

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${schnyder.variable} ${satoshi.variable}`}
    >
      <head>
        {/* Google Tag Manager - GTM-MGNHGSH6 */}
        {/* <Script
          id="gtm-script-1"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MGNHGSH6');`,
          }}
        /> */}

        {/* Google Tag Manager - GTM-WT8DXZZ7 */}
        <Script
          id="gtm-script-2"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WT8DXZZ7');`,
          }}
        />
      </head>

      <body
        className="min-h-screen font-sans "
        style={{ backgroundColor: '#FFFEF5', color: '#1E1E1E' }}
      >
        {/* Google Tag Manager (noscript) - GTM-MGNHGSH6 */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MGNHGSH6"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {/* Google Tag Manager (noscript) - GTM-WT8DXZZ7 */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WT8DXZZ7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <Navbar
          services={servicesData}
          blogs={blogsData}
          projectsData={projectsData}
          navigationItems={headerNavigationItems}
        />

        {children}

        <Footer navigationItems={footerNavigationItems} />
      </body>
    </html>
  );
}
