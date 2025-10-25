#!/bin/bash

# Fix Prisma imports in all API routes
# Replaces: new PrismaClient() with singleton import

FILES=(
  "src/app/api/google-ads/metrics/route.ts"
  "src/app/api/google-ads/accounts/route.ts"
  "src/app/api/google-ads/accounts/[id]/route.ts"
  "src/app/api/google-ads/sync/route.ts"
  "src/app/api/room-redesign/verify/route.ts"
  "src/app/api/room-redesign/image/[id]/[type]/route.ts"
  "src/app/api/room-redesign/upload/route.ts"
  "src/app/api/search-console/queries/route.ts"
  "src/app/api/search-console/properties/route.ts"
  "src/app/api/search-console/performance/route.ts"
  "src/app/api/search-console/pages/route.ts"
  "src/app/api/ga4/metrics/route.ts"
  "src/app/api/ga4/realtime/route.ts"
  "src/app/api/ga4/traffic-sources/route.ts"
  "src/app/api/gtm/accounts/route.ts"
  "src/app/api/gtm/accounts/[id]/route.ts"
  "src/app/api/gtm/containers/[id]/route.ts"
  "src/app/api/gtm/sync/route.ts"
  "src/app/api/analytics/overview/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."

    # Create a temporary file
    temp_file=$(mktemp)

    # Process the file
    awk '
      /^import \{ PrismaClient \} from/ {
        print "import { prisma } from '\''@/lib/prisma'\'';"
        next
      }
      /^const prisma = new PrismaClient\(\);?$/ {
        next
      }
      { print }
    ' "$file" > "$temp_file"

    # Replace original file
    mv "$temp_file" "$file"

    echo "✓ Fixed $file"
  else
    echo "✗ File not found: $file"
  fi
done

echo ""
echo "✅ All files fixed!"
