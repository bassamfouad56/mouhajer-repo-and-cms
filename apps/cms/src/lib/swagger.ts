import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mouhajer CMS API Documentation',
      version: '1.0.0',
      description: `
# Mouhajer International Design - CMS API

This is the REST API documentation for the Mouhajer CMS backend.

## Features
- Content Management (Pages, Projects, Services, Blog)
- Media Management with Vercel Blob storage
- CRM and Lead tracking
- User management with role-based access
- Bilingual support (English/Arabic)
- Room Redesign AI features

## Authentication
Most endpoints require authentication via NextAuth.js session cookies.
Protected endpoints return 401 Unauthorized if not authenticated.
Admin-only endpoints require the ADMIN role.

## Bilingual Fields
Many resources support bilingual content with the following structure:
\`\`\`json
{
  "title": {
    "en": "English Title",
    "ar": "العنوان بالعربية"
  },
  "description": {
    "en": "English Description",
    "ar": "الوصف بالعربية"
  }
}
\`\`\`

## GraphQL API
For GraphQL operations, see the GraphQL Playground at \`/api/graphql\`
      `.trim(),
      contact: {
        name: 'Mouhajer International Design',
        url: 'https://mouhajer.com',
      },
      license: {
        name: 'Private',
      },
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Development server',
      },
      {
        url: 'https://cms.mouhajer.com',
        description: 'Production server',
      },
    ],
    tags: [
      { name: 'Authentication', description: 'NextAuth.js authentication endpoints' },
      { name: 'Pages', description: 'Page management endpoints' },
      { name: 'Projects', description: 'Project portfolio management' },
      { name: 'Services', description: 'Service offerings management' },
      { name: 'Blog', description: 'Blog post management' },
      { name: 'Media', description: 'Media file upload and management' },
      { name: 'Navigation', description: 'Site navigation management' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'CRM', description: 'Lead and contact management' },
      { name: 'Ads', description: 'Advertisement management and tracking' },
      { name: 'Room Redesign', description: 'AI room redesign feature endpoints' },
      { name: 'Settings', description: 'Site-wide settings management' },
      { name: 'Activity', description: 'Activity logging and tracking' },
      { name: 'Debug', description: 'Debug and development utilities' },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'authjs.session-token',
          description: 'NextAuth.js session cookie (automatic in browser)',
        },
      },
      schemas: {
        BilingualText: {
          type: 'object',
          properties: {
            en: {
              type: 'string',
              description: 'English text',
            },
            ar: {
              type: 'string',
              description: 'Arabic text',
            },
          },
          example: {
            en: 'Welcome',
            ar: 'مرحبا',
          },
        },
        SEO: {
          type: 'object',
          properties: {
            title: {
              $ref: '#/components/schemas/BilingualText',
            },
            description: {
              $ref: '#/components/schemas/BilingualText',
            },
            keywords: {
              type: 'object',
              properties: {
                en: {
                  type: 'array',
                  items: { type: 'string' },
                },
                ar: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
            ogImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
          },
        },
        Page: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              $ref: '#/components/schemas/BilingualText',
            },
            slug: {
              type: 'string',
            },
            description: {
              $ref: '#/components/schemas/BilingualText',
            },
            seo: {
              $ref: '#/components/schemas/SEO',
            },
            blocks: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            published: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              $ref: '#/components/schemas/BilingualText',
            },
            slug: {
              type: 'string',
            },
            description: {
              $ref: '#/components/schemas/BilingualText',
            },
            category: {
              type: 'string',
            },
            featured: {
              type: 'boolean',
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  url: { type: 'string', format: 'uri' },
                  alt: { $ref: '#/components/schemas/BilingualText' },
                },
              },
            },
            published: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              $ref: '#/components/schemas/BilingualText',
            },
            slug: {
              type: 'string',
            },
            description: {
              $ref: '#/components/schemas/BilingualText',
            },
            features: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { $ref: '#/components/schemas/BilingualText' },
                  description: { $ref: '#/components/schemas/BilingualText' },
                },
              },
            },
            pricing: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
                currency: { type: 'string' },
              },
            },
            duration: {
              $ref: '#/components/schemas/BilingualText',
            },
            location: {
              type: 'string',
            },
            published: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        BlogPost: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              $ref: '#/components/schemas/BilingualText',
            },
            slug: {
              type: 'string',
            },
            excerpt: {
              $ref: '#/components/schemas/BilingualText',
            },
            content: {
              $ref: '#/components/schemas/BilingualText',
            },
            author: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
              },
            },
            categories: {
              type: 'array',
              items: { type: 'string' },
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
            },
            featuredImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            published: {
              type: 'boolean',
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Media: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            url: {
              type: 'string',
              format: 'uri',
            },
            filename: {
              type: 'string',
            },
            mimeType: {
              type: 'string',
            },
            size: {
              type: 'number',
              description: 'File size in bytes',
            },
            width: {
              type: 'number',
              nullable: true,
            },
            height: {
              type: 'number',
              nullable: true,
            },
            alt: {
              $ref: '#/components/schemas/BilingualText',
            },
            caption: {
              $ref: '#/components/schemas/BilingualText',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
            },
            image: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Lead: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            phone: {
              type: 'string',
              nullable: true,
            },
            message: {
              type: 'string',
            },
            source: {
              type: 'string',
              description: 'Where the lead came from',
            },
            status: {
              type: 'string',
              enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
              nullable: true,
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Unauthorized',
              },
            },
          },
        },
        Forbidden: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Forbidden - Admin access required',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Not found',
              },
            },
          },
        },
        BadRequest: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Invalid request data',
              },
            },
          },
        },
      },
    },
    security: [
      {
        sessionAuth: [],
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
