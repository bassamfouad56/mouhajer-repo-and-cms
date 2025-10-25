/**
 * Script to discover your Google Business Profile Account ID and Location ID
 * This will connect to Google's My Business API using your existing credentials
 */

const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');

const prisma = new PrismaClient();

async function discoverGBPIds() {
  try {
    console.log('🔍 Discovering Google Business Profile IDs...\n');

    // 1. Get existing GA4 credentials
    const ga4Account = await prisma.googleAnalyticsProperty.findFirst({
      where: { isActive: true }
    });

    if (!ga4Account) {
      console.log('❌ No Google Analytics account found. Please set up GA4 first.');
      process.exit(1);
    }

    console.log('✓ Found credentials from GA4 account');
    console.log(`  Service Account: ${ga4Account.clientEmail}\n`);

    // 2. Set up Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: ga4Account.clientEmail,
        private_key: ga4Account.privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/business.manage'],
    });

    const authClient = await auth.getClient();

    // 3. Try to list accounts using My Business API v4
    const mybusinessV4 = google.mybusinessaccountmanagement({ version: 'v1', auth: authClient });

    console.log('🔎 Searching for your Business Profile accounts...\n');

    try {
      const accountsResponse = await mybusinessV4.accounts.list();
      const accounts = accountsResponse.data.accounts || [];

      if (accounts.length === 0) {
        console.log('⚠️  No accounts found with this service account.');
        console.log('\n📝 Manual Steps Required:');
        console.log('1. Go to https://business.google.com/');
        console.log('2. Select your business');
        console.log('3. Look at the URL - it will be like: business.google.com/dashboard/l/LOCATION_ID');
        console.log('4. Copy the LOCATION_ID from the URL');
        console.log('\nOr grant this service account access:');
        console.log(`   Email: ${ga4Account.clientEmail}`);
        console.log('   Add it as a Manager in your Google Business Profile settings');
        return;
      }

      console.log(`✅ Found ${accounts.length} account(s):\n`);

      for (const account of accounts) {
        console.log('📍 Account:', account.accountName);
        console.log('   Account ID:', account.name);
        console.log('');

        // List locations for this account
        try {
          const locationsResponse = await mybusinessV4.accounts.locations.list({
            parent: account.name,
          });

          const locations = locationsResponse.data.locations || [];

          if (locations.length === 0) {
            console.log('   No locations found for this account\n');
            continue;
          }

          console.log(`   Found ${locations.length} location(s):`);

          for (const location of locations) {
            console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   📌 Location:', location.locationName);
            console.log('   🆔 Location ID:', location.name);
            console.log('   📍 Address:', location.address?.addressLines?.join(', ') || 'N/A');
            console.log('   📞 Phone:', location.phoneNumbers?.primaryPhone || 'N/A');
            console.log('   🌐 Website:', location.websiteUri || 'N/A');
            console.log('');
          }
        } catch (locError) {
          console.log('   ⚠️  Could not list locations:', locError.message);
        }
      }

      console.log('\n✅ Use the IDs above to update your CMS configuration');

    } catch (apiError) {
      console.log('⚠️  API Error:', apiError.message);
      console.log('\n📝 Possible reasons:');
      console.log('1. Service account needs to be added as a Manager in Google Business Profile');
      console.log('2. My Business API might not be enabled in your Google Cloud project');
      console.log('3. The business might not have a verified Google Business Profile');

      console.log('\n🔧 Manual Method:');
      console.log('1. Go to https://business.google.com/');
      console.log('2. Log in and select "Mouhajer International Design and Contracting"');
      console.log('3. Check the URL - copy the part after /l/');
      console.log('   Example: business.google.com/dashboard/l/12345678901234567890');
      console.log('   Your Location ID would be: 12345678901234567890');

      console.log('\n📧 To grant access to your service account:');
      console.log(`   Add this email as a Manager: ${ga4Account.clientEmail}`);
      console.log('   Go to: Business Profile → Users → Add User');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

discoverGBPIds();
