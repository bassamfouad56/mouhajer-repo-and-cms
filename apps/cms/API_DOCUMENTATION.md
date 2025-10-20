# 📡 Mouhajer CMS - API Documentation

Complete API reference for the Mouhajer CMS with endpoints, authentication, and data structures.

## 🌐 Base URL

```
Production: https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app
Development: http://localhost:3010
```

## 🔐 Authentication

The CMS uses NextAuth.js for authentication. Most endpoints require authentication.

### Login

**Endpoint:** `POST /api/auth/signin`

**Public:** Yes (no auth required)

**Request Body:**
```json
{
  "email": "admin@mouhajerdesign.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@mouhajerdesign.com",
    "role": "admin"
  },
  "session": {
    "expires": "2025-11-08T10:00:00.000Z"
  }
}
```

### Logout

**Endpoint:** `POST /api/auth/signout`

**Authentication:** Required

---

## 👥 Users API

### Get All Users

**Endpoint:** `GET /api/users`

**Authentication:** Required (Admin only)

**Response:**
```json
[
  {
    "id": "cm3ummke30000x4cwo43caqss",
    "name": "Admin User",
    "email": "admin@mouhajerdesign.com",
    "role": "admin",
    "active": true,
    "avatar": null,
    "lastLoginAt": "2025-10-08T10:00:00.000Z",
    "createdAt": "2025-10-08T09:00:00.000Z"
  }
]
```

### Create User

**Endpoint:** `POST /api/users`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "editor"
}
```

**Response:**
```json
{
  "id": "new_user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "editor",
  "active": true,
  "createdAt": "2025-10-08T10:00:00.000Z"
}
```

### Update User

**Endpoint:** `PATCH /api/users/[id]`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin",
  "active": true,
  "password": "newpassword" // optional
}
```

### Delete User

