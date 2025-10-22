import { gql } from '@apollo/client';

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($filter: TeamMemberFilterInput, $limit: Int, $offset: Int) {
    teamMembers(filter: $filter, limit: $limit, offset: $offset) {
      id
      nameEn
      nameAr
      roleEn
      roleAr
      bioEn
      bioAr
      specialties
      yearsExperience
      department
      profileImage
      email
      linkedin
      order
      locale
      featured
      published
      joinedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_TEAM_MEMBER = gql`
  query GetTeamMember($id: ID!) {
    teamMember(id: $id) {
      id
      nameEn
      nameAr
      roleEn
      roleAr
      bioEn
      bioAr
      specialties
      yearsExperience
      department
      profileImage
      email
      linkedin
      order
      locale
      featured
      published
      joinedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_TEAM_MEMBERS_BY_DEPARTMENT = gql`
  query GetTeamMembersByDepartment($department: String!, $locale: String) {
    teamMembersByDepartment(department: $department, locale: $locale) {
      id
      nameEn
      nameAr
      roleEn
      roleAr
      bioEn
      bioAr
      specialties
      yearsExperience
      department
      profileImage
      email
      linkedin
      featured
      createdAt
    }
  }
`;

export const GET_TEAM_MEMBERS_COUNT = gql`
  query GetTeamMembersCount($filter: TeamMemberFilterInput) {
    teamMembersCount(filter: $filter)
  }
`;
