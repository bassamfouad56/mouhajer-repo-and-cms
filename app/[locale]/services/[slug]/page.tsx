import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getServices, getIndustries, getProjects, Service } from '@/lib/wordpress';
import EnhancedServiceDetail from './enhanced-service-detail';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const services = await getServices(locale);
  const service = services.find((s: Service) => s.slug === slug);

  if (!service) {
    return {
      title: 'Service Not Found | Mouhajer Design Studio',
    };
  }

  return {
    title: `${service.title} | Services | Mouhajer Design Studio`,
    description: service.excerpt || `Explore our ${service.title} design services and portfolio.`,
  };
}

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const paths = [];

  for (const locale of locales) {
    const services = await getServices(locale);
    for (const service of services) {
      paths.push({
        locale,
        slug: service.slug,
      });
    }
  }

  return paths;
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const [services, industries, projects] = await Promise.all([
    getServices(locale),
    getIndustries(locale),
    getProjects(locale),
  ]);

  const service = services.find((s: Service) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Filter related industries and projects
  const relatedIndustries = industries.filter(i =>
    service.acfFields?.relatedServices?.includes(i.id)
  );

  const relatedProjects = projects.filter(p =>
    p.acfFields?.services?.includes(service.id) ||
    service.acfFields?.relatedProjects?.includes(p.id)
  );

  return (
    <>
      <Header />
      <EnhancedServiceDetail
        service={service}
        relatedIndustries={relatedIndustries}
        relatedProjects={relatedProjects}
        allServices={services}
      />
      <Footer />
    </>
  );
}
