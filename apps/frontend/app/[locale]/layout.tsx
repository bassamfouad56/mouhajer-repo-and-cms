import type { Metadata } from 'next';
import localFont from 'next/font/local';
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
      <body
        className="min-h-screen font-sans "
        style={{ backgroundColor: '#FFFEF5', color: '#1E1E1E' }}
      >
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