**Endpoint:** `DELETE /api/users/[id]`

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true
}
```

---

## 📦 Projects API

### Get All Projects

**Endpoint:** `GET /api/projects`

**Authentication:** Optional (public read)

**Response:**
```json
[
  {
    "id": "cm3ummkf00001x4cwmthfbkqq",
    "title": {
      "en": "Modern Villa Design",
      "ar": "تصميم فيلا حديثة"
    },
    "description": {
      "en": "Luxurious modern villa with contemporary architecture",
      "ar": "فيلا حديثة فاخرة بطراز معماري عصري"
    },
    "images": [
      "https://blob.vercel-storage.com/image1.jpg",
      "https://blob.vercel-storage.com/image2.jpg"
    ],
    "category": "residential",
    "featured": true,
    "seo": {
      "en": {
        "title": "Modern Villa Design",
        "description": "Luxurious modern villa",
        "keywords": ["villa", "modern", "design"]
      },
      "ar": {
        "title": "تصميم فيلا حديثة",
        "description": "فيلا حديثة فاخرة",
        "keywords": ["فيلا", "حديث", "تصميم"]
      }
    },
    "createdAt": "2025-10-08T09:00:00.000Z",
    "updatedAt": "2025-10-08T09:00:00.000Z"
  }
]
```

### Get Single Project

**Endpoint:** `GET /api/projects/[id]`

**Authentication:** Optional (public read)

### Create Project

**Endpoint:** `POST /api/projects`

**Authentication:** Required (Editor or Admin)

**Request Body:**
```json
{
  "title": {
    "en": "New Project",
    "ar": "مشروع جديد"
  },
  "description": {
    "en": "Project description",
    "ar": "وصف المشروع"
  },
  "images": ["url1", "url2"],
  "category": "residential",
  "featured": false,
  "seo": {
    "en": {
      "title": "SEO Title",
      "description": "SEO Description",
      "keywords": ["keyword1", "keyword2"]
    },
    "ar": {
      "title": "عنوان SEO",
      "description": "وصف SEO",
      "keywords": ["كلمة1", "كلمة2"]
    }
  }
}
```

### Update Project

**Endpoint:** `PUT /api/projects/[id]`

**Authentication:** Required (Editor or Admin)

**Request Body:** Same as Create Project

### Delete Project

**Endpoint:** `DELETE /api/projects/[id]`

**Authentication:** Required (Editor or Admin)

---

## 🛠️ Services API

### Get All Services

**Endpoint:** `GET /api/services`

**Authentication:** Optional (public read)

**Response:**
```json
[
  {
    "id": "cm3ummkf30002x4cwl6i72p4o",
    "title": {
      "en": "Interior Design",
      "ar": "التصميم الداخلي"
    },
    "description": {
      "en": "Complete interior design solutions",
      "ar": "حلول التصميم الداخلي المتكاملة"
    },
    "shortDescription": {
      "en": "Professional interior design",
      "ar": "تصميم داخلي احترافي"
    },
    "icon": "interior-design-icon",
    "images": ["url1", "url2"],
    "features": {
      "en": ["Feature 1", "Feature 2"],
      "ar": ["ميزة 1", "ميزة 2"]
    },
    "price": "Contact for quote",
    "featured": true,
    "seo": {
      "en": { /* SEO data */ },
      "ar": { /* SEO data */ }
    },
    "createdAt": "2025-10-08T09:00:00.000Z",
    "updatedAt": "2025-10-08T09:00:00.000Z"
  }
]
```

### Create Service

**Endpoint:** `POST /api/services`

**Authentication:** Required (Editor or Admin)

**Request Body:**
```json
{
  "title": {
    "en": "Service Name",
    "ar": "اسم الخدمة"
  },
  "description": {
    "en": "Full description",
    "ar": "الوصف الكامل"
  },
  "shortDescription": {
    "en": "Brief description",
    "ar": "وصف مختصر"
  },
  "icon": "icon-name",
  "images": ["url1"],
  "features": {
    "en": ["Feature 1", "Feature 2"],
    "ar": ["ميزة 1", "ميزة 2"]
  },
  "price": "Starting at $500",
  "featured": false
}
```

### Update Service

**Endpoint:** `PUT /api/services/[id]`

**Authentication:** Required (Editor or Admin)

### Delete Service

**Endpoint:** `DELETE /api/services/[id]`

**Authentication:** Required (Editor or Admin)

---

## 📝 Blog API

### Get All Blog Posts

**Endpoint:** `GET /api/blog`

**Authentication:** Optional (public read)

**Query Parameters:**
- `status` - Filter by status (published/draft)
- `category` - Filter by category
- `featured` - Filter featured posts (true/false)

**Response:**
```json
[
  {
    "id": "cm3ummkf50003x4cw9w1lqbxi",
    "title": {
      "en": "Design Trends 2025",
      "ar": "اتجاهات التصميم 2025"
    },
    "slug": {
      "en": "design-trends-2025",
      "ar": "اتجاهات-التصميم-2025"
    },
    "excerpt": {
      "en": "Discover the latest design trends",
      "ar": "اكتشف أحدث اتجاهات التصميم"
    },
    "content": {
      "en": "Full article content...",
      "ar": "محتوى المقال الكامل..."
    },
    "featuredImage": "https://blob.vercel-storage.com/image.jpg",
    "category": "design",
    "tags": ["design", "trends", "2025"],
    "author": "Admin User",
    "publishedAt": "2025-10-08T09:00:00.000Z",
    "featured": true,
    "status": "published",
    "seo": {
      "en": { /* SEO data */ },
      "ar": { /* SEO data */ }
    },
    "createdAt": "2025-10-08T09:00:00.000Z",
    "updatedAt": "2025-10-08T09:00:00.000Z"
  }
]
```

### Get Single Blog Post

**Endpoint:** `GET /api/blog/[id]`

**Authentication:** Optional (public read)

### Create Blog Post

**Endpoint:** `POST /api/blog`

**Authentication:** Required (Editor or Admin)

**Request Body:**
```json
{
  "title": {
    "en": "Post Title",
    "ar": "عنوان المقال"
  },
  "slug": {
    "en": "post-title",
    "ar": "عنوان-المقال"
  },
  "excerpt": {
    "en": "Short excerpt",
    "ar": "مقتطف قصير"
  },
  "content": {
    "en": "Full content...",
    "ar": "المحتوى الكامل..."
  },
  "featuredImage": "image_url",
  "category": "design",
  "tags": ["tag1", "tag2"],
  "author": "Author Name",
  "publishedAt": "2025-10-08T09:00:00.000Z",
  "featured": false,
  "status": "published"
}
```

### Update Blog Post

**Endpoint:** `PUT /api/blog/[id]`

**Authentication:** Required (Editor or Admin)

### Delete Blog Post

**Endpoint:** `DELETE /api/blog/[id]`

**Authentication:** Required (Editor or Admin)

---

## 📄 Pages API

### Get All Pages

**Endpoint:** `GET /api/pages`

**Authentication:** Optional (public read)

**Response:**
```json
[
  {
    "id": "cm3ummkf70004x4cw5h7uo8mn",
    "title": {
      "en": "About Us",
      "ar": "من نحن"
    },
    "slug": {
      "en": "about-us",
      "ar": "من-نحن"
    },
    "blocks": [
      {
        "id": "block1",
        "type": "hero",
        "order": 0,
        "content": {
          "en": {
            "title": "Welcome",
            "subtitle": "To our company",
            "image": "hero_image_url"
          },
          "ar": {
            "title": "مرحبا",
            "subtitle": "في شركتنا",
            "image": "hero_image_url"
          }
        }
      },
      {
        "id": "block2",
        "type": "text",
        "order": 1,
        "content": {
          "en": {
            "text": "About us content..."
          },
          "ar": {
            "text": "محتوى من نحن..."
          }
        }
      }
    ],
    "status": "published",
    "seo": {
      "en": { /* SEO data */ },
      "ar": { /* SEO data */ }
    },
    "createdAt": "2025-10-08T09:00:00.000Z",
    "updatedAt": "2025-10-08T09:00:00.000Z"
  }
]
```

### Get Single Page

**Endpoint:** `GET /api/pages/[id]`

**Authentication:** Optional (public read)

### Create Page

**Endpoint:** `POST /api/pages`

**Authentication:** Required (Editor or Admin)

### Update Page

**Endpoint:** `PUT /api/pages/[id]`

**Authentication:** Required (Editor or Admin)

### Delete Page

**Endpoint:** `DELETE /api/pages/[id]`

**Authentication:** Required (Editor or Admin)

---

## 🖼️ Media API

### Get All Media

**Endpoint:** `GET /api/media`

**Authentication:** Optional (public read)

**Response:**
```json
[
  {
    "id": "media_id",
    "name": "image.jpg",
    "originalName": "my-image.jpg",
    "url": "https://blob.vercel-storage.com/xxxxx.jpg",
    "thumbnailUrl": "https://blob.vercel-storage.com/xxxxx-thumb.jpg",
    "type": "image",
    "size": 1024000,
    "width": 1920,
    "height": 1080,
    "alt": "Image description",
    "caption": "Image caption",
    "uploadedAt": "2025-10-08T09:00:00.000Z",
    "uploadedBy": "user_id"
  }
]
```

### Upload Media

**Endpoint:** `POST /api/media/upload`

**Authentication:** Required (Editor or Admin)

**Content-Type:** `multipart/form-data`

**Request:**
```javascript
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('alt', 'Image alt text');
formData.append('caption', 'Image caption');

