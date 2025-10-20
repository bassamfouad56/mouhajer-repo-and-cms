#!/bin/bash
# Sync script for Git Bash
# Run this with: "C:\Program Files\Git\usr\bin\bash.exe" sync-files.sh

MAC_USER="bassamfouad"
MAC_IP="100.111.21.66"
PROJECT_PATH="/d/wbsite/mouhajer-repo-and-cms"
TARGET_PATH="~/Desktop/website/mouhajer-repo-and-cms"

echo "========================================="
echo "Syncing to Mac Mini Desktop"
echo "========================================="
echo ""

# Create directory on Mac Mini
echo "📁 Creating directory structure on Mac Mini..."
ssh ${MAC_USER}@${MAC_IP} "mkdir -p ${TARGET_PATH}"
echo "✅ Directory created"
echo ""

# Sync files using rsync
echo "🚀 Starting rsync transfer..."
echo "Excluding: images, node_modules, build artifacts"
echo ""

rsync -avz --progress \
  --exclude='node_modules/' \
  --exclude='.next/' \
  --exclude='dist/' \
  --exclude='build/' \
  --exclude='.turbo/' \
  --exclude='*.jpg' \
  --exclude='*.jpeg' \
  --exclude='*.png' \
  --exclude='*.gif' \
  --exclude='*.webp' \
  --exclude='*.svg' \
  --exclude='*.ico' \
  --exclude='*.avif' \
  --exclude='*.bmp' \
  --exclude='*.tiff' \
  --exclude='*.tif' \
  --exclude='*.heic' \
  --exclude='*.heif' \
  --exclude='*.mp4' \
  --exclude='*.mov' \
  --exclude='*.avi' \
  --exclude='*.mkv' \
  --exclude='public/uploads/' \
  --exclude='public/images/' \
  --exclude='public/media/' \
  --exclude='assets/images/' \
  --exclude='.git/' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --exclude='.env.local' \
  "${PROJECT_PATH}/" \
  ${MAC_USER}@${MAC_IP}:"${TARGET_PATH}/"

echo ""
echo "✅ Sync complete!"
echo ""
echo "Files synced to: ${TARGET_PATH}"
echo ""
echo "========================================="
echo "Next steps on Mac Mini:"
echo "========================================="
echo "1. SSH into your Mac Mini:"
echo "   ssh ${MAC_USER}@${MAC_IP}"
echo ""
echo "2. Navigate to project:"
echo "   cd ${TARGET_PATH}"
echo ""
echo "3. Install dependencies:"
echo "   npm install"
echo ""
echo "4. Copy .env.local file manually if needed"
echo ""
echo "5. Start development servers:"
echo "   npm run dev"
echo ""
