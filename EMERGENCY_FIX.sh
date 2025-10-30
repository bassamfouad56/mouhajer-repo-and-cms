#!/bin/bash

echo "🔴 EMERGENCY FIX - Killing all Node processes and cleaning up"
echo "============================================================"

# Kill all Node processes
echo "1. Killing all Node processes..."
pkill -9 node 2>/dev/null
pkill -9 next 2>/dev/null
killall -9 node 2>/dev/null
sleep 3

# Clear Next.js cache
echo "2. Clearing Next.js caches..."
rm -rf apps/cms/.next 2>/dev/null
rm -rf apps/frontend/.next 2>/dev/null

# Clear Prisma cache
echo "3. Clearing Prisma cache..."
rm -rf node_modules/@prisma/client 2>/dev/null
rm -rf node_modules/.prisma 2>/dev/null

# Regenerate Prisma client
echo "4. Regenerating Prisma client..."
cd apps/cms
npx prisma generate

echo ""
echo "✅ CLEANUP COMPLETE!"
echo ""
echo "📝 NOW RUN THESE COMMANDS IN SEPARATE TERMINALS:"
echo ""
echo "Terminal 1 - CMS:"
echo "  cd apps/cms"
echo "  npm run dev:cms-only"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd apps/frontend"
echo "  npm run dev"
echo ""
echo "⚠️  Make sure you see: '✅ Generated resolvers' in CMS terminal"
echo ""
