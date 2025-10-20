/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    const p = path === '/index' ? '/' : path;
    return {
      loc: p,
      changefreq: config.changefreq,
      priority: p === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: `${config.siteUrl}/en${p}`, hreflang: 'en' },
        { href: `${config.siteUrl}/ar${p}`, hreflang: 'ar' },
      ],
    };
  },
};

