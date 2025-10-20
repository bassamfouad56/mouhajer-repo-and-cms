import { queryGraphQL } from '../graphql/server-client';

export interface TeamMember {
  id: string;
  nameEn: string;
  nameAr: string | null;
  roleEn: string;
  roleAr: string | null;
  bioEn: string;
  bioAr: string | null;
  specialties: string[];
  yearsExperience: number | null;
  department: string | null;
  profileImage: string | null;
  email: string | null;
  linkedin: string | null;
  order: number;
  locale: string;
  featured: boolean;
  published: boolean;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getTeamMembers(
  locale: string = 'en',
  options: {
    featured?: boolean;
    department?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<TeamMember[]> {
  const query = `
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

  const filter: any = {
    locale,
    published: true,
  };

  if (options.featured !== undefined) {
    filter.featured = options.featured;
  }

  if (options.department) {
    filter.department = options.department;
  }

  try {
    const data = await queryGraphQL({
      query,
      variables: {
        filter,
        limit: options.limit || 20,
        offset: options.offset || 0,
      },
    });

    return data.teamMembers || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  const query = `
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

  try {
    const data = await queryGraphQL({
      query,
      variables: { id },
    });

    return data.teamMember || null;
  } catch (error) {
    console.error('Error fetching team member:', error);
    return null;
  }
}

export async function getTeamMembersCount(
  locale: string = 'en',
  options: {
    featured?: boolean;
    department?: string;
  } = {}
): Promise<number> {
  const query = `
    query GetTeamMembersCount($filter: TeamMemberFilterInput) {
      teamMembersCount(filter: $filter)
    }
  `;

  const filter: any = {
    locale,
    published: true,
  };

  if (options.featured !== undefined) {
    filter.featured = options.featured;
  }

  if (options.department) {
    filter.department = options.department;
  }

  try {
    const data = await queryGraphQL({
      query,
      variables: { filter },
    });

    return data.teamMembersCount || 0;
  } catch (error) {
    console.error('Error fetching team members count:', error);
    return 0;
  }
}
