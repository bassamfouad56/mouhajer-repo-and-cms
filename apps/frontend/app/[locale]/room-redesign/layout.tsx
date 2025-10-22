import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'RoomRedesign' });

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      type: 'website',
      locale: locale === 'ar' ? 'ar_AR' : 'en_US',
      siteName: 'Mouhajer Design',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('subtitle'),
    },
    alternates: {
      canonical: `/room-redesign`,
      languages: {
        en: '/en/room-redesign',
        ar: '/ar/room-redesign',
      },
    },
  };
}

export default function RoomRedesignLayout({ children }: Props) {
  return <>{children}</>;
}
