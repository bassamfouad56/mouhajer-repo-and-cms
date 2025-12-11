# Tailscale Firewall Setup Script
# Run this in PowerShell as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tailscale Firewall Setup for Ollama  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Add Ollama firewall rule
Write-Host "📝 Adding firewall rule for Ollama (port 11434)..." -ForegroundColor Yellow

try {
    # Remove existing rule if it exists
    Remove-NetFirewallRule -DisplayName "Ollama - Tailscale" -ErrorAction SilentlyContinue

    # Add new rule for Tailscale network only (more secure)
    New-NetFirewallRule -DisplayName "Ollama - Tailscale" `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort 11434 `
        -RemoteAddress 100.0.0.0/8 `
        -ErrorAction Stop | Out-Null

    Write-Host "✅ Ollama firewall rule added successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add Ollama firewall rule: $_" -ForegroundColor Red
}

Write-Host ""

# Add File Sharing firewall rule
Write-Host "📝 Adding firewall rule for File Sharing (SMB)..." -ForegroundColor Yellow

try {
    # Remove existing rule if it exists
    Remove-NetFirewallRule -DisplayName "File Sharing - Tailscale" -ErrorAction SilentlyContinue

    # Add new rule for SMB (port 445)
    New-NetFirewallRule -DisplayName "File Sharing - Tailscale" `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort 445 `
        -RemoteAddress 100.0.0.0/8 `
        -ErrorAction Stop | Out-Null

    Write-Host "✅ File sharing firewall rule added successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add file sharing firewall rule: $_" -ForegroundColor Red
}

Write-Host ""

# Test Ollama
Write-Host "🧪 Testing Ollama..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Ollama is running and accessible" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Ollama is not responding on localhost:11434" -ForegroundColor Red
    Write-Host "   Make sure Ollama is running: ollama serve" -ForegroundColor Yellow
}

Write-Host ""

# Display Tailscale info
Write-Host "📊 Your Tailscale Information:" -ForegroundColor Cyan
Write-Host ""

try {
    $tailscaleIP = & tailscale ip -4
    Write-Host "   Tailscale IP: $tailscaleIP" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Remote Access URLs:" -ForegroundColor Cyan
    Write-Host "   • Ollama: http://$tailscaleIP:11434" -ForegroundColor White
    Write-Host "   • File Share: \\$tailscaleIP\mouhajerserver2$\creative" -ForegroundColor White
} catch {
    Write-Host "⚠️  Could not get Tailscale IP. Run 'tailscale ip -4' manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!                      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://login.tailscale.com/admin/machines" -ForegroundColor White
Write-Host "2. Find your PC and approve subnet routes" -ForegroundColor White
Write-Host "3. Install Tailscale on your laptop" -ForegroundColor White
Write-Host "4. Test remote access!" -ForegroundColor White
Write-Host ""

pause
