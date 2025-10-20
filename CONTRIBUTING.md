# Contributing Guide

Thank you for your interest in contributing to the Mouhajer project! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone <your-fork-url>
cd mouhajer-monorepo

# Add upstream remote
git remote add upstream <original-repo-url>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

Follow the instructions in [SETUP.md](SETUP.md) to configure your local environment.

### 4. Create a Branch

```bash
# Fetch latest changes
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

---

## Development Workflow

### 1. Make Changes

- Work on your feature/fix in your branch
- Test locally as you develop
- Commit frequently with clear messages

### 2. Keep Your Branch Updated

```bash
# Regularly sync with upstream
git fetch upstream
git rebase upstream/main
```

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Build all apps
npm run build

# Test manually in browser
npm run dev
```

### 4. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 5. Open a Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill out the PR template
- Request review

---

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define types explicitly (avoid `any`)
- Use shared types from `@mouhajer/types`
- Export types for reusability

**Good:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}
```

**Bad:**
```typescript
function getUser(id: any): Promise<any> {
  // ...
}
```

### React Components

- Use functional components
- Use hooks appropriately
- Keep components small and focused
- Extract reusable logic to custom hooks

**Good:**
```typescript
interface ProjectCardProps {
  project: Project;
  onSelect: (id: string) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div onClick={() => onSelect(project.id)}>
      <h3>{project.titleEn}</h3>
    </div>
  );
}
```

### Naming Conventions

- **Components**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useProject.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Types/Interfaces**: PascalCase (`User`, `ProjectFilters`)

### File Structure

```
components/
├── ProjectCard.tsx         # Component
├── ProjectCard.test.tsx    # Tests (future)
└── index.ts                # Barrel export
```

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use semantic class names
- Extract repeated patterns to components

**Good:**
```tsx
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
    Click me
  </button>
</div>
```

### Imports

- Group imports logically
- Use absolute imports where configured
- Order: React → Third-party → Internal

```typescript
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { useProject } from '@/lib/hooks/useProject';
import type { Project } from '@mouhajer/types';
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

### Scopes

- `cms`: CMS-related changes
- `frontend`: Frontend-related changes
- `types`: Type definitions
- `docs`: Documentation
- `config`: Configuration files

### Examples

```bash
feat(cms): add bulk delete for projects

Added functionality to delete multiple projects at once.
Includes confirmation dialog and loading states.

Closes #123

---

fix(frontend): resolve RTL layout issue in Arabic

Fixed text alignment and padding in Arabic (RTL) mode.

Fixes #456

---

docs: update setup instructions for Docker

Added troubleshooting section and clarified port configurations.

---

refactor(cms): extract media upload logic to utility

Moved upload logic from component to lib/blob-upload.ts
for better reusability.

---

chore: upgrade dependencies to latest versions

Updated Next.js from 14.0.3 to 14.2.18 and other deps.
```

### Commit Message Guidelines

- Use imperative mood ("add" not "added")
- Keep subject line under 72 characters
- Capitalize subject line
- No period at end of subject line
- Separate subject from body with blank line
- Wrap body at 72 characters
- Explain *what* and *why*, not *how*

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass (when available)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Title

Follow commit message convention:

```
feat(cms): add project export functionality
fix(frontend): resolve mobile menu overlap
docs: add API documentation for services
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Bullet point list of changes
- Another change
- Yet another change

## Testing
How has this been tested?

## Screenshots (if applicable)
Before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Tests added/updated (if applicable)

## Related Issues
Closes #123
Related to #456
```

### Review Process

1. **Automated Checks**: CI/CD runs linting and builds
2. **Code Review**: At least one approval required
3. **Testing**: Reviewer tests changes locally
4. **Feedback**: Address review comments
5. **Approval**: PR approved by maintainer
6. **Merge**: Squash and merge into main

---

## Testing

### Manual Testing

Always test your changes:

1. **CMS Changes**:
   ```bash
   cd apps/cms
   npm run dev
   # Test in browser at localhost:3010
   ```

2. **Frontend Changes**:
   ```bash
   cd apps/frontend
   npm run dev
   # Test in browser at localhost:3000
   ```

3. **Cross-Browser Testing**:
   - Chrome
   - Firefox
   - Safari
   - Edge

4. **Responsive Testing**:
   - Mobile (320px, 375px, 425px)
   - Tablet (768px, 1024px)
   - Desktop (1440px, 1920px)

5. **i18n Testing**:
   - Test both English and Arabic
   - Verify RTL layout for Arabic
   - Check text overflow

### Automated Testing (Future)

When test infrastructure is added:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Add/modify environment variables
- Change setup/deployment process
- Add new dependencies
- Modify architecture

### Documentation Files

- **README.md**: Project overview, quick start
- **SETUP.md**: Detailed setup instructions
- **ARCHITECTURE.md**: Technical architecture
- **CONTRIBUTING.md**: This file
- **API documentation**: Update GraphQL schema docs
- **Code comments**: Complex logic

### Writing Good Documentation

- Be clear and concise
- Use examples
- Keep it up to date
- Use proper formatting
- Include code snippets
- Add screenshots when helpful

---

## Project-Specific Guidelines

### CMS Development

- Always validate input with Zod
- Log important actions to ActivityLog
- Check user permissions
- Handle errors gracefully
- Return consistent API responses

### Frontend Development

- Use Server Components by default
- Add `'use client'` only when needed
- Optimize images with next/image
- Implement proper loading states
- Handle errors with error boundaries
- Follow i18n best practices

### Database Changes

- Create Prisma migrations
- Never edit migration files directly
- Test migrations locally first
- Update seed data if needed
- Document schema changes

```bash
# Create migration
cd apps/cms
npm run prisma:migrate

# Generate client
npm run prisma:generate

# Test migration
npm run db:push
```

### Shared Types

When adding/modifying types:

```bash
cd packages/types

# Edit src/index.ts
# Add/modify types

# Build types
npm run build

# Types are now available in CMS and Frontend
```

---

## Common Tasks

### Adding a New Content Model

1. Update Prisma schema (`apps/cms/prisma/schema.prisma`)
2. Create migration
3. Add types to `@mouhajer/types`
4. Create GraphQL schema/resolvers
5. Add API routes in CMS
6. Add UI in CMS for management
7. Add data fetching in frontend
8. Update documentation

### Adding a New Page

1. Create page component in `apps/frontend/app/[locale]/your-page/page.tsx`
2. Add translations to `messages/en.json` and `messages/ar.json`
3. Implement data fetching
4. Add to navigation
5. Update sitemap
6. Add SEO metadata
7. Test both locales

### Fixing a Bug

1. Reproduce the bug locally
2. Identify root cause
3. Write a failing test (if tests exist)
4. Fix the bug
5. Verify test passes
6. Test manually
7. Document the fix in PR

---

## Getting Help

- **Documentation**: Check [README.md](README.md), [SETUP.md](SETUP.md), [ARCHITECTURE.md](ARCHITECTURE.md)
- **Issues**: Search existing issues on GitHub
- **Questions**: Open a discussion on GitHub
- **Contact**: admin@mouhajerdesign.com

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing! 🎉**
