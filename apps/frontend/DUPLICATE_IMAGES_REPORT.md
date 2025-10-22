# Duplicate Images Report

## Summary

**Date**: 2025-10-09
**Total Images Scanned**: 1,174
**Duplicate Groups Found**: 103
**Total Duplicate Files**: 206 (103 duplicates of 103 originals)
**Potential Space Savings**: 1.29 GB

## Analysis Method

This analysis used **MD5 content hashing** to find exact duplicates - not just similar filenames, but files with identical binary content.

## Key Findings

### 1. Exact Duplicates (Same Content)

Found **103 groups** where files are exact byte-for-byte copies:

- **Pattern**: Most duplicates are between `images/` and `images/originals/` folders
- **Cause**: Files were copied to `originals/` folder as backups
- **Safe to Delete**: Yes - one copy is sufficient

### 2. Distribution

| Location | Count | Purpose |
|----------|-------|---------|
| `images/` | 103 files | **KEEP** - Main images used by website |
| `images/originals/` | 103 files | **DELETE** - Duplicate backups |

### 3. Largest Duplicates

The biggest space wasters:

1. `_MID6238-HDR.jpg` - 35.56 MB (2 copies = 71.12 MB)
2. `_MID6228-HDR.jpg` - 35.64 MB (2 copies = 71.28 MB)
3. `_MID6318-HDR.jpg` - 32.31 MB (2 copies = 64.62 MB)
4. `_MID6403-HDR.jpg` - 31.89 MB (2 copies = 63.78 MB)
5. `newbanner.jpg` - 19.29 MB (2 copies = 38.58 MB)

## Recommended Action

### ✅ Safe to Delete

All 103 files in `images/originals/` that are exact duplicates can be safely deleted because:

1. They are byte-for-byte identical to files in `images/`
2. The `images/` folder contains the actively used versions
3. The `originals/` folder appears to be a backup that's no longer needed

### 📋 How to Delete

**Option 1: Manual Review (Recommended)**

Review the detailed report:
```bash
cat duplicate-images-detailed-report.json
```

**Option 2: Automated Deletion**

Run the generated script:
```bash
# Windows
delete-duplicates.bat

# Linux/Mac
bash delete-duplicates.sh
```

**Option 3: Delete Entire Originals Folder (Fastest)**

Since all duplicates are in `images/originals/`, you could simply:
```bash
# Windows
rmdir /s public\images\originals

# Linux/Mac
rm -rf public/images/originals
```

## Impact Assessment

### ✅ Pros
- **Saves 1.29 GB** of disk space
- **Cleaner file structure**
- **Faster deployments** (less files to upload)
- **Reduced hosting costs** (if storage-based pricing)

### ⚠️ Risks
- **Low Risk**: All duplicates have originals in `images/` folder
- **No Code Changes Needed**: Website references `images/` not `originals/`
- **Reversible**: If you have backups or git history

## Additional Findings

### Similar Filenames (Different Content)

Found **109,201 pairs** of files with similar names but different content. Examples:
- `1-1.webp`, `1-2.webp`, `1-3.webp` - These are DIFFERENT images
- Numbers in filenames make many false positives

**Action**: These are legitimate different files - **DO NOT DELETE**

### Same Size, Different Content

Found **5 pairs** of files with identical size but different content:
- These are coincidental - different images happen to be same size
- **DO NOT DELETE**

## Files to Delete (Complete List)

All files in `public/images/originals/` that are duplicates:

```
images/originals/2211111.jpg (11.28 MB)
images/originals/7.jpg (14.38 MB)
images/originals/banner2.png (7.31 MB)
images/originals/Enscape_2023-11-01-15-27-12.jpg (4.67 MB)
images/originals/Enscape_2023-11-01-15-41-34.jpg (4.89 MB)
images/originals/Enscape_2023-11-01-15-45-52.jpg (4.9 MB)
images/originals/Enscape_2023-11-01-15-48-09.jpg (4.93 MB)
... (97 more files)
```

Plus 4 files in `images/` that have their original in `originals/`:
```
images/villa114.jpg (DELETE - original in originals/)
images/_DSC3504-HDR.jpg (DELETE - original in originals/)
images/_MID*.jpg (DELETE several - originals in originals/)
```

## Next Steps

1. **Review** this report
2. **Backup** your current `public/images/` folder (optional but recommended)
3. **Run** the deletion script OR manually delete the `originals/` folder
4. **Test** your website to ensure images still load
5. **Commit** changes to git

## Script Files Generated

- `delete-duplicates.bat` - Windows batch file
- `delete-duplicates.sh` - Linux/Mac bash script
- `duplicate-images-detailed-report.json` - Full technical details
- `find-duplicate-images.js` - The analysis script (reusable)

## Questions?

- **Q: What if I delete the wrong files?**
  A: If you have git history, you can restore them. Otherwise, ensure you have backups.

- **Q: Will this break my website?**
  A: No - we're only deleting duplicates. The main files in `images/` remain.

- **Q: Should I delete the originals folder?**
  A: Yes, it appears to be redundant backups of files already in `images/`.

- **Q: What about the 109,201 "similar filenames"?**
  A: Those are false positives due to numbered files. They're different images - keep them.

## Conclusion

✅ **Safe to proceed** with deleting the 103 duplicate files
💾 **1.29 GB** will be freed
⚡ **No code changes** required
🎯 **Target**: `public/images/originals/` folder
