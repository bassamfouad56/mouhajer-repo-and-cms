import { queryGraphQL } from '../graphql/server-client';

export interface CaseStudy {
  id: string;
  titleEn: string;
  titleAr?: string;
  summaryEn: string;
  summaryAr?: string;
  clientName?: string;
  clientType?: string;
  showClientName: boolean;
  projectType: string;
  location?: string;
  projectSize?: string;
  completionDate?: string;
  duration?: string;
  challengeEn: string;
  challengeAr?: string;
  solutionEn: string;
  solutionAr?: string;
  resultsEn: string;
  resultsAr?: string;
  heroImage?: string;
  beforeImages: string[];
  afterImages: string[];
  gallery: string[];
  videoUrl?: string;
  features: string[];
  stylesTags: string[];
  budget?: number;
  budgetSaved?: number;
  timelineMet: boolean;
  clientSatisfaction?: number;
  teamMembers: string[];
  contractors: string[];
  keywords: string[];
  tags: string[];
  order: number;
  locale: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyFilterInput {
  locale?: string;
  projectType?: string;
  featured?: boolean;
  published?: boolean;
}

export interface GetCaseStudiesOptions {
  filter?: CaseStudyFilterInput;
  limit?: number;
  offset?: number;
}

export async function getCaseStudies(
  locale: string = 'en',
  options?: GetCaseStudiesOptions
): Promise<CaseStudy[]> {
  const query = `
    query GetCaseStudies($filter: CaseStudyFilterInput, $limit: Int, $offset: Int) {
      caseStudies(filter: $filter, limit: $limit, offset: $offset) {
        id
        titleEn
        titleAr
        summaryEn
        summaryAr
        clientName
        clientType
        showClientName
        projectType
        location
        projectSize
        completionDate
        duration
        challengeEn
        challengeAr
        solutionEn
        solutionAr
        resultsEn
        resultsAr
        heroImage
        beforeImages
        afterImages
        gallery
        videoUrl
        features
        stylesTags
        budget
        budgetSaved
        timelineMet
        clientSatisfaction
        teamMembers
        contractors
        keywords
        tags
        order
        locale
        featured
        published
        createdAt
        updatedAt
      }
    }
  `;

  // Build filter with default published: true
  const filter: CaseStudyFilterInput = {
    locale,
    published: true,
    ...options?.filter,
  };

  try {
    const data = await queryGraphQL({
      query,
      variables: {
        filter,
        limit: options?.limit || 20,
        offset: options?.offset || 0,
      },
    });

    return data.caseStudies || [];
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  const query = `
    query GetCaseStudy($id: ID!) {
      caseStudy(id: $id) {
        id
        titleEn
        titleAr
        summaryEn
        summaryAr
        clientName
        clientType
        showClientName
        projectType
        location
        projectSize
        completionDate
        duration
        challengeEn
        challengeAr
        solutionEn
        solutionAr
        resultsEn
        resultsAr
        heroImage
        beforeImages
        afterImages
        gallery
        videoUrl
        features
        stylesTags
        budget
        budgetSaved
        timelineMet
        clientSatisfaction
        teamMembers
        contractors
        keywords
        tags
        order
        locale
        featured
        published
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const data = await queryGraphQL({
      query,
      variables: { id },
    });

    return data.caseStudy || null;
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
}

export async function getCaseStudiesByProjectType(
  projectType: string,
  locale: string = 'en'
): Promise<CaseStudy[]> {
  const query = `
    query GetCaseStudiesByProjectType($projectType: String!, $locale: String) {
      caseStudiesByProjectType(projectType: $projectType, locale: $locale) {
        id
        titleEn
        titleAr
        summaryEn
        summaryAr
        projectType
        location
        completionDate
        heroImage
        beforeImages
        afterImages
        features
        clientSatisfaction
        stylesTags
        budget
        featured
        published
      }
    }
  `;

  try {
    const data = await queryGraphQL({
      query,
      variables: { projectType, locale },
    });

    return data.caseStudiesByProjectType || [];
  } catch (error) {
    console.error('Error fetching case studies by project type:', error);
    return [];
  }
}

export async function getCaseStudiesCount(
  filter?: CaseStudyFilterInput
): Promise<number> {
  const query = `
    query GetCaseStudiesCount($filter: CaseStudyFilterInput) {
      caseStudiesCount(filter: $filter)
    }
  `;

  try {
    const data = await queryGraphQL({
      query,
      variables: { filter },
    });

    return data.caseStudiesCount || 0;
  } catch (error) {
    console.error('Error fetching case studies count:', error);
    return 0;
  }
}
