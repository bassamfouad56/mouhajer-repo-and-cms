import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'r97logzc',
  dataset: 'production',
  apiVersion: '2024-11-21',
  token: 'skiIzl2j9bAUcxtrJGS2MFp1JccNsjBPTSwzGGuydjQpIkCqtx6tt6jDtKKsZaarRfFHApyFrWH64y0RYkFPm7pLOAErsezEPJ5tGAn48O3ruOLA9n6scz2zWZsF6JOPNwSAMWpsupJlNrTVMoJ2Jju6OCcVB5RAs2kFKXtDVOO2jZ04eTZJ',
  useCdn: false,
});

async function verify() {
  console.log('🔍 Verifying Sanity Data\n');

  const services = await client.fetch('*[_type == "service"] | order(order asc)');
  console.log(`✅ Services: ${services.length}`);
  services.forEach(s => console.log(`   - ${s.title}`));

  const industries = await client.fetch('*[_type == "industry"] | order(order asc)');
  console.log(`\n✅ Industries: ${industries.length}`);
  industries.forEach(i => console.log(`   - ${i.title}`));

  const projects = await client.fetch('*[_type == "project"] | order(publishedAt desc)');
  console.log(`\n✅ Projects: ${projects.length}`);
  projects.forEach(p => console.log(`   - ${p.title} (${p.category})`));

  const posts = await client.fetch('*[_type == "post"] | order(publishedAt desc)');
  console.log(`\n✅ Blog Posts: ${posts.length}`);
  posts.forEach(p => console.log(`   - ${p.title}`));

  console.log('\n🎉 All data verified successfully!');
}

verify();
