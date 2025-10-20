#!/bin/bash

# Sync Script for Mac Mini External Drive
# This script backs up npm cache and project to Mac Mini's LaCie drive

MAC_USER="bassamfouad"
MAC_IP="100.111.21.66"
MAC_DRIVE="/Volumes/LaCie"
PROJECT_NAME="mouhajer-repo-and-cms"

echo "========================================="
echo "Mac Mini Project Sync Tool"
echo "========================================="
echo ""

# Function to sync with rsync
sync_to_mac() {
    local source=$1
    local dest=$2
    local description=$3

    echo "📦 Syncing $description..."
    sshpass -p '123123' rsync -avz --progress \
        --exclude 'node_modules/.cache' \
        --exclude '.next' \
        --exclude 'dist' \
        --exclude 'build' \
        "$source" "${MAC_USER}@${MAC_IP}:${dest}"

    if [ $? -eq 0 ]; then
        echo "✅ $description synced successfully!"
    else
        echo "❌ Failed to sync $description"
        return 1
    fi
    echo ""
}

# Check if sshpass is available
if ! command -v sshpass &> /dev/null; then
    echo "⚠️  sshpass not found. Installing..."
    echo "Please install sshpass:"
    echo "  - Windows (Git Bash): Download from https://sourceforge.net/projects/sshpass/"
    echo "  - Or use: ssh-copy-id ${MAC_USER}@${MAC_IP} for passwordless auth"
    echo ""
    echo "Falling back to regular ssh (will prompt for password)..."
    USE_SSHPASS=false
else
    USE_SSHPASS=true
fi

# Main sync operations
echo "Starting sync operations..."
echo ""

# 1. Sync npm cache from Windows to Mac Mini
echo "1️⃣ Syncing npm cache..."
if [ "$USE_SSHPASS" = true ]; then
    sshpass -p '123123' rsync -avz --progress \
        /c/Users/thegh/AppData/Local/npm-cache/ \
        "${MAC_USER}@${MAC_IP}:${MAC_DRIVE}/npm-cache/"
else
    rsync -avz --progress \
        /c/Users/thegh/AppData/Local/npm-cache/ \
        "${MAC_USER}@${MAC_IP}:${MAC_DRIVE}/npm-cache/"
fi
echo ""

# 2. Sync project files
echo "2️⃣ Syncing project files..."
if [ "$USE_SSHPASS" = true ]; then
    sshpass -p '123123' rsync -avz --progress \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '.next' \
        --exclude 'dist' \
        --exclude 'build' \
        --exclude '.turbo' \
        ./ \
        "${MAC_USER}@${MAC_IP}:${MAC_DRIVE}/Projects/${PROJECT_NAME}/"
else
    rsync -avz --progress \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '.next' \
        --exclude 'dist' \
        --exclude 'build' \
        --exclude '.turbo' \
        ./ \
        "${MAC_USER}@${MAC_IP}:${MAC_DRIVE}/Projects/${PROJECT_NAME}/"
fi
echo ""

# 3. Create a package list for reference
echo "3️⃣ Creating package list..."
npm list --depth=0 > package-list.txt
if [ "$USE_SSHPASS" = true ]; then
    sshpass -p '123123' scp package-list.txt \
        "${MAC_USER}@${MAC_IP}:${MAC_DRIVE}/Projects/${PROJECT_NAME}/"
else
    scp package-list.txt \
        "${MAC_USER}@${MAC_IP}:${MAC_DRIVE}/Projects/${PROJECT_NAME}/"
fi
echo ""

echo "========================================="
echo "✅ Sync Complete!"
echo "========================================="
echo ""
echo "Your project and npm cache have been backed up to:"
echo "  ${MAC_DRIVE}/Projects/${PROJECT_NAME}/"
echo "  ${MAC_DRIVE}/npm-cache/"
echo ""
echo "💡 Next steps:"
echo "  1. SSH into Mac Mini: ssh ${MAC_USER}@${MAC_IP}"
echo "  2. Navigate to: cd ${MAC_DRIVE}/Projects/${PROJECT_NAME}"
echo "  3. Install Node.js on Mac Mini (if not installed)"
echo "  4. Run: npm install (will use cached packages)"
echo ""
