#!/bin/bash

# Script to remove static route folders after migration to dynamic CMS routing
# Run this from the apps/frontend directory

echo "🚀 Static Route Removal Script"
echo "=============================="
echo ""
echo "This script will remove the following static route folders:"
echo "- services"
echo "- contact-us"
echo "- our-projects"
echo "- blogs"
echo "- who-we-are"
echo "- team"
echo "- faq"
echo "- testimonials"
echo "- pricing"
echo "- case-studies"
echo "- privacy-policy"
echo "- careers"
echo "- design-services"
echo "- room-redesign"
echo "- suppliers"
echo ""
echo "⚠️  IMPORTANT: Make sure you have:"
echo "1. Run the CMS migration script to create pages"
echo "2. Updated the [[...slug]] route"
echo "3. Tested that pages load from CMS"
echo "4. Created a backup of these folders"
echo ""
read -p "Do you want to proceed? (y/N): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "Aborted."
    exit 0
fi

# Create backup directory
backup_dir="static-routes-backup-$(date +%Y%m%d-%H%M%S)"
echo "Creating backup in $backup_dir..."
mkdir -p "$backup_dir"

# List of folders to remove
folders=(
    "services"
    "contact-us"
    "our-projects"
    "blogs"
    "who-we-are"
    "team"
    "faq"
    "testimonials"
    "pricing"
    "case-studies"
    "privacy-policy"
    "careers"
    "design-services"
    "room-redesign"
    "suppliers"
)

# Backup and remove each folder
for folder in "${folders[@]}"; do
    if [ -d "app/[locale]/$folder" ]; then
        echo "Backing up $folder..."
        cp -r "app/[locale]/$folder" "$backup_dir/"
        echo "Removing $folder..."
        rm -rf "app/[locale]/$folder"
        echo "✅ $folder removed"
    else
        echo "⚠️  $folder not found, skipping..."
    fi
done

# Also remove the original home page.tsx if exists
if [ -f "app/[locale]/page.tsx" ]; then
    echo "Backing up home page.tsx..."
    cp "app/[locale]/page.tsx" "$backup_dir/page.tsx"
    echo "Removing home page.tsx..."
    rm "app/[locale]/page.tsx"
    echo "✅ Home page.tsx removed"
fi

echo ""
echo "✨ Static routes removed successfully!"
echo "📁 Backup saved in: $backup_dir"
echo ""
echo "Next steps:"
echo "1. Test all pages load from CMS"
echo "2. Verify SEO metadata"
echo "3. Check language switching"
echo "4. Test forms and interactive components"
echo ""
echo "To restore if needed:"
echo "cp -r $backup_dir/* app/[locale]/"