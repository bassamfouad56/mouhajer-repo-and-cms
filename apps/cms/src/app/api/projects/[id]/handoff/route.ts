import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsResponse } from '@/lib/cors';

// GET - Retrieve handoff for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    const handoff = await prisma.projectHandoff.findUnique({
      where: { projectId },
    });

    if (!handoff) {
      return corsResponse(
        { error: 'Handoff not found' },
        { status: 404 }
      );
    }

    return corsResponse(handoff);
  } catch (error) {
    console.error('Error fetching project handoff:', error);
    return corsResponse(
      { error: 'Failed to fetch project handoff' },
      { status: 500 }
    );
  }
}

// POST - Create handoff for a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return corsResponse(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if handoff already exists
    const existingHandoff = await prisma.projectHandoff.findUnique({
      where: { projectId },
    });

    if (existingHandoff) {
      return corsResponse(
        { error: 'Handoff already exists for this project' },
        { status: 400 }
      );
    }

    const handoff = await prisma.projectHandoff.create({
      data: {
        projectId,

        // Step 1: Project Overview
        completionDate: body.completionDate ? new Date(body.completionDate) : null,
        duration: body.duration,
        techStack: body.techStack || [],
        liveUrl: body.liveUrl,
        repositoryUrl: body.repositoryUrl,
        projectHighlightsEn: body.projectHighlightsEn || [],
        projectHighlightsAr: body.projectHighlightsAr || [],

        // Step 2: Problem-Solution-Results
        problemStatementEn: body.problemStatementEn,
        problemStatementAr: body.problemStatementAr,
        solutionApproachEn: body.solutionApproachEn,
        solutionApproachAr: body.solutionApproachAr,
        measurableResults: body.measurableResults || [],
        performanceMetrics: body.performanceMetrics,
        uniqueFeaturesEn: body.uniqueFeaturesEn,
        uniqueFeaturesAr: body.uniqueFeaturesAr,

        // Step 3: Visual Assets
        screenshots: body.screenshots || [],
        beforePhotos: body.beforePhotos || [],
        afterPhotos: body.afterPhotos || [],
        videoLinks: body.videoLinks || [],
        figmaLinks: body.figmaLinks || [],

        // Step 4: Client & Social Proof
        clientName: body.clientName,
        clientCompany: body.clientCompany,
        clientTestimonialEn: body.clientTestimonialEn,
        clientTestimonialAr: body.clientTestimonialAr,
        clientRating: body.clientRating,
        useClientName: body.useClientName || false,
        useClientPhotos: body.useClientPhotos !== false,
        allowReference: body.allowReference || false,
        pressMentions: body.pressMentions || [],
        awards: body.awards || [],
        teamCredits: body.teamCredits || [],

        // Step 5: Marketing Strategy
        targetKeywords: body.targetKeywords || [],
        seoMetaDescEn: body.seoMetaDescEn,
        seoMetaDescAr: body.seoMetaDescAr,
        targetAudience: body.targetAudience || [],
        recommendedPlatforms: body.recommendedPlatforms || [],
        geographicFocus: body.geographicFocus || [],
        keySellingPoints: body.keySellingPoints || [],

        // Workflow
        status: body.status || 'draft',
        submittedBy: body.submittedBy,
        notes: body.notes,
      },
    });

    return corsResponse(handoff, { status: 201 });
  } catch (error) {
    console.error('Error creating project handoff:', error);
    return corsResponse(
      { error: 'Failed to create project handoff' },
      { status: 500 }
    );
  }
}

