# Manual Blog Setup Guide

Since you only have 3 blog posts, it's faster to set them up manually in Sanity Studio!

## Step 1: Access Sanity Studio

1. Open your browser and go to: `http://localhost:4050/studio`
2. Or deploy and use: `https://your-site.sanity.studio`

---

## Step 2: Create Blog Tags (10 tags)

Click on **"Tag"** in the sidebar, then create these 10 tags:

### Tag 1: Luxury Design
- **Tag Name (English)**: Luxury Design
- **Tag Name (Arabic)**: تصميم فاخر
- **Slug**: `luxury-design`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Articles about luxury interior design and high-end aesthetics
- **Description (Arabic)**: مقالات حول التصميم الداخلي الفاخر والجماليات الراقية
- **Tag Color**: `#d4af37`
- **Icon Name**: Gem
- **Featured Tag**: ✅ Yes
- **Display Order**: 1

### Tag 2: Construction Management
- **Tag Name (English)**: Construction Management
- **Tag Name (Arabic)**: إدارة البناء
- **Slug**: `construction-management`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Best practices in construction project management
- **Description (Arabic)**: أفضل الممارسات في إدارة مشاريع البناء
- **Tag Color**: `#8B7355`
- **Icon Name**: HardHat
- **Featured Tag**: ✅ Yes
- **Display Order**: 2

### Tag 3: Turnkey Solutions
- **Tag Name (English)**: Turnkey Solutions
- **Tag Name (Arabic)**: حلول متكاملة
- **Slug**: `turnkey-solutions`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: End-to-end project delivery and turnkey construction
- **Description (Arabic)**: تسليم المشاريع الشامل والبناء المتكامل
- **Tag Color**: `#2C5F2D`
- **Icon Name**: Key
- **Featured Tag**: ✅ Yes
- **Display Order**: 3

### Tag 4: Dubai Projects
- **Tag Name (English)**: Dubai Projects
- **Tag Name (Arabic)**: مشاريع دبي
- **Slug**: `dubai-projects`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Projects and insights specific to Dubai market
- **Description (Arabic)**: المشاريع والرؤى الخاصة بسوق دبي
- **Tag Color**: `#C41E3A`
- **Featured Tag**: ✅ Yes
- **Display Order**: 4

### Tag 5: Industry Insights
- **Tag Name (English)**: Industry Insights
- **Tag Name (Arabic)**: رؤى الصناعة
- **Slug**: `industry-insights`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Expert insights on construction and design industry trends
- **Description (Arabic)**: رؤى الخبراء حول اتجاهات صناعة البناء والتصميم
- **Featured Tag**: ❌ No
- **Display Order**: 5

### Tag 6: Design Philosophy
- **Tag Name (English)**: Design Philosophy
- **Tag Name (Arabic)**: فلسفة التصميم
- **Slug**: `design-philosophy`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Our design principles and philosophy
- **Description (Arabic)**: مبادئنا وفلسفتنا في التصميم
- **Featured Tag**: ❌ No
- **Display Order**: 6

### Tag 7: Project Success
- **Tag Name (English)**: Project Success
- **Tag Name (Arabic)**: نجاح المشروع
- **Slug**: `project-success`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Keys to successful project delivery
- **Description (Arabic)**: مفاتيح التسليم الناجح للمشروع
- **Featured Tag**: ❌ No
- **Display Order**: 7

### Tag 8: Risk Management
- **Tag Name (English)**: Risk Management
- **Tag Name (Arabic)**: إدارة المخاطر
- **Slug**: `risk-management`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Managing risks in construction projects
- **Description (Arabic)**: إدارة المخاطر في مشاريع البناء
- **Featured Tag**: ❌ No
- **Display Order**: 8

### Tag 9: Acoustic Design
- **Tag Name (English)**: Acoustic Design
- **Tag Name (Arabic)**: التصميم الصوتي
- **Slug**: `acoustic-design`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Sound design and acoustic engineering
- **Description (Arabic)**: التصميم الصوتي والهندسة الصوتية
- **Featured Tag**: ❌ No
- **Display Order**: 9

### Tag 10: Awards & Recognition
- **Tag Name (English)**: Awards & Recognition
- **Tag Name (Arabic)**: الجوائز والتكريمات
- **Slug**: `awards-recognition`
- **Tag Category**: Blog Topic
- **Used In**: Blog
- **Description (English)**: Award-winning projects and recognition
- **Description (Arabic)**: المشاريع الفائزة بالجوائز والتكريمات
- **Featured Tag**: ❌ No
- **Display Order**: 10

---

## Step 3: Update Blog Posts

Click on **"Blog Post"** in the sidebar, then update each post:

### Post 1: "The Anatomy of a Winner"
1. Open the post
2. **Category**: Select **"Project Stories"**
3. **Tags**: Select these 4 tags:
   - Awards & Recognition
   - Turnkey Solutions
   - Dubai Projects
   - Project Success
4. Click **"Publish"**

### Post 2: "The Blame Game: Turnkey"
1. Open the post
2. **Category**: Select **"Project Stories"**
3. **Tags**: Select these 4 tags:
   - Turnkey Solutions
   - Construction Management
   - Risk Management
   - Industry Insights
4. Click **"Publish"**

### Post 3: "The Sound of Luxury is Silence"
1. Open the post
2. **Category**: Select **"Founder's Insights"**
3. **Tags**: Select these 4 tags:
   - Luxury Design
   - Design Philosophy
   - Acoustic Design
   - Dubai Projects
4. Click **"Publish"**

---

## Step 4: Test the Journal!

Once you've saved all the posts, visit your journal:

1. Go to: `http://localhost:4050/en/journal`

2. **Test Category Filtering:**
   - Click "All" tab - should show all 3 posts
   - Click "Project Stories" - should show 2 posts
   - Click "Founder's Insights" - should show 1 post
   - Click "Design Trends" - should show 0 posts

3. **Test Tag Filtering:**
   - Check "Turnkey Solutions" in sidebar - should show 2 posts
   - Check "Luxury Design" - should show 1 post
   - Check both - should show 0 posts (intersection)

4. **Test Search:**
   - Type "luxury" - should find 1 post
   - Type "turnkey" - should find 2 posts

5. **Test Combined Filters:**
   - Select category "Project Stories"
   - Check tag "Turnkey Solutions"
   - Should show 2 posts
   - Add search "winner"
   - Should show 1 post

---

## Alternative: Use Script (Automated)

If you want to automate this instead:

1. **Get Write-Enabled Token:**
   - Go to: https://www.sanity.io/manage
   - Select your project
   - Go to: **API → Tokens**
   - Click **"Add API token"**
   - Name: `Blog Seeding Token`
   - Permissions: **Editor**
   - Click **"Create"**
   - Copy the token

2. **Update .env.local:**
   ```bash
   SANITY_API_TOKEN=your_new_write_enabled_token_here
   ```

3. **Run the Script:**
   ```bash
   npx tsx scripts/seed-blog-categories-tags.ts
   ```

This will automatically:
- Create all 10 tags
- Assign categories to your 3 posts
- Assign relevant tags to each post

---

## ✅ Done!

Your journal is now fully set up with:
- ✅ 10 blog tags (4 featured)
- ✅ 3 blog posts categorized
- ✅ Tags assigned to each post
- ✅ Advanced filtering working
- ✅ Search working
- ✅ URL persistence working

Enjoy your new journal architecture! 🎉
