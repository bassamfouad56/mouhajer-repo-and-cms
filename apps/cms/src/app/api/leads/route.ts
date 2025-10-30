import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendLeadEmails } from '@/lib/email';

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      company,
      projectType,
      service,
      budgetRange,
      budget,
      projectLocation,
      city,
      area,
      timeline,
      startDate,
      message,
      projectDescription,
      source = 'website',
      locale = 'en',
    } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Check for duplicate lead (same email or phone within last 24 hours)
    if (email || phone) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const existingLead = await prisma.lead.findFirst({
        where: {
          OR: [
            email ? { email } : {},
            { phone },
          ],
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
      });

      if (existingLead) {
        return NextResponse.json(
          {
            message: 'Lead already exists',
            leadId: existingLead.id,
            duplicate: true,
          },
          { status: 200 }
        );
      }
    }

    // Calculate lead score based on available information
    let score = 50; // Base score
    if (email) score += 10;
    if (company) score += 5;
    if (budgetRange || budget) score += 15;
    if (projectType) score += 10;
    if (city || area || projectLocation) score += 10;

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone,
        companyName: company || null,
        source,
        status: 'new',
        score,
        projectType: projectType || service || 'general_inquiry',
        budgetRange: budgetRange || budget || null,
        timeline: timeline || startDate || null,
        city: city || projectLocation || null,
        area: area || null,
        message: message || projectDescription || null,
        qualified: score >= 70,
        locale,
      },
    });

    // Send email notifications (non-blocking - don't wait for email to complete)
    sendLeadEmails({
      name,
      email,
      phone,
      company,
      projectType: projectType || service,
      service,
      projectLocation: projectLocation || city,
      budget: budgetRange || budget,
      timeline: timeline || startDate,
      message: message || projectDescription,
      locale,
    }).catch((error) => {
      console.error('[Leads API] Failed to send emails:', error);
      // Don't fail the request if email fails
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Lead created successfully',
        leadId: lead.id,
        score: lead.score,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/leads - Get all leads with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const qualified = searchParams.get('qualified');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (source) where.source = source;
    if (qualified !== null && qualified !== undefined) {
      where.qualified = qualified === 'true';
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          companyName: true,
          source: true,
          status: true,
          score: true,
          projectType: true,
          budgetRange: true,
          city: true,
          qualified: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
