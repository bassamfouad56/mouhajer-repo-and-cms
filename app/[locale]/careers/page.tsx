import { Metadata } from 'next';
import CareersPageContent from './careers-page-content';

export const metadata: Metadata = {
  title: 'Careers - Join Our Team | Mouhajer Design',
  description: 'Join the award-winning team at Mouhajer Design. Explore career opportunities in architecture, interior design, and project management across Dubai and the UAE.',
  openGraph: {
    title: 'Careers - Join Our Team | Mouhajer Design',
    description: 'Join the award-winning team at Mouhajer Design. Explore career opportunities in architecture, interior design, and project management.',
  },
};

export default function CareersPage() {
  return <CareersPageContent />;
}
