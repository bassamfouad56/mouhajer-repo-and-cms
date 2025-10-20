# Migrate to Clean Bitbucket Repository

## Current Situation
- Local repository: **805KB** ✅ (Clean)
- Remote Bitbucket: **>1GB** ❌ (Blocked)

## Solution: Create New Clean Repository

### Step 1: Delete Old Repository on Bitbucket
1. Go to: https://bitbucket.org/viraleast-app/mouhajer-metro/admin
2. Click **"Delete repository"** at the bottom
3. Confirm deletion

> ⚠️ **Don't worry!** You have all the code locally. Nothing will be lost.

### Step 2: Create New Repository on Bitbucket
1. Go to: https://bitbucket.org/viraleast-app/
2. Click **"Create repository"**
3. Name it: `mouhajer-metro` (same name as before)
4. Set it to **Private**
5. **DO NOT** initialize with README or .gitignore
6. Copy the new repository URL

### Step 3: Push Your Clean Repository

Run these commands in your terminal:

```bash
# Update remote URL to new repository
git remote set-url origin https://bitbucket.org/viraleast-app/mouhajer-metro.git

# Push main branch
git push -u origin main

# Push feature branch
git push -u origin feature/cms-integration

# Push any other branches you need
git branch -a  # List all branches
git push -u origin <branch-name>  # Push each branch
```

### Step 4: Verify Success

```bash
# Check repository size on Bitbucket
# Should be around 1-2 MB instead of 1+ GB

# Verify all branches are pushed
git branch -r
```

## Alternative: Use GitHub Instead

If you prefer, you can switch to GitHub (which has better free tier):

```bash
# Create new repo on GitHub: https://github.com/new

# Add GitHub as new remote
git remote set-url origin https://github.com/YOUR_USERNAME/mouhajer-repo.git

# Push to GitHub
git push -u origin main
git push -u origin feature/cms-integration
```

## Summary

**Before:**
- Bitbucket repo: 1+ GB (blocked)
- Could not push any changes

**After:**
- New clean repo: ~1-2 MB
- Can push changes normally
- Much faster cloning and operations

---

**All your code is safe locally. This just creates a fresh remote repository without the bloated history.**
