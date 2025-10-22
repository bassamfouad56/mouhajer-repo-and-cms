import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// On-demand revalidation webhook endpoint
// Called by mouhajer-cms when content is published/updated

export async function POST(request: NextRequest) {
  try {
    // Verify secret token to prevent unauthorized revalidation
    const authHeader = request.headers.get('authorization');
    const secret = process.env['REVALIDATION_SECRET'];

    if (!secret) {
      console.error('REVALIDATION_SECRET not configured');
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { type, slug, locale } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing "type" in request body' },
        { status: 400 }
      );
    }

    // Revalidate based on content type
    const paths: string[] = [];

    switch (type) {
      case 'blog':
      case 'blogPost':
        // Revalidate blog listing
        paths.push('/en/blogs');
        paths.push('/ar/blogs');

        // Revalidate specific post if slug provided
        if (slug) {
          paths.push(`/en/blogs/${slug}`);
          if (locale && locale !== 'en') {
            paths.push(`/${locale}/blogs/${slug}`);
          }
        }
        break;

      case 'project':
        // Revalidate project listing
        paths.push('/en/our-projects');
        paths.push('/ar/our-projects');

        // Revalidate specific project if slug provided
        if (slug) {
          paths.push(`/en/our-projects/${slug}`);
          if (locale && locale !== 'en') {
            paths.push(`/${locale}/our-projects/${slug}`);
          }
        }
        break;

      case 'service':
        // Revalidate service listing
        paths.push('/en/services');
        paths.push('/ar/services');

        // Revalidate specific service if slug provided
        if (slug) {
          paths.push(`/en/services/${slug}`);
          if (locale && locale !== 'en') {
            paths.push(`/${locale}/services/${slug}`);
          }
        }
        break;

      case 'page':
        // Revalidate specific page if slug provided
        if (slug) {
          paths.push(`/en/${slug}`);
          paths.push(`/ar/${slug}`);
        }
        break;

      case 'settings':
      case 'navigation':
        // Revalidate all pages when global settings/navigation change
        paths.push('/en');
        paths.push('/ar');
        paths.push('/en/our-projects');
        paths.push('/ar/our-projects');
        paths.push('/en/services');
        paths.push('/ar/services');
        paths.push('/en/blogs');
        paths.push('/ar/blogs');
        paths.push('/en/who-we-are');
        paths.push('/ar/who-we-are');
        paths.push('/en/contact-us');
        paths.push('/ar/contact-us');
        break;

      case 'all':
        // Nuclear option: revalidate entire site
        paths.push('/');
        break;

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    // Perform revalidation
    const results = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, status: 'success' });
      } catch (error) {
        console.error(`Failed to revalidate ${path}:`, error);
        results.push({ path, status: 'error', error: String(error) });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${paths.length} path(s)`,
      type,
      slug,
      locale,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Revalidation webhook endpoint',
    usage: 'Send POST request with { type, slug?, locale? } and Authorization: Bearer <REVALIDATION_SECRET>',
    types: ['blog', 'project', 'service', 'page', 'settings', 'navigation', 'all'],
    examples: [
      { type: 'blog', slug: 'my-blog-post', locale: 'en' },
      { type: 'project', slug: 'arto-cafe-dubai-mall' },
      { type: 'settings' },
    ],
  });
}
