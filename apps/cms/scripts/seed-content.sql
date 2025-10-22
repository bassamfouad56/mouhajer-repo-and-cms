-- Seed Sample Content for Mouhajer CMS
-- Projects, Services, and Blog Posts

-- Insert Sample Projects
INSERT INTO projects (
  id, title_en, title_ar, description_en, description_ar, images, category, featured, status, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'Luxury Villa in Dubai Hills',
  'فيلا فاخرة في دبي هيلز',
  'A stunning contemporary villa featuring bespoke interiors with a perfect blend of modern luxury and traditional Arabic elements. This 12,000 sq ft masterpiece showcases our expertise in high-end residential design.',
  'فيلا معاصرة مذهلة تتميز بتصميمات داخلية مخصصة مع مزيج مثالي من الفخامة الحديثة والعناصر العربية التقليدية. تعرض هذه التحفة الفنية البالغة 12,000 قدم مربع خبرتنا في التصميم السكني الراقي.',
  ARRAY['/images/projects/villa-1.jpg', '/images/projects/villa-2.jpg', '/images/projects/villa-3.jpg'],
  'Residential',
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Emirates Palace Penthouse',
  'بنتهاوس قصر الإمارات',
  'An opulent penthouse design featuring Italian marble, gold leaf details, and panoramic city views. This project exemplifies our commitment to creating spaces of unparalleled luxury.',
  'تصميم بنتهاوس فاخر يضم رخام إيطالي وتفاصيل ورق ذهبي وإطلالات بانورامية على المدينة. يجسد هذا المشروع التزامنا بإنشاء مساحات ذات فخامة لا مثيل لها.',
  ARRAY['/images/projects/penthouse-1.jpg', '/images/projects/penthouse-2.jpg'],
  'Residential',
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Downtown Dubai Corporate Office',
  'مكتب شركات وسط دبي',
  'A modern corporate workspace designed to inspire innovation and collaboration. Features include smart office technology, sustainable materials, and biophilic design elements.',
  'مساحة عمل شركات حديثة مصممة لإلهام الابتكار والتعاون. تشمل الميزات تكنولوجيا المكاتب الذكية والمواد المستدامة وعناصر التصميم المحبة للطبيعة.',
  ARRAY['/images/projects/office-1.jpg', '/images/projects/office-2.jpg', '/images/projects/office-3.jpg'],
  'Commercial',
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Jumeirah Beach Restaurant',
  'مطعم شاطئ جميرا',
  'An elegant fine dining restaurant with sophisticated coastal aesthetics. Custom lighting, artisan finishes, and carefully curated art pieces create an unforgettable dining atmosphere.',
  'مطعم راقي أنيق بجماليات ساحلية متطورة. الإضاءة المخصصة والتشطيبات الحرفية والقطع الفنية المنسقة بعناية تخلق جواً لا يُنسى لتناول الطعام.',
  ARRAY['/images/projects/restaurant-1.jpg', '/images/projects/restaurant-2.jpg'],
  'Hospitality',
  false,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Marina Luxury Apartment',
  'شقة فاخرة في المارينا',
  'A sophisticated urban apartment featuring smart home integration, minimalist aesthetics, and premium European fixtures throughout.',
  'شقة حضرية متطورة تتميز بتكامل المنزل الذكي والجماليات البسيطة والتجهيزات الأوروبية الممتازة في جميع أنحائها.',
  ARRAY['/images/projects/apartment-1.jpg', '/images/projects/apartment-2.jpg'],
  'Residential',
  false,
  'published',
  NOW(),
  NOW()
);

