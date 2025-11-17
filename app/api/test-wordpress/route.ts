import { NextResponse } from 'next/server';
import { getProjects, getServices, getIndustries, getPosts } from '@/lib/wordpress';

export async function GET() {
  try {
    const [projects, services, industries, posts] = await Promise.all([
      getProjects(),
      getServices(),
      getIndustries(),
      getPosts(),
    ]);

    return NextResponse.json({
      success: true,
      connection: 'Connected to WordPress',
      data: {
        projects: {
          count: projects.length,
          items: projects.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.acfFields?.category,
          })),
        },
        services: {
          count: services.length,
          items: services.map(s => ({ id: s.id, title: s.title })),
        },
        industries: {
          count: industries.length,
          items: industries.map(i => ({ id: i.id, title: i.title })),
        },
        posts: {
          count: posts.length,
          items: posts.map(p => ({ id: p.id, title: p.title, slug: p.slug })),
        },
      },
      config: {
        apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'Not configured',
        hasUsername: !!process.env.WP_USERNAME,
        hasPassword: !!process.env.WP_APP_PASSWORD,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'Not configured',
        hasUsername: !!process.env.WP_USERNAME,
        hasPassword: !!process.env.WP_APP_PASSWORD,
      },
    }, { status: 500 });
  }
}
