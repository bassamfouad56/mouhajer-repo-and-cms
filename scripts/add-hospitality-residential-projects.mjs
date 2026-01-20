import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

// ========================================
// TAXONOMY DATA
// ========================================

const industries = [
  { id: 'industry-hospitality', title: { en: 'Hospitality', ar: 'الضيافة' }, slug: 'hospitality' },
  { id: 'industry-residential', title: { en: 'Residential', ar: 'سكني' }, slug: 'residential' },
];

const projectTypes = [
  { id: 'projectType-full-turnkey-renovation', title: { en: 'Full Turnkey Renovation', ar: 'تجديد متكامل' }, slug: 'full-turnkey-renovation' },
  { id: 'projectType-soft-refurbishment', title: { en: 'Soft Refurbishment', ar: 'تجديد خفيف' }, slug: 'soft-refurbishment' },
  { id: 'projectType-design-build', title: { en: 'Design & Build', ar: 'تصميم وبناء' }, slug: 'design-build' },
  { id: 'projectType-hotel-refurbishment', title: { en: 'Hotel Refurbishment', ar: 'تجديد فندق' }, slug: 'hotel-refurbishment' },
  { id: 'projectType-turnkey-contract', title: { en: 'Turnkey Contract', ar: 'عقد متكامل' }, slug: 'turnkey-contract' },
  { id: 'projectType-general-resort-design', title: { en: 'General Resort Design', ar: 'تصميم منتجع' }, slug: 'general-resort-design' },
];

