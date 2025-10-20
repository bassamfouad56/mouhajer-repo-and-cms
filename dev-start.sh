#!/bin/bash

# Development Startup Script
# Automatically sets up Prisma and starts both CMS and Frontend

echo "🚀 Starting Mouhajer Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Push Prisma Schema
echo -e "${BLUE}📦 Step 1: Syncing Prisma Schema...${NC}"
cd apps/cms
npx prisma db push --accept-data-loss
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma schema synced${NC}"
else
    echo -e "${YELLOW}⚠ Prisma sync failed, but continuing...${NC}"
fi
echo ""

# Step 2: Generate Prisma Client
echo -e "${BLUE}🔧 Step 2: Generating Prisma Client...${NC}"
npx prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo -e "${YELLOW}⚠ Prisma generation failed, but continuing...${NC}"
fi
echo ""

# Go back to root
cd ../..

# Step 3: Kill any existing processes on ports 3010 and 3000
echo -e "${BLUE}🧹 Step 3: Cleaning up existing processes...${NC}"
lsof -ti :3010 | xargs kill -9 2>/dev/null
lsof -ti :3000 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✓ Ports cleaned${NC}"
echo ""

# Step 4: Start CMS (Backend)
echo -e "${BLUE}🎨 Step 4: Starting CMS on port 3010...${NC}"
cd apps/cms
npm run dev:cms-only > ../../logs/cms.log 2>&1 &
CMS_PID=$!
echo -e "${GREEN}✓ CMS starting (PID: $CMS_PID)${NC}"
cd ../..
echo ""

# Wait a moment for CMS to initialize
sleep 3

# Step 5: Start Frontend
echo -e "${BLUE}🌐 Step 5: Starting Frontend on port 3000...${NC}"
cd apps/frontend
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend starting (PID: $FRONTEND_PID)${NC}"
cd ../..
echo ""

# Step 6: Summary
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Development Environment Ready! ✨${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📍 Services:${NC}"
echo -e "   CMS:      ${YELLOW}http://localhost:3010${NC}"
echo -e "   Frontend: ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo -e "   CMS:      ${YELLOW}tail -f logs/cms.log${NC}"
echo -e "   Frontend: ${YELLOW}tail -f logs/frontend.log${NC}"
echo ""
echo -e "${BLUE}🛑 To stop all services:${NC}"
echo -e "   Run: ${YELLOW}./dev-stop.sh${NC}"
echo -e "   Or:  ${YELLOW}kill $CMS_PID $FRONTEND_PID${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""

# Save PIDs to file for easy stopping
echo "CMS_PID=$CMS_PID" > .dev-pids
echo "FRONTEND_PID=$FRONTEND_PID" >> .dev-pids
