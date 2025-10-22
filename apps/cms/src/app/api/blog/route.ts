import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsResponse } from '@/lib/cors';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const where: any = {};
    if (featured) where.featured = true;
    if (status) where.status = status;
    if (category) where.category = category;

    const posts = await prisma.blogPost.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match expected format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: {
        en: post.titleEn,
        ar: post.titleAr,
      },
      slug: {
        en: post.slugEn,
        ar: post.slugAr,
      },
      excerpt: {
        en: post.excerptEn,
        ar: post.excerptAr,
      },
      content: {
        en: post.contentEn,
        ar: post.contentAr,
      },
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: post.author,
      publishedAt: post.publishedAt?.toISOString() || null,
      featured: post.featured,
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return corsResponse(transformedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return corsResponse(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return corsResponse(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title?.en || !body.title?.ar) {
      return corsResponse(
        { error: 'Title in both English and Arabic is required' },
        { status: 400 }
      );
    }

    if (!body.slug?.en || !body.slug?.ar) {
      return corsResponse(
        { error: 'Slug in both English and Arabic is required' },
        { status: 400 }
      );
    }

    if (!body.content?.en || !body.content?.ar) {
      return corsResponse(
        { error: 'Content in both English and Arabic is required' },
        { status: 400 }
      );
    }

    if (!body.author) {
      return corsResponse(
        { error: 'Author is required' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        titleEn: body.title.en,
        titleAr: body.title.ar,
        slugEn: body.slug.en,
        slugAr: body.slug.ar,
        excerptEn: body.excerpt?.en || '',
        excerptAr: body.excerpt?.ar || '',
        contentEn: body.content.en,
        contentAr: body.content.ar,
        featuredImage: body.featuredImage || null,
        category: body.category || null,
        tags: body.tags || [],
        author: body.author,
        publishedAt: body.status === 'published' ? new Date() : null,
        featured: body.featured || false,
        status: body.status || 'draft',
      },
    });

    // Transform to match expected format
    const transformedPost = {
      id: post.id,
      title: {
        en: post.titleEn,
        ar: post.titleAr,
      },
      slug: {
        en: post.slugEn,
        ar: post.slugAr,
      },
      excerpt: {
        en: post.excerptEn,
        ar: post.excerptAr,
      },
      content: {
        en: post.contentEn,
        ar: post.contentAr,
      },
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: post.author,
      publishedAt: post.publishedAt?.toISOString() || null,
      featured: post.featured,
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    return corsResponse(transformedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return corsResponse(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
