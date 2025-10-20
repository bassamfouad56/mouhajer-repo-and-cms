# PowerShell Script to Setup SSH Keys for Passwordless Mac Mini Access

$MAC_USER = "bassamfouad"
$MAC_IP = "100.111.21.66"
$PASSWORD = "123123"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "SSH Key Setup for Mac Mini" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if SSH key exists
$sshKeyPath = "$env:USERPROFILE\.ssh\id_rsa"
$sshPubKeyPath = "$sshKeyPath.pub"

if (Test-Path $sshKeyPath) {
    Write-Host "✅ SSH key already exists at: $sshKeyPath" -ForegroundColor Green
} else {
    Write-Host "🔑 Generating new SSH key..." -ForegroundColor Yellow
    ssh-keygen -t rsa -b 4096 -f $sshKeyPath -N '""' -C "windows-to-mac-mini"

    if (Test-Path $sshKeyPath) {
        Write-Host "✅ SSH key generated successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to generate SSH key" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📋 Your public key:" -ForegroundColor Yellow
Get-Content $sshPubKeyPath
Write-Host ""

# Instructions for manual setup
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Manual Setup Instructions" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To complete the setup, you need to copy your public key to the Mac Mini:" -ForegroundColor White
Write-Host ""
Write-Host "Method 1: Automated (requires ssh-copy-id)" -ForegroundColor Yellow
Write-Host "  ssh-copy-id -i $sshPubKeyPath $MAC_USER@$MAC_IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "Method 2: Manual" -ForegroundColor Yellow
Write-Host "  1. SSH into Mac Mini: ssh $MAC_USER@$MAC_IP" -ForegroundColor Cyan
Write-Host "  2. Create .ssh directory: mkdir -p ~/.ssh && chmod 700 ~/.ssh" -ForegroundColor Cyan
Write-Host "  3. Edit authorized_keys: nano ~/.ssh/authorized_keys" -ForegroundColor Cyan
Write-Host "  4. Paste the public key shown above" -ForegroundColor Cyan
Write-Host "  5. Save and exit (Ctrl+X, then Y, then Enter)" -ForegroundColor Cyan
Write-Host "  6. Set permissions: chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Cyan
Write-Host ""

# Try automated method
Write-Host "Attempting automated setup..." -ForegroundColor Yellow
Write-Host ""

# Create a temporary script for SSH key copy
$tempScript = @"
#!/bin/bash
# Get the public key content
PUB_KEY=`$(cat "$sshPubKeyPath")

# SSH into Mac Mini and append the key
sshpass -p '$PASSWORD' ssh -o StrictHostKeyChecking=no $MAC_USER@$MAC_IP "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PUB_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'SSH key installed successfully!'"
"@

# For Git Bash users
if (Test-Path "C:\Program Files\Git\bin\bash.exe") {
    Write-Host "Git Bash detected, attempting automatic key copy..." -ForegroundColor Yellow

    # Read the public key
    $pubKey = Get-Content $sshPubKeyPath -Raw
    $pubKey = $pubKey.Trim()

    # Try to copy the key (will prompt for password)
    Write-Host ""
    Write-Host "Please enter the password when prompted..." -ForegroundColor Yellow

    $sshCommand = @"
mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$pubKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'Key added successfully!'
"@

    ssh "$MAC_USER@$MAC_IP" $sshCommand

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SSH key installed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Testing passwordless connection..." -ForegroundColor Yellow
        $testResult = ssh "$MAC_USER@$MAC_IP" "echo 'Connection successful!'"

        if ($testResult -match "Connection successful") {
            Write-Host "✅ Passwordless SSH is now working!" -ForegroundColor Green
        }
    }
} else {
    Write-Host "⚠️  Git Bash not found. Please use Method 2 (Manual) above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now SSH into Mac Mini without a password:" -ForegroundColor White
Write-Host "  ssh $MAC_USER@$MAC_IP" -ForegroundColor Cyan
Write-Host ""
