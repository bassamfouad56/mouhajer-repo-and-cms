import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.title?.en) updateData.titleEn = body.title.en;
    if (body.title?.ar) updateData.titleAr = body.title.ar;
    if (body.slug?.en) updateData.slugEn = body.slug.en;
    if (body.slug?.ar) updateData.slugAr = body.slug.ar;
    if (body.excerpt?.en !== undefined) updateData.excerptEn = body.excerpt.en;
    if (body.excerpt?.ar !== undefined) updateData.excerptAr = body.excerpt.ar;
    if (body.content?.en) updateData.contentEn = body.content.en;
    if (body.content?.ar) updateData.contentAr = body.content.ar;
    if (body.featuredImage !== undefined) updateData.featuredImage = body.featuredImage;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.author) updateData.author = body.author;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.status) {
      updateData.status = body.status;
      // Set publishedAt when changing to published status
      if (body.status === 'published' && !body.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (body.publishedAt !== undefined) {
      updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    // Transform to match expected format
    const transformedPost = {
      id: updatedPost.id,
      title: {
        en: updatedPost.titleEn,
        ar: updatedPost.titleAr,
      },
      slug: {
        en: updatedPost.slugEn,
        ar: updatedPost.slugAr,
      },
      excerpt: {
        en: updatedPost.excerptEn,
        ar: updatedPost.excerptAr,
      },
      content: {
        en: updatedPost.contentEn,
        ar: updatedPost.contentAr,
      },
      featuredImage: updatedPost.featuredImage,
      category: updatedPost.category,
      tags: updatedPost.tags,
      author: updatedPost.author,
      publishedAt: updatedPost.publishedAt?.toISOString() || null,
      featured: updatedPost.featured,
      status: updatedPost.status,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
