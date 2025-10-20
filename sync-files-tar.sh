#!/bin/bash
# Sync script using tar+ssh (works without rsync)
# Run this with: "C:\Program Files\Git\usr\bin\bash.exe" sync-files-tar.sh

MAC_USER="bassamfouad"
MAC_IP="100.111.21.66"
PROJECT_PATH="/d/wbsite/mouhajer-repo-and-cms"
TARGET_PATH="~/Desktop/website/mouhajer-repo-and-cms"

echo "========================================="
echo "Syncing to Mac Mini Desktop (using tar)"
echo "========================================="
echo ""

# Create directory on Mac Mini
echo "📁 Creating directory structure on Mac Mini..."
ssh ${MAC_USER}@${MAC_IP} "mkdir -p ${TARGET_PATH}"
echo "✅ Directory created"
echo ""

# Create tar archive excluding images and build artifacts, then pipe to Mac Mini
echo "🚀 Starting transfer..."
echo "Packaging and transferring files..."
echo ""

cd "${PROJECT_PATH}"

tar czf - \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='build' \
  --exclude='.turbo' \
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
  --exclude='public/uploads' \
  --exclude='public/images' \
  --exclude='public/media' \
  --exclude='assets/images' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --exclude='.env.local' \
  . | ssh ${MAC_USER}@${MAC_IP} "cd ${TARGET_PATH} && tar xzf -"

if [ $? -eq 0 ]; then
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
else
  echo ""
  echo "❌ Sync failed!"
  echo "Please check your SSH connection and try again."
  exit 1
fi
