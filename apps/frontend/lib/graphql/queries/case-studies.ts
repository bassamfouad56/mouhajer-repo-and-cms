import { gql } from '@apollo/client';

export const GET_CASE_STUDIES = gql`
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

export const GET_CASE_STUDY = gql`
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

export const GET_CASE_STUDIES_BY_PROJECT_TYPE = gql`
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

export const GET_CASE_STUDIES_COUNT = gql`
  query GetCaseStudiesCount($filter: CaseStudyFilterInput) {
    caseStudiesCount(filter: $filter)
  }
`;