fetch('/api/media/upload', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "id": "new_media_id",
  "url": "https://blob.vercel-storage.com/file.jpg",
  "thumbnailUrl": "https://blob.vercel-storage.com/file-thumb.jpg",
  "name": "file.jpg",
  "type": "image",
  "size": 1024000
}
```

### Update Media

**Endpoint:** `PATCH /api/media/[id]`

**Authentication:** Required (Editor or Admin)

**Request Body:**
```json
{
  "alt": "Updated alt text",
  "caption": "Updated caption"
}
```

### Delete Media

**Endpoint:** `DELETE /api/media/[id]`

**Authentication:** Required (Editor or Admin)

---

## 📢 Advertisements API

### Get All Ads

**Endpoint:** `GET /api/ads`

**Authentication:** Optional (public read)

**Query Parameters:**
- `active` - Filter by status (true/false)
- `type` - Filter by type (banner/popup/sidebar)

**Response:**
```json
[
  {
    "id": "ad_id",
    "title": "Ad Title",
    "content": {
      "en": "Ad content",
      "ar": "محتوى الإعلان"
    },
    "imageUrl": "ad_image_url",
    "link": "https://example.com",
    "type": "banner",
    "position": "home-top",
    "startDate": "2025-10-01T00:00:00.000Z",
    "endDate": "2025-10-31T23:59:59.000Z",
    "active": true,
    "impressions": 1000,
    "clicks": 50,
    "createdAt": "2025-10-08T09:00:00.000Z"
  }
]
```

### Create Ad

**Endpoint:** `POST /api/ads`

**Authentication:** Required (Admin only)

### Update Ad

**Endpoint:** `PUT /api/ads/[id]`

**Authentication:** Required (Admin only)

### Delete Ad

**Endpoint:** `DELETE /api/ads/[id]`

**Authentication:** Required (Admin only)

### Track Ad Click

**Endpoint:** `POST /api/ads/[id]/track`

**Authentication:** Not required (public)

---

## ⚙️ Settings API

### Get Settings

**Endpoint:** `GET /api/settings`

**Authentication:** Optional (public read)

**Response:**
```json
{
  "id": "settings_id",
  "siteName": {
    "en": "Mouhajer Design",
    "ar": "تصاميم مهاجر"
  },
  "siteDescription": {
    "en": "International Design Studio",
    "ar": "استوديو تصميم دولي"
  },
  "logo": "logo_url",
  "favicon": "favicon_url",
  "contactEmail": "contact@mouhajerdesign.com",
  "contactPhone": "+1234567890",
  "socialMedia": {
    "facebook": "https://facebook.com/mouhajer",
    "instagram": "https://instagram.com/mouhajer",
    "twitter": "https://twitter.com/mouhajer",
    "linkedin": "https://linkedin.com/company/mouhajer"
  },
  "analytics": {
    "googleAnalyticsId": "GA-XXXXXX",
    "facebookPixelId": "FB-XXXXXX"
  },
  "seo": {
    "en": {
      "defaultTitle": "Mouhajer Design",
      "defaultDescription": "International Design Studio"
    },
    "ar": {
      "defaultTitle": "تصاميم مهاجر",
      "defaultDescription": "استوديو تصميم دولي"
    }
  },
  "maintenanceMode": false,
  "updatedAt": "2025-10-08T09:00:00.000Z"
}
```

### Update Settings

**Endpoint:** `PUT /api/settings`

**Authentication:** Required (Admin only)

---

## 📊 Activity Log API

### Get Activity Logs

**Endpoint:** `GET /api/activity`

**Authentication:** Required

**Query Parameters:**
- `action` - Filter by action (create/update/delete/login)
- `resource` - Filter by resource (user/project/service/blog/etc)
- `userId` - Filter by user ID
- `limit` - Limit results (default: 50, max: 100)

**Response:**
```json
[
  {
    "id": "log_id",
    "userId": "user_id",
    "action": "create",
    "resource": "project",
    "resourceId": "project_id",
    "details": {
      "title": "New Project"
    },
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2025-10-08T09:00:00.000Z",
    "user": {
      "name": "Admin User",
      "email": "admin@mouhajerdesign.com"
    }
  }
]
```

---

## 📋 Data Structures

### User Object
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
  avatar?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Bilingual Content
```typescript
interface BilingualContent {
  en: string;
  ar: string;
}
```

### SEO Object
```typescript
interface SEO {
  en: {
    title: string;
    description: string;
    keywords: string[];
  };
  ar: {
    title: string;
    description: string;
    keywords: string[];
  };
}
```

### Project Object
```typescript
interface Project {
  id: string;
  title: BilingualContent;
  description: BilingualContent;
  images: string[];
  category: string;
  featured: boolean;
  seo: SEO;
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Object
```typescript
interface Service {
  id: string;
  title: BilingualContent;
  description: BilingualContent;
  shortDescription: BilingualContent;
  icon: string;
  images: string[];
  features: {
    en: string[];
    ar: string[];
  };
  price: string;
  featured: boolean;
  seo: SEO;
  createdAt: Date;
  updatedAt: Date;
}
```

### Blog Post Object
```typescript
interface BlogPost {
  id: string;
  title: BilingualContent;
  slug: BilingualContent;
  excerpt: BilingualContent;
  content: BilingualContent;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: Date;
  featured: boolean;
  status: 'draft' | 'published';
  seo: SEO;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔒 Authentication Headers

For authenticated requests, include the session cookie automatically set by NextAuth.

**Cookie-based Authentication:**
```javascript
fetch('/api/users', {
  credentials: 'include' // Important for cookies
});
```

---

## 🌍 CORS Configuration

The API supports CORS for frontend integration:

**Allowed Origins:**
- `http://localhost:3000` (development)
- Your production frontend URL

**Allowed Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS

**Allowed Headers:** Content-Type, Authorization

---

## 📝 Example Usage

### Frontend Integration (React/Next.js)

```typescript
// lib/cms-client.ts
const CMS_URL = 'https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app';

export const cmsClient = {
  // Get all projects
  async getProjects() {
    const res = await fetch(`${CMS_URL}/api/projects`);
    return res.json();
  },

  // Get single project
  async getProject(id: string) {
    const res = await fetch(`${CMS_URL}/api/projects/${id}`);
    return res.json();
  },

  // Get all blog posts
  async getBlogPosts(status = 'published') {
    const res = await fetch(`${CMS_URL}/api/blog?status=${status}`);
    return res.json();
  },

  // Get settings
  async getSettings() {
    const res = await fetch(`${CMS_URL}/api/settings`);
    return res.json();
  }
};

// Usage in component
const projects = await cmsClient.getProjects();
```

---

## 🔧 Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

---

## 📊 Rate Limits

Currently no rate limits enforced. Consider implementing rate limiting for production use.

---

**Last Updated:** October 8, 2025
**API Version:** 1.0.0
**Base URL:** https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app
