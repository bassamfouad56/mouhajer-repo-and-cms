const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking for existing Google credentials...\n');
  
  // Check GA4
  const ga4 = await prisma.googleAnalyticsProperty.findMany();
  console.log('📊 Google Analytics 4 Properties:', ga4.length);
  if (ga4.length > 0) {
    console.log('   First GA4:', {
      name: ga4[0].propertyName,
      propertyId: ga4[0].propertyId,
      clientEmail: ga4[0].clientEmail,
      projectId: ga4[0].projectId
    });
  }
  
  // Check GBP
  const gbp = await prisma.googleBusinessProfileAccount.findMany();
  console.log('\n⭐ Google Business Profile Accounts:', gbp.length);
  if (gbp.length > 0) {
    console.log('   First GBP:', {
      name: gbp[0].accountName,
      locationName: gbp[0].locationName,
      clientEmail: gbp[0].clientEmail
    });
  }
  
  // Check Search Console
  const gsc = await prisma.googleSearchConsoleProperty.findMany();
  console.log('\n🔍 Search Console Properties:', gsc.length);
  if (gsc.length > 0) {
    console.log('   First GSC:', {
      name: gsc[0].propertyName,
      siteUrl: gsc[0].siteUrl,
      clientEmail: gsc[0].clientEmail
    });
  }
  
  // Check GTM
  const gtm = await prisma.googleTagManagerAccount.findMany();
  console.log('\n🏷️  Tag Manager Accounts:', gtm.length);
  if (gtm.length > 0) {
    console.log('   First GTM:', {
      name: gtm[0].accountName,
      accountId: gtm[0].accountId,
      clientEmail: gtm[0].clientEmail
    });
  }
  
  console.log('\n✅ Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
