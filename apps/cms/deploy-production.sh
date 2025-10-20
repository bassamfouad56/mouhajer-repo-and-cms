#!/bin/bash

# Mouhajer CMS - Production Deployment Script
# This script sets up environment variables and deploys to Vercel

set -e  # Exit on error

echo "🚀 Mouhajer CMS - Production Deployment"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Generate NEXTAUTH_SECRET if not provided
NEXTAUTH_SECRET="8TeB6RUo1UN1FMguZ1AOy0XFJptnkjmJo3DLb+fUwKg="
PRODUCTION_URL="https://mouhajer-cms.vercel.app"

echo -e "${BLUE}Step 1: Checking environment variables${NC}"
echo "----------------------------------------"

# Check if NEXTAUTH variables exist
if vercel env ls | grep -q "NEXTAUTH_SECRET"; then
    echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET already exists${NC}"
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel env rm NEXTAUTH_SECRET production --yes 2>/dev/null || true
        vercel env rm NEXTAUTH_SECRET preview --yes 2>/dev/null || true
        vercel env rm NEXTAUTH_SECRET development --yes 2>/dev/null || true
        echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development
        echo -e "${GREEN}✓ NEXTAUTH_SECRET updated${NC}"
    fi
else
    echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development
    echo -e "${GREEN}✓ NEXTAUTH_SECRET added${NC}"
fi

# Check if BLOB_READ_WRITE_TOKEN exists
if vercel env ls | grep -q "BLOB_READ_WRITE_TOKEN"; then
    echo -e "${GREEN}✓ BLOB_READ_WRITE_TOKEN already configured${NC}"
else
    if vercel env ls | grep -q "storage_READ_WRITE_TOKEN"; then
        echo -e "${YELLOW}⚠️  Found storage_READ_WRITE_TOKEN, you may need to add BLOB_READ_WRITE_TOKEN${NC}"
        echo "Please add it manually:"
        echo "  vercel env add BLOB_READ_WRITE_TOKEN"
    fi
fi

# Add NEXTAUTH_URL
if vercel env ls | grep -q "NEXTAUTH_URL"; then
    echo -e "${YELLOW}⚠️  NEXTAUTH_URL already exists${NC}"
    read -p "Do you want to update it to $PRODUCTION_URL? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel env rm NEXTAUTH_URL production --yes 2>/dev/null || true
        vercel env rm NEXTAUTH_URL preview --yes 2>/dev/null || true
        vercel env rm NEXTAUTH_URL development --yes 2>/dev/null || true
        echo "$PRODUCTION_URL" | vercel env add NEXTAUTH_URL production
        echo "http://localhost:3010" | vercel env add NEXTAUTH_URL development
        echo -e "${GREEN}✓ NEXTAUTH_URL updated${NC}"
    fi
else
    echo "$PRODUCTION_URL" | vercel env add NEXTAUTH_URL production
    echo "http://localhost:3010" | vercel env add NEXTAUTH_URL development
    echo -e "${GREEN}✓ NEXTAUTH_URL added${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Building for production${NC}"
echo "----------------------------------------"
npm run build
echo -e "${GREEN}✓ Build successful${NC}"

echo ""
echo -e "${BLUE}Step 3: Deploying to Vercel${NC}"
echo "----------------------------------------"
vercel --prod

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Post-Deployment Steps${NC}"
echo ""
echo "1. Initialize the database:"
echo "   ${BLUE}npm run db:push${NC}"
echo "   ${BLUE}npm run db:seed${NC}"
echo ""
echo "2. Visit your CMS:"
echo "   ${BLUE}$PRODUCTION_URL${NC}"
echo ""
echo "3. Login with default credentials:"
echo "   Email: ${BLUE}admin@mouhajerdesign.com${NC}"
echo "   Password: ${BLUE}admin123${NC}"
echo ""
echo "4. ${RED}IMMEDIATELY change the admin password!${NC}"
echo ""
echo "5. Check the deployment:"
echo "   ${BLUE}vercel logs${NC}"
echo ""
echo -e "${GREEN}Happy content managing! 🎉${NC}"
