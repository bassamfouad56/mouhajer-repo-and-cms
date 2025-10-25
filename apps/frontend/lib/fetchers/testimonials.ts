import { queryGraphQL } from '../graphql/server-client';

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  commentEn: string;
  commentAr: string | null;
  rating: number;
  projectTitle: string | null;
  projectType: string | null;
  clientImage: string | null;
  projectImage: string | null;
  locale: string;
  featured: boolean;
  published: boolean;
  reviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export async function getTestimonials(
  locale: string = 'en',
  options: {
    featured?: boolean;
    projectType?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<Testimonial[]> {
  const query = `
    query GetTestimonials($filter: TestimonialFilterInput, $limit: Int, $offset: Int) {
      testimonials(filter: $filter, limit: $limit, offset: $offset) {
        id
        name
        role
        company
        commentEn
        commentAr
        rating
        projectTitle
        projectType
        clientImage
        projectImage
        locale
        featured
        published
        reviewDate
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

  if (options.projectType) {
    filter.projectType = options.projectType;
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

    return data.testimonials || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getTestimonial(id: string): Promise<Testimonial | null> {
  const query = `
    query GetTestimonial($id: ID!) {
      testimonial(id: $id) {
        id
        name
        role
        company
        commentEn
        commentAr
        rating
        projectTitle
        projectType
        clientImage
        projectImage
        locale
        featured
        published
        reviewDate
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

    return data.testimonial || null;
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return null;
  }
}

export async function getTestimonialsCount(
  locale: string = 'en',
  options: {
    featured?: boolean;
    projectType?: string;
  } = {}
): Promise<number> {
  const query = `
    query GetTestimonialsCount($filter: TestimonialFilterInput) {
      testimonialsCount(filter: $filter)
    }
  `;

  const filter: any = {
    locale,
    published: true,
  };

  if (options.featured !== undefined) {
    filter.featured = options.featured;
  }

  if (options.projectType) {
    filter.projectType = options.projectType;
  }

  try {
    const data = await queryGraphQL({
      query,
      variables: { filter },
    });

    return data.testimonialsCount || 0;
  } catch (error) {
    console.error('Error fetching testimonials count:', error);
    return 0;
  }
}
