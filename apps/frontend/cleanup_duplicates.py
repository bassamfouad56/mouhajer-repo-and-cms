#!/usr/bin/env python
import os
import re
import hashlib

def get_file_hash(filepath):
    """Calculate MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except:
        return None

def is_thumbnail(filename):
    """Check if file is a thumbnail based on resolution pattern."""
    patterns = [
        r'-\d+x\d+\.',
        r'-scaled\.',
        r'-thumbnail\.',
        r'-thumb\.',
    ]
    for pattern in patterns:
        if re.search(pattern, filename):
            return True
    return False

def get_base_name(filename):
    """Extract base name without resolution suffix."""
    base = re.sub(r'-\d+x\d+(\.[^.]+)$', r'\1', filename)
    base = re.sub(r'-scaled(\.[^.]+)$', r'\1', base)
    base = re.sub(r'-(thumbnail|thumb)(\.[^.]+)$', r'\2', base)
    return base

def main():
    public_dir = "public"

    # Statistics
    total_files = 0
    thumbnails_removed = 0
    hash_duplicates_removed = 0

    # Find all image files
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    all_images = []

    for root, dirs, files in os.walk(public_dir):
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                filepath = os.path.join(root, file)
                all_images.append(filepath)
                total_files += 1

    print("Found {} image files".format(total_files))

    # Step 1: Remove resolution variants (thumbnails)
    print("\nRemoving thumbnail/resolution variants...")
    originals = {}
    thumbnails_to_remove = []

    for filepath in all_images:
        filename = os.path.basename(filepath)
        if is_thumbnail(filename):
            thumbnails_to_remove.append(filepath)
        else:
            base_name = get_base_name(filename)
            originals[base_name] = filepath

    for thumb in thumbnails_to_remove:
        try:
            os.remove(thumb)
            thumbnails_removed += 1
            print("Removed thumbnail: {}".format(thumb))
        except Exception as e:
            print("Error removing {}: {}".format(thumb, e))

    # Step 2: Find and remove exact duplicates by hash
    print("\nFinding exact duplicates by file hash...")
    remaining_images = [img for img in all_images if img not in thumbnails_to_remove]

    file_hashes = {}
    duplicates_to_remove = []

    for filepath in remaining_images:
        if os.path.exists(filepath):
            file_hash = get_file_hash(filepath)
            if file_hash:
                if file_hash in file_hashes:
                    # Keep the file with shorter path or alphabetically first
                    existing = file_hashes[file_hash]
                    if len(filepath) > len(existing) or \
                       (len(filepath) == len(existing) and filepath > existing):
                        duplicates_to_remove.append(filepath)
                        print("Duplicate found: {} (keeping {})".format(filepath, existing))
                    else:
                        duplicates_to_remove.append(existing)
                        file_hashes[file_hash] = filepath
                        print("Duplicate found: {} (keeping {})".format(existing, filepath))
                else:
                    file_hashes[file_hash] = filepath

    for dup in duplicates_to_remove:
        try:
            if os.path.exists(dup):
                os.remove(dup)
                hash_duplicates_removed += 1
                print("Removed duplicate: {}".format(dup))
        except Exception as e:
            print("Error removing {}: {}".format(dup, e))

    # Summary
    print("\n=== CLEANUP SUMMARY ===")
    print("Total files processed: {}".format(total_files))
    print("Thumbnails removed: {}".format(thumbnails_removed))
    print("Hash duplicates removed: {}".format(hash_duplicates_removed))
    print("Total files removed: {}".format(thumbnails_removed + hash_duplicates_removed))
    print("Files remaining: {}".format(total_files - thumbnails_removed - hash_duplicates_removed))

if __name__ == "__main__":
    main()