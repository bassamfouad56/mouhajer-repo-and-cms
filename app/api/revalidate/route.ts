/**
 * Revalidation Webhook for Sanity
 *
 * Triggered by Sanity webhooks to revalidate specific pages when content changes
 * Setup in Sanity Studio: Settings > API > Webhooks
 *
 * Webhook URL: https://your-domain.com/api/revalidate
 * Include the secret in the webhook body
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify the webhook secret
    const secret = request.headers.get('x-sanity-webhook-secret');
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Get the document type and slug from the webhook payload
    const { _type, slug } = body;

    // Revalidate based on document type
    switch (_type) {
      case 'project':
        // Revalidate project pages
        revalidatePath('/[locale]/projects');
        if (slug?.current) {
          revalidatePath(`/[locale]/projects/${slug.current}`);
        }
        // Also revalidate homepage which shows featured projects
        revalidatePath('/[locale]');
        break;

      case 'service':
        // Revalidate service pages
        revalidatePath('/[locale]/services');
        if (slug?.current) {
          revalidatePath(`/[locale]/services/${slug.current}`);
        }
        revalidatePath('/[locale]');
        break;

      case 'industry':
        // Revalidate industry pages
        revalidatePath('/[locale]/industries');
        if (slug?.current) {
          revalidatePath(`/[locale]/industries/${slug.current}`);
        }
        revalidatePath('/[locale]');
        break;

      case 'post':
        // Revalidate blog pages
        revalidatePath('/[locale]/blog');
        if (slug?.current) {
          revalidatePath(`/[locale]/blog/${slug.current}`);
        }
        break;

      case 'client':
        // Revalidate pages showing clients
        revalidatePath('/[locale]'); // Homepage shows partner logos
        revalidatePath('/[locale]/about');
        revalidatePath('/[locale]/about/clients');
        revalidateTag('clients');
        break;

      case 'testimonial':
        // Revalidate pages showing testimonials
        revalidatePath('/[locale]'); // Homepage may show testimonials
        revalidatePath('/[locale]/about');
        revalidatePath('/[locale]/about/clients');
        revalidateTag('testimonials');
        break;

      case 'lead':
        // Leads don't need page revalidation
        // Just log for monitoring
        console.log('New lead received:', body.email);
        break;

      default:
        // Revalidate homepage for any other changes
        revalidatePath('/[locale]');
        // Also revalidate with tags if available
        if (_type) {
          revalidateTag(_type);
        }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      slug: slug?.current,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path,
    });
  }

  return NextResponse.json(
    { message: 'Missing path parameter' },
    { status: 400 }
  );
}
