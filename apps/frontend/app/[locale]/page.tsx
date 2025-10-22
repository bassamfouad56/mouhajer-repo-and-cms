import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Mouhajer Interior Design',
    description: 'Luxury Interior Design Dubai',
  };
}

export default async function Home({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Welcome to Mouhajer Design' : 'مرحباً بكم في موهاجر للتصميم'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {locale === 'en' 
              ? 'Luxury Interior Design & Architecture in Dubai'
              : 'التصميم الداخلي الفاخر والهندسة المعمارية في دبي'
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'en' ? 'Interior Design' : 'التصميم الداخلي'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? 'Luxury residential and commercial interior design'
                  : 'التصميم الداخلي الفاخر للمساكن والمشاريع التجارية'
                }
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'en' ? 'Architecture' : 'الهندسة المعمارية'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? 'Modern architectural solutions and planning'
                  : 'الحلول المعمارية الحديثة والتخطيط'
                }
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'en' ? 'Consultation' : 'الاستشارة'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? 'Expert design consultation and project management'
                  : 'استشارات التصميم المتخصصة وإدارة المشاريع'
                }
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-gray-500">
              {locale === 'en' 
                ? 'CMS Connection Status: Testing...'
                : 'حالة الاتصال بنظام إدارة المحتوى: جاري الاختبار...'
              }
            </p>
            <div className="mt-4">
              <a 
                href="/en" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
              >
                English
              </a>
              <a 
                href="/ar" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                العربية
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}