#!/bin/bash

# AI Image Generation Feature Setup Script
# This script helps set up the AI image generation feature

set -e

echo "=================================="
echo "MIDC AI Image Generation Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
pnpm add resend
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Check environment variables
echo -e "${YELLOW}Step 2: Checking environment variables...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
    echo -e "${YELLOW}⚠ Please edit .env.local and add your credentials:${NC}"
    echo "  - OLLAMA_BASE_URL"
    echo "  - COMFYUI_BASE_URL"
    echo "  - RESEND_API_KEY"
    echo "  - Sanity credentials"
    echo ""
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
fi
echo ""

# Step 3: Test Mac Mini connectivity
echo -e "${YELLOW}Step 3: Testing Mac Mini connectivity...${NC}"
MAC_MINI_IP="100.111.21.66"

if ping -c 1 $MAC_MINI_IP &> /dev/null; then
    echo -e "${GREEN}✓ Mac Mini is reachable at $MAC_MINI_IP${NC}"
else
    echo -e "${RED}✗ Cannot reach Mac Mini at $MAC_MINI_IP${NC}"
    echo -e "${YELLOW}Please ensure Mac Mini is powered on and connected to the network${NC}"
fi
echo ""

# Step 4: Test Ollama
echo -e "${YELLOW}Step 4: Testing Ollama service...${NC}"
if curl -s "http://$MAC_MINI_IP:11434/api/tags" &> /dev/null; then
    echo -e "${GREEN}✓ Ollama is running${NC}"

    # Check for required models
    echo "  Checking for required models..."
    if curl -s "http://$MAC_MINI_IP:11434/api/tags" | grep -q "llama3"; then
        echo -e "  ${GREEN}✓ llama3 model found${NC}"
    else
        echo -e "  ${YELLOW}⚠ llama3 model not found${NC}"
        echo "    Run: ssh bassamfouad@$MAC_MINI_IP 'ollama pull llama3'"
    fi

    if curl -s "http://$MAC_MINI_IP:11434/api/tags" | grep -q "llava"; then
        echo -e "  ${GREEN}✓ llava model found${NC}"
    else
        echo -e "  ${YELLOW}⚠ llava model not found${NC}"
        echo "    Run: ssh bassamfouad@$MAC_MINI_IP 'ollama pull llava'"
    fi
else
    echo -e "${RED}✗ Ollama is not running${NC}"
    echo -e "${YELLOW}Start Ollama on Mac Mini:${NC}"
    echo "  ssh bassamfouad@$MAC_MINI_IP"
    echo "  OLLAMA_HOST=0.0.0.0:11434 ollama serve"
fi
echo ""

# Step 5: Test ComfyUI
echo -e "${YELLOW}Step 5: Testing ComfyUI service...${NC}"
if curl -s "http://$MAC_MINI_IP:8188/system_stats" &> /dev/null; then
    echo -e "${GREEN}✓ ComfyUI is running${NC}"
else
    echo -e "${RED}✗ ComfyUI is not running${NC}"
    echo -e "${YELLOW}Start ComfyUI on Mac Mini:${NC}"
    echo "  ssh bassamfouad@$MAC_MINI_IP"
    echo "  cd /Volumes/LLM_DATA/ComfyUI"
    echo "  python main.py --listen 0.0.0.0 --port 8188"
fi
echo ""

# Step 6: Check external drive
echo -e "${YELLOW}Step 6: Checking external drive storage...${NC}"
if ssh bassamfouad@$MAC_MINI_IP "[ -d /Volumes/LLM_DATA ]" 2>/dev/null; then
    echo -e "${GREEN}✓ External drive is mounted${NC}"

    # Check if AI images directory exists
    if ssh bassamfouad@$MAC_MINI_IP "[ -d /Volumes/LLM_DATA/ai-generated-images ]" 2>/dev/null; then
        echo -e "  ${GREEN}✓ AI images directory exists${NC}"
    else
        echo -e "  ${YELLOW}⚠ Creating AI images directory...${NC}"
        ssh bassamfouad@$MAC_MINI_IP "mkdir -p /Volumes/LLM_DATA/ai-generated-images"
        echo -e "  ${GREEN}✓ Directory created${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Cannot verify external drive (SSH not configured or drive not mounted)${NC}"
fi
echo ""

# Step 7: Deploy Sanity schema
echo -e "${YELLOW}Step 7: Deploying Sanity schema...${NC}"
echo -e "${YELLOW}You need to manually deploy the Sanity schema:${NC}"
echo "  npx sanity deploy"
echo "  or run: pnpm run deploy:sanity (if configured)"
echo ""

# Step 8: Summary
echo "=================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Deploy Sanity schema: npx sanity deploy"
echo "3. Start development server: pnpm run dev"
echo "4. Test the AI feature at: http://localhost:3000"
echo ""
echo "Documentation:"
echo "- Setup Guide: docs/AI_IMAGE_GENERATION_SETUP.md"
echo "- Feature Summary: docs/AI_FEATURE_SUMMARY.md"
echo ""
echo "Health check endpoint:"
echo "- curl http://localhost:3000/api/ai/generate-image"
echo ""
