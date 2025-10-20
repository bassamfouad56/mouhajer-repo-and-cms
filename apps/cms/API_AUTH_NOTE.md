# API Authentication - Important Note

## ⚠️ Cookie-Based Authentication

The Mouhajer CMS uses **NextAuth.js** with **HTTP-only cookies** for authentication.

### Why Credentials Don't Work Directly

The API does **NOT** support:
- ❌ Basic Auth headers
- ❌ Bearer tokens
- ❌ API keys
- ❌ Direct username/password on each request

### How to Authenticate

**Step 1: Login via Browser or POST request**
```bash
curl -X POST https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mouhajerdesign.com","password":"admin123","redirect":false}' \
  -c cookies.txt
```

**Step 2: Use the session cookie**
```bash
curl https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app/api/users \
  -b cookies.txt
```

### For Frontend (React/Next.js)

```typescript
// Login first
await fetch('/api/auth/callback/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@mouhajerdesign.com',
    password: 'admin123',
    redirect: false
  }),
  credentials: 'include' // Important!
});

// Then make API calls (cookie automatically included)
const users = await fetch('/api/users', {
  credentials: 'include' // Important!
}).then(r => r.json());
```

### Test Credentials

**Admin (Full Access):**
- Email: `admin@mouhajerdesign.com`
- Password: `admin123`

**Editor (Content Only):**
- Email: `editor@mouhajerdesign.com`
- Password: `editor123`

**⚠️ Change these passwords after first login in production!**

### Public Endpoints (No Auth Required)

These endpoints can be accessed without authentication:
- `GET /api/projects`
- `GET /api/projects/[id]`
- `GET /api/services`
- `GET /api/services/[id]`
- `GET /api/blog`
- `GET /api/blog/[id]`
- `GET /api/pages`
- `GET /api/pages/[id]`
- `GET /api/media`
- `GET /api/settings`

All other endpoints (POST, PUT, DELETE, /users, /activity) require authentication.
