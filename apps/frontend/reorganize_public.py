#!/usr/bin/env python
import os
import shutil

def reorganize_public():
    """Reorganize public folder with a cleaner structure."""

    public_dir = "public"

    # Create new organized structure
    new_structure = {
        "images": {
            "2024": {},
            "misc": {}
        },
        "fonts": {},
        "assets": {}
    }

    # Create directories
    for main_dir, subdirs in new_structure.items():
        main_path = os.path.join(public_dir, main_dir)
        if not os.path.exists(main_path):
            os.makedirs(main_path)
        for subdir in subdirs:
            sub_path = os.path.join(main_path, subdir)
            if not os.path.exists(sub_path):
                os.makedirs(sub_path)

    # Move fonts
    if os.path.exists(os.path.join(public_dir, "fonts")):
        fonts_src = os.path.join(public_dir, "fonts")
        fonts_dst = os.path.join(public_dir, "fonts")
        # Fonts are already in the right place
        print("Fonts folder is already organized")

    # Move images from date folders
    date_folders = ["2024/03", "2024/04", "2024/05", "2024/06"]
    moved_count = 0

    for date_folder in date_folders:
        src_folder = os.path.join(public_dir, date_folder)
        if os.path.exists(src_folder):
            # Get month name
            month = date_folder.split("/")[1]
            dst_folder = os.path.join(public_dir, "images", "2024", month)

            if not os.path.exists(dst_folder):
                os.makedirs(dst_folder)

            # Move all files from source to destination
            for filename in os.listdir(src_folder):
                src_file = os.path.join(src_folder, filename)
                if os.path.isfile(src_file):
                    dst_file = os.path.join(dst_folder, filename)
                    try:
                        shutil.move(src_file, dst_file)
                        moved_count += 1
                        print("Moved: {} -> {}".format(filename, dst_folder))
                    except Exception as e:
                        print("Error moving {}: {}".format(filename, e))

    # Move misc folders
    misc_folders = ["new", "numbers", "supplier"]
    for folder in misc_folders:
        src_folder = os.path.join(public_dir, folder)
        if os.path.exists(src_folder):
            for filename in os.listdir(src_folder):
                src_file = os.path.join(src_folder, filename)
                if os.path.isfile(src_file):
                    # Determine file type
                    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')):
                        dst_folder = os.path.join(public_dir, "images", "misc", folder)
                        if not os.path.exists(dst_folder):
                            os.makedirs(dst_folder)
                        dst_file = os.path.join(dst_folder, filename)
                    else:
                        dst_folder = os.path.join(public_dir, "assets", folder)
                        if not os.path.exists(dst_folder):
                            os.makedirs(dst_folder)
                        dst_file = os.path.join(dst_folder, filename)

                    try:
                        shutil.move(src_file, dst_file)
                        moved_count += 1
                        print("Moved: {} -> {}".format(filename, dst_folder))
                    except Exception as e:
                        print("Error moving {}: {}".format(filename, e))

    # Move root level images
    for filename in os.listdir(public_dir):
        src_file = os.path.join(public_dir, filename)
        if os.path.isfile(src_file) and filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')):
            dst_file = os.path.join(public_dir, "images", "misc", filename)
            try:
                shutil.move(src_file, dst_file)
                moved_count += 1
                print("Moved root image: {} -> images/misc".format(filename))
            except Exception as e:
                print("Error moving {}: {}".format(filename, e))

    # Clean up empty directories
    for date_folder in ["2024"]:
        folder_path = os.path.join(public_dir, date_folder)
        if os.path.exists(folder_path):
            # Remove empty subdirectories
            for month in os.listdir(folder_path):
                month_path = os.path.join(folder_path, month)
                if os.path.isdir(month_path) and not os.listdir(month_path):
                    os.rmdir(month_path)
                    print("Removed empty directory: {}".format(month_path))
            # Remove year folder if empty
            if not os.listdir(folder_path):
                os.rmdir(folder_path)
                print("Removed empty directory: {}".format(folder_path))

    # Remove old empty folders
    for folder in misc_folders:
        folder_path = os.path.join(public_dir, folder)
        if os.path.exists(folder_path) and os.path.isdir(folder_path) and not os.listdir(folder_path):
            os.rmdir(folder_path)
            print("Removed empty directory: {}".format(folder_path))

    print("\n=== REORGANIZATION SUMMARY ===")
    print("Files moved: {}".format(moved_count))
    print("\nNew structure:")
    print("public/")
    print("  |-- images/")
    print("      |-- 2024/")
    print("          |-- 03/")
    print("          |-- 04/")
    print("          |-- 05/")
    print("          |-- 06/")
    print("      |-- misc/")
    print("  |-- fonts/")
    print("  |-- assets/")

if __name__ == "__main__":
    reorganize_public()