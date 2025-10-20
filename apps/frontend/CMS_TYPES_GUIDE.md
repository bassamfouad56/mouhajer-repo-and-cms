# CMS Types Guide

## Overview

This guide documents TypeScript types for Mouhajer CMS integration. All types are in lib/cms-types.ts.

## Core Types

### BilingualContent


### Project


### BlogPost


### Service


## Migration from ACF

### OLD ACF (DEPRECATED - DO NOT USE)


### NEW CMS (USE THIS)


## Usage Examples

### Component Example


### Best Practices
1. Always import types from lib/cms-types
2. Use optional chaining for nullable fields
3. Provide fallback values for images
4. Use locale-aware rendering
5. Format dates consistently

## See Also
- lib/cms-types.ts - Type definitions
- lib/cms-client.ts - API client
- mouhajer-cms/prisma/schema.prisma - Database schema