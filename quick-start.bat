@echo off
echo =============================================
echo Mouhajer Project - Quick Start Menu
echo =============================================
echo.
echo What would you like to do?
echo.
echo 1. Start Development Server (Frontend + CMS)
echo 2. Setup SSH Keys (No Password for Mac Mini)
echo 3. Sync to Mac Mini External Drive
echo 4. View Documentation
echo 5. Check Mac Mini Status
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto start_dev
if "%choice%"=="2" goto setup_ssh
if "%choice%"=="3" goto sync
if "%choice%"=="4" goto docs
if "%choice%"=="5" goto status
if "%choice%"=="6" goto end

:start_dev
echo.
echo Starting development servers...
npm run dev
goto end

:setup_ssh
echo.
echo Setting up SSH keys for passwordless Mac Mini access...
powershell -ExecutionPolicy Bypass -File setup-ssh-keys.ps1
pause
goto end

:sync
echo.
echo Choose sync method:
echo 1. PowerShell (Recommended for Windows)
echo 2. Git Bash (Requires Git Bash)
echo.
set /p sync_choice="Enter choice (1-2): "

if "%sync_choice%"=="1" (
    powershell -ExecutionPolicy Bypass -File sync-to-mac-mini.ps1
) else (
    bash sync-to-mac-mini.sh
)
pause
goto end

:docs
echo.
echo Opening documentation...
start MAC_MINI_SYNC_GUIDE.md
start FIXES_SUMMARY.md
goto end

:status
echo.
echo Checking Mac Mini status...
mac-status
pause
goto end

:end
echo.
echo Goodbye!
pause
