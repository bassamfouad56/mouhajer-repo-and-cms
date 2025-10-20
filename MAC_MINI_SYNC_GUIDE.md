# Mac Mini External Drive Setup & Sync Guide

This guide explains how to use your Mac Mini's external drive (LaCie 2TB) to store and manage npm libraries and project files.

## 📋 Overview

**Problem Fixed:**
1. ✅ Next.js `useTranslations` context error
2. ✅ Set up external drive for npm libraries
3. ✅ Create sync scripts for automated backups

**Mac Mini Details:**
- **IP Address:** 100.111.21.66
- **Username:** bassamfouad
- **External Drive:** LaCie 2TB mounted at `/Volumes/LaCie`
- **Available Space:** 1.8TB

## 🔧 What Was Fixed

### 1. Next.js Translation Error

**Files Created/Modified:**
- `apps/frontend/components/Providers.tsx` - New client provider component
- `apps/frontend/app/[locale]/layout.tsx` - Updated to wrap app with NextIntlClientProvider

**Changes Made:**
```typescript
// Created Providers.tsx
'use client';
import { NextIntlClientProvider } from 'next-intl';

export default function Providers({ children, locale, messages }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// Updated layout.tsx to use Providers
const messages = await getMessages();
<Providers locale={locale} messages={messages}>
  {/* app content */}
</Providers>
```

**Result:** The `useTranslations()` hook now works correctly in client components like `room-redesign/page.tsx`.

### 2. Mac Mini External Drive Setup

**Directories Created on LaCie Drive:**
```
/Volumes/LaCie/
├── npm-cache/          # For npm package cache
├── npm-global/         # For global npm packages
└── Projects/           # For project files
    └── mouhajer-repo-and-cms/
```

## 🚀 Quick Start

### Option 1: Passwordless SSH (Recommended)

1. **Set up SSH keys (one-time setup):**
   ```powershell
   .\setup-ssh-keys.ps1
   ```

2. **Sync your project:**
   ```bash
   .\sync-to-mac-mini.sh
   ```

### Option 2: With Password

Just run the sync script and enter password when prompted:
```powershell
.\sync-to-mac-mini.ps1
```

## 📦 How npm Library Management Works

### On Windows (Current Machine)

Your npm cache is located at:
```
C:\Users\thegh\AppData\Local\npm-cache
```

When you run `npm install`, packages are downloaded and cached here.

### On Mac Mini

After syncing, packages will be available at:
```
/Volumes/LaCie/npm-cache/
```

## 🔄 Sync Workflow

### Step 1: Install Dependencies on Windows

```bash
cd /d/Desktop/wbsite/mouhajer-repo-and-cms
npm install
```

This downloads all packages and caches them locally.

### Step 2: Sync to Mac Mini

**Using PowerShell:**
```powershell
.\sync-to-mac-mini.ps1
```

**Using Git Bash:**
```bash
./sync-to-mac-mini.sh
```

### Step 3: Use on Mac Mini

SSH into Mac Mini:
```bash
ssh bassamfouad@100.111.21.66
```

Navigate to project:
```bash
cd /Volumes/LaCie/Projects/mouhajer-repo-and-cms
```

Install Node.js (if not installed):
```bash
# Install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

Configure npm to use external drive cache:
```bash
npm config set cache /Volumes/LaCie/npm-cache
npm config set prefix /Volumes/LaCie/npm-global
```

Install dependencies (will use cached packages):
```bash
npm install
```

## 📝 Script Reference

### setup-ssh-keys.ps1

Sets up SSH key authentication to avoid password prompts.

**Usage:**
```powershell
.\setup-ssh-keys.ps1
```

### sync-to-mac-mini.ps1 (Windows PowerShell)

Syncs your project and npm cache to Mac Mini.

**Features:**
- Tests connection to Mac Mini
- Creates necessary directories
- Generates package list
- Provides manual sync instructions

**Usage:**
```powershell
.\sync-to-mac-mini.ps1
```

### sync-to-mac-mini.sh (Git Bash)

Full-featured sync script with rsync.

**Features:**
- Syncs npm cache from Windows to Mac Mini
- Syncs project files (excluding node_modules, .next, build)
- Creates package list
- Shows progress

**Usage:**
```bash
./sync-to-mac-mini.sh
```

## 🛠️ Manual Sync Methods

### Using WinSCP (GUI)

1. Download WinSCP: https://winscp.net/
2. Connect to: `100.111.21.66`
3. Username: `bassamfouad`
4. Password: `123123`
5. Drag and drop files to: `/Volumes/LaCie/Projects/mouhajer-repo-and-cms/`

### Using SCP (Command Line)

```bash
# Sync entire project
scp -r * bassamfouad@100.111.21.66:/Volumes/LaCie/Projects/mouhajer-repo-and-cms/

