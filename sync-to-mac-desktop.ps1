# PowerShell Script to Sync Project to Mac Mini Desktop
# Excludes images and build artifacts

$MAC_USER = "bassamfouad"
$MAC_IP = "100.111.21.66"
$PROJECT_PATH = "d:\wbsite\mouhajer-repo-and-cms"
$TARGET_PATH = "Desktop/website/mouhajer-repo-and-cms"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Syncing to Mac Mini Desktop" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create directory structure on Mac Mini
Write-Host "📁 Creating directory structure on Mac Mini..." -ForegroundColor Yellow
ssh ${MAC_USER}@${MAC_IP} "mkdir -p ${TARGET_PATH}"
Write-Host "✅ Directory created" -ForegroundColor Green
Write-Host ""

# Step 2: Get list of files to sync (excluding images and build artifacts)
Write-Host "📋 Preparing file list..." -ForegroundColor Yellow

$excludePatterns = @(
    '\.next',
    'node_modules',
    'dist',
    'build',
    '\.turbo',
    '\.git',
    '\.jpg$',
    '\.jpeg$',
    '\.png$',
    '\.gif$',
    '\.webp$',
    '\.svg$',
    '\.ico$',
    '\.avif$',
    '\.bmp$',
    '\.tiff$',
    'public\\uploads',
    'public\\images',
    'public\\media',
    'assets\\images'
)

# Step 3: Sync using SCP for each directory
Write-Host "🚀 Starting file transfer..." -ForegroundColor Yellow
Write-Host ""

# Core files to sync
$itemsToSync = @(
    "package.json",
    "package-lock.json",
    "turbo.json",
    "tsconfig.json",
    "*.md",
    "apps\frontend",
    "apps\cms",
    "packages"
)

Write-Host "⚠️  Note: Using SCP to transfer files." -ForegroundColor Yellow
Write-Host "This may take several minutes depending on project size..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Recommended: Use rsync for faster syncing:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  If you have Git Bash or WSL installed, run:" -ForegroundColor White
Write-Host ""
Write-Host '  rsync -avz --progress \' -ForegroundColor Yellow
Write-Host '    --exclude="node_modules/" \' -ForegroundColor Yellow
Write-Host '    --exclude=".next/" \' -ForegroundColor Yellow
Write-Host '    --exclude="dist/" \' -ForegroundColor Yellow
Write-Host '    --exclude="build/" \' -ForegroundColor Yellow
Write-Host '    --exclude=".turbo/" \' -ForegroundColor Yellow
Write-Host '    --exclude="*.jpg" \' -ForegroundColor Yellow
Write-Host '    --exclude="*.jpeg" \' -ForegroundColor Yellow
Write-Host '    --exclude="*.png" \' -ForegroundColor Yellow
Write-Host '    --exclude="*.gif" \' -ForegroundColor Yellow
Write-Host '    --exclude="*.webp" \' -ForegroundColor Yellow
Write-Host '    --exclude="*.svg" \' -ForegroundColor Yellow
Write-Host '    --exclude="public/uploads/" \' -ForegroundColor Yellow
Write-Host '    --exclude="public/images/" \' -ForegroundColor Yellow
Write-Host '    --exclude=".git/" \' -ForegroundColor Yellow
Write-Host '    "d:/wbsite/mouhajer-repo-and-cms/" \' -ForegroundColor Yellow
Write-Host '    bassamfouad@100.111.21.66:~/Desktop/website/mouhajer-repo-and-cms/' -ForegroundColor Yellow
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Would you like to continue with SCP method? (slower)" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to cancel and use rsync instead" -ForegroundColor Yellow
pause

# SCP transfer for root files
Write-Host "Transferring root configuration files..." -ForegroundColor Cyan
scp "${PROJECT_PATH}\package.json" "${MAC_USER}@${MAC_IP}:${TARGET_PATH}/"
scp "${PROJECT_PATH}\package-lock.json" "${MAC_USER}@${MAC_IP}:${TARGET_PATH}/"
scp "${PROJECT_PATH}\turbo.json" "${MAC_USER}@${MAC_IP}:${TARGET_PATH}/"

Write-Host ""
Write-Host "⚠️  For apps/frontend and apps/cms directories," -ForegroundColor Yellow
Write-Host "please use rsync command shown above for efficiency." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Basic configuration files transferred!" -ForegroundColor Green
