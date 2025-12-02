import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import HandoverMaintenanceContent from './handover-maintenance-content';

export const metadata: Metadata = {
  title: 'Handover & Maintenance | MIDC - The Keys & Beyond',
  description: 'We Protect. Our job isn&apos;t done when we hand over the keys. We provide warranty management, 24/7 defect response, and optional long-term maintenance contracts to protect your investment.',
};

export default function HandoverMaintenancePage() {
  return (
    <>
      <Header />
      <HandoverMaintenanceContent />
      <Footer />
    </>
  );
}