const locations = [
  { id: 'location-abu-dhabi', name: { en: 'Abu Dhabi, UAE', ar: 'أبوظبي، الإمارات' }, slug: 'abu-dhabi', country: 'UAE' },
  { id: 'location-dubai', name: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' }, slug: 'dubai', country: 'UAE' },
  { id: 'location-downtown-dubai', name: { en: 'Downtown Dubai, UAE', ar: 'وسط دبي، الإمارات' }, slug: 'downtown-dubai', country: 'UAE' },
  { id: 'location-palm-jumeirah', name: { en: 'Palm Jumeirah, Dubai', ar: 'نخلة جميرا، دبي' }, slug: 'palm-jumeirah', country: 'UAE' },
  { id: 'location-jbr', name: { en: 'JBR, Dubai', ar: 'جي بي آر، دبي' }, slug: 'jbr-dubai', country: 'UAE' },
  { id: 'location-mbr-city', name: { en: 'MBR City, Dubai', ar: 'مدينة محمد بن راشد، دبي' }, slug: 'mbr-city', country: 'UAE' },
  { id: 'location-jumeirah-bay', name: { en: 'Jumeirah Bay, Dubai', ar: 'خليج جميرا، دبي' }, slug: 'jumeirah-bay', country: 'UAE' },
  { id: 'location-saadiyat-island', name: { en: 'Saadiyat Island, Abu Dhabi', ar: 'جزيرة السعديات، أبوظبي' }, slug: 'saadiyat-island', country: 'UAE' },
  { id: 'location-dubai-marina', name: { en: 'Dubai Marina, UAE', ar: 'مرسى دبي، الإمارات' }, slug: 'dubai-marina', country: 'UAE' },
  { id: 'location-dubai-creek', name: { en: 'Dubai Creek, UAE', ar: 'خور دبي، الإمارات' }, slug: 'dubai-creek', country: 'UAE' },
  { id: 'location-sheikh-zayed-road', name: { en: 'Sheikh Zayed Road, Dubai', ar: 'شارع الشيخ زايد، دبي' }, slug: 'sheikh-zayed-road', country: 'UAE' },
  { id: 'location-oud-metha', name: { en: 'Oud Metha, Dubai', ar: 'عود ميثاء، دبي' }, slug: 'oud-metha', country: 'UAE' },
  { id: 'location-dubai-creek-harbour', name: { en: 'Dubai Creek Harbour, UAE', ar: 'ميناء خور دبي، الإمارات' }, slug: 'dubai-creek-harbour', country: 'UAE' },
];

const services = [
  { id: 'service-interior-design', title: { en: 'Interior Design', ar: 'تصميم داخلي' }, slug: 'interior-design' },
  { id: 'service-fit-out-construction', title: { en: 'Fit-Out & Construction', ar: 'التجهيز والبناء' }, slug: 'fit-out-construction' },
  { id: 'service-ffe', title: { en: 'FF&E', ar: 'الأثاث والتجهيزات' }, slug: 'ffe' },
  { id: 'service-mep-engineering', title: { en: 'MEP Engineering', ar: 'هندسة الميكانيكا والكهرباء' }, slug: 'mep-engineering' },
  { id: 'service-architecture-engineering', title: { en: 'Architecture & Engineering', ar: 'الهندسة المعمارية' }, slug: 'architecture-engineering' },
  { id: 'service-furniture-joinery', title: { en: 'Furniture & Joinery', ar: 'الأثاث والنجارة' }, slug: 'furniture-joinery' },
  { id: 'service-landscape', title: { en: 'Landscape', ar: 'تنسيق الحدائق' }, slug: 'landscape' },
];

const tags = [
  { id: 'tag-best-hotel-interior-abu-dhabi', name: { en: 'Best Hotel Interior Abu Dhabi', ar: 'أفضل تصميم داخلي فندق أبوظبي' }, slug: 'best-hotel-interior-abu-dhabi', category: 'award' },
  { id: 'tag-best-luxury-hotel-interior-dubai', name: { en: 'Best Luxury Hotel Interior Design Dubai', ar: 'أفضل تصميم داخلي فندق فاخر دبي' }, slug: 'best-luxury-hotel-interior-dubai', category: 'award' },
  { id: 'tag-best-hotel-suite-interior-dubai', name: { en: 'Best Hotel Suite Interior Dubai', ar: 'أفضل تصميم داخلي جناح فندق دبي' }, slug: 'best-hotel-suite-interior-dubai', category: 'award' },
  { id: 'tag-best-residential-interior-dubai', name: { en: 'Best Residential Interior Apartment Dubai', ar: 'أفضل تصميم داخلي شقة سكنية دبي' }, slug: 'best-residential-interior-dubai', category: 'award' },
  { id: 'tag-award-winner', name: { en: 'Award Winner', ar: 'فائز بجائزة' }, slug: 'award-winner', category: 'award' },
];

// ========================================
// HOSPITALITY PROJECTS (12)
// ========================================

const hospitalityProjects = [
  {
    id: 'project-sheraton-abu-dhabi',
    title: { en: 'Sheraton Abu Dhabi Hotel & Resort', ar: 'فندق ومنتجع شيراتون أبوظبي' },
    slug: 'sheraton-abu-dhabi-hotel-resort',
    excerpt: {
      en: 'Location: Corniche Road, Abu Dhabi, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Full Turnkey Renovation (Construction, Fit-out, FF&E). Status: Completed (Nov 2021). Awards: Best Hotel Interior Abu Dhabi (5-Star Winner)',
      ar: 'الموقع: طريق الكورنيش، أبوظبي. العميل: فنادق أبوظبي الوطنية. النطاق: تجديد متكامل'
    },
    featured: true,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-full-turnkey-renovation',
    location: 'location-abu-dhabi',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2021,
    duration: { startDate: '2021-05-01', endDate: '2021-11-30', months: 7 },
    budget: { amount: 140000000, currency: 'AED', range: '100m-plus' },
    units: { count: 277, label: 'Rooms' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-ffe', 'service-mep-engineering'],
    tags: ['tag-best-hotel-interior-abu-dhabi', 'tag-award-winner'],
    challenge: {
      en: `Reinventing a Landmark

The Sheraton Abu Dhabi is not just a hotel; it is a heritage landmark on the Corniche. The client, Abu Dhabi National Hotels (ADNH), presented a formidable challenge: execute a comprehensive modernization of this 277-room 5-star property within an incredibly aggressive timeline of just 10 months.

The mandate was clear: transform the aging interiors into a contemporary masterpiece while respecting the building's iconic structural guidelines. The project required a total budget management of AED 140 Million and a seamless coordination of civil works, MEP, and high-end joinery without compromising on the quality expected of a luxury resort.`,
      ar: 'إعادة اختراع معلم تاريخي...'
    },
    approach: {
      en: `A Symphony of Heritage & Innovation

Mouhajer International Design approached this project with a philosophy of "Consumable Artistic Reality." We bridged the gap between the hotel's historic charm and the demands of modern luxury travel.

Public Areas (Lobby, Restaurants, Spa/Gym): We reimagined the public spaces as grand social theaters. By upgrading the lobby with opulent marble flooring and bespoke lighting installations, we created an immediate sense of arrival. The renovation extended to key outlets including the spa and restaurants, where we utilized custom fit-outs to distinct atmospheric zones—from the high-energy fitness areas to the serene, acoustic-controlled spa environments.

Guest Rooms & Suites: The redesign of the 277 keys focused on "smart luxury." We stripped back outdated elements and introduced a palette of warm neutrals, rich textures, and ergonomic layouts. The result is a suite of rooms that feel expansive, sophisticated, and technologically integrated.

Engineering & Fit-Out: To meet the 10-month deadline, our engineering teams worked in parallel with our design division. We executed complex structural upgrades and MEP (Mechanical, Electrical, Plumbing) works simultaneously with fine finishing, ensuring zero downtime in the transition from construction to handover.`,
      ar: 'سيمفونية من التراث والابتكار...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Civil & Structural', ar: 'الأعمال المدنية والهيكلية' }, description: { en: 'Complete overhaul of corridors, guest rooms, and public facility structures.', ar: 'إصلاح شامل للممرات وغرف الضيوف ومرافق العامة.' } },
      { _key: 'scope-2', title: { en: 'Interior Design & Fit-Out', ar: 'التصميم الداخلي والتجهيز' }, description: { en: 'End-to-end execution including gypsum works, wall cladding, and flooring.', ar: 'تنفيذ متكامل يشمل أعمال الجبس وتكسية الجدران والأرضيات.' } },
      { _key: 'scope-3', title: { en: 'FF&E (Furniture, Fixtures & Equipment)', ar: 'الأثاث والتجهيزات والمعدات' }, description: { en: 'Sourcing and installation of custom bespoke furniture and soft furnishings.', ar: 'توريد وتركيب الأثاث المخصص والمفروشات الناعمة.' } },
      { _key: 'scope-4', title: { en: 'MEP Services', ar: 'خدمات الميكانيكا والكهرباء' }, description: { en: 'Full upgrade of electrical and mechanical systems to meet modern energy standards.', ar: 'ترقية كاملة للأنظمة الكهربائية والميكانيكية.' } },
    ],
    outcome: {
      en: `Delivered on time and within budget, the newly renovated Sheraton Abu Dhabi stands as a testament to Mouhajer Design's capacity for large-scale commercial execution. The project successfully re-positioned the hotel as a market leader in Abu Dhabi hospitality, earning the prestigious Best Hotel Interior Abu Dhabi award.

The transformation was absolute, turning a classic property into a modern icon of opulence, proving once again that tight deadlines are no barrier to perfection when expertise is at the helm.

"Creating the new guidelines of Sheraton in 10 months only."`,
      ar: 'تم التسليم في الوقت المحدد وضمن الميزانية...'
    },
    testimonial: {
      quote: { en: 'Creating the new guidelines of Sheraton in 10 months only.', ar: 'إنشاء المعايير الجديدة لشيراتون في 10 أشهر فقط.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-sofitel-jbr',
    title: { en: 'Sofitel JBR (Jumeirah Beach Residence)', ar: 'سوفيتيل جي بي آر' },
    slug: 'sofitel-jbr-jumeirah-beach-residence',
    excerpt: {
      en: 'Location: The Walk, JBR, Dubai, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Soft Refurbishment (Renovation, Fit-out, FF&E). Status: Completed (Nov 2020). Awards: Best Luxury Hotel Interior Design Dubai',
      ar: 'الموقع: ذا ووك، جي بي آر، دبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: true,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-soft-refurbishment',
    location: 'location-jbr',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2020,
    duration: { startDate: '2020-05-01', endDate: '2020-11-30', months: 7 },
    budget: { amount: 112000000, currency: 'AED', range: '100m-plus' },
    units: { count: 444, label: 'Rooms' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-ffe'],
    tags: ['tag-best-luxury-hotel-interior-dubai', 'tag-award-winner'],
    challenge: {
      en: `Innovation Amidst Adversity

Undertaking a major renovation during the peak of the global pandemic (2020) presented a unique set of logistical and operational challenges. The client, ADNH, required a comprehensive "soft upgrade" of this massive 5-star property, comprising 444 guest rooms and suites spread across 27 floors (5th to 32nd), along with key public dining areas.

The critical constraints were strict health and safety protocols, a disrupted global supply chain, and a rigid timeline. We had a budget of AED 112 Million to refresh the hotel's aesthetic without engaging in heavy structural demolition, requiring a strategy of high-impact, precision intervention.`,
      ar: 'الابتكار وسط الشدائد...'
    },
    approach: {
      en: `French Elegance Meets Arabian Hospitality

Our approach focused on "Soft Refurbishment" techniques that maximize visual impact through finishings, textures, and bespoke joinery.

Guest Rooms & Corridors (5th-32nd Floors): We revitalized the guest experience by infusing the rooms with a blend of French Art de Vivre and local culture. This involved replacing worn surfaces with premium wall coverings, upgrading the flooring to high-end timber and carpets, and installing custom FF&E that modernized the space while retaining the Sofitel brand's classic elegance.

Public Areas (All-Day Dining): The restaurant upgrade focused on flow and atmosphere. We introduced new seating configurations, ambient lighting, and decorative screens that refreshed the dining experience, making it feel open yet intimate—essential for the post-pandemic hospitality landscape.

Pandemic Execution: Executing this during the COVID-19 lockdown proved our operational resilience. We implemented rigorous safety bubbles for our workforce and sourced materials strategically to bypass international shipping delays, ensuring the project moved forward when the rest of the world stood still.`,
      ar: 'الأناقة الفرنسية تلتقي بالضيافة العربية...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Interior Renovation', ar: 'التجديد الداخلي' }, description: { en: 'Comprehensive soft upgrade of 444 keys, including suites and standard rooms.', ar: 'ترقية شاملة لـ 444 غرفة.' } },
      { _key: 'scope-2', title: { en: 'Corridors', ar: 'الممرات' }, description: { en: 'Wall cladding, flooring, and lighting upgrades across 27 floors.', ar: 'تكسية الجدران والأرضيات والإضاءة في 27 طابقاً.' } },
      { _key: 'scope-3', title: { en: 'FF&E', ar: 'الأثاث والتجهيزات' }, description: { en: 'Supply and installation of soft furnishings, curtains, and movable furniture.', ar: 'توريد وتركيب المفروشات والستائر والأثاث.' } },
      { _key: 'scope-4', title: { en: 'Joinery & Fit-Out', ar: 'النجارة والتجهيز' }, description: { en: 'Refinishing of existing woodwork and installation of new decorative elements.', ar: 'إعادة تشطيب الأعمال الخشبية وتركيب عناصر زخرفية جديدة.' } },
    ],
    outcome: {
      en: `Mouhajer International Design delivered the project in November 2020, right on schedule. The renovation successfully refreshed the property's market appeal just as the world began to reopen. The seamless execution during such a challenging period earned the project the Best Luxury Hotel Interior Design Dubai award.

This project stands as a case study in agility and crisis management, proving that luxury and quality can be delivered even under the most restrictive global conditions.

"444 Rooms upgraded in record time during the 2020 global lockdown."`,
      ar: 'تم تسليم المشروع في نوفمبر 2020...'
    },
    testimonial: {
      quote: { en: '444 Rooms upgraded in record time during the 2020 global lockdown.', ar: '444 غرفة تم ترقيتها في وقت قياسي خلال الإغلاق العالمي 2020.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-address-boulevard',
    title: { en: 'Address Boulevard', ar: 'أدرس بوليفارد' },
    slug: 'address-boulevard',
    excerpt: {
      en: 'Location: Downtown Dubai, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Design & Build (VIP Suites). Status: Completed (Mar 2023). Awards: Best Hotel Suite Interior Dubai (VIP Suite)',
      ar: 'الموقع: وسط دبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: true,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-design-build',
    location: 'location-downtown-dubai',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2023,
    duration: { startDate: '2022-08-01', endDate: '2023-03-31', months: 8 },
    budget: { amount: 25000000, currency: 'AED', range: '10m-50m' },
    units: { count: 19, label: 'Suites' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-furniture-joinery'],
    tags: ['tag-best-hotel-suite-interior-dubai', 'tag-award-winner'],
    challenge: {
      en: `Surgical Precision in a Live Environment

Renovating the most exclusive inventory of a flagship hotel—its Royal and VIP Suites—is difficult enough. Doing so while the hotel is fully operational creates a challenge of the highest order.

The mandate involved the complete Design and Build of 15 Suites and 4 Royal Suites with a budget of AED 25 Million. The critical constraint was "invisible execution." Work had to proceed without disturbing the high-profile guests residing in adjacent rooms or disrupting the serene atmosphere of the Address Boulevard. Noise control, debris management, and logistical discretion were just as important as the design itself.`,
      ar: 'دقة جراحية في بيئة حية...'
    },
    approach: {
      en: `Defining the Apex of Luxury

Mouhajer International Design took a "Design and Build" responsibility, allowing us to control the vision from the drawing board to the final polish.

Royal & VIP Suites: These spaces are designed to host heads of state and elite travelers. Our design language focused on "residential grandeur"—creating spaces that feel like palatial private homes rather than hotel rooms. We utilized rare marbles, intricate European molding, and custom-manufactured furniture to justify the premium price point of these suites.

Silent Execution: We implemented a military-grade logistical strategy. Deliveries were timed for low-traffic hours, and acoustic barriers were deployed to ensure the construction noise was imperceptible to hotel guests.

Smart Integration: Beyond aesthetics, the suites were upgraded with state-of-the-art automation systems, seamlessly integrated into the classical design framework.`,
      ar: 'تحديد ذروة الفخامة...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Design & Build', ar: 'التصميم والبناء' }, description: { en: 'Full turnkey responsibility, from conceptual interior design to final construction.', ar: 'مسؤولية متكاملة من التصميم إلى البناء النهائي.' } },
      { _key: 'scope-2', title: { en: 'Suite Configuration', ar: 'تكوين الأجنحة' }, description: { en: 'Complete overhaul of 15 Luxury Suites and 4 Royal Suites.', ar: 'إصلاح شامل لـ 15 جناحاً فاخراً و4 أجنحة ملكية.' } },
      { _key: 'scope-3', title: { en: 'High-End Fit-Out', ar: 'التجهيز الفاخر' }, description: { en: 'Installation of premium wall paneling, marble flooring, and intricate gypsum cornices.', ar: 'تركيب ألواح الجدران الفاخرة والرخام والكورنيش الجبسي.' } },
      { _key: 'scope-4', title: { en: 'MEP Adaptation', ar: 'تكييف الأنظمة' }, description: { en: 'Rerouting and upgrading mechanical systems to suit new suite layouts without affecting the central hotel systems.', ar: 'إعادة توجيه وترقية الأنظمة الميكانيكية.' } },
    ],
    outcome: {
      en: `Completed in March 2023, the project was a triumph of logistics and luxury. The result was a set of suites so impeccably finished that they received the award for Best Hotel Suite Interior Dubai.

This project proves that we do not just build interiors; we respect the business continuity of our clients, delivering heavy construction results with the touch of a white-glove service.

"Invisible construction, undeniable luxury: Delivering Royal Suites in a live 5-star hotel."`,
      ar: 'اكتمل المشروع في مارس 2023...'
    },
    testimonial: {
      quote: { en: 'Invisible construction, undeniable luxury: Delivering Royal Suites in a live 5-star hotel.', ar: 'بناء غير مرئي، فخامة لا يمكن إنكارها.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-ritz-carlton-abu-dhabi',
    title: { en: 'The Ritz-Carlton Abu Dhabi, Grand Canal', ar: 'ريتز كارلتون أبوظبي، القناة الكبرى' },
    slug: 'ritz-carlton-abu-dhabi-grand-canal',
    excerpt: {
      en: 'Location: Grand Canal, Abu Dhabi, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Design & Build (Structural Reconfiguration & Luxury Fit-out). Status: Completed (Oct 2023)',
      ar: 'الموقع: القناة الكبرى، أبوظبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: true,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-design-build',
    location: 'location-abu-dhabi',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2023,
    duration: { startDate: '2021-12-01', endDate: '2023-10-31', months: 23 },
    budget: { amount: 50000000, currency: 'AED', range: '50m-100m' },
    units: { count: 10, label: 'Villas' },
    services: ['service-architecture-engineering', 'service-fit-out-construction', 'service-mep-engineering'],
    tags: [],
    challenge: {
      en: `Structural Metamorphosis

The objective was architecturally ambitious: Merge 20 existing villas into 10 expansive, high-inventory luxury villas. Each new unit was to be transformed into a 3-bedroom sanctuary, complete with its own private swimming pool.

As this was a VIP project within the operating grounds of the Ritz-Carlton, the stakes were exceptionally high. We faced two major hurdles:

Structural Integrity: Merging two distinct buildings into one requires complex civil engineering to ensure load-bearing walls and MEP systems are unified seamlessly.

VIP Hospitality Standards: Because the hotel remained active and hosted VIP guests, construction had to be conducted with zero visual or noise pollution. Every logistical move was choreographed to maintain the Ritz-Carlton's world-class guest experience.`,
      ar: 'التحول الهيكلي...'
    },
    approach: {
      en: `Grandeur Redefined

Mouhajer International Design executed a comprehensive "Design and Build" strategy that prioritized privacy, scale, and the brand's signature Mediterranean-meets-Arabic aesthetic.

Space Transformation: By knocking down the dividing lines of 20 units, we created massive, open-plan living areas that lead directly to the private pool decks. The transition from bedroom to lounge was designed to emphasize the "Majlis" concept—a space for gathering and prestige.

The Private Oasis: Each villa was equipped with a custom-engineered private pool. This required intricate waterproofing, plumbing, and aesthetic tiling that mirrored the luxury of the Grand Canal surroundings.

Bespoke Interiors: We utilized premium materials—hand-selected marble, ornate gypsum, and bespoke joinery—to create an environment fitting for VIP guests. The lighting design was curated to highlight the architectural volume created by the merger.`,
      ar: 'إعادة تعريف الفخامة...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Civil & Structural', ar: 'الأعمال المدنية والهيكلية' }, description: { en: 'Merging of structural frames, demolition of dividing walls, and foundation work for 10 private pools.', ar: 'دمج الإطارات الهيكلية وهدم الجدران الفاصلة.' } },
      { _key: 'scope-2', title: { en: 'Architecture & MEP', ar: 'الهندسة المعمارية والأنظمة' }, description: { en: 'Full redesign of mechanical and electrical systems to support the new 3-bedroom layout and individual pool heating/filtration.', ar: 'إعادة تصميم كاملة للأنظمة.' } },
      { _key: 'scope-3', title: { en: 'High-End Fit-Out', ar: 'التجهيز الفاخر' }, description: { en: 'Turnkey interior execution including custom floor patterns, wall cladding, and high-ceiling treatments.', ar: 'تنفيذ داخلي متكامل.' } },
      { _key: 'scope-4', title: { en: 'External Works', ar: 'الأعمال الخارجية' }, description: { en: 'Landscaping and deck construction for the new private pool areas.', ar: 'تنسيق الحدائق وبناء الأسطح.' } },
    ],
    outcome: {
      en: `Completed in October 2023, the Rabdan Villas represent the pinnacle of our "Design and Build" division. We successfully doubled the luxury value of the property by creating larger, more exclusive inventory that did not exist before.

Despite the operational complexity of the Ritz-Carlton environment, the project was delivered with surgical precision, proving that Mouhajer Design can manage high-stakes structural changes without compromising the serenity of a 5-star resort.

"20 units transformed into 10 palatial sanctuaries, delivered within the heart of an operating 5-star icon."`,
      ar: 'اكتمل المشروع في أكتوبر 2023...'
    },
    testimonial: {
      quote: { en: '20 units transformed into 10 palatial sanctuaries, delivered within the heart of an operating 5-star icon.', ar: '20 وحدة تحولت إلى 10 ملاذات فخمة.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-radisson-blu-corniche',
    title: { en: 'Radisson Blu Hotel and Resort Corniche', ar: 'فندق ومنتجع راديسون بلو كورنيش' },
    slug: 'radisson-blu-hotel-resort-corniche',
    excerpt: {
      en: 'Location: Corniche Road, Abu Dhabi, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Design & Build (Lobby & All-Day Dining). Budget: AED 19 Million. Status: Completed (Jan 2021)',
      ar: 'الموقع: طريق الكورنيش، أبوظبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-design-build',
    location: 'location-abu-dhabi',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2021,
    duration: { startDate: '2020-07-01', endDate: '2021-01-31', months: 7 },
    budget: { amount: 19000000, currency: 'AED', range: '10m-50m' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-mep-engineering'],
    tags: [],
    challenge: {
      en: `Revitalizing the Heart of the Hotel

The lobby and the all-day dining restaurant are the two most critical touchpoints of any hotel experience. The challenge for the Radisson Blu Corniche was to execute a comprehensive refurbishment of these high-traffic zones without disrupting the guest experience.

With a budget of AED 19 Million, the project demanded a "Design and Build" strategy that was both aesthetically transformative and operationally invisible. The hotel remained fully operational throughout the construction period (July 2020 – Jan 2021), requiring strict noise control, dust containment, and a phased execution plan to ensure guests could still enjoy the property's facilities undisturbed.`,
      ar: 'إحياء قلب الفندق...'
    },
    approach: {
      en: `A Warm, Contemporary Welcome

Mouhajer International Design took ownership of the entire lifecycle, from concept to handover. Our goal was to modernize the aesthetic while improving the functional flow of the spaces.

The Main Lobby: We reimagined the lobby as a vibrant social hub rather than just a transit space. By introducing lighter color palettes, modern architectural lighting, and contemporary furniture, we opened up the space to feel more expansive and welcoming. The design focuses on clean lines and premium materials that reflect the coastal elegance of the Corniche.

La Terrazza (All-Day Dining): The refurbishment of La Terrazza focused on versatility. We designed distinct "micro-zones" within the restaurant to cater to different dining needs—from intimate seating for couples to flexible arrangements for larger groups. The buffet counters were redesigned for both visual appeal and hygiene efficiency, a critical consideration during the 2020 timeline.

Operational Agility: Executing this during the pandemic era meant adhering to the highest safety standards. Our team managed the logistics meticulously, creating "invisible" construction zones that allowed the hotel to function smoothly alongside major renovation works.`,
      ar: 'ترحيب دافئ ومعاصر...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Design & Build', ar: 'التصميم والبناء' }, description: { en: 'Full turnkey responsibility for interior design, MEP, and construction.', ar: 'مسؤولية متكاملة للتصميم والأنظمة والبناء.' } },
      { _key: 'scope-2', title: { en: 'Lobby Renovation', ar: 'تجديد اللوبي' }, description: { en: 'Complete upgrade of flooring, wall cladding, reception counters, and lighting.', ar: 'ترقية كاملة للأرضيات وتكسية الجدران.' } },
      { _key: 'scope-3', title: { en: 'Restaurant Refurbishment', ar: 'تجديد المطعم' }, description: { en: 'Total fit-out of La Terrazza, including new buffet stations, joinery, and furniture.', ar: 'تجهيز كامل لمطعم لا تيراتزا.' } },
      { _key: 'scope-4', title: { en: 'MEP Upgrades', ar: 'ترقيات الأنظمة' }, description: { en: 'Modernization of HVAC and electrical systems to support the new layouts.', ar: 'تحديث أنظمة التكييف والكهرباء.' } },
    ],
    outcome: {
      en: `Completed in January 2021, the project successfully breathed new life into the property's public face. The seamless delivery ensured that the hotel was ready to welcome guests with a fresh, modern look as the hospitality sector began its recovery.

The result is a testament to Mouhajer Design's ability to work in sensitive, live environments, delivering high-impact renovations that elevate the brand value without compromising day-to-day operations.

"Transforming the first impression: A seamless upgrade of the Lobby and Dining experience."`,
      ar: 'اكتمل المشروع في يناير 2021...'
    },
    testimonial: {
      quote: { en: 'Transforming the first impression: A seamless upgrade of the Lobby and Dining experience.', ar: 'تحويل الانطباع الأول: ترقية سلسة لتجربة اللوبي والطعام.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-park-hyatt-dubai',
    title: { en: 'Park Hyatt Dubai', ar: 'بارك حياة دبي' },
    slug: 'park-hyatt-dubai',
    excerpt: {
      en: 'Location: Dubai Creek Resort, Dubai, UAE. Client: Wasl LLC. Scope: Hotel Refurbishment (VIP Suites, Guest Rooms, Turquoise). Budget: AED 140 Million. Status: Ongoing (Phase 1 Completed; Phase 2 in Progress)',
      ar: 'الموقع: منتجع خور دبي. العميل: وصل'
    },
    featured: true,
    status: 'in-progress',
    sector: 'industry-hospitality',
    projectType: 'projectType-hotel-refurbishment',
    location: 'location-dubai-creek',
    client: { en: 'Wasl LLC', ar: 'وصل' },
    year: 2026,
    duration: { startDate: '2025-09-01', endDate: '2026-04-30', months: 8 },
    budget: { amount: 140000000, currency: 'AED', range: '100m-plus' },
    units: { count: 114, label: 'Rooms' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-ffe'],
    tags: [],
    challenge: {
      en: `Evolving an Icon

The Park Hyatt Dubai is renowned for its serenity, iconic architecture, and world-class luxury on the banks of the Dubai Creek. The challenge set by Wasl LLC was to modernize a significant portion of this sanctuary without disrupting its peaceful ambiance.

With a substantial budget of AED 140 Million, the project involves the refurbishment of 114 Guest Rooms, the ultra-exclusive VIP Suites, and the Turquoise venue. The critical constraint is the phased execution; the hotel remains a top destination for luxury travelers, meaning construction must be strictly compartmentalized to ensure the guest experience remains flawless during the high season.`,
      ar: 'تطوير أيقونة...'
    },
    approach: {
      en: `Moorish Elegance, Modern Comfort

Mouhajer International Design is currently executing this refurbishment with a focus on preserving the resort's unique character—a blend of Mediterranean elegance and Moorish detail—while introducing contemporary luxuries.

Guest Rooms (114 Keys): The refurbishment of the 114 rooms focuses on elevating the tactile experience. We are introducing lighter, airy palettes that reflect the Creek's calmness, upgrading the joinery, and integrating smart room controls that blend invisibly with the classic design.

VIP Suites: These suites are being reimagined as the pinnacle of privacy and opulence, featuring bespoke furniture, upgraded marble bathrooms, and curated art pieces that align with the Park Hyatt's sophisticated brand identity.

Turquoise: The upgrade of the Turquoise venue aims to enhance its flow and aesthetic appeal, maximizing its potential as a premier dining and leisure destination within the resort.`,
      ar: 'الأناقة المورية والراحة العصرية...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Refurbishment', ar: 'التجديد' }, description: { en: 'Complete interior refresh of 114 Guest Rooms and Corridors.', ar: 'تجديد داخلي كامل لـ 114 غرفة ضيوف.' } },
      { _key: 'scope-2', title: { en: 'VIP Upgrade', ar: 'ترقية كبار الشخصيات' }, description: { en: 'High-end fit-out and FF&E for VIP Suites.', ar: 'تجهيز فاخر لأجنحة كبار الشخصيات.' } },
      { _key: 'scope-3', title: { en: 'Public Venues', ar: 'الأماكن العامة' }, description: { en: 'Renovation of the Turquoise dining area.', ar: 'تجديد منطقة طعام تركواز.' } },
      { _key: 'scope-4', title: { en: 'Phased Logistics', ar: 'اللوجستيات المرحلية' }, description: { en: 'Strategic project management to segregate construction zones from operational hotel areas.', ar: 'إدارة مشروع استراتيجية لفصل مناطق البناء.' } },
    ],
    outcome: {
      en: `We have successfully completed Phase 1 of the project. This milestone was delivered on schedule, meeting the rigorous quality standards of Wasl LLC and Hyatt.

Phase 1 (Completed): successful handover of the initial batch of rooms and key areas.

Phase 2 (Starting Now): We are currently mobilizing for Phase 2, which will see the completion of the remaining inventory and final touches by April 2026.

As we move into the final phase, Mouhajer International Design remains committed to delivering a product that honors the legacy of the Park Hyatt Dubai. By April 2026, the resort will offer a refreshed, elevated experience that seamlessly bridges its storied past with a modern future.

"Preserving the serenity of the Creek while building the future of luxury. Phase 1 Complete."`,
      ar: 'أكملنا المرحلة الأولى بنجاح...'
    },
    testimonial: {
      quote: { en: 'Preserving the serenity of the Creek while building the future of luxury. Phase 1 Complete.', ar: 'الحفاظ على هدوء الخور بينما نبني مستقبل الفخامة.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-park-hyatt-saadiyat',
    title: { en: 'Park Hyatt Saadiyat Island', ar: 'بارك حياة جزيرة السعديات' },
    slug: 'park-hyatt-saadiyat-island',
    excerpt: {
      en: 'Location: Saadiyat Island, Abu Dhabi, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Soft Refurbishment (Guest Rooms & Villas). Budget: AED 29 Million. Status: Ongoing / Near Completion',
      ar: 'الموقع: جزيرة السعديات، أبوظبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: false,
    status: 'in-progress',
    sector: 'industry-hospitality',
    projectType: 'projectType-soft-refurbishment',
    location: 'location-saadiyat-island',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2025,
    duration: { startDate: '2025-07-01', endDate: '2025-09-30', months: 3 },
    budget: { amount: 29000000, currency: 'AED', range: '10m-50m' },
    units: { count: 255, label: 'Rooms & Villas' },
    services: ['service-interior-design', 'service-ffe', 'service-furniture-joinery'],
    tags: [],
    challenge: {
      en: `A Summer Blitz

The Park Hyatt on Saadiyat Island is a sanctuary of contemporary luxury. To ensure it maintains its standing as a premier destination, the client, ADNH, commissioned a rapid-fire "Soft Refurbishment" of the entire inventory—255 Guest Rooms and Villas.

The challenge was primarily logistical velocity. The project was scheduled for the UAE's summer months (July–September), a strategic window designed to minimize impact during the peak tourist season. The goal was to refresh 255 keys with a budget of AED 29 Million in just under 3 months, ensuring the resort emerges with a fresh, pristine look just in time for the high-occupancy winter season.`,
      ar: 'هجوم صيفي...'
    },
    approach: {
      en: `The Art of Soft Refurbishment

Mouhajer International Design focused on high-impact, low-intrusion upgrades. "Soft Refurbishment" requires a keen eye for detail—enhancing the aesthetic without the heavy demolition that closes down hotels.

Guest Rooms & Villas: Our team focused on revitalizing the tactile elements of the rooms. This included upgrading upholstery, refreshing wall treatments, and replacing key FF&E (Furniture, Fixtures, and Equipment) items. The design language preserved the resort's existing earthy, beach-front palette while introducing newer, crisper fabrics and finishes to lift the overall ambiance.

Parallel Execution: To meet the 3-month deadline, we deployed multiple teams working in parallel across different wings of the hotel and the villa clusters. This "swarm" strategy allowed for maximum productivity during the short designated window.`,
      ar: 'فن التجديد الخفيف...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Soft Refurbishment', ar: 'التجديد الخفيف' }, description: { en: 'Comprehensive refresh of 255 units (Standard Rooms, Suites, and Private Villas).', ar: 'تجديد شامل لـ 255 وحدة.' } },
      { _key: 'scope-2', title: { en: 'FF&E Upgrades', ar: 'ترقيات الأثاث' }, description: { en: 'Replacement and reupholstery of furniture, curtains, and carpets.', ar: 'استبدال وإعادة تنجيد الأثاث والستائر والسجاد.' } },
      { _key: 'scope-3', title: { en: 'Surface Treatment', ar: 'معالجة الأسطح' }, description: { en: 'Maintenance and aesthetic upgrades to wall coverings and joinery.', ar: 'صيانة وترقيات جمالية لتغطيات الجدران.' } },
      { _key: 'scope-4', title: { en: 'Project Management', ar: 'إدارة المشروع' }, description: { en: 'High-speed logistics to manage furniture removal and installation across a sprawling resort layout.', ar: 'لوجستيات عالية السرعة لإدارة إزالة وتركيب الأثاث.' } },
    ],
    outcome: {
      en: `This project exemplifies Mouhajer Design's capability to execute volume at speed. By strictly managing the timeline and supply chain, we are ensuring that one of Saadiyat Island's most iconic properties is fully refreshed and ready to welcome the world for the upcoming season.

"255 Keys, 3 Months: A rapid revitalization for a Saadiyat Icon."`,
      ar: 'يجسد هذا المشروع قدرة مهاجر...'
    },
    testimonial: {
      quote: { en: '255 Keys, 3 Months: A rapid revitalization for a Saadiyat Icon.', ar: '255 غرفة، 3 أشهر: إحياء سريع لأيقونة السعديات.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-grand-hyatt-dubai',
    title: { en: 'Grand Hyatt Dubai', ar: 'جراند حياة دبي' },
    slug: 'grand-hyatt-dubai',
    excerpt: {
      en: 'Location: Oud Metha, Dubai, UAE. Client: Grand Hyatt. Scope: Design & Build (Full Turnkey). Budget: AED 20 Million. Status: Completed (Jan 2024)',
      ar: 'الموقع: عود ميثاء، دبي. العميل: جراند حياة'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-design-build',
    location: 'location-oud-metha',
    client: { en: 'Grand Hyatt', ar: 'جراند حياة' },
    year: 2024,
    duration: { startDate: '2023-10-01', endDate: '2024-01-31', months: 4 },
    budget: { amount: 20000000, currency: 'AED', range: '10m-50m' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-furniture-joinery'],
    tags: [],
    challenge: {
      en: `The 24-Hour Sprint

The renovation of a Royal Suite is usually a meticulous, slow process. However, the Grand Hyatt presented a challenge that required military-grade precision: Design and Build the Royal Suite and Prince Suite in effectively two months.

With a budget of AED 20 Million, the expectations for quality were sky-high, but the timeline was non-negotiable. To meet this deadline, standard working hours were insufficient. The site had to remain active 24 hours a day, requiring a complex rotation of shifts to ensure work never stopped—from demolition to the final placement of the last artifact—without sacrificing a single millimeter of precision.`,
      ar: 'سباق الـ 24 ساعة...'
    },
    approach: {
      en: `Royal Grandeur at Record Speed

As the Design and Build contractor, Mouhajer International Design shouldered the full responsibility. We eliminated the lag between design and construction by making real-time decisions on-site.

Round-the-Clock Execution: We implemented a 3-shift system (24/7 operation). While one team handled heavy fit-out and noise-intensive work during the day, specialist teams handled quiet, intricate detailing (joinery, gold leafing, marble polishing) throughout the night.

The Royal Aesthetic: The design demanded an aesthetic fit for royalty. We utilized a palette of regal golds, deep royal blues, and cream marbles. The furniture was custom-manufactured to fit the expansive dimensions of the suites, ensuring that despite the rush, the final product felt timeless and curated.

Fit-Out Precision: The scope included complete civil works, high-end joinery, and MEP upgrades. Coordinating these trades in a 24-hour cycle required our project managers to virtually live on-site, ensuring zero bottlenecks in the workflow.`,
      ar: 'الفخامة الملكية بسرعة قياسية...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Design & Build', ar: 'التصميم والبناء' }, description: { en: 'Complete interior design and turnkey construction.', ar: 'تصميم داخلي كامل وبناء متكامل.' } },
      { _key: 'scope-2', title: { en: 'Suite Configuration', ar: 'تكوين الأجنحة' }, description: { en: 'Total renovation of the Royal Suite and Prince Suite.', ar: 'تجديد كامل للجناح الملكي وجناح الأمير.' } },
      { _key: 'scope-3', title: { en: '24/7 Operations', ar: 'العمليات على مدار الساعة' }, description: { en: 'Management of a continuous construction lifecycle to meet the accelerated deadline.', ar: 'إدارة دورة بناء مستمرة.' } },
      { _key: 'scope-4', title: { en: 'Luxury Finishes', ar: 'التشطيبات الفاخرة' }, description: { en: 'Installation of premium marble, bespoke chandeliers, and custom wall paneling.', ar: 'تركيب الرخام الفاخر والثريات المخصصة.' } },
    ],
    outcome: {
      en: `The project was successfully handed over in January 2024. By maintaining a 24-hour workflow, Mouhajer Design achieved in two months what typically takes six. The Royal and Prince Suites now stand as the jewel in the crown of the Grand Hyatt, proving that with the right resource management, speed and luxury are not mutually exclusive.

"Operating 24 hours a day to deliver a Royal standard in just two months."`,
      ar: 'تم تسليم المشروع بنجاح في يناير 2024...'
    },
    testimonial: {
      quote: { en: 'Operating 24 hours a day to deliver a Royal standard in just two months.', ar: 'العمل 24 ساعة يومياً لتقديم معيار ملكي في شهرين فقط.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-address-dubai-marina',
    title: { en: 'Address Dubai Marina', ar: 'أدرس دبي مارينا' },
    slug: 'address-dubai-marina',
    excerpt: {
      en: 'Location: Dubai Marina, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Design & Build (Lobby, Restaurant, 220 Rooms). Budget: AED 27 Million. Status: Completed (Aug 2021)',
      ar: 'الموقع: مرسى دبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-design-build',
    location: 'location-dubai-marina',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2021,
    duration: { startDate: '2021-04-01', endDate: '2021-08-31', months: 5 },
    budget: { amount: 27000000, currency: 'AED', range: '10m-50m' },
    units: { count: 220, label: 'Rooms' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-ffe'],
    tags: [],
    challenge: {
      en: `A Multi-Front Renovation

Address Dubai Marina is a centerpiece of the vibrant Marina district. The objective was to modernize both the public face of the hotel and the private guest experience simultaneously. The scope was extensive: a complete refresh of the Main Lobby, a redesign of "The Restaurant," and a soft renovation of 220 Guest Rooms.

The critical constraint was the timeline and operational continuity. With a budget of AED 27 Million, Mouhajer International Design had to deliver this multi-zone renovation in under 6 months. Crucially, the hotel remained fully operational, meaning the lobby and dining areas had to be renovated in phases to ensure guests were never inconvenienced, and room renovations had to be completely silent to neighbors.`,
      ar: 'تجديد متعدد الجبهات...'
    },
    approach: {
      en: `Urban Luxury Refined

As the Design and Build contractor, we streamlined the process by overlapping the design approvals with the procurement and site mobilization phases.

Public Areas (Lobby & The Restaurant): We updated the lobby to reflect the chic, urban energy of the Marina, utilizing contemporary furniture and sophisticated lighting to create a seamless flow. For "The Restaurant," the design focused on creating distinct dining atmospheres—energizing for breakfast, yet intimate for dinner—using bespoke joinery and warm, ambient textures.

Guest Rooms (220 Keys): The soft renovation of the rooms focused on maximum visual impact with minimal structural intrusion. We replaced carpets, curtains, and upholstery, and introduced new art and accessories to align the rooms with the modern aesthetic of the Address brand.

Live Environment Management: To handle 220 rooms alongside the lobby, we treated the hotel as a "vertical city." Work was compartmentalized floor-by-floor, with strict noise curfews and invisible logistics paths for material transport.`,
      ar: 'الفخامة الحضرية المكررة...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Design & Build', ar: 'التصميم والبناء' }, description: { en: 'Comprehensive responsibility for interior design and fit-out execution.', ar: 'مسؤولية شاملة للتصميم الداخلي والتنفيذ.' } },
      { _key: 'scope-2', title: { en: 'Public Area Upgrade', ar: 'ترقية المناطق العامة' }, description: { en: 'Renovation of the Main Lobby and "The Restaurant" (All-Day Dining).', ar: 'تجديد اللوبي الرئيسي والمطعم.' } },
      { _key: 'scope-3', title: { en: 'Room Renovation', ar: 'تجديد الغرف' }, description: { en: 'Soft refurbishment of 220 Guest Rooms and Suites.', ar: 'تجديد خفيف لـ 220 غرفة وجناح.' } },
      { _key: 'scope-4', title: { en: 'FF&E', ar: 'الأثاث والتجهيزات' }, description: { en: 'Sourcing and installation of new furniture, carpets, and soft furnishings throughout.', ar: 'توريد وتركيب الأثاث الجديد والسجاد.' } },
    ],
    outcome: {
      en: `Completed in August 2021, the project revitalized Address Dubai Marina's key assets in record time. By successfully managing the complex logistics of working in a live hotel, Mouhajer Design delivered a fresh, contemporary product that immediately enhanced the guest experience and asset value.

"Revitalizing the Lobby, Dining, and 220 Rooms in under 6 months without hitting pause on operations."`,
      ar: 'اكتمل المشروع في أغسطس 2021...'
    },
    testimonial: {
      quote: { en: 'Revitalizing the Lobby, Dining, and 220 Rooms in under 6 months without hitting pause on operations.', ar: 'إحياء اللوبي والطعام و220 غرفة في أقل من 6 أشهر.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-dubai-creek-resort',
    title: { en: 'Dubai Creek Resort', ar: 'منتجع خور دبي' },
    slug: 'dubai-creek-resort',
    excerpt: {
      en: 'Location: Dubai Creek, UAE. Scope: General Resort Design, Interior Design & Fit-out',
      ar: 'الموقع: خور دبي. النطاق: تصميم منتجع عام، تصميم داخلي وتجهيز'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-general-resort-design',
    location: 'location-dubai-creek',
    client: { en: 'N/A', ar: 'غير محدد' },
    services: ['service-architecture-engineering', 'service-interior-design', 'service-fit-out-construction'],
    tags: [],
    challenge: {
      en: `Designing for Serenity

The Dubai Creek Resort area is one of the city's most historically significant and visually stunning locations. Designing within this context requires more than just luxury; it requires a deep sensitivity to the surrounding landscape and the waterfront ambiance.

The challenge for this engagement was to provide General Resort Design solutions that unify the indoor and outdoor experiences. The goal was to create a cohesive design language that flows effortlessly from the manicured exterior landscapes into the opulent interior spaces, ensuring that every touchpoint—from the arrival experience to the private quarters—reflects a sense of timeless calm and grandeur.`,
      ar: 'التصميم للهدوء...'
    },
    approach: {
      en: `A Holistic Vision

Mouhajer International Design approached this project with a wide-angle lens, focusing on the macro-level planning of the resort atmosphere down to the micro-level details of the fit-out.

Integrated Design: We moved beyond isolated room designs to create a master narrative for the resort. The aesthetic draws heavily on the natural elements of the Creek—using cool blues, warm sands, and natural stone textures to blur the lines between the architecture and the environment.

Luxury Fit-Out: Our team executed high-end fit-out works that define the resort's character. This included the installation of custom joinery that mimics traditional maritime craftsmanship, alongside premium marble flooring that anchors the space in luxury.

Spatial Flow: A key aspect of the general design was optimizing the flow of guests. We utilized architectural elements and lighting design to guide guests intuitively through the property, creating a journey of discovery rather than just transit.`,
      ar: 'رؤية شاملة...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'General Resort Design', ar: 'تصميم المنتجع العام' }, description: { en: 'Conceptual planning and aesthetic direction for resort facilities.', ar: 'التخطيط المفاهيمي والتوجيه الجمالي.' } },
      { _key: 'scope-2', title: { en: 'Interior Design', ar: 'التصميم الداخلي' }, description: { en: 'Detailed interior schemes for public and private zones.', ar: 'مخططات داخلية مفصلة للمناطق العامة والخاصة.' } },
      { _key: 'scope-3', title: { en: 'Fit-Out Works', ar: 'أعمال التجهيز' }, description: { en: 'Execution of civil works, joinery, and finishing to international luxury standards.', ar: 'تنفيذ الأعمال المدنية والنجارة والتشطيب.' } },
      { _key: 'scope-4', title: { en: 'Material Selection', ar: 'اختيار المواد' }, description: { en: 'Curation of durable, high-end materials suitable for a waterfront resort environment.', ar: 'اختيار مواد متينة وفاخرة مناسبة لبيئة المنتجع.' } },
    ],
    outcome: {
      en: `This project stands as a testament to Mouhajer International Design's ability to handle the complexities of large-scale resort environments. By harmonizing structural engineering with artistic interior design, we helped establish an atmosphere where luxury is felt in every detail, contributing to the reputation of Dubai Creek as a premier destination for relaxation and elegance.

"Where the heritage of the Creek meets the future of luxury hospitality."`,
      ar: 'يقف هذا المشروع شاهداً على قدرة مهاجر...'
    },
    testimonial: {
      quote: { en: 'Where the heritage of the Creek meets the future of luxury hospitality.', ar: 'حيث يلتقي تراث الخور بمستقبل الضيافة الفاخرة.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-dusit-thani-dubai',
    title: { en: 'Dusit Thani Dubai Hotel', ar: 'فندق دوسيت ثاني دبي' },
    slug: 'dusit-thani-dubai-hotel',
    excerpt: {
      en: 'Location: Sheikh Zayed Road, Dubai, UAE. Client: Dusit Thani. Scope: Soft Refurbishment (355 Guest Rooms). Status: Ongoing (Phase 1 Completed 2025; Phase 2 Scheduled 2026)',
      ar: 'الموقع: شارع الشيخ زايد، دبي. العميل: دوسيت ثاني'
    },
    featured: false,
    status: 'in-progress',
    sector: 'industry-hospitality',
    projectType: 'projectType-soft-refurbishment',
    location: 'location-sheikh-zayed-road',
    client: { en: 'Dusit Thani', ar: 'دوسيت ثاني' },
    year: 2026,
    units: { count: 355, label: 'Rooms' },
    services: ['service-interior-design', 'service-ffe', 'service-furniture-joinery'],
    tags: [],
    challenge: {
      en: `Modernizing an Icon on Sheikh Zayed Road

The Dusit Thani is one of Dubai's most recognizable landmarks, known for its Thai-inspired architecture and hospitality. The brief was to execute a comprehensive Soft Refurbishment of 355 Guest Rooms to lift the aesthetic to modern standards while retaining the brand's unique cultural identity.

The primary challenge was operational continuity. The hotel had to remain open and fully functional throughout the process. This required a strict phased strategy to ensure that the renovation of hundreds of rooms did not disturb the guest experience in the heart of Dubai's busiest business district. Furthermore, Phase 1 had to be delivered in a tight 4-month window.`,
      ar: 'تحديث أيقونة على شارع الشيخ زايد...'
    },
    approach: {
      en: `Thai Heritage, Modern Luxuries

Mouhajer International Design focused on a "lighter, brighter" evolution of the classic Dusit style.

Soft Refurbishment Strategy: To maximize impact without heavy construction noise, we focused on high-end surface upgrades. We replaced heavy textiles with lighter, contemporary fabrics, upgraded the wall treatments to brighten the spaces, and refreshed the FF&E (furniture, fixtures, and equipment) to offer better ergonomics for the modern business traveler.

Phase 1 Execution (The Sprint): For the first phase, our logistics teams worked with surgical precision. We isolated specific floors, creating a "vertical buffer" to contain noise and activity. This allowed us to strip, refurbish, and reinstall the initial batch of rooms within just 4 months, handing them back to the hotel operations team on schedule in 2025.`,
      ar: 'التراث التايلاندي والفخامة العصرية...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Guest Room Refresh', ar: 'تجديد غرف الضيوف' }, description: { en: 'Comprehensive soft refurbishment of 355 keys (split into phases).', ar: 'تجديد خفيف شامل لـ 355 غرفة.' } },
      { _key: 'scope-2', title: { en: 'FF&E Upgrade', ar: 'ترقية الأثاث' }, description: { en: 'Supply and installation of new soft furnishings, carpets, and curtains.', ar: 'توريد وتركيب المفروشات الجديدة والسجاد والستائر.' } },
      { _key: 'scope-3', title: { en: 'Surface Finishes', ar: 'التشطيبات السطحية' }, description: { en: 'Polishing existing joinery and updating wall coverings.', ar: 'صقل الأعمال الخشبية وتحديث تغطيات الجدران.' } },
      { _key: 'scope-4', title: { en: 'Live Site Management', ar: 'إدارة الموقع الحي' }, description: { en: 'Strict logistical coordination to operate stealthily within a live 5-star hotel environment.', ar: 'تنسيق لوجستي صارم للعمل بشكل خفي.' } },
    ],
    outcome: {
      en: `As we look toward Phase 2 in 2026, Mouhajer International Design continues to demonstrate that large-scale renovations need not be disruptive. We are revitalizing the Dusit Thani room by room, ensuring it remains a competitive leader on Sheikh Zayed Road.

"A fresh look for a Dubai legend. Phase 1 delivered in just 4 months."`,
      ar: 'مع تطلعنا للمرحلة الثانية في 2026...'
    },
    testimonial: {
      quote: { en: 'A fresh look for a Dubai legend. Phase 1 delivered in just 4 months.', ar: 'مظهر جديد لأسطورة دبي. المرحلة الأولى في 4 أشهر فقط.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-hotel-boulevard-autograph',
    title: { en: 'Hotel Boulevard, Autograph Collection', ar: 'فندق بوليفارد، مجموعة أوتوغراف' },
    slug: 'hotel-boulevard-autograph-collection',
    excerpt: {
      en: 'Location: Downtown Dubai, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Soft Refurbishment (140 Rooms). Status: Completed (Sep 2025)',
      ar: 'الموقع: وسط دبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-hospitality',
    projectType: 'projectType-soft-refurbishment',
    location: 'location-downtown-dubai',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2025,
    duration: { startDate: '2025-03-01', endDate: '2025-09-30', months: 7 },
    units: { count: 140, label: 'Rooms' },
    services: ['service-interior-design', 'service-ffe', 'service-furniture-joinery'],
    tags: [],
    challenge: {
      en: `Refining Boutique Luxury

As part of the prestigious Autograph Collection, Hotel Boulevard represents a unique character and distinct narrative in the heart of Downtown Dubai. The client, ADNH, required a Soft Refurbishment of all 140 guest rooms to align the property with the latest design standards of the brand.

The challenge was to execute this comprehensive refresh within a 6-month window (March – September 2025). The objective was to elevate the guest experience through tactile and visual upgrades without the need for heavy structural intervention, ensuring a quick turnaround for market re-entry.`,
      ar: 'تحسين الفخامة البوتيكية...'
    },
    approach: {
      en: `Curated Elegance

Mouhajer International Design focused on enhancing the "boutique" feel of the property. Our approach was centered on "curated details"—ensuring that every fabric, surface, and fixture contributed to a cohesive story of urban luxury.

Room Refresh: We moved away from standard hotel uniformity to create spaces that feel personal and artistic. The refurbishment involved a complete update of the color palette to warmer, more sophisticated tones, utilizing premium wall coverings and bespoke upholstery.

Tactile Upgrades: Recognizing that luxury is felt as much as it is seen, we prioritized high-quality textures. From plush carpets to velvet soft furnishings, the new materials were selected to provide a sense of comfort and exclusivity.

Efficient Execution: To meet the September completion date, our teams worked in a streamlined flow. We managed the removal of old assets and the installation of new FF&E (Furniture, Fixtures, and Equipment) with a "just-in-time" logistics strategy to prevent on-site clutter and maximize speed.`,
      ar: 'الأناقة المنسقة...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Soft Refurbishment', ar: 'التجديد الخفيف' }, description: { en: 'Complete aesthetic upgrade of 140 Guest Rooms.', ar: 'ترقية جمالية كاملة لـ 140 غرفة ضيوف.' } },
      { _key: 'scope-2', title: { en: 'FF&E Installation', ar: 'تركيب الأثاث' }, description: { en: 'Sourcing and placement of new soft furnishings, curtains, and carpets.', ar: 'توريد ووضع المفروشات الجديدة والستائر والسجاد.' } },
      { _key: 'scope-3', title: { en: 'Wall & Floor Treatments', ar: 'معالجات الجدران والأرضيات' }, description: { en: 'Installation of premium wallpapers and flooring upgrades.', ar: 'تركيب ورق الجدران الفاخر وترقيات الأرضيات.' } },
      { _key: 'scope-4', title: { en: 'Logistics Management', ar: 'إدارة اللوجستيات' }, description: { en: 'Rapid turnaround of room inventory to minimize downtime.', ar: 'دوران سريع لمخزون الغرف لتقليل وقت التوقف.' } },
    ],
    outcome: {
      en: `The project was successfully completed in September 2025, on time and within scope. The refreshed rooms at Hotel Boulevard now offer a sophisticated retreat that perfectly complements the vibrant energy of Downtown Dubai. This project highlights Mouhajer Design's ability to deliver high-quality boutique finishes with the speed and reliability of a large-scale contractor.

"140 Rooms reimagined. Boutique luxury delivered in 6 months."`,
      ar: 'اكتمل المشروع بنجاح في سبتمبر 2025...'
    },
    testimonial: {
      quote: { en: '140 Rooms reimagined. Boutique luxury delivered in 6 months.', ar: '140 غرفة أعيد تصورها. فخامة بوتيكية في 6 أشهر.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
];

// ========================================
// RESIDENTIAL PROJECTS (5)
// ========================================

const residentialProjects = [
  {
    id: 'project-boulevard-penthouse',
    title: { en: 'Boulevard Penthouse 70-71', ar: 'بنتهاوس بوليفارد 70-71' },
    slug: 'boulevard-penthouse-70-71',
    excerpt: {
      en: 'Location: Downtown Dubai, UAE. Client: Abu Dhabi National Hotels (ADNH). Scope: Design & Build (Full Turnkey). Size: 2,000 Square Meters. Budget: AED 40 Million. Status: Completed (Feb 2023). Awards: Best Residential Interior Apartment Dubai',
      ar: 'الموقع: وسط دبي. العميل: فنادق أبوظبي الوطنية'
    },
    featured: true,
    status: 'completed',
    sector: 'industry-residential',
    projectType: 'projectType-design-build',
    location: 'location-downtown-dubai',
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    year: 2023,
    duration: { startDate: '2022-02-01', endDate: '2023-02-28', months: 13 },
    budget: { amount: 40000000, currency: 'AED', range: '10m-50m' },
    area: 2000,
    services: ['service-interior-design', 'service-fit-out-construction', 'service-furniture-joinery'],
    tags: ['tag-best-residential-interior-dubai', 'tag-award-winner'],
    challenge: {
      en: `Logistics in the Clouds

Constructing a palace in the sky presents a unique set of engineering and logistical hurdles. The project involved the complete Design and Build of a massive 2,000 square meter penthouse spanning the 70th and 71st floors.

The building below was fully operational, meaning we could not disrupt the residents or guests. The primary challenge was vertical logistics: transporting materials, marble, and heavy joinery up 70 floors using only designated service lifts. Furthermore, the intensity of the schedule and the intricacy of the design required a massive workforce. On peak days, Mouhajer International Design managed a staggering 800 workers on-site, coordinating a complex symphony of trades within a high-security, high-altitude environment.`,
      ar: 'اللوجستيات في السحاب...'
    },
    approach: {
      en: `The Pinnacle of Opulence

Winning the award for Best Residential Interior Apartment Dubai required a design that was nothing short of breathtaking.

Sky-High Luxury: We designed the space to maximize the panoramic views of the Burj Khalifa and Downtown Dubai while ensuring the interior finishes rivaled the view. The design features expansive open-plan living areas, private elevators, and a layout that flows seamlessly across the two levels.

Detailed Craftsmanship: With a budget of AED 40 Million, every surface was treated as a canvas. We utilized rare book-matched marbles, gold-leaf detailing, and custom-manufactured chandeliers that had to be assembled on-site due to their scale.

Crowd Control & Safety: Managing 800 workers at this height required military-grade project management. We implemented strict safety protocols and shift rotations to maintain efficiency without overcrowding the workspace, ensuring that civil works, MEP, and fine finishing could happen simultaneously.`,
      ar: 'ذروة البذخ...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Design & Build', ar: 'التصميم والبناء' }, description: { en: 'End-to-end responsibility for the interior architecture and construction.', ar: 'مسؤولية كاملة للتصميم الداخلي والبناء.' } },
      { _key: 'scope-2', title: { en: 'Structural Integration', ar: 'التكامل الهيكلي' }, description: { en: 'Managing the connection between the two floors (70 & 71) within the penthouse.', ar: 'إدارة الربط بين الطابقين.' } },
      { _key: 'scope-3', title: { en: 'High-End Fit-Out', ar: 'التجهيز الفاخر' }, description: { en: 'Installation of luxury stone flooring, acoustic wall paneling, and smart home automation.', ar: 'تركيب الأرضيات الحجرية الفاخرة والألواح الصوتية.' } },
      { _key: 'scope-4', title: { en: 'Vertical Logistics', ar: 'اللوجستيات العمودية' }, description: { en: 'Coordination of material transport and workforce movement to the 70th floor.', ar: 'تنسيق نقل المواد وحركة العمال للطابق 70.' } },
    ],
    outcome: {
      en: `Completed in February 2023, the Boulevard Penthouse stands as one of the most exclusive residences in Dubai. The seamless execution of such a high-density operation at such a high altitude is a testament to our operational capability. The result is a residence of unmatched grandeur, rightfully earning the title of the best residential interior in the city.

"800 Workers, 70 Floors Up, One Vision: Building the Best Apartment in Dubai."`,
      ar: 'اكتمل المشروع في فبراير 2023...'
    },
    testimonial: {
      quote: { en: '800 Workers, 70 Floors Up, One Vision: Building the Best Apartment in Dubai.', ar: '800 عامل، 70 طابقاً، رؤية واحدة: بناء أفضل شقة في دبي.' },
      author: 'MIDC Team',
      role: 'Project Delivery'
    }
  },
  {
    id: 'project-villa-mbr-city',
    title: { en: 'Private Villa in MBR City', ar: 'فيلا خاصة في مدينة محمد بن راشد' },
    slug: 'private-villa-mbr-city',
    excerpt: {
      en: 'Location: Mohammed Bin Rashid Al Maktoum City, Dubai. Client: Private Client. Scope: Turnkey Contract (Design, Build, Fit-out, Furnishing). Status: Completed (May 2021)',
      ar: 'الموقع: مدينة محمد بن راشد، دبي. العميل: عميل خاص'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-residential',
    projectType: 'projectType-turnkey-contract',
    location: 'location-mbr-city',
    client: { en: 'Private Client', ar: 'عميل خاص' },
    year: 2021,
    duration: { startDate: '2020-07-01', endDate: '2021-05-31', months: 11 },
    services: ['service-architecture-engineering', 'service-fit-out-construction', 'service-furniture-joinery'],
    tags: [],
    challenge: {
      en: `Building a Dream Amidst Global Disruption

District One in MBR City is synonymous with modern opulence and crystal lagoons. The client entrusted Mouhajer International Design with a full Turnkey Contract to create a bespoke luxury residence in this prestigious community.

The project commenced in July 2020, right in the midst of the global pandemic. The primary challenge was to execute a high-specification build while navigating severe global supply chain disruptions and local movement restrictions. The client needed a partner who could manage every aspect of the project—from construction to the final cushion placement—guaranteeing that their dream home would be ready on time, regardless of external market conditions.`,
      ar: 'بناء حلم وسط الاضطراب العالمي...'
    },
    approach: {
      en: `Seamless Modern Living

Our Turnkey approach meant we carried the entire burden of execution, offering the client complete peace of mind.

Contemporary Elegance: The design reflects the architectural language of District One—clean lines, expansive glass, and a seamless connection between indoor and outdoor living. We focused on open-plan layouts that maximize natural light, using cool marble floors and warm wood accents to create a balanced, inviting atmosphere.

Resilient Logistics: To overcome the 2020 logistics crisis, our procurement team utilized our strong local network and in-house manufacturing capabilities. Instead of waiting for delayed international shipments, we fabricated bespoke joinery, furniture, and decorative elements in our own facilities, ensuring the quality was controlled and the timeline was met.

Personalized Sanctuary: As a private residence, every detail was tailored to the family's lifestyle—from the custom kitchen design to the spa-like bathrooms—the fit-out focused on functional luxury.`,
      ar: 'حياة عصرية سلسة...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Turnkey Execution', ar: 'التنفيذ المتكامل' }, description: { en: 'End-to-end management from concept design to key handover.', ar: 'إدارة كاملة من التصميم إلى التسليم.' } },
      { _key: 'scope-2', title: { en: 'Interior Fit-Out', ar: 'التجهيز الداخلي' }, description: { en: 'Full installation of flooring, ceilings, wall cladding, and MEP systems.', ar: 'تركيب كامل للأرضيات والأسقف والتكسية.' } },
      { _key: 'scope-3', title: { en: 'Custom Joinery', ar: 'النجارة المخصصة' }, description: { en: 'Design and manufacturing of walk-in wardrobes, kitchen cabinetry, and vanity units.', ar: 'تصميم وتصنيع خزائن الملابس والمطابخ.' } },
      { _key: 'scope-4', title: { en: 'Landscape Integration', ar: 'تكامل المناظر الطبيعية' }, description: { en: 'Ensuring the interior design flowed naturally into the exterior garden and pool areas.', ar: 'ضمان انسياب التصميم الداخلي إلى الحديقة والمسبح.' } },
    ],
    outcome: {
      en: `The villa was successfully handed over in May 2021. Despite the global challenges of the construction period, Mouhajer International Design delivered a flawless property with no delays. The project stands as a prime example of our "One-Stop Solution" capability, proving that even in the most difficult times, we build with precision and promise.

"From concept to keys: Delivering a District One masterpiece during the peak of 2020."`,
      ar: 'تم تسليم الفيلا بنجاح في مايو 2021...'
    },
    testimonial: {
      quote: { en: 'From concept to keys: Delivering a District One masterpiece during the peak of 2020.', ar: 'من المفهوم إلى المفاتيح: تسليم تحفة ديستريكت ون في ذروة 2020.' },
      author: 'Private Client',
      role: 'Homeowner'
    }
  },
  {
    id: 'project-villa-jumeirah-bay',
    title: { en: 'Private Villa in Jumeirah Bay', ar: 'فيلا خاصة في خليج جميرا' },
    slug: 'private-villa-jumeirah-bay',
    excerpt: {
      en: 'Location: Bulgari Island, Jumeirah Bay, Dubai. Client: Private Client. Scope: Turnkey Contract (Design, Build, Fit-out, Furnishing). Status: Completed (Nov 2020)',
      ar: 'الموقع: جزيرة بولغاري، خليج جميرا، دبي. العميل: عميل خاص'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-residential',
    projectType: 'projectType-turnkey-contract',
    location: 'location-jumeirah-bay',
    client: { en: 'Private Client', ar: 'عميل خاص' },
    year: 2020,
    duration: { startDate: '2019-11-01', endDate: '2020-11-30', months: 13 },
    services: ['service-architecture-engineering', 'service-fit-out-construction', 'service-mep-engineering'],
    tags: [],
    challenge: {
      en: `Designing for the "Island of Billionaires"

Jumeirah Bay Island is Dubai's most exclusive address, home to the Bulgari Resort and a select number of private mansions. Building in this location requires more than just luxury; it demands a design that respects the unique architectural guidelines of the island while providing absolute privacy and grandeur for the client.

The project was a comprehensive Turnkey Contract aimed at delivering a bespoke waterfront mansion. The challenge was to execute a complex, high-specification build within a strict 12-month timeline (Nov 2019 – Nov 2020). As the project crossed into 2020, we also had to navigate the logistical hurdles of the pandemic without allowing the quality or the schedule to slip—standards are non-negotiable in a neighborhood of this caliber.`,
      ar: 'التصميم لـ "جزيرة المليارديرات"...'
    },
    approach: {
      en: `Marine Opulence

Mouhajer International Design approached this project with a vision of "Timeless Marine Luxury." The design had to harmonize with the island's seahorse shape and the surrounding azure waters.

Turnkey Perfection: We managed every single detail—from the structural engineering to the selection of the finest Italian linens. This "white glove" service meant the client had a single point of accountability for the entire creation of their home.

Material Selection: To match the prestige of the Bulgari neighborhood, we imported rare stones and utilized marine-grade materials that can withstand the coastal environment while looking immaculate. The interiors feature expansive floor-to-ceiling glass to frame the sea views, grounded by warm, natural timber accents.

Privacy & Exclusivity: The layout was engineered to offer maximum openness to the sea while maintaining strict privacy from the street side, creating a secluded personal resort for the owner.`,
      ar: 'الفخامة البحرية...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Turnkey Construction', ar: 'البناء المتكامل' }, description: { en: 'Full design-and-build responsibility, taking the plot from concept to completion.', ar: 'مسؤولية كاملة للتصميم والبناء.' } },
      { _key: 'scope-2', title: { en: 'Luxury Fit-Out', ar: 'التجهيز الفاخر' }, description: { en: 'High-precision installation of marble flooring, custom wall cladding, and automated shading systems.', ar: 'تركيب دقيق للرخام وتكسية الجدران المخصصة.' } },
      { _key: 'scope-3', title: { en: 'Bespoke Furniture', ar: 'الأثاث المخصص' }, description: { en: 'Design and manufacturing of custom furniture pieces tailored to the villa\'s unique dimensions.', ar: 'تصميم وتصنيع قطع أثاث مخصصة.' } },
      { _key: 'scope-4', title: { en: 'Exterior Integration', ar: 'التكامل الخارجي' }, description: { en: 'Seamless connection between the indoor majestic halls and the private marina/pool deck.', ar: 'ربط سلس بين القاعات الداخلية والمارينا الخاصة.' } },
    ],
    outcome: {
      en: `The project was handed over in November 2020, precisely one year after commencement. By delivering this project on time during a year of global uncertainty, Mouhajer International Design cemented its reputation as a reliable partner for Dubai's elite. The villa stands today as a jewel on Jumeirah Bay, embodying the pinnacle of privacy and prestige.

"A waterfront masterpiece delivered in 12 months on Dubai's most exclusive island."`,
      ar: 'تم تسليم المشروع في نوفمبر 2020...'
    },
    testimonial: {
      quote: { en: 'A waterfront masterpiece delivered in 12 months on Dubai\'s most exclusive island.', ar: 'تحفة على الواجهة البحرية في 12 شهراً على أكثر جزر دبي حصرية.' },
      author: 'Private Client',
      role: 'Homeowner'
    }
  },
  {
    id: 'project-villa-palm-jumeirah',
    title: { en: 'Private Villa in Palm Jumeirah', ar: 'فيلا خاصة في نخلة جميرا' },
    slug: 'private-villa-palm-jumeirah',
    excerpt: {
      en: 'Location: Palm Jumeirah, Dubai, UAE. Client: Private Client. Scope: Turnkey Contract (Design, Build, Fit-out). Status: Completed (Mar 2022)',
      ar: 'الموقع: نخلة جميرا، دبي. العميل: عميل خاص'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-residential',
    projectType: 'projectType-turnkey-contract',
    location: 'location-palm-jumeirah',
    client: { en: 'Private Client', ar: 'عميل خاص' },
    year: 2022,
    duration: { startDate: '2020-10-01', endDate: '2022-03-31', months: 18 },
    services: ['service-architecture-engineering', 'service-fit-out-construction', 'service-landscape', 'service-mep-engineering'],
    tags: [],
    challenge: {
      en: `Redefining Island Living

The Fronds of Palm Jumeirah are among the most coveted stretches of real estate in the world. However, transforming a standard Frond villa into a one-of-a-kind architectural statement requires vision and engineering prowess.

The client engaged Mouhajer International Design for a complete Turnkey Contract, entrusting us with the entire lifecycle of the project from October 2020 to March 2022. The challenge was to break away from the "cookie-cutter" developer templates often found on the Palm and create a bespoke waterfront sanctuary. This required extensive structural modifications, intricate MEP re-engineering, and a logistics strategy that respected the privacy of the neighboring villas in this exclusive, high-density residential zone.`,
      ar: 'إعادة تعريف الحياة الجزرية...'
    },
    approach: {
      en: `A Personal Resort

Our approach was to blur the lines between a private home and a 5-star beach resort.

Holistic Turnkey Solution: We managed every vertical of the project. From the initial architectural drawings to the final selection of art pieces, the client dealt with a single entity. This ensured that the vision remained consistent throughout the 18-month construction phase.

Waterfront Integration: The design maximized the unique location. We utilized floor-to-ceiling panoramic glazing to pull the ocean views into the living spaces. The transition from the indoor lounge to the private beach was designed to be seamless, utilizing continuous flooring materials that extend to the outdoor terrace.

Bespoke Interiors: Every corner of the villa was treated with custom craftsmanship. We installed bespoke joinery, automated smart-home systems, and book-matched marble features that turned functional elements into artistic focal points.`,
      ar: 'منتجع شخصي...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Turnkey Construction', ar: 'البناء المتكامل' }, description: { en: 'Complete project management from Design to Build.', ar: 'إدارة مشروع كاملة من التصميم إلى البناء.' } },
      { _key: 'scope-2', title: { en: 'Structural Modification', ar: 'التعديل الهيكلي' }, description: { en: 'Alterations to the existing layout to maximize space and light.', ar: 'تعديلات على التصميم الحالي لتحقيق أقصى مساحة وإضاءة.' } },
      { _key: 'scope-3', title: { en: 'High-End Fit-Out', ar: 'التجهيز الفاخر' }, description: { en: 'Installation of premium stone, wood, and metal finishes.', ar: 'تركيب تشطيبات الحجر والخشب والمعدن الفاخرة.' } },
      { _key: 'scope-4', title: { en: 'Landscape Design', ar: 'تصميم المناظر الطبيعية' }, description: { en: 'Development of the pool deck and beach access areas.', ar: 'تطوير سطح المسبح ومناطق الوصول للشاطئ.' } },
    ],
    outcome: {
      en: `Handed over in March 2022, the villa stands as a testament to bespoke luxury. Mouhajer International Design successfully transformed the property into a high-value asset that offers a unique living experience. By managing the complexities of construction on the Palm, we delivered a stress-free experience for the client and a home that sets a new standard for Frond living.

"A seamless journey from blueprint to beachfront reality."`,
      ar: 'تم التسليم في مارس 2022...'
    },
    testimonial: {
      quote: { en: 'A seamless journey from blueprint to beachfront reality.', ar: 'رحلة سلسة من المخطط إلى واقع الواجهة البحرية.' },
      author: 'Private Client',
      role: 'Homeowner'
    }
  },
  {
    id: 'project-dubai-creek-residence',
    title: { en: 'Dubai Creek Residence', ar: 'إقامة خور دبي' },
    slug: 'dubai-creek-residence',
    excerpt: {
      en: 'Location: Dubai Creek Harbour, UAE. Scope: Interior Design & Fit-Out (Apartments & Villas)',
      ar: 'الموقع: ميناء خور دبي. النطاق: تصميم داخلي وتجهيز'
    },
    featured: false,
    status: 'completed',
    sector: 'industry-residential',
    projectType: 'projectType-design-build',
    location: 'location-dubai-creek-harbour',
    client: { en: 'Various Private Clients', ar: 'عملاء خاصون متعددون' },
    services: ['service-interior-design', 'service-fit-out-construction', 'service-furniture-joinery'],
    tags: [],
    challenge: {
      en: `Elevating the Standard

Dubai Creek Residence is situated in one of the city's most forward-thinking districts, offering stunning views of the skyline and the Creek. However, standard developer finishes often leave room for personalization and elevation.

The challenge in working within these towers and podium villas is to take a high-quality "shell" and transform it into a true luxury home that reflects the owner's personality. Our objective is to distinguish these residences from the standard market inventory, adding value through custom modifications, smart space planning, and material upgrades that turn a property from "premium" to "exceptional."`,
      ar: 'رفع المعيار...'
    },
    approach: {
      en: `Beyond Developer Standards

Mouhajer International Design has executed multiple Interior Design and Fit-Out projects within the Dubai Creek Residence development—both in the tower apartments and the podium villas.

Custom Fit-Out: For each residence, we take the base shell and reimagine it according to the client's lifestyle. This often involves reconfiguring layouts, upgrading MEP systems for smart home integration, and installing bespoke joinery that maximizes storage while maintaining a sleek aesthetic.

Premium Materials: We source materials that go far beyond standard developer specifications. This includes rare stone selections, hand-crafted metalwork, and soft furnishings from top-tier global suppliers. The result is an interior that feels curated and personal, not off-the-shelf.

Design Coherence: Whether it's a compact apartment or a sprawling villa, we maintain a consistent design philosophy—functional elegance. Every element serves a purpose, and every material is chosen for both beauty and durability.`,
      ar: 'ما وراء معايير المطور...'
    },
    scope: [
      { _key: 'scope-1', title: { en: 'Interior Design', ar: 'التصميم الداخلي' }, description: { en: 'Full interior concepts for apartments and villas within Dubai Creek Residence.', ar: 'مفاهيم داخلية كاملة للشقق والفيلات.' } },
      { _key: 'scope-2', title: { en: 'Fit-Out Execution', ar: 'تنفيذ التجهيز' }, description: { en: 'Complete renovation and fit-out from flooring to ceilings.', ar: 'تجديد وتجهيز كامل من الأرضيات إلى الأسقف.' } },
      { _key: 'scope-3', title: { en: 'Custom Joinery', ar: 'النجارة المخصصة' }, description: { en: 'Bespoke wardrobes, kitchens, and storage solutions.', ar: 'خزائن ومطابخ وحلول تخزين مخصصة.' } },
      { _key: 'scope-4', title: { en: 'Smart Home Integration', ar: 'تكامل المنزل الذكي' }, description: { en: 'Upgrading MEP to support automated lighting, climate, and security systems.', ar: 'ترقية الأنظمة لدعم الإضاءة والمناخ والأمان الآلي.' } },
    ],
    outcome: {
      en: `Our work at Dubai Creek Residence has transformed numerous properties from standard deliveries into signature homes. Each project has resulted in a substantial uplift in both the living experience and the market value of the property.

By consistently delivering above developer standards, Mouhajer International Design has become a trusted partner for discerning homeowners in this landmark development.

"Turning premium apartments into personalized palaces at Dubai Creek Residence."`,
      ar: 'حولت أعمالنا في إقامة خور دبي العديد من العقارات...'
    },
    testimonial: {
      quote: { en: 'Turning premium apartments into personalized palaces at Dubai Creek Residence.', ar: 'تحويل الشقق الفاخرة إلى قصور شخصية في إقامة خور دبي.' },
      author: 'Multiple Clients',
      role: 'Homeowners'
    }
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

async function ensureTaxonomyExists(type, items) {
  console.log(`\n📚 Ensuring ${type} taxonomy exists...`);

  for (const item of items) {
    const existing = await client.fetch(`*[_type == "${type}" && _id == "${item.id}"][0]`);

    if (existing) {
      console.log(`  ✅ ${item.title?.en || item.name?.en} already exists`);
    } else {
      const doc = {
        _type: type,
        _id: item.id,
        ...(item.title && { title: item.title }),
        ...(item.name && { name: item.name }),
        slug: { _type: 'slug', current: item.slug },
        ...(item.country && { country: item.country }),
        ...(item.category && { category: item.category }),
      };

      await client.createOrReplace(doc);
      console.log(`  ✨ Created: ${item.title?.en || item.name?.en}`);
    }
  }
}

async function createProject(projectData) {
  console.log(`\n📝 Creating project: ${projectData.title.en}`);

  // Check if exists
  const existing = await client.fetch(`*[_type == "project" && _id == "${projectData.id}"][0]`);

  if (existing) {
    console.log(`  ⚠️ Project already exists, updating...`);
    await client.delete(projectData.id);
  }

  // Build services references
  const servicesRefs = (projectData.services || []).map((svcId, idx) => ({
    _type: 'reference',
    _ref: svcId,
    _key: `svc-${idx}`
  }));

  // Build tags references
  const tagsRefs = (projectData.tags || []).map((tagId, idx) => ({
    _type: 'reference',
    _ref: tagId,
    _key: `tag-${idx}`
  }));

  const project = {
    _type: 'project',
    _id: projectData.id,
    title: projectData.title,
    slug: { _type: 'slug', current: projectData.slug },
    excerpt: projectData.excerpt,
    featured: projectData.featured || false,
    status: projectData.status || 'completed',
    publishedAt: new Date().toISOString(),

    // Classification
    sector: { _type: 'reference', _ref: projectData.sector },
    projectType: { _type: 'reference', _ref: projectData.projectType },
    location: { _type: 'reference', _ref: projectData.location },
    services: servicesRefs,
    tags: tagsRefs,

    // Details
    client: projectData.client,
    ...(projectData.year && { year: projectData.year }),
    ...(projectData.duration && { duration: projectData.duration }),
    ...(projectData.budget && { budget: projectData.budget }),
    ...(projectData.area && { area: projectData.area }),
    ...(projectData.units && { units: projectData.units }),

    // Content
    challenge: projectData.challenge,
    approach: projectData.approach,
    scope: projectData.scope,
    outcome: projectData.outcome,
    ...(projectData.testimonial && { testimonial: projectData.testimonial }),
  };

  const created = await client.create(project);
  console.log(`  ✅ Created: ${created._id}`);
  return created;
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log('🚀 Starting Hospitality & Residential Projects Migration\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Ensure all taxonomy exists
    await ensureTaxonomyExists('industry', industries);
    await ensureTaxonomyExists('projectType', projectTypes);
    await ensureTaxonomyExists('location', locations);
    await ensureTaxonomyExists('service', services);
    await ensureTaxonomyExists('tag', tags);

    console.log('\n' + '='.repeat(60));
    console.log('📊 Creating Hospitality Projects (12)\n');

    // Step 2: Create Hospitality Projects
    for (const project of hospitalityProjects) {
      await createProject(project);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🏠 Creating Residential Projects (5)\n');

    // Step 3: Create Residential Projects
    for (const project of residentialProjects) {
      await createProject(project);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Migration Complete!');
    console.log(`   Hospitality Projects: ${hospitalityProjects.length}`);
    console.log(`   Residential Projects: ${residentialProjects.length}`);
    console.log(`   Total: ${hospitalityProjects.length + residentialProjects.length}`);
    console.log('\n⚠️  Note: Images need to be added via Sanity Studio or a separate migration.');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
