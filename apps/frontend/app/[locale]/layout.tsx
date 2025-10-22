import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mouhajer Interior Design',
  description: 'Luxury Interior Design Dubai',
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="min-h-screen bg-white">
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Mouhajer Design
              </h1>
              <div className="flex space-x-4">
                <a href="/en" className="text-gray-600 hover:text-gray-900">
                  EN
                </a>
                <a href="/ar" className="text-gray-600 hover:text-gray-900">
                  AR
                </a>
              </div>
            </div>
          </div>
        </nav>
        
        {children}
        
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Mouhajer Interior Design. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}