// PATCH - Update handoff
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();

    const handoff = await prisma.projectHandoff.findUnique({
      where: { projectId },
    });

    if (!handoff) {
      return corsResponse(
        { error: 'Handoff not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Step 1: Project Overview
    if (body.completionDate !== undefined) updateData.completionDate = body.completionDate ? new Date(body.completionDate) : null;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.techStack !== undefined) updateData.techStack = body.techStack;
    if (body.liveUrl !== undefined) updateData.liveUrl = body.liveUrl;
    if (body.repositoryUrl !== undefined) updateData.repositoryUrl = body.repositoryUrl;
    if (body.projectHighlightsEn !== undefined) updateData.projectHighlightsEn = body.projectHighlightsEn;
    if (body.projectHighlightsAr !== undefined) updateData.projectHighlightsAr = body.projectHighlightsAr;

    // Step 2: Problem-Solution-Results
    if (body.problemStatementEn !== undefined) updateData.problemStatementEn = body.problemStatementEn;
    if (body.problemStatementAr !== undefined) updateData.problemStatementAr = body.problemStatementAr;
    if (body.solutionApproachEn !== undefined) updateData.solutionApproachEn = body.solutionApproachEn;
    if (body.solutionApproachAr !== undefined) updateData.solutionApproachAr = body.solutionApproachAr;
    if (body.measurableResults !== undefined) updateData.measurableResults = body.measurableResults;
    if (body.performanceMetrics !== undefined) updateData.performanceMetrics = body.performanceMetrics;
    if (body.uniqueFeaturesEn !== undefined) updateData.uniqueFeaturesEn = body.uniqueFeaturesEn;
    if (body.uniqueFeaturesAr !== undefined) updateData.uniqueFeaturesAr = body.uniqueFeaturesAr;

    // Step 3: Visual Assets
    if (body.screenshots !== undefined) updateData.screenshots = body.screenshots;
    if (body.beforePhotos !== undefined) updateData.beforePhotos = body.beforePhotos;
    if (body.afterPhotos !== undefined) updateData.afterPhotos = body.afterPhotos;
    if (body.videoLinks !== undefined) updateData.videoLinks = body.videoLinks;
    if (body.figmaLinks !== undefined) updateData.figmaLinks = body.figmaLinks;

    // Step 4: Client & Social Proof
    if (body.clientName !== undefined) updateData.clientName = body.clientName;
    if (body.clientCompany !== undefined) updateData.clientCompany = body.clientCompany;
    if (body.clientTestimonialEn !== undefined) updateData.clientTestimonialEn = body.clientTestimonialEn;
    if (body.clientTestimonialAr !== undefined) updateData.clientTestimonialAr = body.clientTestimonialAr;
    if (body.clientRating !== undefined) updateData.clientRating = body.clientRating;
    if (body.useClientName !== undefined) updateData.useClientName = body.useClientName;
    if (body.useClientPhotos !== undefined) updateData.useClientPhotos = body.useClientPhotos;
    if (body.allowReference !== undefined) updateData.allowReference = body.allowReference;
    if (body.pressMentions !== undefined) updateData.pressMentions = body.pressMentions;
    if (body.awards !== undefined) updateData.awards = body.awards;
    if (body.teamCredits !== undefined) updateData.teamCredits = body.teamCredits;

    // Step 5: Marketing Strategy
    if (body.targetKeywords !== undefined) updateData.targetKeywords = body.targetKeywords;
    if (body.seoMetaDescEn !== undefined) updateData.seoMetaDescEn = body.seoMetaDescEn;
    if (body.seoMetaDescAr !== undefined) updateData.seoMetaDescAr = body.seoMetaDescAr;
    if (body.targetAudience !== undefined) updateData.targetAudience = body.targetAudience;
    if (body.recommendedPlatforms !== undefined) updateData.recommendedPlatforms = body.recommendedPlatforms;
    if (body.geographicFocus !== undefined) updateData.geographicFocus = body.geographicFocus;
    if (body.keySellingPoints !== undefined) updateData.keySellingPoints = body.keySellingPoints;

    // Workflow management
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'submitted' && !handoff.submittedAt) {
        updateData.submittedAt = new Date();
        updateData.submittedBy = body.submittedBy;
      }
      if (body.status === 'approved' && !handoff.approvedAt) {
        updateData.approvedAt = new Date();
        updateData.approvedBy = body.approvedBy;
      }
    }

    if (body.notes !== undefined) updateData.notes = body.notes;

    const updatedHandoff = await prisma.projectHandoff.update({
      where: { projectId },
      data: updateData,
    });

    return corsResponse(updatedHandoff);
  } catch (error) {
    console.error('Error updating project handoff:', error);
    return corsResponse(
      { error: 'Failed to update project handoff' },
      { status: 500 }
    );
  }
}
