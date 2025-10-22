-- Seed Homepage Content for Mouhajer CMS
-- This script creates the homepage with all blocks matching the live website design

-- First, delete existing homepage if it exists
DELETE FROM page_blocks WHERE page_id IN (SELECT id FROM pages WHERE slug_en = 'home');
DELETE FROM pages WHERE slug_en = 'home';

-- Insert Homepage Page
INSERT INTO pages (
  id,
  title_en,
  title_ar,
  slug_en,
  slug_ar,
  description_en,
  description_ar,
  seo_meta_title_en,
  seo_meta_title_ar,
  seo_meta_desc_en,
  seo_meta_desc_ar,
  seo_keywords,
  status,
  featured,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Home',
  'الرئيسية',
  'home',
  'الرئيسية',
  'Luxury Interior Design Company in Dubai - Award-winning design studio',
  'شركة التصميم الداخلي الفاخر في دبي - استوديو التصميم الحائز على جوائز',
  'Luxury Interior Design Dubai | Mouhajer International Design',
  'تصميم داخلي فاخر دبي | مهاجر الدولية للتصميم',
  'Award-winning luxury interior design company in Dubai. Transform your villa, apartment, or commercial space with our expert designers. 500+ successful projects across UAE.',
  'شركة التصميم الداخلي الفاخر الحائزة على جوائز في دبي. حول الفيلا أو الشقة أو المساحة التجارية مع مصممينا الخبراء. أكثر من 500 مشروع ناجح في الإمارات.',
  ARRAY['interior design Dubai', 'luxury interior design', 'villa design Dubai', 'apartment design UAE', 'commercial interior design'],
  'published',
  true,
  NOW(),
  NOW()
);

-- Get the page ID we just created
DO $$
DECLARE
  homepage_id UUID;
BEGIN
  SELECT id INTO homepage_id FROM pages WHERE slug_en = 'home';

  -- Block 1: Hero Banner
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'hero_banner',
    jsonb_build_object(
      'backgroundImage', '/newbanner.jpg',
      'backgroundVideo', '/videos/hero-bg.mp4',
      'title', jsonb_build_object(
        'en', 'Excellence in Architecture, Interior Design & Fit-Out Services',
        'ar', 'التميز في الهندسة المعمارية والتصميم الداخلي وخدمات التجهيز'
      ),
      'subtitle', jsonb_build_object(
        'en', 'Transform your space with Dubai''s award-winning design studio',
        'ar', 'حول مساحتك مع استوديو التصميم الحائز على جوائز في دبي'
      ),
      'maskLayer', true
    ),
    1,
    NOW(),
    NOW()
  );

  -- Block 2: Animated Headline
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'animated_headline',
    jsonb_build_object(
      'text', jsonb_build_object(
        'en', 'LUXURY • INNOVATION • CRAFTSMANSHIP • EXCELLENCE',
        'ar', 'فخامة • ابتكار • حرفية • تميز'
      ),
      'blackened', true
    ),
    2,
    NOW(),
    NOW()
  );

  -- Block 3: Company Description
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'company_description_home',
    jsonb_build_object(
      'backgroundColor', '#202020'
    ),
    3,
    NOW(),
    NOW()
  );

  -- Block 4: About Carousel Home
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'about_carousel_home',
    jsonb_build_object(
      'images', '[]'::jsonb
    ),
    4,
    NOW(),
    NOW()
  );

  -- Block 5: Services Swiper
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'services_swiper',
    jsonb_build_object(
      'title', jsonb_build_object(
        'en', 'Our Comprehensive Design Services',
        'ar', 'خدمات التصميم الشاملة لدينا'
      )
    ),
    5,
    NOW(),
    NOW()
  );

  -- Block 6: Portfolio Display Home
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'portfolio_display_home',
    jsonb_build_object(
      'headline', jsonb_build_object(
        'en', 'OUR PORTFOLIO',
        'ar', 'أعمالنا'
      ),
      'projectCount', 400,
      'featured', true,
      'maxItems', 10
    ),
    6,
    NOW(),
    NOW()
  );

  -- Block 7: Founder Section
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'founder_section',
    jsonb_build_object(
      'image', '/images/engineer-placeholder.jpg'
    ),
    7,
    NOW(),
    NOW()
  );

  -- Block 8: Awards Section
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'awards_section',
    jsonb_build_object(
      'title', jsonb_build_object(
        'en', 'Awards & Recognition',
        'ar', 'الجوائز والتقدير'
      )
    ),
    8,
    NOW(),
    NOW()
  );

  -- Block 9: Featured In
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'featured_in',
    jsonb_build_object(
      'logos', '[]'::jsonb
    ),
    9,
    NOW(),
    NOW()
  );

  -- Block 10: Blog Section
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'blog_section',
    jsonb_build_object(
      'title', jsonb_build_object(
        'en', 'Latest From Our Blog',
        'ar', 'آخر المقالات من مدونتنا'
      ),
      'featured', true,
      'published', true,
      'maxItems', 3,
      'layout', 'grid',
      'showExcerpt', true,
      'showAuthor', true,
      'showDate', true,
      'showCategory', true
    ),
    10,
    NOW(),
    NOW()
  );

  -- Block 11: Contact Form
  INSERT INTO page_blocks (id, page_id, type, data, "order", created_at, updated_at) VALUES (
    gen_random_uuid(),
    homepage_id,
    'contact_form',
    jsonb_build_object(
      'title', jsonb_build_object(
        'en', 'Get In Touch',
        'ar', 'تواصل معنا'
      )
    ),
    11,
    NOW(),
    NOW()
  );

END $$;