# Sync npm cache
scp -r C:/Users/thegh/AppData/Local/npm-cache/* bassamfouad@100.111.21.66:/Volumes/LaCie/npm-cache/
```

## 🔍 Troubleshooting

### "Network error. Please check your connection and try again."

This error in the Next.js app is likely caused by:

1. **API endpoint not accessible** - Check if CMS is running
2. **CORS issues** - Verify API configuration
3. **Network timeout** - Increase timeout in Next.js config

**Fix:**
```bash
# Check if CMS is running
npm run dev:cms

# Check API endpoint
curl http://localhost:3001/api/graphql
```

### Mac Mini Connection Issues

1. **Cannot connect:**
   ```bash
   ping 100.111.21.66
   ```

2. **SSH timeout:**
   - Ensure Mac Mini is powered on
   - Check if SSH is enabled: System Preferences → Sharing → Remote Login

3. **External drive not mounted:**
   ```bash
   mac-ssh "diskutil list"
   mac-mount  # Use the built-in mount command
   ```

### Node.js Not Installed on Mac Mini

Install via Homebrew:
```bash
# SSH into Mac Mini
ssh bassamfouad@100.111.21.66

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

## 📊 Project Structure on Mac Mini

```
/Volumes/LaCie/
├── npm-cache/                          # npm package cache (synced from Windows)
├── npm-global/                         # Global npm packages
└── Projects/
    └── mouhajer-repo-and-cms/
        ├── apps/
        │   ├── frontend/               # Next.js frontend
        │   └── cms/                    # Payload CMS
        ├── packages/                   # Shared packages
        ├── package.json
        ├── turbo.json
        └── package-list.txt           # List of installed packages
```

## 🎯 Benefits of This Setup

1. **✅ Centralized Storage:** All npm libraries backed up on external drive
2. **✅ Faster Installs:** Cached packages don't need to be re-downloaded
3. **✅ Cross-Platform:** Same libraries available on Windows and Mac
4. **✅ Backup:** External drive acts as backup for your project
5. **✅ Development Ready:** Mac Mini can be used for development

## 🔐 Security Notes

- SSH password (`123123`) is stored in scripts for convenience
- For production, use SSH keys (setup-ssh-keys.ps1)
- Consider using environment variables for sensitive data
- The external drive is NTFS formatted, accessible from both Windows and Mac

## 🚦 Next Steps

1. **Test the Translation Fix:**
   ```bash
   npm run dev
   # Navigate to http://localhost:3007/en/room-redesign
   ```

2. **Set Up Passwordless SSH:**
   ```powershell
   .\setup-ssh-keys.ps1
   ```

3. **Sync Your Project:**
   ```bash
   .\sync-to-mac-mini.sh
   ```

4. **Install Node.js on Mac Mini** (if needed)

5. **Configure npm on Mac Mini to use external drive**

## 📞 Support

If you encounter issues:

1. Check Mac Mini status: `mac-status`
2. Wake Mac Mini if sleeping: `mac-wake`
3. Check drive status: `mac-ssh "diskutil list"`
4. Review logs in the sync scripts

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [npm Cache Documentation](https://docs.npmjs.com/cli/v10/commands/npm-cache)
- [SSH Key Setup Guide](https://www.ssh.com/academy/ssh/keygen)

---

**Last Updated:** October 17, 2025
**Version:** 1.0.0
