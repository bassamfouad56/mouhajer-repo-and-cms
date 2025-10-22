import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import CMSLayout from '@/components/CMSLayout';
import SessionProvider from '@/components/SessionProvider';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Poppins({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae'),
  title: {
    default: 'Mouhajer CMS - Content Management System',
    template: '%s | Mouhajer CMS',
  },
  description:
    'Content Management System for Mouhajer International Design and Contracting - Manage your interior design projects, services, and content',
  keywords: ['CMS', 'Mouhajer', 'Interior Design', 'Dubai', 'Content Management', 'GraphQL'],
  authors: [{ name: 'Mouhajer International Design and Contracting' }],
  creator: 'Mouhajer International',
  publisher: 'Mouhajer International',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    alternateLocale: ['ar_AE'],
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae',
    siteName: 'Mouhajer CMS',
    title: 'Mouhajer CMS - Content Management System',
    description: 'Content Management System for Mouhajer International Design and Contracting',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mouhajer CMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouhajer CMS - Content Management System',
    description: 'Content Management System for Mouhajer International Design and Contracting',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <ToastProvider>
              <CMSLayout>{children}</CMSLayout>
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
