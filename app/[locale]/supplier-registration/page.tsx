import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import SupplierRegistrationContent from './supplier-registration-content';

export const metadata: Metadata = {
  title: 'Supplier Registration | MIDC - Join Our Vendor Network',
  description: 'Register as a supplier with MIDC. We partner with companies supplying high-grade stone, bespoke joinery, and specialized construction materials that meet the MIDC Standard.',
};

export default function SupplierRegistrationPage() {
  return (
    <>
      <Header />
      <SupplierRegistrationContent />
      <Footer />
    </>
  );
}
