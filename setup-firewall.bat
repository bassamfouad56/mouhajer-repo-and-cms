@echo off
echo ========================================
echo   Tailscale Firewall Setup for Ollama
echo ========================================
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator
    echo.
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo Running as Administrator...
echo.

echo Adding firewall rule for Ollama (port 11434)...
netsh advfirewall firewall delete rule name="Ollama - Tailscale" >nul 2>&1
netsh advfirewall firewall add rule name="Ollama - Tailscale" dir=in action=allow protocol=TCP localport=11434 remoteip=100.0.0.0/8

if %errorLevel% equ 0 (
    echo [SUCCESS] Ollama firewall rule added
) else (
    echo [FAILED] Could not add Ollama firewall rule
)

echo.
echo Adding firewall rule for File Sharing (SMB port 445)...
netsh advfirewall firewall delete rule name="File Sharing - Tailscale" >nul 2>&1
netsh advfirewall firewall add rule name="File Sharing - Tailscale" dir=in action=allow protocol=TCP localport=445 remoteip=100.0.0.0/8

if %errorLevel% equ 0 (
    echo [SUCCESS] File sharing firewall rule added
) else (
    echo [FAILED] Could not add file sharing firewall rule
)

echo.
echo Testing Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1

if %errorLevel% equ 0 (
    echo [SUCCESS] Ollama is running and accessible
) else (
    echo [WARNING] Ollama is not responding on localhost:11434
    echo Make sure Ollama is running: ollama serve
)

echo.
echo Getting your Tailscale IP...
for /f "tokens=*" %%i in ('tailscale ip -4 2^>nul') do set TAILSCALE_IP=%%i

if defined TAILSCALE_IP (
    echo.
    echo ========================================
    echo   Your Tailscale Information
    echo ========================================
    echo.
    echo   Tailscale IP: %TAILSCALE_IP%
    echo.
    echo   Remote Access URLs:
    echo   - Ollama: http://%TAILSCALE_IP%:11434
    echo   - File Share: \\%TAILSCALE_IP%\mouhajerserver2$\creative
    echo.
) else (
    echo [WARNING] Could not get Tailscale IP
)

echo ========================================
echo   Setup Complete
echo ========================================
echo.
echo Next Steps:
echo 1. Go to https://login.tailscale.com/admin/machines
echo 2. Find your PC and approve subnet routes
echo 3. Install Tailscale on your laptop
echo 4. Test remote access
echo.

pause
