# PowerShell Script to Sync to Mac Mini External Drive
# This script backs up npm cache and project to Mac Mini's LaCie drive

$MAC_USER = "bassamfouad"
$MAC_IP = "100.111.21.66"
$MAC_DRIVE = "/Volumes/LaCie"
$PROJECT_NAME = "mouhajer-repo-and-cms"
$PASSWORD = "123123"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Mac Mini Project Sync Tool" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Function to execute SSH command
function Invoke-MacSSH {
    param(
        [string]$Command
    )

    # Use plink if available, otherwise fall back to ssh
    if (Get-Command plink -ErrorAction SilentlyContinue) {
        echo $PASSWORD | plink -ssh -batch -pw $PASSWORD "$MAC_USER@$MAC_IP" $Command
    } else {
        ssh "$MAC_USER@$MAC_IP" $Command
    }
}

# Check connection
Write-Host "🔌 Testing connection to Mac Mini..." -ForegroundColor Yellow
try {
    $result = Invoke-MacSSH "echo 'Connected'"
    if ($result -match "Connected") {
        Write-Host "✅ Connected to Mac Mini successfully!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Failed to connect to Mac Mini" -ForegroundColor Red
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "  1. Mac Mini is powered on" -ForegroundColor Yellow
    Write-Host "  2. SSH is enabled" -ForegroundColor Yellow
    Write-Host "  3. Network connection is working" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Create directories on Mac Mini
Write-Host "📁 Creating directories on Mac Mini..." -ForegroundColor Yellow
Invoke-MacSSH "mkdir -p $MAC_DRIVE/npm-cache $MAC_DRIVE/Projects/$PROJECT_NAME"

Write-Host ""
Write-Host "📦 Syncing files..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  For automated sync, please install one of:" -ForegroundColor Yellow
Write-Host "  1. WinSCP: https://winscp.net/" -ForegroundColor Cyan
Write-Host "  2. Git Bash with rsync" -ForegroundColor Cyan
Write-Host "  3. Or use the provided setup-ssh-keys script" -ForegroundColor Cyan
Write-Host ""

# Create a batch file for manual sync
$batchContent = @"
@echo off
echo =========================================
echo Mac Mini Sync - Manual Method
echo =========================================
echo.
echo To sync your files manually:
echo.
echo Option 1: Using WinSCP
echo   1. Download WinSCP from https://winscp.net/
echo   2. Connect to: $MAC_IP
echo   3. Username: $MAC_USER
echo   4. Password: $PASSWORD
echo   5. Drag and drop files to: $MAC_DRIVE/Projects/$PROJECT_NAME/
echo.
echo Option 2: Using SCP (if available)
echo   scp -r * $MAC_USER@$MAC_IP:$MAC_DRIVE/Projects/$PROJECT_NAME/
echo.
echo =========================================
pause
"@

$batchContent | Out-File -FilePath ".\manual-sync-instructions.bat" -Encoding ASCII

Write-Host "✅ Created manual sync instructions: manual-sync-instructions.bat" -ForegroundColor Green
Write-Host ""

# Create package list
Write-Host "📝 Creating package list..." -ForegroundColor Yellow
npm list --depth=0 > package-list.txt
Write-Host "✅ Package list created: package-list.txt" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Set up SSH keys for passwordless access:" -ForegroundColor White
Write-Host "   .\setup-ssh-keys.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "2️⃣  Your npm cache location:" -ForegroundColor White
Write-Host "   $env:LOCALAPPDATA\npm-cache" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣  Your project will be available at:" -ForegroundColor White
Write-Host "   $MAC_DRIVE/Projects/$PROJECT_NAME/" -ForegroundColor Cyan
Write-Host ""
Write-Host "4️⃣  To use the external drive libraries:" -ForegroundColor White
Write-Host "   - SSH into Mac Mini" -ForegroundColor Cyan
Write-Host "   - Install Node.js (if not installed)" -ForegroundColor Cyan
Write-Host "   - Run: npm install (will download to local node_modules)" -ForegroundColor Cyan
Write-Host ""
