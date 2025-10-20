# Swagger API Documentation Guide

## Overview

The Mouhajer CMS API is now documented using Swagger/OpenAPI 3.0 specification. This allows for interactive API exploration and testing through a web interface.

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:

**Development:** [http://localhost:3010/api/docs](http://localhost:3010/api/docs)

**Production:** `https://your-domain.com/api/docs`

## Documentation Structure

### 1. Configuration File
Location: `src/lib/swagger.ts`

This file contains:
- OpenAPI 3.0 configuration
- Server definitions (dev/prod)
- Common schemas and components
- Security definitions
- Reusable response templates

### 2. API Routes
Individual route files contain JSDoc comments with OpenAPI annotations.

### 3. Swagger UI Routes
- **UI Page:** `src/app/api/docs/page.tsx` - The Swagger UI interface
- **JSON Endpoint:** `src/app/api/docs/swagger.json/route.ts` - OpenAPI spec JSON

## Adding Documentation to New Endpoints

When creating or updating API endpoints, add JSDoc comments with Swagger annotations:

### Example: GET Endpoint

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Short description
 *     description: Detailed description of what this endpoint does
 *     tags: [YourTag]
 *     security: []  # Use [] for public endpoints
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  // Your code here
}
```

### Example: POST Endpoint (Protected)

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Create new resource
 *     description: Creates a new resource (Admin only)
 *     tags: [YourTag]
 *     security:
 *       - sessionAuth: []  # Requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *               - field2
 *             properties:
 *               field1:
 *                 type: string
 *               field2:
 *                 $ref: '#/components/schemas/BilingualText'
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export async function POST(request: NextRequest) {
  // Your code here
}
```

## Common Schemas

The following schemas are pre-defined and can be referenced using `$ref`:

### Bilingual Content
```yaml
$ref: '#/components/schemas/BilingualText'
```

Use this for fields that support English and Arabic:
```json
{
  "en": "English text",
  "ar": "النص العربي"
}
```

### Available Schemas
- `BilingualText` - Bilingual text fields (en/ar)
- `SEO` - SEO metadata with bilingual support
- `Page` - Page object with blocks and SEO
- `Project` - Project with images and categories
- `Service` - Service with features and pricing
- `BlogPost` - Blog post with author and categories
- `Media` - Media file metadata
- `User` - User object with role
- `Lead` - CRM lead object
- `Error` - Standard error response

### Common Responses
- `Unauthorized` - 401 response
- `Forbidden` - 403 response
- `NotFound` - 404 response
- `BadRequest` - 400 response

## Tags

Organize endpoints using these tags:
- `Authentication` - Auth endpoints
- `Pages` - Page management
- `Projects` - Project portfolio
- `Services` - Service offerings
- `Blog` - Blog posts
- `Media` - Media files
- `Navigation` - Navigation management
- `Users` - User management
- `CRM` - Lead/contact management
- `Ads` - Advertisement tracking
- `Room Redesign` - AI features
- `Settings` - Site settings
- `Activity` - Activity logs
- `Debug` - Debug utilities

## Security

### Public Endpoints
Use `security: []` for endpoints that don't require authentication:
```yaml
security: []
```

### Protected Endpoints
Use `sessionAuth` for endpoints requiring authentication:
```yaml
security:
  - sessionAuth: []
```

## Best Practices

1. **Always document new endpoints** - Add JSDoc annotations when creating routes
2. **Use existing schemas** - Reference common schemas instead of redefining
3. **Be descriptive** - Write clear summaries and descriptions
4. **Include examples** - Add example request/response bodies when helpful
5. **Document errors** - List all possible error responses
6. **Use proper HTTP codes** - 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
7. **Tag appropriately** - Use consistent tags for grouping

## Testing the Documentation

After adding documentation:

1. Start the development server:
   ```bash
   npm run dev:cms-only
   ```

2. Navigate to [http://localhost:3010/api/docs](http://localhost:3010/api/docs)

3. Verify your endpoint appears in the correct tag group

4. Test the endpoint using the "Try it out" feature in Swagger UI

## Updating Schemas

To add new reusable schemas, edit `src/lib/swagger.ts` in the `components.schemas` section:

```typescript
components: {
  schemas: {
    YourNewSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        // ... more properties
      },
    },
  },
}
```

## Troubleshooting

### Swagger UI not loading
- Check that the server is running
- Verify the URL `/api/docs/swagger.json` returns valid JSON
- Check browser console for errors

### Endpoint not showing
- Ensure JSDoc comments use `@swagger` tag
- Check the file path matches the pattern in `swagger.ts`
- Restart the dev server after adding new documentation

### Syntax errors in annotations
- Validate YAML indentation in JSDoc comments
- Ensure schema references exist in `swagger.ts`
- Check for missing commas or colons

## Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc Swagger Plugin](https://github.com/Surnet/swagger-jsdoc)

## Example Endpoints

See these files for complete examples:
- [src/app/api/pages/route.ts](src/app/api/pages/route.ts) - GET and POST with bilingual content
- [src/app/api/projects/route.ts](src/app/api/projects/route.ts) - Filtering and pagination
- [src/app/api/media/upload/route.ts](src/app/api/media/upload/route.ts) - File upload with multipart/form-data
