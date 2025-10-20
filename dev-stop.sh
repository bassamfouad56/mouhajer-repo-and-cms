#!/bin/bash

# Stop Development Services Script

echo "🛑 Stopping Mouhajer Development Environment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Try to read PIDs from file first
if [ -f .dev-pids ]; then
    source .dev-pids

    if [ ! -z "$CMS_PID" ]; then
        echo -e "${YELLOW}Stopping CMS (PID: $CMS_PID)...${NC}"
        kill $CMS_PID 2>/dev/null
        echo -e "${GREEN}✓ CMS stopped${NC}"
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        echo -e "${YELLOW}Stopping Frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    fi

    rm .dev-pids
fi

# Also kill by port just to be sure
echo -e "${YELLOW}Cleaning up ports...${NC}"
lsof -ti :3010 | xargs kill -9 2>/dev/null
lsof -ti :3000 | xargs kill -9 2>/dev/null

echo ""
echo -e "${GREEN}✅ All services stopped!${NC}"
echo ""
