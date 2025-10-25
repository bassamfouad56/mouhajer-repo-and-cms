/**
 * Update Google Business Profile Account with real IDs
 * Usage: node update-gbp-account.js <LOCATION_ID>
 *
 * Example: node update-gbp-account.js 12345678901234567890
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateGBPAccount() {
  const locationId = process.argv[2];

  if (!locationId) {
    console.log('❌ Please provide a Location ID');
    console.log('\nUsage: node update-gbp-account.js <LOCATION_ID>');
    console.log('\nTo find your Location ID:');
    console.log('1. Go to https://business.google.com/');
    console.log('2. Select your business');
    console.log('3. Copy the number from the URL after /l/');
    console.log('\nExample: business.google.com/dashboard/l/12345678901234567890');
    console.log('         Location ID would be: 12345678901234567890\n');
    process.exit(1);
  }

  try {
    console.log('🔄 Updating Google Business Profile account...\n');

    // Find the existing account
    const account = await prisma.googleBusinessProfileAccount.findFirst();

    if (!account) {
      console.log('❌ No Google Business Profile account found in database');
      process.exit(1);
    }

    console.log('✓ Found account:', account.accountName);

    // Update with real IDs
    const updated = await prisma.googleBusinessProfileAccount.update({
      where: { id: account.id },
      data: {
        gbpAccountId: `accounts/${locationId}`,
        locationId: `locations/${locationId}`,
        locationName: 'Mouhajer International Design and Contracting',
        address: 'Office no. 1807-1808, Westburry Tower 1 - Dubai',
        phoneNumber: '+971 4 431 8426',
        websiteUrl: 'https://mahermouhajer.com',
        syncStatus: 'pending',
      }
    });

    console.log('\n✅ Account updated successfully!');
    console.log('\nUpdated Information:');
    console.log('  Location ID:', updated.locationId);
    console.log('  GBP Account ID:', updated.gbpAccountId);
    console.log('  Location Name:', updated.locationName);
    console.log('  Address:', updated.address);
    console.log('  Phone:', updated.phoneNumber);
    console.log('  Website:', updated.websiteUrl);

    console.log('\n🎉 Next Steps:');
    console.log('1. Go to http://localhost:3010/analytics/business-profile');
    console.log('2. Click "Sync Reviews" button');
    console.log('3. Your 98 reviews should appear!');

  } catch (error) {
    console.error('❌ Error updating account:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateGBPAccount();
