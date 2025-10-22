import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding testimonials...');

  const testimonials = [
    {
      name: 'Sarah Al-Mansoori',
      role: 'Homeowner',
      company: null,
      commentEn:
        'Working with Mouhajer was an absolute dream! They transformed our villa into a modern masterpiece while respecting our traditional values. The attention to detail and professionalism was outstanding.',
      commentAr:
        'كان العمل مع مهاجر حلمًا حقيقيًا! قاموا بتحويل فيلتنا إلى تحفة عصرية مع احترام قيمنا التقليدية. كان الاهتمام بالتفاصيل والاحترافية رائعين.',
      rating: 5,
      projectTitle: 'Modern Villa Redesign',
      projectType: 'villa',
      clientImage: '/images/clients/sarah-almansoori.jpg',
      projectImage: '/images/projects/villa-modern.jpg',
      locale: 'en',
      featured: true,
      published: true,
    },
    {
      name: 'Ahmed Hassan',
      role: 'CEO',
      company: 'Tech Innovations LLC',
      commentEn:
        'Our office transformation exceeded all expectations. The team understood our vision for a creative workspace and delivered beyond what we imagined. Highly recommended!',
      commentAr:
        'تجاوز تحويل مكتبنا جميع التوقعات. فهم الفريق رؤيتنا لمساحة عمل إبداعية وحقق أكثر مما تخيلنا. موصى به بشدة!',
      rating: 5,
      projectTitle: 'Tech Office Redesign',
      projectType: 'office',
      clientImage: '/images/clients/ahmed-hassan.jpg',
      projectImage: '/images/projects/office-tech.jpg',
      locale: 'en',
      featured: true,
      published: true,
    },
    {
      name: 'Fatima Al-Zarooni',
      role: 'Interior Design Enthusiast',
      company: null,
      commentEn:
        'The level of creativity and expertise shown by Mouhajer team is unmatched. They listened to every detail and created a space that truly reflects our personality.',
      commentAr:
        'مستوى الإبداع والخبرة الذي أظهره فريق مهاجر لا مثيل له. استمعوا إلى كل التفاصيل وأنشأوا مساحة تعكس شخصيتنا حقًا.',
      rating: 5,
      projectTitle: 'Luxury Apartment',
      projectType: 'apartment',
      clientImage: '/images/clients/fatima-alzarooni.jpg',
      projectImage: '/images/projects/apartment-luxury.jpg',
      locale: 'en',
      featured: false,
      published: true,
    },
    {
      name: 'Omar Al-Maktoum',
      role: 'Business Owner',
      company: 'Al-Maktoum Trading',
      commentEn:
        'Professional, creative, and delivered on time! The restaurant design has received countless compliments from our customers. Worth every dirham.',
      commentAr:
        'محترفون ومبدعون وتسليم في الوقت المحدد! حصل تصميم المطعم على إشادات لا حصر لها من عملائنا. يستحق كل درهم.',
      rating: 5,
      projectTitle: 'Restaurant Interior',
      projectType: 'commercial',
      clientImage: '/images/clients/omar-almaktoum.jpg',
      projectImage: '/images/projects/restaurant-modern.jpg',
      locale: 'en',
      featured: false,
      published: true,
    },
    {
      name: 'Layla Khalid',
      role: 'Homeowner',
      company: null,
      commentEn:
        'From concept to completion, the experience was seamless. The team was responsive, creative, and truly cared about bringing our vision to life.',
      commentAr:
        'من المفهوم إلى الإكمال، كانت التجربة سلسة. كان الفريق سريع الاستجابة ومبدعًا ويهتم حقًا بتحقيق رؤيتنا.',
      rating: 4,
      projectTitle: 'Contemporary Home',
      projectType: 'villa',
      clientImage: '/images/clients/layla-khalid.jpg',
      projectImage: '/images/projects/home-contemporary.jpg',
      locale: 'en',
      featured: false,
      published: true,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
    console.log(`✅ Created testimonial: ${testimonial.name}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding testimonials:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
