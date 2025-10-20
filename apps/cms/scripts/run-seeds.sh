#!/bin/bash

# Run Database Seed Scripts for Mouhajer CMS
# This script populates the CMS with homepage content and sample data

echo "🌱 Seeding Mouhajer CMS Database..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set it in your .env file or export it:"
    echo "  export DATABASE_URL='your-database-url'"
    exit 1
fi

# Run content seed first (projects, services, blog)
echo "📝 Seeding sample content (projects, services, blog)..."
psql "$DATABASE_URL" -f ./scripts/seed-content.sql
if [ $? -eq 0 ]; then
    echo "✅ Sample content seeded successfully"
else
    echo "❌ Failed to seed sample content"
    exit 1
fi

echo ""

# Run homepage seed
echo "🏠 Seeding homepage with blocks..."
psql "$DATABASE_URL" -f ./scripts/seed-homepage.sql
if [ $? -eq 0 ]; then
    echo "✅ Homepage seeded successfully"
else
    echo "❌ Failed to seed homepage"
    exit 1
fi

echo ""
echo "🎉 Database seeding completed successfully!"
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:3000/en to see your homepage"
echo "2. Visit http://localhost:3010 to manage content in the CMS"
echo "3. Upload images via the CMS media library"
