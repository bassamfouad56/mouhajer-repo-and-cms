import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { About } from '@/components/sections/about';
import { Team } from '@/components/sections/team';
import { Testimonials } from '@/components/sections/testimonials';
import { Process } from '@/components/sections/process';

export const metadata: Metadata = {
  title: 'About Us | Mouhajer International Design',
  description: 'Learn about Mouhajer International Design - Award-winning luxury interior design firm with over 20 years of excellence in creating timeless spaces across the Middle East.',
  openGraph: {
    title: 'About Us | Mouhajer International Design',
    description: 'Learn about Mouhajer International Design - Award-winning luxury interior design firm with over 20 years of excellence.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Mouhajer International Design Studio',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] bg-neutral-950 px-6 py-32 lg:px-12 lg:py-40">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[100px_100px]" />

          <div className="relative z-10 mx-auto max-w-[1800px]">
            <div className="max-w-4xl">
              <h1 className="mb-8 text-5xl font-light tracking-tight text-white lg:text-7xl">
                Crafting Timeless Spaces Since 2009
              </h1>
              <p className="text-xl font-light leading-relaxed text-neutral-300 lg:text-2xl">
                Mouhajer International Design is an award-winning luxury interior design firm dedicated to creating
                exceptional spaces that reflect the unique vision and lifestyle of our clients.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <About />

        {/* Our Process */}
        <Process />

        {/* Our Story */}
        <section className="bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1800px]">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              <div>
                <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                  Our Story
                </h2>
                <div className="space-y-6 text-lg font-light leading-relaxed text-neutral-700">
                  <p>
                    Founded in 2009, Mouhajer International Design began with a simple yet powerful vision: to create
                    interior spaces that transcend trends and stand the test of time.
                  </p>
                  <p>
                    Over the years, we&apos;ve grown from a boutique design studio into one of the Middle East&apos;s most
                    respected interior design firms, completing over 500 projects across residential, commercial, and
                    hospitality sectors.
                  </p>
                  <p>
                    Our approach combines meticulous attention to detail with a deep understanding of cultural context,
                    resulting in spaces that are not only beautiful but also deeply meaningful to those who inhabit them.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                  Our Philosophy
                </h2>
                <div className="space-y-6 text-lg font-light leading-relaxed text-neutral-700">
                  <p>
                    We believe that exceptional design is born from the perfect marriage of form and function. Every
                    project we undertake is approached with fresh eyes, creative thinking, and unwavering commitment to
                    excellence.
                  </p>
                  <p>
                    Our design philosophy centers on creating harmonious environments that enhance the daily lives of our
                    clients while respecting architectural integrity and cultural heritage.
                  </p>
                  <p>
                    Sustainability, craftsmanship, and innovation guide every decision we make, ensuring that our designs
                    are not only visually stunning but also environmentally responsible and built to last.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1800px]">
            <h2 className="mb-16 text-center text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
              Our Values
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Excellence',
                  description: 'Unwavering commitment to the highest standards in every aspect of our work.',
                },
                {
                  title: 'Innovation',
                  description: 'Constantly pushing boundaries while respecting timeless design principles.',
                },
                {
                  title: 'Integrity',
                  description: 'Honest, transparent relationships built on trust and mutual respect.',
                },
                {
                  title: 'Sustainability',
                  description: 'Responsible design that minimizes environmental impact and maximizes longevity.',
                },
              ].map((value) => (
                <div key={value.title} className="group">
                  <div className="relative overflow-hidden border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-950">
                    <h3 className="mb-4 text-2xl font-light text-neutral-950">{value.title}</h3>
                    <p className="font-light leading-relaxed text-neutral-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <Team />

        {/* Testimonials */}
        <Testimonials />

        {/* Awards & Recognition */}
        <section className="bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1800px]">
            <h2 className="mb-16 text-center text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
              Awards & Recognition
            </h2>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  year: '2023',
                  award: 'Best Luxury Interior Design',
                  organization: 'Middle East Design Awards',
                },
                {
                  year: '2022',
                  award: 'Hospitality Design Excellence',
                  organization: 'International Design Awards',
                },
                {
                  year: '2022',
                  award: 'Residential Design of the Year',
                  organization: 'Gulf Interior Design Awards',
                },
                {
                  year: '2021',
                  award: 'Innovation in Design',
                  organization: 'Dubai Design Week',
                },
                {
                  year: '2020',
                  award: 'Sustainable Design Award',
                  organization: 'Green Building Council',
                },
                {
                  year: '2019',
                  award: 'Design Firm of the Year',
                  organization: 'Emirates Interior Designers',
                },
              ].map((award) => (
                <div key={`${award.year}-${award.award}`} className="border-l-2 border-neutral-950 pl-6">
                  <div className="mb-2 text-sm font-light tracking-wider text-neutral-500">{award.year}</div>
                  <h3 className="mb-2 text-xl font-light text-neutral-950">{award.award}</h3>
                  <p className="font-light text-neutral-600">{award.organization}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