-- Insert Sample Services
INSERT INTO services (
  id, title_en, title_ar, description_en, description_ar, short_description_en, short_description_ar,
  icon, features_en, features_ar, price, duration, featured, status, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'Interior Design Consultancy',
  'استشارات التصميم الداخلي',
  'Our comprehensive interior design consultancy service transforms your vision into reality. From concept development to final execution, we guide you through every step of creating your dream space. Our award-winning designers combine creativity with functionality to deliver spaces that exceed expectations.',
  'تحول خدمة استشارات التصميم الداخلي الشاملة لدينا رؤيتك إلى واقع. من تطوير المفهوم إلى التنفيذ النهائي، نرشدك خلال كل خطوة من إنشاء المساحة التي تحلم بها. يجمع مصممونا الحائزون على جوائز بين الإبداع والوظائف لتقديم مساحات تتجاوز التوقعات.',
  'Transform your space with expert design consultation',
  'حول مساحتك مع استشارة تصميم خبيرة',
  '🎨',
  ARRAY['Concept Development', '3D Visualization', 'Material Selection', 'Project Management'],
  ARRAY['تطوير المفهوم', 'التصور ثلاثي الأبعاد', 'اختيار المواد', 'إدارة المشاريع'],
  'Starting from AED 50,000',
  '8-12 weeks',
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Luxury Fit-Out Services',
  'خدمات التجهيز الفاخر',
  'Complete turnkey fit-out solutions for residential and commercial projects. We manage every aspect of the fit-out process, ensuring impeccable quality, timely delivery, and budget adherence. Our experienced team coordinates all trades to deliver exceptional results.',
  'حلول التجهيز الكاملة الجاهزة للمشاريع السكنية والتجارية. نحن ندير كل جانب من جوانب عملية التجهيز، مما يضمن جودة لا تشوبها شائبة وتسليم في الوقت المناسب والالتزام بالميزانية. ينسق فريقنا ذو الخبرة جميع الحرف لتقديم نتائج استثنائية.',
  'End-to-end fit-out solutions with premium finishes',
  'حلول التجهيز من البداية للنهاية مع تشطيبات ممتازة',
  '🔨',
  ARRAY['Full Project Management', 'Quality Assurance', 'On-time Delivery', 'Budget Control'],
  ARRAY['إدارة المشروع الكاملة', 'ضمان الجودة', 'التسليم في الموعد', 'التحكم في الميزانية'],
  'Custom Quote',
  '12-20 weeks',
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Architectural Design',
  'التصميم المعماري',
  'Innovative architectural design services that blend aesthetics with functionality. Our architects create spaces that are not only visually stunning but also sustainable and practical for modern living.',
  'خدمات التصميم المعماري المبتكرة التي تمزج الجماليات مع الوظائف. يخلق مهندسونا مساحات ليست مذهلة بصرياً فحسب، بل أيضاً مستدامة وعملية للحياة الحديثة.',
  'Cutting-edge architectural solutions',
  'حلول معمارية متطورة',
  '🏛️',
  ARRAY['Sustainable Design', 'Building Permits', 'Structural Engineering', 'MEP Coordination'],
  ARRAY['التصميم المستدام', 'تصاريح البناء', 'الهندسة الإنشائية', 'تنسيق MEP'],
  'Custom Quote',
  '16-24 weeks',
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Furniture & Decoration',
  'الأثاث والديكور',
  'Bespoke furniture design and exclusive decoration services. Access our curated collection of luxury furnishings from world-renowned brands, or commission custom pieces crafted by master artisans.',
  'تصميم الأثاث المخصص وخدمات الديكور الحصرية. الوصول إلى مجموعتنا المنسقة من الأثاث الفاخر من العلامات التجارية المشهورة عالمياً، أو تكليف قطع مخصصة مصنوعة من قبل حرفيين رئيسيين.',
  'Curated luxury furnishings and custom pieces',
  'أثاث فاخر منسق وقطع مخصصة',
  '🛋️',
  ARRAY['Custom Furniture Design', 'Luxury Brand Access', 'Art Curation', 'Accessory Selection'],
  ARRAY['تصميم الأثاث المخصص', 'الوصول للعلامات الفاخرة', 'تنسيق الفن', 'اختيار الإكسسوارات'],
  'Starting from AED 30,000',
  '6-10 weeks',
  false,
  'published',
  NOW(),
  NOW()
);

-- Insert Sample Blog Posts
INSERT INTO blog_posts (
  id, title_en, title_ar, slug_en, slug_ar, excerpt_en, excerpt_ar, content_en, content_ar,
  featured_image, category, tags, author, published_at, featured, status, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  '10 Luxury Interior Design Trends for 2025',
  '10 اتجاهات تصميم داخلي فاخر لعام 2025',
  '10-luxury-interior-design-trends-2025',
  '10-اتجاهات-تصميم-داخلي-فاخر-2025',
  'Discover the top luxury interior design trends that will define elite spaces in 2025. From sustainable materials to smart home integration.',
  'اكتشف أفضل اتجاهات التصميم الداخلي الفاخر التي ستحدد المساحات النخبوية في عام 2025. من المواد المستدامة إلى تكامل المنزل الذكي.',
  'The luxury interior design landscape is evolving. Here are the top 10 trends we''re seeing for 2025...',
  'يتطور مشهد التصميم الداخلي الفاخر. فيما يلي أهم 10 اتجاهات نراها لعام 2025...',
  '/images/blog/trends-2025.jpg',
  'Design Trends',
  ARRAY['trends', 'luxury', 'interior design', '2025'],
  'Eng. Maher Mouhajer',
  NOW(),
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Art of Mixing Modern and Traditional Design',
  'فن مزج التصميم الحديث والتقليدي',
  'mixing-modern-traditional-design',
  'مزج-التصميم-الحديث-التقليدي',
  'Learn how to seamlessly blend contemporary aesthetics with classical elements for timeless interiors.',
  'تعلم كيفية مزج الجماليات المعاصرة بسلاسة مع العناصر الكلاسيكية للحصول على تصميمات داخلية خالدة.',
  'Blending modern and traditional design requires a nuanced approach...',
  'يتطلب مزج التصميم الحديث والتقليدي نهجاً دقيقاً...',
  '/images/blog/modern-traditional.jpg',
  'Design Tips',
  ARRAY['design tips', 'modern', 'traditional', 'mixing styles'],
  'Mouhajer Design Team',
  NOW() - INTERVAL '5 days',
  true,
  'published',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Sustainable Luxury: The Future of Interior Design',
  'الفخامة المستدامة: مستقبل التصميم الداخلي',
  'sustainable-luxury-interior-design',
  'الفخامة-المستدامة-التصميم-الداخلي',
  'Explore how sustainable practices are reshaping luxury interior design without compromising on elegance.',
  'استكشف كيف تعيد الممارسات المستدامة تشكيل التصميم الداخلي الفاخر دون المساس بالأناقة.',
  'Sustainability and luxury are no longer mutually exclusive...',
  'لم تعد الاستدامة والفخامة متعارضتين...',
  '/images/blog/sustainable-luxury.jpg',
  'Sustainability',
  ARRAY['sustainability', 'eco-friendly', 'luxury', 'green design'],
  'Mouhajer Design Team',
  NOW() - INTERVAL '10 days',
  false,
  'published',
  NOW(),
  NOW()
);
